// components/layout/Navbar.tsx
import { createClient } from '@/lib/superbase/server';
import Link from 'next/link';
import SignOutButton from '../SignOutButton';

export default async function Navbar() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  return (
    <nav className="bg-gray-800 p-4 text-white">
      <div className="container mx-auto flex justify-between items-center">
        <Link href="/" className="text-xl font-bold">
          MyApp
        </Link>
        <div className="space-x-4">
          <Link href="/">Home</Link>
          {user ? (
            <>
              <Link href="/dashboard">Dashboard</Link>
              <span className='text-sm text-gray-300 hidden md:inline'>({user.email})</span>
              <SignOutButton />
            </>
          ) : (
            <Link href="/login">Login</Link>
          )}
        </div>
      </div>
    </nav>
  );
}