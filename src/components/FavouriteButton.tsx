'use client';

import { useMovieStore } from '@/store/useMovieStore';
import { Favourite, MediaType } from '@/types/movie';
import { toast } from 'sonner';

interface FavouriteButtonProps {
  id: number;
  media_type: MediaType;
  title?: string;
  name?: string;
  poster_path: string;
  backdrop_path: string;
  vote_average: number;
  release_date?: string;
  first_air_date?: string;
  variant?: 'overlay' | 'inline';
}

export default function FavouriteButton({
  id,
  media_type,
  name = '',
  poster_path,
  backdrop_path,
  vote_average,
  release_date = '',
  first_air_date = '',
  variant = 'overlay',
}: FavouriteButtonProps) {
  const isFav = useMovieStore((state) => state.favourites.some((favourite) => favourite.id === id));
  const addFavourite = useMovieStore((state) => state.addFavourite);
  const removeFavourite = useMovieStore((state) => state.removeFavourite);

  const handleToggle = (event: React.MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();

    if (isFav) {
      if (window.confirm(`Remove "${name}" from favourites?`)) {
        removeFavourite(id);
        toast.success('Removed from favourites');
      }
      return;
    }

    const favourite: Favourite = {
      id,
      media_type,
      name,
      poster_path,
      backdrop_path,
      vote_average,
      release_date,
      first_air_date,
      addedAt: new Date().toISOString(),
    };

    addFavourite(favourite);
    toast.success('Added to favourites');
  };

  const overlayClass = `absolute top-2 right-2 z-10 p-2 rounded-full transition-all ${
    isFav
      ? 'bg-red-500 text-white hover:bg-red-600'
      : 'bg-black/50 text-white hover:bg-black/70'
  }`;

  const inlineClass = `inline-flex items-center gap-2 rounded-lg px-4 py-2 font-semibold transition-colors ${
    isFav
      ? 'bg-red-500 text-white hover:bg-red-600'
      : 'bg-zinc-800 text-white hover:bg-zinc-700'
  }`;

  return (
    <button
      type="button"
      onClick={handleToggle}
      className={`cursor-pointer ${variant === 'inline' ? inlineClass : overlayClass}`}
      aria-label={isFav ? 'Remove from favourites' : 'Add to favourites'}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill={isFav ? 'currentColor' : 'none'}
        viewBox="0 0 24 24"
        strokeWidth={2}
        stroke="currentColor"
        className="w-5 h-5"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z"
        />
      </svg>
      {variant === 'inline' && (
        <span>{isFav ? 'Remove favourite' : 'Add to favourites'}</span>
      )}
    </button>
  );
}
