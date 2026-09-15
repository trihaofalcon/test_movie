import { Favourite, Group, MovieList, MovieListItem } from '@/types/movie';

const FAVOURITES_KEY = 'fmovie_favourites';
const GROUPS_KEY = 'fmovie_groups';
const LISTS_KEY = 'fmovie_lists';

class StorageService {
  // Favourites
  getFavourites(): Favourite[] {
    if (typeof window === 'undefined') return [];
    const data = localStorage.getItem(FAVOURITES_KEY);
    return data ? JSON.parse(data) : [];
  }

  saveFavourites(favourites: Favourite[]): void {
    if (typeof window === 'undefined') return;
    localStorage.setItem(FAVOURITES_KEY, JSON.stringify(favourites));
  }

  addFavourite(favourite: Favourite): void {
    const favourites = this.getFavourites();
    if (!favourites.some(f => f.id === favourite.id)) {
      favourites.push(favourite);
      this.saveFavourites(favourites);
    }
  }

  removeFavourite(id: number): void {
    const favourites = this.getFavourites().filter(f => f.id !== id);
    this.saveFavourites(favourites);

    const groups = this.getGroups().map(group => ({
      ...group,
      favouriteIds: group.favouriteIds.filter(favouriteId => favouriteId !== id),
    }));
    this.saveGroups(groups);
  }

  isFavourite(id: number): boolean {
    return this.getFavourites().some(f => f.id === id);
  }

  // Groups
  getGroups(): Group[] {
    if (typeof window === 'undefined') return [];
    const data = localStorage.getItem(GROUPS_KEY);
    return data ? JSON.parse(data) : [];
  }

  saveGroups(groups: Group[]): void {
    if (typeof window === 'undefined') return;
    localStorage.setItem(GROUPS_KEY, JSON.stringify(groups));
  }

  addGroup(group: Omit<Group, 'id' | 'createdAt' | 'favouriteIds'>): Group {
    const groups = this.getGroups();
    const newGroup: Group = {
      ...group,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      favouriteIds: []
    };
    groups.push(newGroup);
    this.saveGroups(groups);
    return newGroup;
  }

  updateGroup(id: string, updates: Partial<Group>): void {
    const groups = this.getGroups();
    const index = groups.findIndex(g => g.id === id);
    if (index !== -1) {
      groups[index] = { ...groups[index], ...updates };
      this.saveGroups(groups);
    }
  }

  deleteGroup(id: string): void {
    const groups = this.getGroups().filter(g => g.id !== id);
    this.saveGroups(groups);
  }

  addFavouriteToGroup(groupId: string, favouriteId: number): void {
    const groups = this.getGroups();
    const group = groups.find(g => g.id === groupId);
    if (group && !group.favouriteIds.includes(favouriteId)) {
      group.favouriteIds.push(favouriteId);
      this.saveGroups(groups);
    }
  }

  removeFavouriteFromGroup(groupId: string, favouriteId: number): void {
    const groups = this.getGroups();
    const group = groups.find(g => g.id === groupId);
    if (group) {
      group.favouriteIds = group.favouriteIds.filter(id => id !== favouriteId);
      this.saveGroups(groups);
    }
  }

  getGroupFavourites(groupId: string): Favourite[] {
    const group = this.getGroups().find(g => g.id === groupId);
    if (!group) return [];
    
    const allFavourites = this.getFavourites();
    return allFavourites.filter(f => group.favouriteIds.includes(f.id));
  }

  // Lists
  getLists(): MovieList[] {
    if (typeof window === 'undefined') return [];
    const data = localStorage.getItem(LISTS_KEY);
    if (data) {
      try {
        return JSON.parse(data);
      } catch {
        return [];
      }
    }
    return [];
  }

  saveLists(lists: MovieList[]): void {
    if (typeof window === 'undefined') return;
    localStorage.setItem(LISTS_KEY, JSON.stringify(lists));
  }

  createList(name: string, description?: string): MovieList {
    const lists = this.getLists();
    const now = new Date().toISOString();
    const newList: MovieList = {
      id: `list_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      name: name.trim(),
      description: description?.trim() || '',
      createdAt: now,
      updatedAt: now,
      items: [],
    };
    lists.push(newList);
    this.saveLists(lists);
    return newList;
  }

  updateList(id: string, updates: Partial<Pick<MovieList, 'name' | 'description'>>): void {
    const lists = this.getLists();
    const index = lists.findIndex(l => l.id === id);
    if (index !== -1) {
      lists[index] = {
        ...lists[index],
        ...updates,
        updatedAt: new Date().toISOString(),
      };
      this.saveLists(lists);
    }
  }

  deleteList(id: string): void {
    const lists = this.getLists().filter(l => l.id !== id);
    this.saveLists(lists);
  }

  addItemToList(listId: string, item: MovieListItem): void {
    const lists = this.getLists();
    const list = lists.find(l => l.id === listId);
    if (list && !list.items.some(i => i.id === item.id)) {
      list.items.unshift(item);
      list.updatedAt = new Date().toISOString();
      this.saveLists(lists);
    }
  }

  removeItemFromList(listId: string, itemId: number): void {
    const lists = this.getLists();
    const list = lists.find(l => l.id === listId);
    if (list) {
      list.items = list.items.filter(i => i.id !== itemId);
      list.updatedAt = new Date().toISOString();
      this.saveLists(lists);
    }
  }

  toggleItemInList(listId: string, item: MovieListItem): boolean {
    const lists = this.getLists();
    const list = lists.find(l => l.id === listId);
    if (!list) return false;

    const exists = list.items.some(i => i.id === item.id);
    if (exists) {
      list.items = list.items.filter(i => i.id !== item.id);
    } else {
      list.items.unshift(item);
    }
    list.updatedAt = new Date().toISOString();
    this.saveLists(lists);
    return !exists;
  }

  isItemInList(listId: string, itemId: number): boolean {
    const lists = this.getLists();
    const list = lists.find(l => l.id === listId);
    return list ? list.items.some(i => i.id === itemId) : false;
  }

  getListsContainingItem(itemId: number): string[] {
    const lists = this.getLists();
    return lists.filter(l => l.items.some(i => i.id === itemId)).map(l => l.id);
  }
}

export const storageService = new StorageService();

