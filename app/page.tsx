"use client";

import Link from 'next/link';

export default function HomePage() {
  return (
    <section className="flex flex-col items-center justify-center text-center space-y-6 mt-20">
      <h2 className="text-4xl font-bold text-blue-600">Welcome to the LinkedIn Company Poster</h2>
      <p className="text-gray-700 max-w-2xl">
        Automate and schedule your company posts to LinkedIn with ease. Sign up, connect
        your LinkedIn account, and start planning your content today.
      </p>
      <div className="flex gap-4">
        <Link
          href="/signup"
          className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded shadow"
        >
          Get Started
        </Link>
        <Link
          href="/login"
          className="border border-blue-500 text-blue-500 hover:bg-blue-50 px-6 py-3 rounded shadow"
        >
          Log In
        </Link>
      </div>
    </section>
  );
}