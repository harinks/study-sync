
import SignOutButton from '@/components/SignOutButton';
import { createClient } from '@/lib/superbase/server';
import { redirect } from 'next/navigation';


export default async function DashboardPage() {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();

  // Although middleware protects, double-check user existence in critical pages
  if (!user) {
    // This usually shouldn't happen if middleware is correct, but good practice
    return redirect('/login');
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold">Dashboard</h1>
      <p>Welcome, {user.email}!</p>
      <p>Your User ID: {user.id}</p>

      <div className="mt-4">
        <SignOutButton />
      </div>

      {/* Add more dashboard content here */}
    </div>
  );
}