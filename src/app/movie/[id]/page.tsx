'use client';

import FavouriteButton from '@/components/FavouriteButton';
import { Badge, Button } from '@/components/ui';
import { MEDIA_TYPES } from '@/constants/common';
import { cn } from '@/lib';
import { tmdbService } from '@/services/tmdb';
import { MovieDetails } from '@/types/movie';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

import { useMovieStore } from '@/store/useMovieStore';
import Image from 'next/image';

export default function MovieDetailPage() {
  const params = useParams();
  const [movie, setMovie] = useState<MovieDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showFullBackdrop, setShowFullBackdrop] = useState<boolean>(false);

  const router = useRouter();
  const openAddToListModal = useMovieStore((state) => state.openAddToListModal);

  useEffect(() => {
    const fetchMovieDetails = async () => {
      try {
        const id = parseInt(params.id as string);
        const movieData = await tmdbService.getMovieDetails(id);
        setMovie(movieData);
      } catch {
        setError('Failed to load movie details');
      } finally {
        setLoading(false);
      }
    };

    fetchMovieDetails();
  }, [params.id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-zinc-950 text-white">
        <div className="container mx-auto px-4 py-8">
          <div className="animate-pulse">
            <div className="mb-4 h-8 w-1/3 rounded bg-zinc-800" />
            <div className="mb-8 h-64 rounded bg-zinc-800" />
            <div className="mb-4 h-6 w-1/2 rounded bg-zinc-800" />
            <div className="h-24 rounded bg-zinc-800" />
          </div>
        </div>
      </div>
    );
  }

  if (error || !movie) {
    return (
      <div className="min-h-screen bg-zinc-950 text-white">
        <div className="container mx-auto px-4 py-8">
          <div className="rounded-lg bg-red-900/50 p-4 text-red-200">
            {error || 'Movie not found'}
          </div>
          <Link
            href="/"
            className="mt-4 inline-block text-blue-400 hover:text-blue-300"
          >
            ← Back to Home
          </Link>
        </div>
      </div>
    );
  }

  const backdropUrl = tmdbService.getImageUrl(movie.backdrop_path, 'original');
  const posterUrl = tmdbService.getImageUrl(movie.poster_path);

  return (
    <div className="min-h-screen">
      <div className="container mx-auto p-4 bg-transparent sticky top-0 z-50">
        <Button variant="secondary" onClick={() => router.back()}>
          ← Back to Home
        </Button>
      </div>
      <div
        className={cn(
          'relative overflow-hidden mt-[-72px] cursor-pointer transition-all duration-300',
          showFullBackdrop ? 'max-h-[1000px]' : 'max-h-[500px]'
        )}
        onClick={() => setShowFullBackdrop(!showFullBackdrop)}
      >
        <Image
          src={backdropUrl}
          alt={movie.title}
          className="h-full w-full object-cover object-top"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-zinc-800 via-zinc-800/10 to-transparent" />
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col gap-8 md:flex-row">
          <div className="flex-shrink-0">
            <Image
              src={posterUrl}
              alt={movie.title}
              className="h-[500px] w-full rounded-lg object-cover shadow-xl"
            />
          </div>

          <div className="flex-1">
            <div className="mb-4 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <h1 className="text-4xl font-bold">{movie.title}</h1>
              <div className="flex flex-wrap items-center gap-2">
                <FavouriteButton
                  variant="inline"
                  id={movie.id}
                  media_type={MEDIA_TYPES.MOVIE}
                  name={movie.title}
                  poster_path={movie.poster_path}
                  backdrop_path={movie.backdrop_path}
                  vote_average={movie.vote_average}
                  release_date={movie.release_date}
                />
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => openAddToListModal(movie)}
                  className="flex items-center gap-2 cursor-pointer"
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
                </Button>
              </div>
            </div>

            {movie.tagline && (
              <p className="mb-4 text-xl text-zinc-400 italic">
                {movie.tagline}
              </p>
            )}

            <div className="mb-6 flex flex-wrap gap-4 text-sm">
              <div className="flex items-center gap-2">
                <span className="text-yellow-400">★</span>
                <span className="font-semibold">
                  {movie.vote_average.toFixed(1)}
                </span>
              </div>
              <div>•</div>
              <div>{new Date(movie.release_date).getFullYear()}</div>
              <div>•</div>
              <div>{movie.runtime} min</div>
              <div>•</div>
              <div>{movie.status}</div>
            </div>

            <div className="mb-6 flex flex-wrap gap-2">
              {movie.genres.map((genre) => (
                <Badge key={genre.id} variant="default">
                  {genre.name}
                </Badge>
              ))}
            </div>

            <div className="mb-8">
              <h2 className="mb-2 text-xl font-semibold">Overview</h2>
              <p className="text-zinc-300 leading-relaxed">{movie.overview}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
