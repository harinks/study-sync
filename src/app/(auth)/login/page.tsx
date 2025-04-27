'use client'; // Top always

import { Suspense } from 'react';
import Link from 'next/link';
import AuthForm from '@/components/AuthForm';
import GoogleSignInButton from '@/components/GoogleSignInButton';
import { useSearchParams } from 'next/navigation';

// Loading fallback component
const LoadingFallback = () => (
  <div className="w-full max-w-md rounded-lg bg-white p-8 shadow-md animate-pulse">
    <div className="h-8 bg-gray-200 rounded w-3/4 mb-6 mx-auto"></div> {/* Title */}
    <div className="h-10 bg-gray-200 rounded mb-4"></div> {/* Form/messages */}
    <div className="h-4 bg-gray-200 rounded w-1/2 mb-4 mx-auto"></div> {/* OR divider */}
    <div className="h-10 bg-gray-200 rounded mb-6"></div> {/* Google button */}
    <div className="h-4 bg-gray-200 rounded w-1/4 mx-auto"></div> {/* Back link */}
  </div>
);

// ✨ Create a small child component that uses useSearchParams safely inside Suspense
const AuthSection = () => {
  const searchParams = useSearchParams();
  const message = searchParams.get('message');
  const error = searchParams.get('error');

  return (
    <>
      {/* Display message if present */}
      {message && (
        <p className="mb-4 rounded bg-blue-100 p-3 text-center text-sm text-blue-700">
          {message}
        </p>
      )}
      {/* Display error if present */}
      {error && (
        <p className="mb-4 rounded bg-red-100 p-3 text-center text-sm text-red-700">
          {error}
        </p>
      )}
      <AuthForm />
    </>
  );
};

const LoginPage = () => {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-100 p-4">
      <div className="w-full max-w-md rounded-lg bg-white p-8 shadow-md">
        <h2 className="mb-6 text-center text-2xl font-bold text-gray-900">
          Sign In / Sign Up
        </h2>

        {/* Now Suspense properly wraps the part using useSearchParams */}
        <Suspense fallback={<LoadingFallback />}>
          <AuthSection />
        </Suspense>

        <div className="my-4 flex items-center justify-center">
          <span className="w-full border-t border-gray-300"></span>
          <span className="mx-4 flex-shrink-0 text-gray-500">OR</span>
          <span className="w-full border-t border-gray-300"></span>
        </div>

        <GoogleSignInButton />

        <p className="mt-6 text-center text-sm text-gray-600">
          <Link href="/" className="font-medium text-indigo-600 hover:text-indigo-500">
            Back to Home
          </Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
