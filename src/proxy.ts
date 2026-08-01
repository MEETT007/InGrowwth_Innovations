import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
import { requireSameOrigin } from '@/lib/request-security';

const isPublicAdminRoute = createRouteMatcher(['/admin/sign-in(.*)']);
const isAdminRoute = createRouteMatcher(['/admin(.*)']);
const isAdminApiRoute = createRouteMatcher(['/api/admin(.*)']);
const isUploadRoute = createRouteMatcher(['/api/upload']);
const MUTATING_METHODS = new Set(['POST', 'PUT', 'PATCH', 'DELETE']);
const MAX_ADMIN_REQUEST_BYTES = 512 * 1024;

function buildContentSecurityPolicy(nonce: string): string {
  const isDevelopment = process.env.NODE_ENV === 'development';
  return [
    "default-src 'self'",
    `script-src 'self' 'nonce-${nonce}' 'strict-dynamic'${isDevelopment ? " 'unsafe-eval'" : ''}`,
    "style-src 'self' 'unsafe-inline'",
    "img-src 'self' data: blob: https://images.unsplash.com https://i.pravatar.cc https://*.amazonaws.com",
    "font-src 'self'",
    "connect-src 'self' https://*.clerk.accounts.dev https://*.clerk.com",
    "frame-src 'self' https://*.clerk.accounts.dev https://*.clerk.com",
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self'",
    "frame-ancestors 'none'",
    "worker-src 'self' blob:",
    'upgrade-insecure-requests',
  ].join('; ');
}

export default clerkMiddleware(async (auth, request) => {
  if (
    (isAdminApiRoute(request) || isUploadRoute(request)) &&
    MUTATING_METHODS.has(request.method)
  ) {
    const sameOriginError = requireSameOrigin(request);
    if (sameOriginError) return sameOriginError;
  }

  if (isAdminApiRoute(request)) {
    const contentLength = Number(request.headers.get('content-length'));
    if (Number.isFinite(contentLength) && contentLength > MAX_ADMIN_REQUEST_BYTES) {
      return NextResponse.json(
        { success: false, message: 'Request body is too large.' },
        { status: 413 }
      );
    }

    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json(
        {
          success: false,
          message: 'Unauthorized: Authentication required for admin API endpoints.',
        },
        { status: 401 }
      );
    }
  }

  if (isAdminRoute(request) && !isPublicAdminRoute(request)) {
    await auth.protect();
  }

  const nonce = Buffer.from(crypto.randomUUID()).toString('base64');
  const contentSecurityPolicy = buildContentSecurityPolicy(nonce);
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set('x-nonce', nonce);
  requestHeaders.set('Content-Security-Policy', contentSecurityPolicy);

  const response = NextResponse.next({ request: { headers: requestHeaders } });
  response.headers.set('Content-Security-Policy', contentSecurityPolicy);
  return response;
});

export const config = {
  matcher: [
    {
      source:
        '/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt|[^?]*\\.(?:html?|css|js(?!on)|json|webp|png|jpg|jpeg|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
      missing: [
        { type: 'header', key: 'next-router-prefetch' },
        { type: 'header', key: 'purpose', value: 'prefetch' },
      ],
    },
    '/(api|trpc)(.*)',
  ],
};
