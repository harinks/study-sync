// lib/supabase/client.ts
import { createBrowserClient } from '@supabase/ssr'

export function createSuperbaseClient() {
  // Create a supabase client on the browser with project's credentials
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}