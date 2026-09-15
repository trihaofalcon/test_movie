import { MediaItem } from '@/types/movie';
import MovieCard from './MovieCard';

interface MediaGridProps {
  items: MediaItem[];
  loading: boolean;
}

export default function MediaGrid({ items, loading }: MediaGridProps) {
  if (loading) {
    return (
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
        {Array.from({ length: 10 }).map((_, i) => (
          <div
            key={i}
            className="aspect-[2/3] animate-pulse rounded-lg bg-zinc-800"
          />
        ))}
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="flex min-h-[400px] items-center justify-center text-zinc-400">
        <p>No results found</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
      {items.map((item) => (
        <MovieCard key={item.id} item={item} />
      ))}
    </div>
  );
}
