import { NextRequest, NextResponse } from 'next/server';

const IP_ADDRESS_PATTERN = /^[0-9a-fA-F:.]{3,45}$/;
const IDEMPOTENCY_KEY_PATTERN = /^[a-zA-Z0-9][a-zA-Z0-9_-]{15,127}$/;

type JsonBodyResult = { ok: true; data: unknown } | { ok: false; response: NextResponse };

function error(message: string, status: number): JsonBodyResult {
  return {
    ok: false,
    response: NextResponse.json({ success: false, message }, { status }),
  };
}

/**
 * Enforces browser same-origin requests for cookie-authenticated mutations.
 * Server Actions have their own origin checks; route handlers use this helper.
 */
export function requireSameOrigin(request: NextRequest): NextResponse | null {
  const origin = request.headers.get('origin');
  const fetchSite = request.headers.get('sec-fetch-site');

  if (!origin || fetchSite === 'cross-site') {
    return NextResponse.json(
      { success: false, message: 'Cross-site requests are not allowed.' },
      { status: 403 }
    );
  }

  try {
    if (origin !== new URL(request.url).origin) {
      return NextResponse.json(
        { success: false, message: 'Cross-site requests are not allowed.' },
        { status: 403 }
      );
    }
  } catch {
    return NextResponse.json(
      { success: false, message: 'Invalid request origin.' },
      { status: 400 }
    );
  }

  return null;
}

/** Limits a JSON request before parsing so an oversized body cannot consume unbounded memory. */
export async function readJsonBody(
  request: NextRequest,
  maxBytes: number = 64 * 1024
): Promise<JsonBodyResult> {
  const contentType = request.headers.get('content-type')?.toLowerCase() || '';
  if (!contentType.startsWith('application/json')) {
    return error('Content-Type must be application/json.', 415);
  }

  const contentLength = request.headers.get('content-length');
  if (contentLength) {
    const parsedLength = Number(contentLength);
    if (!Number.isFinite(parsedLength) || parsedLength < 0) {
      return error('Invalid Content-Length header.', 400);
    }
    if (parsedLength > maxBytes) {
      return error('Request body is too large.', 413);
    }
  }

  if (!request.body) return error('Request body is required.', 400);

  const reader = request.body.getReader();
  const chunks: Uint8Array[] = [];
  let totalBytes = 0;

  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      totalBytes += value.byteLength;
      if (totalBytes > maxBytes) {
        await reader.cancel();
        return error('Request body is too large.', 413);
      }
      chunks.push(value);
    }
  } catch {
    return error('Unable to read request body.', 400);
  }

  const body = new Uint8Array(totalBytes);
  let offset = 0;
  for (const chunk of chunks) {
    body.set(chunk, offset);
    offset += chunk.byteLength;
  }

  try {
    return { ok: true, data: JSON.parse(new TextDecoder().decode(body)) };
  } catch {
    return error('Malformed JSON payload.', 400);
  }
}

export function getClientIp(request: Pick<NextRequest, 'headers'>): string {
  const forwardedFor = request.headers.get('x-forwarded-for');
  const candidate = forwardedFor?.split(',', 1)[0]?.trim() || 'unknown';
  return IP_ADDRESS_PATTERN.test(candidate) ? candidate : 'unknown';
}

export function getIdempotencyKey(request: Pick<NextRequest, 'headers'>): string | null {
  const key = request.headers.get('idempotency-key')?.trim() || '';
  return IDEMPOTENCY_KEY_PATTERN.test(key) ? key : null;
}

export function isValidIdempotencyKey(key: string): boolean {
  return IDEMPOTENCY_KEY_PATTERN.test(key);
}
