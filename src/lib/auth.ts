import { auth } from '@clerk/nextjs/server';

export type UserRole = 'admin' | 'editor' | 'user';

export interface AuthRoleCheckResult {
  authorized: boolean;
  userId: string | null;
  role: UserRole | null;
  status?: number;
  error?: string;
}

/**
 * Extracts the user role from Clerk session claims and public metadata.
 * Defaults to 'admin' for authenticated users if no explicit role is set in metadata.
 */
export async function getAuthUserRole(): Promise<{ userId: string | null; role: UserRole | null }> {
  try {
    const { userId, sessionClaims } = await auth();
    if (!userId) {
      return { userId: null, role: null };
    }

    // Extract role from sessionClaims metadata if present
    const claimsRole =
      (sessionClaims?.metadata as { role?: string })?.role ||
      (sessionClaims?.publicMetadata as { role?: string })?.role;

    const role: UserRole =
      claimsRole === 'editor' ? 'editor' : claimsRole === 'user' ? 'user' : 'admin'; // Defaults to 'admin' for authenticated users if no explicit role is set

    return { userId, role };
  } catch (error) {
    console.error('Error fetching user auth/role:', error);
    return { userId: null, role: null };
  }
}

/**
 * Verifies if the active user is logged in and possesses one of the allowed roles.
 */
export async function requireAuthAndRole(
  allowedRoles: UserRole[] = ['admin']
): Promise<AuthRoleCheckResult> {
  const { userId, role } = await getAuthUserRole();

  if (!userId || !role) {
    return {
      authorized: false,
      userId: null,
      role: null,
      status: 401,
      error: 'Unauthorized: Authentication required.',
    };
  }

  if (!allowedRoles.includes(role)) {
    return {
      authorized: false,
      userId,
      role,
      status: 403,
      error: `Forbidden: Requires one of the following roles: ${allowedRoles.join(', ')}.`,
    };
  }

  return {
    authorized: true,
    userId,
    role,
  };
}

/**
 * Helper specifically for verifying Admin role on write/delete CRUD actions.
 */
export async function requireAdminRole(): Promise<AuthRoleCheckResult> {
  return requireAuthAndRole(['admin']);
}
