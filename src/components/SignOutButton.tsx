'use client';

import { useTransition } from 'react';
import { signOut } from '@/actions/auth';
import { Button } from './ui/Button';

export default function SignOutButton() {
  const [isPending, startTransition] = useTransition();

  const handleSignOut = () => {
    startTransition(async () => {
      await signOut();
      // Redirect happens in the server action
    });
  };

  return (
    <Button onClick={handleSignOut} disabled={isPending}>
      {isPending ? 'Signing out...' : 'Sign Out'}
    </Button>
  );
}