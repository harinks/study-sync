'use client';

import { useTransition } from 'react';
import { signInWithGoogle } from '@/actions/auth';
import { Button } from './ui/Button';

export default function GoogleSignInButton() {
  const [isPending, startTransition] = useTransition();

  const handleClick = () => {
    startTransition(async () => {
      await signInWithGoogle();
      // Error handling is done via redirect in the server action
    });
  };

  return (
    <Button
       onClick={handleClick}
       disabled={isPending}
       className="w-full bg-red-500 hover:bg-red-700" // Example Google styling
    >
      {isPending ? 'Redirecting...' : 'Sign in with Google'}
    </Button>
  );
}