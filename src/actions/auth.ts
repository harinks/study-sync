// actions/auth.ts
'use server' // <--- Mark as Server Actions
import { createClient } from '@/lib/superbase/server';
import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import { z } from 'zod' // Optional: for validation

// Define a schema for email validation (optional but recommended)
const EmailSchema = z.string().email({ message: "Invalid email address" });

export async function signInWithMagicLink(formData: FormData) {
  const email = formData.get('email') as string;

  // Validate email (optional)
  const validation = EmailSchema.safeParse(email);
  if (!validation.success) {
    return { error: validation.error.flatten().formErrors.join(', ') };
  }

  const supabase = await createClient(); // Use the server client
  const origin = (await headers()).get('origin'); // Get the origin URL dynamically

  const { error } = await supabase.auth.signInWithOtp({
    email: validation.data,
    options: {
      // shouldCreateUser: true, // Default: true. Set to false if you only want existing users
      emailRedirectTo: `${origin}/auth/callback`, // Important: Use dynamic origin
    },
  });

  if (error) {
    console.error('Magic Link Error:', error);
    return { error: 'Could not send magic link. Please try again.' };
  }

  // Optionally redirect or return a success message
  // Redirecting might be confusing as user needs to check email
   return { success: 'Magic link sent! Check your email.' };
  // redirect('/login?message=Check email for login link'); // Alternative: redirect with message
}

export async function signInWithGoogle() {
  const supabase = await createClient();
  const origin = (await headers()).get('origin');

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: `${origin}/auth/callback`, // Important: Use dynamic origin
    },
  });

  if (error) {
    console.error('Google Sign In Error:', error);
    // Redirect to login page with an error message
    return redirect('/login?error=Could not authenticate with Google');
  }

  // Redirect the user to the Google OAuth consent screen
  if (data.url) {
    redirect(data.url);
  }

  // Fallback redirect if URL is somehow missing
  return redirect('/login?error=An unexpected error occurred');
}

export async function signOut() {
  const supabase = await createClient();
  const { error } = await supabase.auth.signOut();

  if (error) {
    console.error('Sign Out Error:', error);
    // Handle error appropriately, maybe redirect with error query param
    return redirect('/?error=Could not sign out');
  }

  // Redirect to home page after sign out
  redirect('/');
}