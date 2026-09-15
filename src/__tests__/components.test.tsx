import React from 'react';
import '@testing-library/jest-dom';
import { render, screen, fireEvent } from '@testing-library/react';
import MovieCardDropdown from '@/components/MovieCardDropdown';
import AddToListModal from '@/components/AddToListModal';
import { storageService } from '@/services/storage';
import { useMovieStore } from '@/store/useMovieStore';
import { MediaItem } from '@/types/movie';

const mockMovie: MediaItem = {
  id: 12345,
  title: 'Spider-Man',
  name: 'Spider-Man',
  overview: 'Bitten by a radioactive spider...',
  poster_path: '/spider.jpg',
  backdrop_path: '/spider_back.jpg',
  vote_average: 8.2,
  release_date: '2002-05-03',
  media_type: 'movie',
};

describe('MovieCardDropdown and AddToListModal Components', () => {
  beforeEach(() => {
    localStorage.clear();
    useMovieStore.setState({
      lists: [],
      favourites: [],
      activeListModalItem: null,
    });
  });

  describe('MovieCardDropdown', () => {
    it('renders the dropdown trigger button and opens menu on click', () => {
      render(<MovieCardDropdown item={mockMovie} />);

      const triggerBtn = screen.getByLabelText('Movie options');
      expect(triggerBtn).toBeInTheDocument();

      // Menu is initially closed
      expect(screen.queryByRole('menu')).not.toBeInTheDocument();

      // Click to open
      fireEvent.click(triggerBtn);
      expect(screen.getByRole('menu')).toBeInTheDocument();
      expect(screen.getByText('Favourite')).toBeInTheDocument();
      expect(screen.getByText('Add to List')).toBeInTheDocument();
    });

    it('toggles favourite when clicking Favourite option', () => {
      render(<MovieCardDropdown item={mockMovie} />);

      fireEvent.click(screen.getByLabelText('Movie options'));
      fireEvent.click(screen.getByText('Favourite'));

      expect(useMovieStore.getState().favourites.some((f) => f.id === 12345)).toBe(true);

      // Open menu again, should say Remove Favourite
      fireEvent.click(screen.getByLabelText('Movie options'));
      expect(screen.getByText('Remove Favourite')).toBeInTheDocument();
    });

    it('opens AddToListModal when clicking Add to List option', () => {
      render(<MovieCardDropdown item={mockMovie} />);

      fireEvent.click(screen.getByLabelText('Movie options'));
      fireEvent.click(screen.getByText('Add to List'));

      expect(useMovieStore.getState().activeListModalItem).toEqual(mockMovie);
    });
  });

  describe('AddToListModal', () => {
    it('does not render when activeListModalItem is null', () => {
      const { container } = render(<AddToListModal />);
      expect(container.firstChild).toBeNull();
    });

    it('renders movie info and allows creating and selecting lists', () => {
      const list = storageService.createList('Action Hits');
      useMovieStore.setState({
        activeListModalItem: mockMovie,
        lists: [list],
      });

      render(<AddToListModal />);

      // Check title and list name
      expect(screen.getByText('Spider-Man')).toBeInTheDocument();
      expect(screen.getByText('Action Hits')).toBeInTheDocument();

      // Check the checkbox for Action Hits
      const checkbox = screen.getByRole('checkbox');
      expect(checkbox).not.toBeChecked();

      // Click to toggle movie into list
      fireEvent.click(checkbox);
      expect(useMovieStore.getState().lists[0].items).toHaveLength(1);
      expect(useMovieStore.getState().lists[0].items[0].id).toBe(12345);

      // Open inline create form
      const newBtn = screen.getByText('New list');
      fireEvent.click(newBtn);

      const nameInput = screen.getByPlaceholderText(/List name/i);
      fireEvent.change(nameInput, { target: { value: 'Marvel Classics' } });

      const createBtn = screen.getByText('Create & Add');
      fireEvent.click(createBtn);

      // Verify list was created and movie was added to it
      const lists = useMovieStore.getState().lists;
      expect(lists).toHaveLength(2);
      const marvelList = lists.find((l) => l.name === 'Marvel Classics');
      expect(marvelList).toBeDefined();
      expect(marvelList?.items.some((i) => i.id === 12345)).toBe(true);
    });
  });
});
