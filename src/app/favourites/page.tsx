'use client';

import Header from '@/components/Header';
import MovieCard from '@/components/MovieCard';
import { Button, Card } from '@/components/ui';
import { favouriteToMediaItem } from '@/lib/media';
import { useMovieStore } from '@/store/useMovieStore';
import { FormEvent, useMemo, useState } from 'react';

type FilterId = 'all' | 'ungrouped' | string;

export default function FavouritesPage() {
  const favourites = useMovieStore((state) => state.favourites);
  const groups = useMovieStore((state) => state.groups);
  const addGroup = useMovieStore((state) => state.addGroup);
  const deleteGroup = useMovieStore((state) => state.deleteGroup);
  const removeFavourite = useMovieStore((state) => state.removeFavourite);
  const removeFavouriteFromGroup = useMovieStore(
    (state) => state.removeFavouriteFromGroup
  );

  const [selectedFilter, setSelectedFilter] = useState<FilterId>('all');
  const [groupName, setGroupName] = useState('');
  const [groupDescription, setGroupDescription] = useState('');

  const groupedIds = useMemo(
    () => new Set(groups.flatMap((group) => group.favouriteIds)),
    [groups]
  );

  const visibleFavourites = useMemo(() => {
    if (selectedFilter === 'all') return favourites;
    if (selectedFilter === 'ungrouped') {
      return favourites.filter((favourite) => !groupedIds.has(favourite.id));
    }

    const group = groups.find((item) => item.id === selectedFilter);
    if (!group) return [];
    return favourites.filter((favourite) =>
      group.favouriteIds.includes(favourite.id)
    );
  }, [favourites, groups, groupedIds, selectedFilter]);

  const handleCreateGroup = (event: FormEvent) => {
    event.preventDefault();
    const name = groupName.trim();
    if (!name) return;

    const group = addGroup({
      name,
      description: groupDescription.trim(),
    });
    setGroupName('');
    setGroupDescription('');
    setSelectedFilter(group.id);
  };

  const handleDeleteGroup = (groupId: string) => {
    const group = groups.find((item) => item.id === groupId);
    if (!group) return;
    if (
      !window.confirm(`Delete group "${group.name}"? Favourites will be kept.`)
    )
      return;

    deleteGroup(groupId);
    if (selectedFilter === groupId) {
      setSelectedFilter('all');
    }
  };

  const selectedGroup = groups.find((group) => group.id === selectedFilter);

  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-700 via-zinc-800 to-zinc-900">
      <Header description="Your saved favourite movies and TV shows" />

      <main className="container mx-auto gap-8 px-4 py-8">
        {/* <aside className="space-y-6">
          <Card className="p-4">
            <h2 className="mb-3 text-lg font-semibold">Create group</h2>
            <form onSubmit={handleCreateGroup} className="space-y-3">
              <Input
                label="Name"
                value={groupName}
                onChange={(event) => setGroupName(event.target.value)}
                placeholder="Weekend watchlist"
                required
              />
              <Input
                label="Description"
                value={groupDescription}
                onChange={(event) => setGroupDescription(event.target.value)}
                placeholder="Optional"
              />
              <Button type="submit" variant="primary" className="w-full">
                Create group
              </Button>
            </form>
          </Card>

          <Card className="p-4">
            <h2 className="mb-3 text-lg font-semibold">Groups</h2>
            <div className="space-y-2">
              <button
                type="button"
                onClick={() => setSelectedFilter('all')}
                className={`w-full rounded-lg px-3 py-2 text-left text-sm ${
                  selectedFilter === 'all' ? 'bg-blue-600 text-white' : 'bg-zinc-800 text-zinc-300 hover:bg-zinc-700'
                }`}
              >
                All favourites ({favourites.length})
              </button>
              <button
                type="button"
                onClick={() => setSelectedFilter('ungrouped')}
                className={`w-full rounded-lg px-3 py-2 text-left text-sm ${
                  selectedFilter === 'ungrouped' ? 'bg-blue-600 text-white' : 'bg-zinc-800 text-zinc-300 hover:bg-zinc-700'
                }`}
              >
                Ungrouped ({favourites.filter((favourite) => !groupedIds.has(favourite.id)).length})
              </button>
              {groups.map((group) => (
                <div key={group.id} className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setSelectedFilter(group.id)}
                    className={`flex-1 rounded-lg px-3 py-2 text-left text-sm ${
                      selectedFilter === group.id ? 'bg-blue-600 text-white' : 'bg-zinc-800 text-zinc-300 hover:bg-zinc-700'
                    }`}
                  >
                    {group.name} ({group.favouriteIds.length})
                  </button>
                  <Button
                    type="button"
                    variant="danger"
                    size="sm"
                    onClick={() => handleDeleteGroup(group.id)}
                    aria-label={`Delete group ${group.name}`}
                  >
                    Delete
                  </Button>
                </div>
              ))}
            </div>
          </Card>
        </aside> */}

        <section>
          <div className="mb-6">
            <h1 className="text-3xl font-bold">
              {selectedFilter === 'all' && 'All favourites'}
              {selectedFilter === 'ungrouped' && 'Ungrouped favourites'}
              {selectedGroup && selectedGroup.name}
            </h1>
            {selectedGroup?.description && (
              <p className="mt-2 text-zinc-400">{selectedGroup.description}</p>
            )}
          </div>

          {visibleFavourites.length === 0 ? (
            <Card className="p-8 text-center text-zinc-400">
              {favourites.length === 0 ? (
                <p>
                  No favourites yet. Search for a movie or TV show and tap the
                  heart to save it.
                </p>
              ) : (
                <p>
                  Nothing in this group yet. Add a favourite from the dropdown
                  on a card.
                </p>
              )}
            </Card>
          ) : (
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
              {visibleFavourites.map((favourite) => (
                <div key={favourite.id} className="space-y-2">
                  <MovieCard item={favouriteToMediaItem(favourite)} />
                  {/* <AddToGroupSelect favouriteId={favourite.id} /> */}
                  {selectedGroup && (
                    <Button
                      type="button"
                      variant="secondary"
                      size="sm"
                      className="w-full"
                      onClick={() =>
                        removeFavouriteFromGroup(selectedGroup.id, favourite.id)
                      }
                    >
                      Remove from group
                    </Button>
                  )}
                </div>
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
