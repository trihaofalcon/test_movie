'use client';

import Link from 'next/link';
import { MediaItem } from '@/types/movie';
import { tmdbService } from '@/services/tmdb';
import { Card } from '@/components/ui';
import MovieCardDropdown from './MovieCardDropdown';
import { useMovieStore } from '@/store/useMovieStore';

interface MovieCardProps {
  item: MediaItem;
}

export default function MovieCard({ item }: MovieCardProps) {
  const isFav = useMovieStore((state) =>
    state.favourites.some((fav) => fav.id === item?.id)
  );

  const title = item?.title || item?.name || '';
  const date = item && ('release_date' in item ? item.release_date : item.first_air_date);
  const year = date ? new Date(date).getFullYear() : 'N/A';
  const imageUrl = tmdbService.getImageUrl(item?.poster_path);

  return (
    <Link href={`/${item.media_type}/${item.id}`}>
      <Card hover className="group relative overflow-hidden">
        <div className="aspect-[2/3] overflow-hidden relative">
          <img
            src={imageUrl}
            alt={title}
            className="h-full w-full object-cover transition-opacity group-hover:opacity-75"
            loading="lazy"
          />

          {/* Subtle favourite badge if favourited */}
          {isFav && (
            <div
              className="absolute bottom-2 right-2 z-10 flex h-7 w-7 items-center justify-center rounded-full bg-red-600/90 text-white shadow backdrop-blur-sm"
              title="In favourites"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="h-4 w-4"
              >
                <path d="M11.645 20.91l-.007-.003-.022-.012a15.247 15.247 0 01-.383-.218 25.18 25.18 0 01-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0112 5.052 5.5 5.5 0 0116.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 01-4.244 3.17 15.247 15.247 0 01-.383.219l-.022.012-.007.004-.003.001a.752.752 0 01-.704 0l-.003-.001z" />
              </svg>
            </div>
          )}

          {/* Action dropdown menu */}
          <MovieCardDropdown item={item} />
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent p-4 pointer-events-none">
          <h3 className="mb-1 font-semibold text-white line-clamp-2">{title}</h3>
          <div className="flex items-center justify-between text-sm text-zinc-300">
            <span>{year}</span>
            <div className="flex items-center gap-1">
              <span className="text-yellow-400">★</span>
              <span>{item.vote_average.toFixed(1)}</span>
            </div>
          </div>
        </div>
      </Card>
    </Link>
  );
}

