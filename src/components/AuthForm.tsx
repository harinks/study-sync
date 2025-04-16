'use client';

import { useState, useTransition } from 'react';
import { signInWithMagicLink } from '@/actions/auth';
import { Button } from './ui/Button';
import { Input } from './ui/Input';

export default function AuthForm() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setMessage(null);

    startTransition(async () => {
      const result = await signInWithMagicLink(new FormData(event.currentTarget));
      if (result?.error) {
        setError(result.error);
      } else if (result?.success) {
         setMessage(result.success);
         setEmail(''); // Clear email field on success
      }
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700">
          Email address
        </label>
        <Input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="mt-1 block w-full"
          disabled={isPending}
        />
      </div>

      {error && <p className="text-red-500 text-sm">{error}</p>}
      {message && <p className="text-green-600 text-sm">{message}</p>}

      <Button type="submit" className="w-full" disabled={isPending}>
        {isPending ? 'Sending...' : 'Send Magic Link'}
      </Button>
    </form>
  );
}