'use client';

import { useMovieStore } from '@/store/useMovieStore';
import { Favourite, MediaItem } from '@/types/movie';
import React, { useEffect, useRef, useState } from 'react';
import { toast } from 'sonner';

interface MovieCardDropdownProps {
  item: MediaItem;
}

export default function MovieCardDropdown({ item }: MovieCardDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const isFav = useMovieStore((state) =>
    state.favourites.some((fav) => fav.id === item.id)
  );
  const addFavourite = useMovieStore((state) => state.addFavourite);
  const removeFavourite = useMovieStore((state) => state.removeFavourite);
  const openAddToListModal = useMovieStore((state) => state.openAddToListModal);

  const title = item.title || item.name || 'Untitled';

  // Handle clicking outside
  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (event: MouseEvent | TouchEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('touchstart', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  const handleToggleDropdown = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsOpen((prev) => !prev);
  };

  const handleToggleFavourite = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsOpen(false);

    if (isFav) {
      removeFavourite(item.id);
      toast.info(`Removed "${title}" from favourites`);
    } else {
      const favourite: Favourite = {
        id: item.id,
        media_type: item.media_type,
        name: title,
        poster_path: item.poster_path,
        backdrop_path: item.backdrop_path,
        vote_average: item.vote_average,
        release_date: 'release_date' in item ? item.release_date || '' : '',
        first_air_date:
          'first_air_date' in item ? item.first_air_date || '' : '',
        addedAt: new Date().toISOString(),
      };
      addFavourite(favourite);
      toast.success(`Added "${title}" to favourites`);
    }
  };

  const handleOpenAddToList = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsOpen(false);
    openAddToListModal(item);
  };

  return (
    <div ref={dropdownRef} className="absolute top-2 right-2 z-20">
      {/* Three dots menu button */}
      <button
        type="button"
        onClick={handleToggleDropdown}
        aria-label="Movie options"
        aria-expanded={isOpen}
        className={`flex h-8 w-8 items-center justify-center rounded-full backdrop-blur-md transition-all cursor-pointer border ${
          isOpen
            ? 'bg-blue-600 text-white border-blue-400 shadow-md ring-2 ring-blue-500/40'
            : 'bg-black/60 text-white/90 border-white/10 hover:bg-black/80 hover:text-white shadow'
        }`}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="currentColor"
          className="w-5 h-5"
        >
          <path
            fillRule="evenodd"
            d="M4.5 12a1.5 1.5 0 113 0 1.5 1.5 0 01-3 0zm6 0a1.5 1.5 0 113 0 1.5 1.5 0 01-3 0zm6 0a1.5 1.5 0 113 0 1.5 1.5 0 01-3 0z"
            clipRule="evenodd"
          />
        </svg>
      </button>

      {/* Dropdown Menu Popover */}
      {isOpen && (
        <div
          role="menu"
          aria-orientation="vertical"
          className="absolute right-0 top-10 z-30 w-44 overflow-hidden rounded-xl border border-zinc-700/80 bg-zinc-900/95 p-1 shadow-2xl backdrop-blur-xl animate-in fade-in zoom-in-95 duration-150"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
          }}
        >
          {/* Favourite Option */}
          <button
            type="button"
            role="menuitem"
            onClick={handleToggleFavourite}
            className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-left text-xs font-medium text-zinc-200 transition-colors hover:bg-zinc-800 hover:text-white cursor-pointer"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill={isFav ? 'currentColor' : 'none'}
              stroke="currentColor"
              strokeWidth={2}
              className={`w-4 h-4 ${isFav ? 'text-red-500' : 'text-zinc-400'}`}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z"
              />
            </svg>
            <span>{isFav ? 'Remove Favourite' : 'Favourite'}</span>
          </button>

          {/* Add to List Option */}
          <button
            type="button"
            role="menuitem"
            onClick={handleOpenAddToList}
            className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-left text-xs font-medium text-zinc-200 transition-colors hover:bg-zinc-800 hover:text-white cursor-pointer"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
              className="w-4 h-4 text-blue-400"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 4.5v15m7.5-7.5h-15"
              />
            </svg>
            <span>Add to List</span>
          </button>
        </div>
      )}
    </div>
  );
}
