import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';

const isPublicRoute = createRouteMatcher(['/sign-in', '/api(.*)']);
export default clerkMiddleware((auth, req) => {
  // Add custom logic to run before redirecting // Add notification that session expired
  if (!isPublicRoute(req) && !auth().userId) {
    auth().protect();
  }
});

export const config = { matcher: ['/((?!.+\\.[\\w]+$|_next).*)', '/', '/(api|trpc)(.*)'] };