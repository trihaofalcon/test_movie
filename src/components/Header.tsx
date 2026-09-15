'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useMovieStore } from '@/store/useMovieStore';
import React from 'react';

export default function Header({
  description,
  children,
}: {
  description?: string;
  children?: React.ReactNode;
}) {
  const pathname = usePathname();
  const listsCount = useMovieStore((state) => state.lists.length);
  const favouritesCount = useMovieStore((state) => state.favourites.length);

  const navItems = [
    { label: 'Favourites', href: '/favourites', count: favouritesCount },
    { label: 'Lists', href: '/lists', count: listsCount },
  ];

  return (
    <header className="sticky top-0 z-40 border-b border-zinc-800 bg-zinc-900/95 backdrop-blur-md">
      <div className="container mx-auto px-4 py-3.5">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start justify-between gap-6 w-full">
            <div>
              <Link
                href="/"
                className="text-2xl font-black tracking-tight text-white hover:text-blue-400 transition-colors flex items-center gap-1.5"
              >
                <span className="rounded-lg bg-blue-600 px-2 py-0.5 text-sm font-extrabold text-white">
                  F
                </span>
                <span>Movie</span>
              </Link>
              {description && (
                <p className="text-xs text-zinc-400 mt-0.5">{description}</p>
              )}
            </div>

            <nav className="flex items-center gap-1">
              {navItems.map((item) => {
                const isActive =
                  item.href === '/'
                    ? pathname === '/'
                    : pathname.startsWith(item.href);

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium transition-all ${isActive
                      ? 'bg-zinc-800 text-white font-semibold shadow-sm'
                      : 'text-zinc-400 hover:bg-zinc-800/60 hover:text-zinc-200'
                      }`}
                  >
                    <span>{item.label}</span>
                    {item.count !== undefined && item.count > 0 && (
                      <span
                        className={`rounded-full px-1.5 py-0.5 text-[10px] font-bold leading-none ${isActive
                          ? 'bg-blue-600 text-white'
                          : 'bg-zinc-800 text-zinc-400 border border-zinc-700'
                          }`}
                      >
                        {item.count}
                      </span>
                    )}
                  </Link>
                );
              })}
            </nav>
          </div>
        </div>

        {children}
      </div>
    </header>
  );
}
