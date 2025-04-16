import { createClient } from '@/lib/superbase/server'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  const next = searchParams.get('next') ?? '/' // Default redirect target

  if (code) {
    const supabase = await createClient();
    console.log('--- Supabase client created. Attempting code exchange... ---');

    // --- UNCOMMENT exchangeCodeForSession Block ---
    const { error } = await supabase.auth.exchangeCodeForSession(code); // <--- UNCOMMENT

    // // Log the result VERY clearly
    // if (error) {
    //    console.error("--- ERROR during exchangeCodeForSession: ---", error); // <-- Log the error object
    //    // Optionally return an error response here instead of redirecting to login immediately
    //    // return new Response(`Error during code exchange: ${error.message}`, { status: 500 });
    // } else {
    //     console.log('--- SUCCESS: exchangeCodeForSession completed without error. ---');
    // }
    // // --- End of exchangeCodeForSession Block ---

    // --- Original Redirect Logic (Executes if no error) ---
    if (!error) {
      console.log(`--- Preparing redirect to: ${next} (origin: ${origin}) ---`);
      const redirectTo = new URL(next, origin);
       // Basic validation to prevent open redirect
       if (redirectTo.origin !== origin) {
           console.warn(`--- Potential Open Redirect detected (Target: ${redirectTo}). Falling back to root. ---`);
           redirectTo.pathname = '/';
           redirectTo.search = '';
       }
       console.log(`--- Executing redirect to: ${redirectTo.toString()} ---`);
      return NextResponse.redirect(redirectTo.toString()); // <--- The actual redirect
    }
    // --- End of Redirect Logic ---

    // --- Fallback if there WAS an exchange error ---
    console.log('--- Code exchange failed, redirecting to login with error message ---');
    const errorUrl = new URL('/login', origin)
    errorUrl.searchParams.set('error', 'Could not log you in. Code exchange failed.')
    errorUrl.searchParams.set('details', error?.message || 'Unknown error') // Pass details if available
    return NextResponse.redirect(errorUrl.toString());
    // --- End of Fallback ---

  } else {
     console.log('--- No code found in callback URL ---');
     return new Response('Error: No code parameter found in callback.', { status: 400 });
  }
}



