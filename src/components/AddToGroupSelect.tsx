'use client';

import { useMovieStore } from '@/store/useMovieStore';

interface AddToGroupSelectProps {
  favouriteId: number;
}

export default function AddToGroupSelect({ favouriteId }: AddToGroupSelectProps) {
  const groups = useMovieStore((state) => state.groups);
  const addFavouriteToGroup = useMovieStore((state) => state.addFavouriteToGroup);
  const removeFavouriteFromGroup = useMovieStore((state) => state.removeFavouriteFromGroup);

  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const groupId = event.target.value;
    if (!groupId) return;

    const alreadyInGroup = groups
      .find((group) => group.id === groupId)
      ?.favouriteIds.includes(favouriteId);

    if (alreadyInGroup) {
      removeFavouriteFromGroup(groupId, favouriteId);
    } else {
      addFavouriteToGroup(groupId, favouriteId);
    }

    event.target.value = '';
  };

  if (groups.length === 0) {
    return (
      <p className="text-xs text-zinc-500">Create a group to organise this favourite.</p>
    );
  }

  return (
    <select
      defaultValue=""
      onChange={handleChange}
      onClick={(event) => event.stopPropagation()}
      className="w-full rounded-lg bg-zinc-800 px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
      aria-label="Add or remove from group"
    >
      <option value="" disabled>
        Add to or remove from a group
      </option>
      {groups.map((group) => {
        const inGroup = group.favouriteIds.includes(favouriteId);
        return (
          <option key={group.id} value={group.id}>
            {inGroup ? `Remove from ${group.name}` : `Add to ${group.name}`}
          </option>
        );
      })}
    </select>
  );
}
