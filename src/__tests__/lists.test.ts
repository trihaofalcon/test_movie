import { storageService } from '@/services/storage';
import { mediaItemToListItem, listItemToMediaItem } from '@/lib/media';
import { useMovieStore } from '@/store/useMovieStore';
import { MediaItem, MovieListItem } from '@/types/movie';

describe('Movie Lists Functionality', () => {
  beforeEach(() => {
    localStorage.clear();
    useMovieStore.setState({
      lists: [],
      favourites: [],
      activeListModalItem: null,
    });
  });

  describe('StorageService Lists', () => {
    it('creates and retrieves lists from storage', () => {
      const list = storageService.createList('My Watchlist', 'Movies for Friday');
      expect(list.id).toBeDefined();
      expect(list.name).toBe('My Watchlist');
      expect(list.description).toBe('Movies for Friday');
      expect(list.items).toEqual([]);

      const allLists = storageService.getLists();
      expect(allLists).toHaveLength(1);
      expect(allLists[0].name).toBe('My Watchlist');
    });

    it('updates list details', () => {
      const list = storageService.createList('Old Name', 'Old Desc');
      storageService.updateList(list.id, { name: 'New Name', description: 'New Desc' });

      const updated = storageService.getLists().find((l) => l.id === list.id);
      expect(updated?.name).toBe('New Name');
      expect(updated?.description).toBe('New Desc');
    });

    it('deletes a list', () => {
      const list = storageService.createList('To Delete');
      expect(storageService.getLists()).toHaveLength(1);

      storageService.deleteList(list.id);
      expect(storageService.getLists()).toHaveLength(0);
    });

    it('adds and removes items from a list', () => {
      const list = storageService.createList('Favorites 2026');
      const item: MovieListItem = {
        id: 101,
        media_type: 'movie',
        title: 'Inception',
        poster_path: '/inception.jpg',
        backdrop_path: '/backdrop.jpg',
        vote_average: 8.8,
        release_date: '2010-07-16',
        addedAt: new Date().toISOString(),
      };

      storageService.addItemToList(list.id, item);
      expect(storageService.isItemInList(list.id, 101)).toBe(true);
      expect(storageService.getListsContainingItem(101)).toContain(list.id);

      // Ensure duplicate is not added
      storageService.addItemToList(list.id, item);
      const listsAfterDupe = storageService.getLists();
      expect(listsAfterDupe[0].items).toHaveLength(1);

      // Remove item
      storageService.removeItemFromList(list.id, 101);
      expect(storageService.isItemInList(list.id, 101)).toBe(false);
      expect(storageService.getListsContainingItem(101)).toHaveLength(0);
    });

    it('toggles items in a list', () => {
      const list = storageService.createList('Weekend Binge');
      const item: MovieListItem = {
        id: 202,
        media_type: 'tv',
        title: 'Breaking Bad',
        poster_path: '/bb.jpg',
        backdrop_path: '/bb_back.jpg',
        vote_average: 9.5,
        first_air_date: '2008-01-20',
        addedAt: new Date().toISOString(),
      };

      // Toggle ON
      const added = storageService.toggleItemInList(list.id, item);
      expect(added).toBe(true);
      expect(storageService.isItemInList(list.id, 202)).toBe(true);

      // Toggle OFF
      const removed = storageService.toggleItemInList(list.id, item);
      expect(removed).toBe(false);
      expect(storageService.isItemInList(list.id, 202)).toBe(false);
    });
  });

  describe('Media item conversion helpers', () => {
    it('converts MediaItem to MovieListItem and back', () => {
      const mediaItem: MediaItem = {
        id: 550,
        title: 'Fight Club',
        name: 'Fight Club',
        overview: 'An insomniac office worker...',
        poster_path: '/fight_club.jpg',
        backdrop_path: '/fc_back.jpg',
        release_date: '1999-10-15',
        vote_average: 8.4,
        media_type: 'movie',
      };

      const listItem = mediaItemToListItem(mediaItem);
      expect(listItem.id).toBe(550);
      expect(listItem.title).toBe('Fight Club');
      expect(listItem.media_type).toBe('movie');
      expect(listItem.poster_path).toBe('/fight_club.jpg');

      const convertedBack = listItemToMediaItem(listItem);
      expect(convertedBack.id).toBe(550);
      expect(convertedBack.media_type).toBe('movie');
      if ('title' in convertedBack) {
        expect(convertedBack.title).toBe('Fight Club');
      }
    });
  });

  describe('Zustand MovieStore List actions', () => {
    it('creates, loads, and manages modal state', () => {
      const movie: MediaItem = {
        id: 999,
        title: 'Interstellar',
        name: 'Interstellar',
        overview: 'Mankind was born on Earth...',
        poster_path: '/interstellar.jpg',
        backdrop_path: '/interstellar_back.jpg',
        release_date: '2014-11-07',
        vote_average: 8.6,
        media_type: 'movie',
      };

      // Modal open/close
      useMovieStore.getState().openAddToListModal(movie);
      expect(useMovieStore.getState().activeListModalItem).toEqual(movie);

      useMovieStore.getState().closeAddToListModal();
      expect(useMovieStore.getState().activeListModalItem).toBeNull();

      // Create list via store
      const list = useMovieStore.getState().createList('Sci-Fi Movies', 'Best space movies');
      expect(useMovieStore.getState().lists).toHaveLength(1);
      expect(useMovieStore.getState().lists[0].name).toBe('Sci-Fi Movies');

      // Add item to list via store
      useMovieStore.getState().addItemToList(list.id, movie);
      expect(useMovieStore.getState().lists[0].items).toHaveLength(1);
      expect(useMovieStore.getState().lists[0].items[0].id).toBe(999);

      // Remove item from list via store
      useMovieStore.getState().removeItemFromList(list.id, 999);
      expect(useMovieStore.getState().lists[0].items).toHaveLength(0);

      // Delete list via store
      useMovieStore.getState().deleteList(list.id);
      expect(useMovieStore.getState().lists).toHaveLength(0);
    });
  });
});
