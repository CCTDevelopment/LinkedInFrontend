"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';

/**
 * Simple navigation bar component.
 * Highlights the current active route.
 */
export default function Navbar() {
  const pathname = usePathname();
  const linkClasses = (path: string) =>
    `px-4 py-2 rounded hover:bg-blue-600 hover:text-white transition ${
      pathname === path ? 'bg-blue-500 text-white' : 'text-blue-700'
    }`;

  return (
    <nav className="flex items-center justify-between bg-gray-100 px-6 py-4 mb-6 shadow">
      <h1 className="text-xl font-semibold text-gray-800">FounderHub.AI - LinkedIn Company Poster</h1>
      <div className="flex gap-3">
        <Link href="/" className={linkClasses('/')}>Home</Link>
        <Link href="/signup" className={linkClasses('/signup')}>Sign Up</Link>
        <Link href="/login" className={linkClasses('/login')}>Log In</Link>
        <Link href="/dashboard" className={linkClasses('/dashboard')}>Dashboard</Link>
      </div>
    </nav>
  );
}