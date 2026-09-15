'use client';

import Header from '@/components/Header';
import MovieCard from '@/components/MovieCard';
import { Button, Card, Input, Modal } from '@/components/ui';
import { listItemToMediaItem } from '@/lib/media';
import { useMovieStore } from '@/store/useMovieStore';
import { MovieList } from '@/types/movie';
import Link from 'next/link';
import { useMemo, useState } from 'react';
import { toast } from 'sonner';

export default function ListsPage() {
  const lists = useMovieStore((state) => state.lists);
  const createList = useMovieStore((state) => state.createList);
  const updateList = useMovieStore((state) => state.updateList);
  const deleteList = useMovieStore((state) => state.deleteList);
  const removeItemFromList = useMovieStore((state) => state.removeItemFromList);

  const [selectedListId, setSelectedListId] = useState<string | null>(null);

  // Create / Edit modal state
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'create' | 'edit'>('create');
  const [editingList, setEditingList] = useState<MovieList | null>(null);
  const [listName, setListName] = useState('');
  const [listDescription, setListDescription] = useState('');

  // Search within active list
  const [itemSearchQuery, setItemSearchQuery] = useState('');

  // Active list resolution
  const activeList = useMemo(() => {
    if (!lists.length) return null;
    if (selectedListId) {
      const found = lists.find((l) => l.id === selectedListId);
      if (found) return found;
    }
    return lists[0];
  }, [lists, selectedListId]);

  // Filtered items in active list
  const visibleItems = useMemo(() => {
    if (!activeList) return [];
    if (!itemSearchQuery.trim()) return activeList.items;
    const q = itemSearchQuery.toLowerCase();
    return activeList.items.filter((item) =>
      item.title.toLowerCase().includes(q)
    );
  }, [activeList, itemSearchQuery]);

  const handleOpenCreateModal = () => {
    setModalMode('create');
    setEditingList(null);
    setListName('');
    setListDescription('');
    setModalOpen(true);
  };

  const handleOpenEditModal = (list: MovieList) => {
    setModalMode('edit');
    setEditingList(list);
    setListName(list.name);
    setListDescription(list.description || '');
    setModalOpen(true);
  };

  const handleSaveModal = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = listName.trim();
    if (!trimmed) return;

    if (modalMode === 'create') {
      const newList = createList(trimmed, listDescription.trim());
      setSelectedListId(newList.id);
      toast.success(`Created list "${trimmed}"`);
    } else if (editingList) {
      updateList(editingList.id, {
        name: trimmed,
        description: listDescription.trim(),
      });
      toast.success(`Updated list "${trimmed}"`);
    }

    setModalOpen(false);
    setListName('');
    setListDescription('');
  };

  const handleDeleteList = (list: MovieList) => {
    if (
      window.confirm(
        `Are you sure you want to delete list "${list.name}"? This action cannot be undone.`
      )
    ) {
      deleteList(list.id);
      toast.success(`Deleted list "${list.name}"`);
      if (selectedListId === list.id) {
        setSelectedListId(null);
      }
    }
  };

  const handleRemoveItem = (listId: string, itemId: number, itemTitle: string) => {
    removeItemFromList(listId, itemId);
    toast.info(`Removed "${itemTitle}" from list`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-700 via-zinc-800 to-zinc-900">
      <Header description="Organize and curate your personal movie and TV show collections" />

      <main className="container mx-auto px-4 py-8">
        {/* Top bar with title and Create button */}
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-black tracking-tight text-white">
              My Lists
            </h1>
            <p className="text-sm text-zinc-400 mt-0.5">
              {lists.length} {lists.length === 1 ? 'custom list' : 'custom lists'} created
            </p>
          </div>
          <Button
            type="button"
            variant="primary"
            onClick={handleOpenCreateModal}
            className="flex items-center gap-1.5 self-start sm:self-auto cursor-pointer shadow-lg shadow-blue-600/20"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-4 h-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2.5}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
            <span>Create New List</span>
          </Button>
        </div>

        {/* If no lists exist at all */}
        {lists.length === 0 ? (
          <Card className="p-12 text-center border-dashed border-zinc-700 bg-zinc-900/60 backdrop-blur-sm">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-zinc-800/80 text-blue-400 border border-zinc-700">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-8 w-8"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={1.5}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3.75 12h16.5m-16.5 3.75h16.5M3.75 19.5h16.5M5.625 4.5h12.75a1.875 1.875 0 010 3.75H5.625a1.875 1.875 0 010-3.75z"
                />
              </svg>
            </div>
            <h2 className="text-xl font-bold text-white mb-2">
              You don&apos;t have any lists yet
            </h2>
            <p className="mx-auto max-w-md text-sm text-zinc-400 mb-6">
              Create custom lists to save movies and TV shows for weekend marathons, watch parties, holiday specials, and more.
            </p>
            <div className="flex justify-center gap-3">
              <Button
                type="button"
                variant="primary"
                onClick={handleOpenCreateModal}
                className="cursor-pointer"
              >
                + Create Your First List
              </Button>
              <Link href="/">
                <Button type="button" variant="secondary">
                  Explore Movies
                </Button>
              </Link>
            </div>
          </Card>
        ) : (
          /* Main 2-column layout */
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Left Sidebar: Lists selection */}
            <aside className="lg:col-span-1 space-y-3">
              <div className="flex items-center justify-between px-1">
                <span className="text-xs font-bold uppercase tracking-wider text-zinc-400">
                  All Lists ({lists.length})
                </span>
                <button
                  type="button"
                  onClick={handleOpenCreateModal}
                  className="text-xs font-semibold text-blue-400 hover:text-blue-300 flex items-center gap-0.5 cursor-pointer"
                >
                  + Add List
                </button>
              </div>

              <div className="space-y-2">
                {lists.map((list) => {
                  const isSelected = activeList?.id === list.id;
                  return (
                    <div
                      key={list.id}
                      onClick={() => {
                        setSelectedListId(list.id);
                        setItemSearchQuery('');
                      }}
                      className={`group relative flex flex-col p-3.5 rounded-xl border transition-all cursor-pointer ${isSelected
                          ? 'bg-zinc-800/90 border-blue-500/70 shadow-md shadow-blue-500/10 text-white'
                          : 'bg-zinc-900/50 border-zinc-800/80 text-zinc-300 hover:bg-zinc-800/50 hover:border-zinc-700'
                        }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2">
                            <h3 className="font-semibold text-sm truncate text-white">
                              {list.name}
                            </h3>
                            <span
                              className={`rounded-full px-2 py-0.5 text-[11px] font-medium shrink-0 ${isSelected
                                  ? 'bg-blue-600 text-white'
                                  : 'bg-zinc-800 text-zinc-400'
                                }`}
                            >
                              {list.items.length}
                            </span>
                          </div>
                          {list.description && (
                            <p className="text-xs text-zinc-400 line-clamp-1 mt-1">
                              {list.description}
                            </p>
                          )}
                        </div>

                        {/* Actions on hover or always accessible */}
                        <div
                          className="flex items-center gap-1 opacity-80 group-hover:opacity-100 transition-opacity"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <button
                            type="button"
                            onClick={() => handleOpenEditModal(list)}
                            aria-label={`Edit ${list.name}`}
                            className="rounded p-1 text-zinc-400 hover:bg-zinc-700 hover:text-white transition-colors cursor-pointer"
                            title="Edit list"
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="w-3.5 h-3.5"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                              strokeWidth={2}
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10"
                              />
                            </svg>
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDeleteList(list)}
                            aria-label={`Delete ${list.name}`}
                            className="rounded p-1 text-zinc-400 hover:bg-red-950 hover:text-red-400 transition-colors cursor-pointer"
                            title="Delete list"
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="w-3.5 h-3.5"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                              strokeWidth={2}
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
                              />
                            </svg>
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </aside>

            {/* Right Main Column: Active List Details & Movies Grid */}
            <section className="lg:col-span-3 space-y-6">
              {activeList && (
                <>
                  {/* Active List Header Card */}
                  <div className="rounded-2xl border border-zinc-700/80 bg-zinc-900/80 p-6 backdrop-blur-md">
                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                      <div>
                        <div className="flex items-center gap-3">
                          <h2 className="text-2xl font-black text-white">
                            {activeList.name}
                          </h2>
                          <span className="rounded-full bg-blue-600/20 text-blue-400 border border-blue-500/30 px-2.5 py-0.5 text-xs font-semibold">
                            {activeList.items.length} {activeList.items.length === 1 ? 'title' : 'titles'}
                          </span>
                        </div>
                        {activeList.description && (
                          <p className="text-sm text-zinc-300 mt-1.5 max-w-2xl">
                            {activeList.description}
                          </p>
                        )}
                        <p className="text-xs text-zinc-500 mt-2">
                          Created {new Date(activeList.createdAt).toLocaleDateString()}
                          {activeList.updatedAt !== activeList.createdAt &&
                            ` • Updated ${new Date(activeList.updatedAt).toLocaleDateString()}`}
                        </p>
                      </div>

                      <div className="flex items-center gap-2">
                        <Button
                          type="button"
                          variant="secondary"
                          size="sm"
                          onClick={() => handleOpenEditModal(activeList)}
                          className="flex items-center gap-1.5 cursor-pointer"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="w-3.5 h-3.5"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth={2}
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125"
                            />
                          </svg>
                          <span>Edit</span>
                        </Button>
                        <Button
                          type="button"
                          variant="secondary"
                          size="sm"
                          onClick={() => handleDeleteList(activeList)}
                          className="text-red-400 hover:text-red-300 hover:bg-red-950/40 cursor-pointer"
                        >
                          Delete
                        </Button>
                        <Link href="/">
                          <Button type="button" variant="primary" size="sm">
                            + Add Movies
                          </Button>
                        </Link>
                      </div>
                    </div>

                    {/* Filter items within this list if items > 3 */}
                    {activeList.items.length > 3 && (
                      <div className="mt-4 pt-4 border-t border-zinc-800">
                        <Input
                          placeholder={`Filter ${activeList.items.length} titles in "${activeList.name}"...`}
                          value={itemSearchQuery}
                          onChange={(e) => setItemSearchQuery(e.target.value)}
                          className="max-w-md bg-zinc-950/60 border-zinc-700 text-sm"
                        />
                      </div>
                    )}
                  </div>

                  {/* List Items Grid */}
                  {visibleItems.length === 0 ? (
                    <Card className="p-12 text-center border-dashed border-zinc-700 bg-zinc-900/40">
                      {activeList.items.length === 0 ? (
                        <>
                          <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-zinc-800 text-zinc-400">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-6 w-6"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                              strokeWidth={1.5}
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M12 9v6m3-3H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z"
                              />
                            </svg>
                          </div>
                          <h3 className="text-base font-bold text-white mb-1">
                            This list is empty
                          </h3>
                          <p className="text-sm text-zinc-400 mb-4 max-w-sm mx-auto">
                            Browse popular movies and TV shows, then click the menu on any card to add them to this list.
                          </p>
                          <Link href="/">
                            <Button type="button" variant="primary">
                              Discover Movies & TV Shows
                            </Button>
                          </Link>
                        </>
                      ) : (
                        <p className="text-sm text-zinc-400">
                          No titles found matching &quot;{itemSearchQuery}&quot;
                        </p>
                      )}
                    </Card>
                  ) : (
                    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
                      {visibleItems.map((listItem) => {
                        const mediaItem = listItemToMediaItem(listItem);
                        return (
                          <div key={listItem.id} className="space-y-2 group">
                            <MovieCard item={mediaItem} />
                            <Button
                              type="button"
                              variant="secondary"
                              size="sm"
                              className="w-full text-xs text-zinc-400 hover:text-red-400 hover:bg-zinc-800/80 cursor-pointer"
                              onClick={() =>
                                handleRemoveItem(activeList.id, listItem.id, listItem.title)
                              }
                            >
                              Remove from list
                            </Button>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </>
              )}
            </section>
          </div>
        )}
      </main>

      {/* Create / Edit List Dialog */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={modalMode === 'create' ? 'Create New List' : 'Edit List'}
      >
        <form onSubmit={handleSaveModal} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-300 mb-1.5">
              List Name *
            </label>
            <Input
              placeholder="e.g. Weekend Watchlist, Horror Classics..."
              value={listName}
              onChange={(e) => setListName(e.target.value)}
              autoFocus
              required
              className="bg-zinc-950 border-zinc-700 text-white"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-300 mb-1.5">
              Description (Optional)
            </label>
            <Input
              placeholder="What is this collection about?..."
              value={listDescription}
              onChange={(e) => setListDescription(e.target.value)}
              className="bg-zinc-950 border-zinc-700 text-white"
            />
          </div>

          <div className="flex justify-end gap-2 pt-2 border-t border-zinc-800">
            <Button
              type="button"
              variant="secondary"
              onClick={() => setModalOpen(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              disabled={!listName.trim()}
            >
              {modalMode === 'create' ? 'Create List' : 'Save Changes'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
