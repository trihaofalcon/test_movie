'use client';

import { useEffect } from 'react';
import { useMovieStore } from '@/store/useMovieStore';

export default function StoreHydration() {
  const loadFavourites = useMovieStore((state) => state.loadFavourites);
  const loadGroups = useMovieStore((state) => state.loadGroups);
  const loadLists = useMovieStore((state) => state.loadLists);

  useEffect(() => {
    loadFavourites();
    loadGroups();
    loadLists();
  }, [loadFavourites, loadGroups, loadLists]);

  return null;
}
