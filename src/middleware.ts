// middleware.ts (Correct Implementation)
import { NextResponse, type NextRequest } from 'next/server';
import { createClient } from './utils/superbase/middleware';

export async function middleware(request: NextRequest) {
  try {
    // Create a Supabase client configured to use cookies and return response object
    const { supabase, response } = await createClient(request);

    // Refresh session if expired - required for Server Components
    // https://supabase.com/docs/guides/auth/server-side/nextjs
    const { data: { session } } = await supabase.auth.getSession();

    // --- Define Routes ---
    const { pathname } = request.nextUrl;
    // Protected routes require authentication
    const protectedRoutes = ['/dashboard']; // Add any other routes needing protection
    // Auth routes (like login) should redirect if user is already logged in
    const authRoutes = ['/login'];

    // --- Route Protection Logic ---

    // 1. If user is not logged in and trying to access a protected route
    const isAccessingProtectedRoute = protectedRoutes.some(path => pathname.startsWith(path));
    if (!session && isAccessingProtectedRoute) {
      console.log(`Middleware: No session, accessing protected route (${pathname}). Redirecting to login.`);
      const redirectUrl = request.nextUrl.clone();
      redirectUrl.pathname = '/login';
      // Optional: Pass the original path to redirect back after login
      redirectUrl.searchParams.set('redirectedFrom', pathname);
      return NextResponse.redirect(redirectUrl);
    }

    // 2. If user IS logged in and trying to access an auth route (like /login)
    const isAccessingAuthRoute = authRoutes.some(path => pathname.startsWith(path));
    if (session && isAccessingAuthRoute) {
      console.log(`Middleware: Session found, accessing auth route (${pathname}). Redirecting to dashboard.`);
      const redirectUrl = request.nextUrl.clone();
      redirectUrl.pathname = '/dashboard'; // Redirect to dashboard or home
      redirectUrl.search = ''; // Clear query params
      return NextResponse.redirect(redirectUrl);
    }

    // --- IMPORTANT: Return the response object! ---
    // This contains potential cookie updates from getSession()
    console.log(`Middleware: Allowing request to proceed for ${pathname}`);
    return response;

  } catch (e) {
    // Handle potential errors during middleware execution
    console.error("ERROR in middleware:", e);
    // Fallback: Allow the request to proceed without modification in case of error
    // Or return a custom error response: return new NextResponse('Internal Server Error', { status: 500 });
    return NextResponse.next({
      request: {
        headers: request.headers,
      },
    });
  }
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * Feel free to modify this pattern to include more paths.
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
    // Explicitly include paths checked by the logic above if needed,
    // but the general pattern usually covers them.
    // Ensuring /dashboard and /login are matched by the general pattern is key.
    '/dashboard/:path*',
    '/login',
  ],
}