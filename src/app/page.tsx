'use client';

import Header from '@/components/Header';
import MediaGrid from '@/components/MediaGrid';
import { Button, Input } from '@/components/ui';
import { MEDIA_TYPES } from '@/constants/common';
import { tmdbService } from '@/services/tmdb';
import { useMovieStore } from '@/store/useMovieStore';
import {
  MediaItem,
  MediaType,
  Movie,
  TMDBResponse,
  TVShow,
} from '@/types/movie';
import Link from 'next/link';
import { useEffect, useState } from 'react';

function normalizeSearchResults(data: TMDBResponse<MediaItem>): MediaItem[] {
  return data.results
    .filter(
      (item) =>
        (item.media_type === MEDIA_TYPES.MOVIE ||
          item.media_type === MEDIA_TYPES.TV) &&
        item.poster_path !== null &&
        item.overview !== null
    )
    .map((item) => {
      if (item.media_type === MEDIA_TYPES.MOVIE) {
        const movie = item as Movie;
        return {
          ...item,
          media_type: MEDIA_TYPES.MOVIE,
          title: movie.title || '',
          name: movie.title || '',
          release_date: movie.release_date || '',
          first_air_date: movie.release_date || '',
        } as MediaItem;
      }

      const show = item as TVShow;
      return {
        ...item,
        media_type: MEDIA_TYPES.TV,
        title: show.name || '',
        name: show.name || '',
        release_date: show.first_air_date || '',
        first_air_date: show.first_air_date || '',
      } as MediaItem;
    });
}

export default function Home() {
  const [activeTab, setActiveTab] = useState<MediaType>(MEDIA_TYPES.MOVIE);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearched, setIsSearched] = useState(false);

  const {
    popularMovies,
    popularTVShows,
    searchResults,
    loading,
    error,
    currentPage,
    totalPages,
    setPopularMovies,
    setPopularTVShows,
    setSearchResults,
    setLoading,
    setError,
    setCurrentPage,
    clearSearch,
  } = useMovieStore();

  useEffect(() => {
    const fetchPopular = async () => {
      setLoading(true);
      try {
        if (activeTab === MEDIA_TYPES.MOVIE) {
          const data = await tmdbService.getPopularMovies(currentPage);
          const moviesWithMediaType = data.results.map((movie) => ({
            ...movie,
            media_type: MEDIA_TYPES.MOVIE,
          }));
          setPopularMovies(moviesWithMediaType, data.total_pages);
        } else {
          const data = await tmdbService.getPopularTVShows(currentPage);
          const showsWithMediaType = data.results.map((show) => ({
            ...show,
            media_type: MEDIA_TYPES.TV,
          }));
          setPopularTVShows(showsWithMediaType, data.total_pages);
        }
      } catch (err) {
        setError('Failed to fetch data');
      }
    };

    if (isSearched) return;

    fetchPopular();
  }, [
    activeTab,
    currentPage,
    isSearched,
    setPopularMovies,
    setPopularTVShows,
    setLoading,
    setError,
  ]);

  const runSearch = async (query: string, page: number) => {
    setLoading(true);
    setIsSearched(true);
    try {
      const data = await tmdbService.searchMulti(query, page);
      setSearchResults(normalizeSearchResults(data), data.total_pages);
      setCurrentPage(page);
    } catch (err) {
      setError('Search failed');
    }
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) {
      clearSearch();
      setIsSearched(false);
      return;
    }

    await runSearch(searchQuery, 1);
  };

  const handleTabChange = (tab: MediaType) => {
    setActiveTab(tab);
    setCurrentPage(1);
    clearSearch();
    setSearchQuery('');
    setIsSearched(false);
  };

  const handlePageChange = (newPage: number) => {
    if (isSearched) {
      runSearch(searchQuery, newPage);
    } else {
      setCurrentPage(newPage);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const currentItems = isSearched
    ? searchResults
    : activeTab === MEDIA_TYPES.MOVIE
      ? popularMovies
      : popularTVShows;

  console.log(totalPages);

  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-700 via-zinc-800 to-zinc-900">
      <Header>
        <div className="flex flex-col-reverse gap-4 md:flex-row md:items-center md:justify-between mt-4">
          <div className="flex gap-2">
            <Button
              onClick={() => handleTabChange(MEDIA_TYPES.MOVIE)}
              variant={
                activeTab === MEDIA_TYPES.MOVIE ? 'primary' : 'secondary'
              }
              className="flex-1 sm:flex-none"
            >
              Movies
            </Button>
            <Button
              onClick={() => handleTabChange(MEDIA_TYPES.TV)}
              variant={activeTab === MEDIA_TYPES.TV ? 'primary' : 'secondary'}
              className="flex-1 sm:flex-none"
            >
              TV Shows
            </Button>
          </div>
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
            <form onSubmit={handleSearch} className="flex gap-2">
              <Input
                type="text"
                placeholder="Search movies & TV shows..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1 lg:w-80"
              />
              <Button type="submit" variant="primary">
                Search
              </Button>
            </form>
          </div>
        </div>
      </Header>

      <main className="container mx-auto px-4 py-8">
        {error && (
          <div className="mb-4 rounded-lg bg-red-900/50 p-4 text-red-200">
            {error}
          </div>
        )}

        <MediaGrid items={currentItems} loading={loading} />

        {!loading && totalPages > 1 && (
          <div className="mt-8 flex justify-center gap-2">
            <Button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              variant="secondary"
            >
              Previous
            </Button>
            <span className="flex items-center px-4 text-zinc-400">
              Page {currentPage} of {totalPages}
            </span>
            <Button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              variant="secondary"
            >
              Next
            </Button>
          </div>
        )}
      </main>
    </div>
  );
}
