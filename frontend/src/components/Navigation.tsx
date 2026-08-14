'use client';

import Link from 'next/link';
import { Atom } from 'lucide-react';

export function Navigation() {
  return (
    <nav className="sticky top-0 z-50 backdrop-blur-lg border-b border-slate-700/50 bg-slate-900/50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 font-bold text-xl">
            <Atom className="w-6 h-6 text-purple-400" />
            <span>Chemistry Explorer</span>
          </Link>

          <div className="flex items-center gap-6">
            <Link
              href="/"
              className="text-sm hover:text-purple-400 transition-colors"
            >
              Home
            </Link>
            <Link
              href="/molecules"
              className="text-sm hover:text-purple-400 transition-colors"
            >
              Molecules
            </Link>
            <Link
              href="/quiz"
              className="text-sm hover:text-purple-400 transition-colors"
            >
              Quiz
            </Link>
            <Link
              href="/notes"
              className="text-sm hover:text-purple-400 transition-colors"
            >
              Notes
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
