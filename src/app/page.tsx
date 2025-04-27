import { createClient } from "@/lib/superbase/server";
import { redirect } from "next/navigation";

export default async function Home() {
  const supabase = await createClient();
   const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
       // This usually shouldn't happen if middleware is correct, but good practice
       return redirect('/login');
     }

  return (
    <main className="flex min-h-screen items-center justify-center p-4">
      <div className="text-center">
        <h1 className="text-3xl font-bold mb-4">Welcome to StudySync 📚</h1>
        <p className="text-lg text-gray-600">Your smart study planner powered by AI + PWA</p>
        {user ? (
         <p>You are logged in as {user.email}.</p>
      ) : (
         <p>Please log in to access protected content.</p>
      )}
      </div>
    </main>
  );
}
