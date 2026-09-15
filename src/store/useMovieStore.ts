import { mediaItemToListItem } from '@/lib/media';
import { storageService } from '@/services/storage';
import { Favourite, Group, MediaItem, MovieList } from '@/types/movie';
import { create } from 'zustand';

interface MovieStore {
  popularMovies: MediaItem[];
  popularTVShows: MediaItem[];
  searchResults: MediaItem[];
  loading: boolean;
  error: string | null;
  currentPage: number;
  totalPages: number;
  favourites: Favourite[];
  groups: Group[];
  lists: MovieList[];
  activeListModalItem: MediaItem | null;

  setPopularMovies: (movies: MediaItem[], totalPages: number) => void;
  setPopularTVShows: (shows: MediaItem[], totalPages: number) => void;
  setSearchResults: (results: MediaItem[], totalPages: number) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  setCurrentPage: (page: number) => void;
  clearSearch: () => void;
  loadFavourites: () => void;
  addFavourite: (favourite: Favourite) => void;
  removeFavourite: (id: number) => void;
  isFavourite: (id: number) => boolean;
  loadGroups: () => void;
  addGroup: (group: Omit<Group, 'id' | 'createdAt' | 'favouriteIds'>) => Group;
  updateGroup: (id: string, updates: Partial<Group>) => void;
  deleteGroup: (id: string) => void;
  addFavouriteToGroup: (groupId: string, favouriteId: number) => void;
  removeFavouriteFromGroup: (groupId: string, favouriteId: number) => void;

  // Lists
  loadLists: () => void;
  createList: (name: string, description?: string) => MovieList;
  updateList: (id: string, updates: Partial<Pick<MovieList, 'name' | 'description'>>) => void;
  deleteList: (id: string) => void;
  addItemToList: (listId: string, item: MediaItem) => void;
  removeItemFromList: (listId: string, itemId: number) => void;
  toggleItemInList: (listId: string, item: MediaItem) => void;
  openAddToListModal: (item: MediaItem) => void;
  closeAddToListModal: () => void;
}

export const useMovieStore = create<MovieStore>((set) => ({
  popularMovies: [],
  popularTVShows: [],
  searchResults: [],
  loading: false,
  error: null,
  currentPage: 1,
  totalPages: 1,
  favourites: [],
  groups: [],
  lists: [],
  activeListModalItem: null,

  setPopularMovies: (movies, totalPages) =>
    set({
      popularMovies: movies,
      totalPages,
      loading: false,
      error: null,
    }),

  setPopularTVShows: (shows, totalPages) =>
    set({
      popularTVShows: shows,
      totalPages,
      loading: false,
      error: null,
    }),

  setSearchResults: (results, totalPages) =>
    set({
      searchResults: results,
      totalPages,
      loading: false,
      error: null,
    }),

  setLoading: (loading) => set({ loading }),

  setError: (error) => set({ error, loading: false }),

  setCurrentPage: (currentPage) => set({ currentPage }),

  clearSearch: () =>
    set({
      searchResults: [],
      currentPage: 1,
      error: null,
    }),

  loadFavourites: () => set({ favourites: storageService.getFavourites() }),

  addFavourite: (favourite) => {
    storageService.addFavourite(favourite);
    set({ favourites: storageService.getFavourites() });
  },

  removeFavourite: (id) => {
    storageService.removeFavourite(id);
    set({
      favourites: storageService.getFavourites(),
      groups: storageService.getGroups(),
    });
  },

  isFavourite: (id) => storageService.isFavourite(id),

  loadGroups: () => set({ groups: storageService.getGroups() }),

  addGroup: (group) => {
    const newGroup = storageService.addGroup(group);
    set({ groups: storageService.getGroups() });
    return newGroup;
  },

  updateGroup: (id, updates) => {
    storageService.updateGroup(id, updates);
    set({ groups: storageService.getGroups() });
  },

  deleteGroup: (id) => {
    storageService.deleteGroup(id);
    set({ groups: storageService.getGroups() });
  },

  addFavouriteToGroup: (groupId, favouriteId) => {
    storageService.addFavouriteToGroup(groupId, favouriteId);
    set({ groups: storageService.getGroups() });
  },

  removeFavouriteFromGroup: (groupId, favouriteId) => {
    storageService.removeFavouriteFromGroup(groupId, favouriteId);
    set({ groups: storageService.getGroups() });
  },

  // Lists
  loadLists: () => set({ lists: storageService.getLists() }),

  createList: (name, description) => {
    const newList = storageService.createList(name, description);
    set({ lists: storageService.getLists() });
    return newList;
  },

  updateList: (id, updates) => {
    storageService.updateList(id, updates);
    set({ lists: storageService.getLists() });
  },

  deleteList: (id) => {
    storageService.deleteList(id);
    set({ lists: storageService.getLists() });
  },

  addItemToList: (listId, item) => {
    storageService.addItemToList(listId, mediaItemToListItem(item));
    set({ lists: storageService.getLists() });
  },

  removeItemFromList: (listId, itemId) => {
    storageService.removeItemFromList(listId, itemId);
    set({ lists: storageService.getLists() });
  },

  toggleItemInList: (listId, item) => {
    storageService.toggleItemInList(listId, mediaItemToListItem(item));
    set({ lists: storageService.getLists() });
  },

  openAddToListModal: (item) => set({ activeListModalItem: item }),

  closeAddToListModal: () => set({ activeListModalItem: null }),
}));

