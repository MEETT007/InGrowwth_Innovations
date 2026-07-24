import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';

const isPublicAdminRoute = createRouteMatcher(['/admin', '/admin/sign-in(.*)', '/admin/sign-up(.*)']);

const isAdminRoute = createRouteMatcher(['/admin(.*)']);
const isAdminApiRoute = createRouteMatcher(['/api/admin(.*)']);

const authMiddleware = clerkMiddleware(async (auth, req) => {
  // 1. API Protection: For /api/admin/* endpoints, return 401 JSON if not logged in
  if (isAdminApiRoute(req)) {
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

  // 2. UI Protection: Redirect unauthenticated requests to /admin/* (except sign-in/sign-up)
  if (isAdminRoute(req) && !isPublicAdminRoute(req)) {
    await auth.protect();
  }
});

export default authMiddleware;
export { authMiddleware as proxy };

export const config = {
  matcher: [
    /*
     * Match all request paths except for:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico, sitemap.xml, robots.txt (metadata files)
     * - Public static assets
     */
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|json|webp|png|jpg|jpeg|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    '/(api|trpc)(.*)',
    '/__clerk/:path*',
  ],
};
