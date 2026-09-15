'use client';

import { Button, Input, Modal } from '@/components/ui';
import { tmdbService } from '@/services/tmdb';
import { useMovieStore } from '@/store/useMovieStore';
import React, { useState } from 'react';
import { toast } from 'sonner';

export default function AddToListModal() {
  const activeItem = useMovieStore((state) => state.activeListModalItem);
  const closeAddToListModal = useMovieStore((state) => state.closeAddToListModal);
  const lists = useMovieStore((state) => state.lists);
  const createList = useMovieStore((state) => state.createList);
  const toggleItemInList = useMovieStore((state) => state.toggleItemInList);
  const addItemToList = useMovieStore((state) => state.addItemToList);

  const [newListName, setNewListName] = useState('');
  const [newListDescription, setNewListDescription] = useState('');
  const [showCreateForm, setShowCreateForm] = useState(false);

  if (!activeItem) return null;

  const title = activeItem.title || activeItem.name || 'Untitled';
  const posterUrl = tmdbService.getImageUrl(activeItem.poster_path);
  const date = 'release_date' in activeItem ? activeItem.release_date : activeItem.first_air_date;
  const year = date ? new Date(date).getFullYear() : null;

  const handleToggleList = (listId: string, listName: string) => {
    const list = lists.find((l) => l.id === listId);
    const wasInList = list?.items.some((i) => i.id === activeItem.id);
    toggleItemInList(listId, activeItem);

    if (wasInList) {
      toast.info(`Removed from "${listName}"`);
    } else {
      toast.success(`Added to "${listName}"`);
    }
  };

  const handleCreateList = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = newListName.trim();
    if (!trimmed) return;

    // Check if list with same name already exists
    const existing = lists.find((l) => l.name.toLowerCase() === trimmed.toLowerCase());
    if (existing) {
      toast.error(`A list named "${trimmed}" already exists.`);
      return;
    }

    const created = createList(trimmed, newListDescription.trim());
    addItemToList(created.id, activeItem);
    toast.success(`Created "${trimmed}" and added "${title}"!`);
    setNewListName('');
    setNewListDescription('');
    setShowCreateForm(false);
  };

  return (
    <Modal
      isOpen={!!activeItem}
      onClose={closeAddToListModal}
      ariaLabelledBy="add-to-list-title"
      contentClassName="p-4 space-y-3"
      header={
        <div className="relative border-b border-zinc-800 p-4 bg-zinc-900/90">
          <button
            type="button"
            onClick={closeAddToListModal}
            className="absolute top-4 right-4 rounded-full p-1.5 text-zinc-400 hover:bg-zinc-800 hover:text-white transition-colors cursor-pointer"
            aria-label="Close modal"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-5 h-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          <div className="flex items-center gap-3 pr-8">
            <div className="h-16 w-12 flex-shrink-0 overflow-hidden rounded-md bg-zinc-800 border border-zinc-700/50">
              <img
                src={posterUrl}
                alt={title}
                className="h-full w-full object-cover"
              />
            </div>
            <div className="min-w-0 flex-1">
              <span className="text-xs font-medium uppercase tracking-wider text-blue-400">
                Add to List
              </span>
              <h2 id="add-to-list-title" className="text-base font-bold text-white truncate">
                {title}
              </h2>
              <div className="flex items-center gap-2 text-xs text-zinc-400 mt-0.5">
                <span className="capitalize">{activeItem.media_type}</span>
                {year && (
                  <>
                    <span>•</span>
                    <span>{year}</span>
                  </>
                )}
                {activeItem.vote_average > 0 && (
                  <>
                    <span>•</span>
                    <span className="text-yellow-400">★ {activeItem.vote_average.toFixed(1)}</span>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      }
      footer={
        <Button
          type="button"
          variant="secondary"
          onClick={closeAddToListModal}
          className="w-full sm:w-auto"
        >
          Done
        </Button>
      }
    >
      {/* Modal Body - List of Lists */}
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold uppercase tracking-wider text-zinc-400">
          Your Lists ({lists.length})
        </span>
        {!showCreateForm && (
          <button
            type="button"
            onClick={() => setShowCreateForm(true)}
            className="text-xs font-medium text-blue-400 hover:text-blue-300 flex items-center gap-1 cursor-pointer"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-3.5 h-3.5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2.5}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
            New list
          </button>
        )}
      </div>

      {lists.length === 0 && !showCreateForm ? (
        <div className="rounded-xl border border-dashed border-zinc-700 p-6 text-center">
          <div className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-zinc-800 text-zinc-400">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-5 h-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={1.5}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M8.25 6.75h12M8.25 12h12m-12 5.25h12M3.75 6.75h.007v.008H3.75V6.75zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zM3.75 12h.007v.008H3.75V12zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm-.375 5.25h.007v.008H3.75v-.008zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z"
              />
            </svg>
          </div>
          <p className="text-sm font-medium text-zinc-300">No lists yet</p>
          <p className="mt-1 text-xs text-zinc-500">
            Create your first list below to organize your movies and shows.
          </p>
          <Button
            type="button"
            variant="primary"
            size="sm"
            className="mt-3"
            onClick={() => setShowCreateForm(true)}
          >
            + Create First List
          </Button>
        </div>
      ) : (
        <div className="space-y-1.5 max-h-56 overflow-y-auto pr-1">
          {lists.map((list) => {
            const isChecked = list.items.some((item) => item.id === activeItem.id);
            return (
              <label
                key={list.id}
                className={`flex items-center justify-between p-3 rounded-xl border transition-all cursor-pointer select-none ${isChecked
                  ? 'bg-blue-600/15 border-blue-500/50 text-white'
                  : 'bg-zinc-800/60 border-zinc-700/50 text-zinc-300 hover:bg-zinc-800 hover:border-zinc-600'
                  }`}
              >
                <div className="min-w-0 flex-1 pr-3">
                  <div className="font-medium text-sm truncate">{list.name}</div>
                  <div className="text-xs text-zinc-400 mt-0.5">
                    {list.items.length} {list.items.length === 1 ? 'item' : 'items'}
                    {list.description ? ` • ${list.description}` : ''}
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={isChecked}
                  onChange={() => handleToggleList(list.id, list.name)}
                  className="h-5 w-5 rounded border-zinc-600 bg-zinc-700 text-blue-600 focus:ring-blue-500 focus:ring-offset-zinc-900 cursor-pointer accent-blue-600"
                />
              </label>
            );
          })}
        </div>
      )}

      {/* Inline Create Form */}
      {showCreateForm && (
        <form
          onSubmit={handleCreateList}
          className="rounded-xl border border-zinc-700/70 bg-zinc-800/60 p-3.5 space-y-2.5 animate-in fade-in slide-in-from-top-2 duration-150"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-zinc-200">Create new list</span>
            <button
              type="button"
              onClick={() => setShowCreateForm(false)}
              className="text-xs text-zinc-400 hover:text-zinc-200 cursor-pointer"
            >
              Cancel
            </button>
          </div>
          <Input
            placeholder="List name (e.g. Weekend Watchlist, Oscar 2026)..."
            value={newListName}
            onChange={(e) => setNewListName(e.target.value)}
            autoFocus
            required
            className="text-sm bg-zinc-900 border-zinc-700 text-white"
          />
          <Input
            placeholder="Description (optional)"
            value={newListDescription}
            onChange={(e) => setNewListDescription(e.target.value)}
            className="text-sm bg-zinc-900 border-zinc-700 text-white"
          />
          <div className="flex justify-end gap-2 pt-1">
            <Button
              type="button"
              variant="secondary"
              size="sm"
              onClick={() => setShowCreateForm(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              size="sm"
              disabled={!newListName.trim()}
            >
              Create & Add
            </Button>
          </div>
        </form>
      )}
    </Modal>
  );
}
