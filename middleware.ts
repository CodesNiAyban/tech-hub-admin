import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';

const isProtectedRoute = createRouteMatcher([
  '/courses(.*)',
  '/home(.*)',
  '/teacher(.*)',
  '/admin(.*)',
  '/course(.*)',
]);

export default clerkMiddleware((auth, req) => {
  if (!auth().userId && isProtectedRoute(req)) {

    // Add custom logic to run before redirecting // Add notification that session expired

    return auth().redirectToSignIn();
  }
});

export const config = {
  matcher: ['/((?!.+\\.[\\w]+$|_next).*)', '/', '/(api|trpc)(.*)'],
  publicRoutes: ['/sign-in(.*)']
};