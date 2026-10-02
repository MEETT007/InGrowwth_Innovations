import { auth, currentUser } from '@clerk/nextjs/server';

export type UserRole = 'admin' | 'editor' | 'user';

export interface AuthRoleCheckResult {
  authorized: boolean;
  userId: string | null;
  role: UserRole | null;
  jobTitle?: string | null;
  status?: number;
  error?: string;
}

/**
 * Extracts the user role from Clerk session claims and public metadata.
 * Dynamically assigns jobTitle based on the user's registered email address.
 */
export async function getAuthUserRole(): Promise<{ userId: string | null; role: UserRole | null; jobTitle: string | null }> {
  try {
    const { userId } = await auth();
    if (!userId) {
      return { userId: null, role: null, jobTitle: null };
    }

    const user = await currentUser();
    const email = user?.emailAddresses?.[0]?.emailAddress?.toLowerCase() || '';

    let jobTitle = 'Employee';
    let role: UserRole = 'editor'; // Default to editor for standard employees

    if (email === 'meett2110@gmail.com') {
      jobTitle = 'CEO and Founder';
      role = 'admin';
    } else if (email === 'sauravp3011@gmail.com' || email === 'sauravpankajkumarpatel@gmail.com') {
      jobTitle = 'COO and Co-Founder';
      role = 'admin';
    } else if (email === 'dalwadidarshan1010@gmail.com') {
      jobTitle = 'CTO and Co-Founder';
      role = 'admin';
    }

    return { userId, role, jobTitle };
  } catch (error) {
    console.error('Error fetching user auth/role:', error);
    return { userId: null, role: null, jobTitle: null };
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
