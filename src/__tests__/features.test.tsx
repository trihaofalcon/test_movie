import '@testing-library/jest-dom';
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { useMovieStore } from '@/store/useMovieStore';
import { MediaItem, Favourite } from '@/types/movie';
import Header from '@/components/Header';
import FavouriteButton from '@/components/FavouriteButton';
import MovieCard from '@/components/MovieCard';
import Input from '@/components/ui/Input';

// ---------------------------------------------------------------------------
// Mock next/navigation (required by Header → usePathname)
// ---------------------------------------------------------------------------
jest.mock('next/navigation', () => ({
  usePathname: jest.fn(() => '/'),
}));

// Mock next/link (renders a plain <a> in tests)
jest.mock('next/link', () => {
  return function MockLink({
    children,
    href,
  }: {
    children: React.ReactNode;
    href: string;
  }) {
    return <a href={href}>{children}</a>;
  };
});

// Mock sonner toast (no real DOM notifications in tests)
jest.mock('sonner', () => ({ toast: { success: jest.fn(), info: jest.fn() } }));

// ---------------------------------------------------------------------------
// Shared mock data
// ---------------------------------------------------------------------------
const mockMovie: MediaItem = {
  id: 1001,
  title: 'The Dark Knight',
  name: 'The Dark Knight',
  overview: 'Batman faces the Joker.',
  poster_path: '/dark_knight.jpg',
  backdrop_path: '/dark_knight_back.jpg',
  vote_average: 9.0,
  release_date: '2008-07-18',
  media_type: 'movie',
};

const mockTVShow: MediaItem = {
  id: 2001,
  name: 'Breaking Bad',
  title: 'Breaking Bad',
  overview: 'A chemistry teacher turns to crime.',
  poster_path: '/breaking_bad.jpg',
  backdrop_path: '/bb_back.jpg',
  vote_average: 9.5,
  first_air_date: '2008-01-20',
  media_type: 'tv',
};

// ---------------------------------------------------------------------------
// Header component
// ---------------------------------------------------------------------------

describe('Header component', () => {
  const { usePathname } = jest.requireMock('next/navigation') as {
    usePathname: jest.Mock;
  };

  beforeEach(() => {
    localStorage.clear();
    useMovieStore.setState({
      favourites: [],
      lists: [],
      activeListModalItem: null,
    });
    usePathname.mockReturnValue('/');
  });

  it('renders the brand logo link', () => {
    render(<Header />);
    expect(screen.getByText('Movie')).toBeInTheDocument();
    const logoLink = screen.getByRole('link', { name: /movie/i });
    expect(logoLink).toHaveAttribute('href', '/');
  });

  it('renders Favourites and Lists nav links', () => {
    render(<Header />);
    expect(
      screen.getByRole('link', { name: /favourites/i })
    ).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /lists/i })).toBeInTheDocument();
  });

  it('shows count badge when there are favourites', () => {
    useMovieStore.setState({
      favourites: [
        {
          id: 1,
          name: 'Movie A',
          media_type: 'movie',
          poster_path: '',
          backdrop_path: '',
          vote_average: 7,
          release_date: '',
          first_air_date: '',
          addedAt: '',
        },
        {
          id: 2,
          name: 'Movie B',
          media_type: 'movie',
          poster_path: '',
          backdrop_path: '',
          vote_average: 8,
          release_date: '',
          first_air_date: '',
          addedAt: '',
        },
      ],
    });
    render(<Header />);
    expect(screen.getByText('2')).toBeInTheDocument();
  });

  it('does not show count badge when count is 0', () => {
    useMovieStore.setState({ favourites: [], lists: [] });
    render(<Header />);
    // No numeric badges should appear
    expect(screen.queryByText('0')).not.toBeInTheDocument();
  });

  it('renders an optional description below the logo', () => {
    render(<Header description="Browse movies & TV shows" />);
    expect(screen.getByText('Browse movies & TV shows')).toBeInTheDocument();
  });

  it('renders children inside the header', () => {
    render(
      <Header>
        <input placeholder="Search..." aria-label="search" />
      </Header>
    );
    expect(screen.getByLabelText('search')).toBeInTheDocument();
  });
});

// ---------------------------------------------------------------------------
// FavouriteButton component
// ---------------------------------------------------------------------------

describe('FavouriteButton component', () => {
  beforeEach(() => {
    localStorage.clear();
    useMovieStore.setState({
      favourites: [],
      lists: [],
      activeListModalItem: null,
    });
  });

  const defaultProps = {
    id: mockMovie.id,
    media_type: mockMovie.media_type as 'movie',
    name: 'The Dark Knight',
    poster_path: '/dark_knight.jpg',
    backdrop_path: '/dark_knight_back.jpg',
    vote_average: 9.0,
    release_date: '2008-07-18',
  };

  it('renders the "Add to favourites" button when not favourited', () => {
    render(<FavouriteButton {...defaultProps} />);
    expect(screen.getByLabelText('Add to favourites')).toBeInTheDocument();
  });

  it('adds to favourites when clicked', () => {
    render(<FavouriteButton {...defaultProps} />);
    fireEvent.click(screen.getByLabelText('Add to favourites'));
    expect(
      useMovieStore.getState().favourites.some((f) => f.id === mockMovie.id)
    ).toBe(true);
  });

  it('shows "Remove from favourites" label after being favourited', () => {
    const fav: Favourite = {
      id: mockMovie.id,
      media_type: 'movie',
      name: 'The Dark Knight',
      poster_path: '/dark_knight.jpg',
      backdrop_path: '/dark_knight_back.jpg',
      vote_average: 9.0,
      release_date: '2008-07-18',
      first_air_date: '',
      addedAt: new Date().toISOString(),
    };
    useMovieStore.setState({ favourites: [fav] });
    render(<FavouriteButton {...defaultProps} />);
    expect(screen.getByLabelText('Remove from favourites')).toBeInTheDocument();
  });

  it('prompts confirmation before removing from favourites', () => {
    const confirmSpy = jest.spyOn(window, 'confirm').mockReturnValue(true);
    const fav: Favourite = {
      id: mockMovie.id,
      media_type: 'movie',
      name: 'The Dark Knight',
      poster_path: '/dark_knight.jpg',
      backdrop_path: '/dark_knight_back.jpg',
      vote_average: 9.0,
      release_date: '2008-07-18',
      first_air_date: '',
      addedAt: new Date().toISOString(),
    };
    useMovieStore.setState({ favourites: [fav] });
    render(<FavouriteButton {...defaultProps} />);
    fireEvent.click(screen.getByLabelText('Remove from favourites'));
    expect(confirmSpy).toHaveBeenCalled();
    expect(useMovieStore.getState().favourites).toHaveLength(0);
    confirmSpy.mockRestore();
  });

  it('renders inline variant with text label', () => {
    render(<FavouriteButton {...defaultProps} variant="inline" />);
    expect(screen.getByText('Add to favourites')).toBeInTheDocument();
  });
});

// ---------------------------------------------------------------------------
// MovieCard component
// ---------------------------------------------------------------------------

describe('MovieCard component', () => {
  beforeEach(() => {
    localStorage.clear();
    useMovieStore.setState({
      favourites: [],
      lists: [],
      activeListModalItem: null,
    });
  });

  it('renders movie title and year', () => {
    render(<MovieCard item={mockMovie} />);
    expect(screen.getByText('The Dark Knight')).toBeInTheDocument();
    expect(screen.getByText('2008')).toBeInTheDocument();
  });

  it('renders vote average', () => {
    render(<MovieCard item={mockMovie} />);
    expect(screen.getByText('9.0')).toBeInTheDocument();
  });

  it('links to the correct movie detail URL', () => {
    render(<MovieCard item={mockMovie} />);
    const link = screen.getByRole('link');
    expect(link).toHaveAttribute('href', '/movie/1001');
  });

  it('links to the correct TV show detail URL', () => {
    render(<MovieCard item={mockTVShow} />);
    const link = screen.getByRole('link');
    expect(link).toHaveAttribute('href', '/tv/2001');
  });

  it('shows favourite badge when item is in favourites', () => {
    useMovieStore.setState({
      favourites: [
        {
          id: mockMovie.id,
          media_type: 'movie',
          name: 'The Dark Knight',
          poster_path: '/dark_knight.jpg',
          backdrop_path: '/dark_knight_back.jpg',
          vote_average: 9.0,
          release_date: '2008-07-18',
          first_air_date: '',
          addedAt: new Date().toISOString(),
        },
      ],
    });
    render(<MovieCard item={mockMovie} />);
    // Favourite badge has a title attribute
    expect(screen.getByTitle('In favourites')).toBeInTheDocument();
  });

  it('does NOT show favourite badge when item is not favourited', () => {
    render(<MovieCard item={mockMovie} />);
    expect(screen.queryByTitle('In favourites')).not.toBeInTheDocument();
  });
});

// ---------------------------------------------------------------------------
// Input UI component
// ---------------------------------------------------------------------------

describe('Input UI component', () => {
  it('renders a text input', () => {
    render(<Input placeholder="Enter something" />);
    expect(screen.getByPlaceholderText('Enter something')).toBeInTheDocument();
  });

  it('renders a label when the label prop is provided', () => {
    render(<Input label="List name" placeholder="e.g. Watchlist" />);
    expect(screen.getByText('List name')).toBeInTheDocument();
  });

  it('renders error message when error prop is provided', () => {
    render(<Input error="This field is required" />);
    expect(screen.getByText('This field is required')).toBeInTheDocument();
  });

  it('applies error ring styles when error prop is set', () => {
    render(<Input error="Oops" placeholder="test" />);
    const input = screen.getByPlaceholderText('test');
    expect(input.className).toContain('ring-red-500');
  });

  it('fires onChange handler', () => {
    const onChange = jest.fn();
    render(<Input placeholder="type here" onChange={onChange} />);
    fireEvent.change(screen.getByPlaceholderText('type here'), {
      target: { value: 'hello' },
    });
    expect(onChange).toHaveBeenCalledTimes(1);
  });
});

// ---------------------------------------------------------------------------
// Zustand store – search & pagination actions
// ---------------------------------------------------------------------------

describe('useMovieStore – search & pagination', () => {
  beforeEach(() => {
    useMovieStore.setState({
      popularMovies: [],
      popularTVShows: [],
      searchResults: [],
      loading: false,
      error: null,
      currentPage: 1,
      totalPages: 1,
    });
  });

  it('setLoading sets the loading flag', () => {
    useMovieStore.getState().setLoading(true);
    expect(useMovieStore.getState().loading).toBe(true);
    useMovieStore.getState().setLoading(false);
    expect(useMovieStore.getState().loading).toBe(false);
  });

  it('setError stores the error message and clears loading', () => {
    useMovieStore.getState().setLoading(true);
    useMovieStore.getState().setError('Network error');
    const state = useMovieStore.getState();
    expect(state.error).toBe('Network error');
    expect(state.loading).toBe(false);
  });

  it('setPopularMovies stores movies and clears error', () => {
    useMovieStore.getState().setPopularMovies([mockMovie], 5);
    const state = useMovieStore.getState();
    expect(state.popularMovies).toHaveLength(1);
    expect(state.popularMovies[0].id).toBe(1001);
    expect(state.totalPages).toBe(5);
    expect(state.error).toBeNull();
  });

  it('setPopularTVShows stores TV shows', () => {
    useMovieStore.getState().setPopularTVShows([mockTVShow], 3);
    const state = useMovieStore.getState();
    expect(state.popularTVShows).toHaveLength(1);
    expect(state.popularTVShows[0].id).toBe(2001);
    expect(state.totalPages).toBe(3);
  });

  it('setSearchResults stores results and clears error', () => {
    useMovieStore.getState().setSearchResults([mockMovie, mockTVShow], 2);
    const state = useMovieStore.getState();
    expect(state.searchResults).toHaveLength(2);
    expect(state.totalPages).toBe(2);
    expect(state.error).toBeNull();
  });

  it('clearSearch resets search results and page to 1', () => {
    useMovieStore.getState().setSearchResults([mockMovie], 1);
    useMovieStore.getState().setCurrentPage(3);
    useMovieStore.getState().clearSearch();
    const state = useMovieStore.getState();
    expect(state.searchResults).toHaveLength(0);
    expect(state.currentPage).toBe(1);
  });

  it('setCurrentPage updates the page number', () => {
    useMovieStore.getState().setCurrentPage(7);
    expect(useMovieStore.getState().currentPage).toBe(7);
  });
});

// ---------------------------------------------------------------------------
// Zustand store – Groups (via store actions)
// ---------------------------------------------------------------------------

describe('useMovieStore – Groups', () => {
  beforeEach(() => {
    localStorage.clear();
    useMovieStore.setState({
      favourites: [],
      groups: [],
      lists: [],
      activeListModalItem: null,
    });
  });

  it('creates and stores a group', () => {
    const group = useMovieStore
      .getState()
      .addGroup({ name: 'Horror', description: 'Scary stuff' });
    expect(group.name).toBe('Horror');
    expect(useMovieStore.getState().groups).toHaveLength(1);
  });

  it('updates a group name via the store', () => {
    const group = useMovieStore
      .getState()
      .addGroup({ name: 'Old', description: '' });
    useMovieStore.getState().updateGroup(group.id, { name: 'New' });
    const updated = useMovieStore
      .getState()
      .groups.find((g) => g.id === group.id);
    expect(updated?.name).toBe('New');
  });

  it('deletes a group via the store', () => {
    const group = useMovieStore
      .getState()
      .addGroup({ name: 'Temp', description: '' });
    useMovieStore.getState().deleteGroup(group.id);
    expect(useMovieStore.getState().groups).toHaveLength(0);
  });

  it('adds and removes a favourite to/from a group', () => {
    const fav: Favourite = {
      id: 42,
      media_type: 'movie',
      name: 'Matrix',
      poster_path: '',
      backdrop_path: '',
      vote_average: 8,
      release_date: '',
      first_air_date: '',
      addedAt: '',
    };
    useMovieStore.getState().addFavourite(fav);
    const group = useMovieStore
      .getState()
      .addGroup({ name: 'Sci-Fi', description: '' });

    useMovieStore.getState().addFavouriteToGroup(group.id, 42);
    expect(useMovieStore.getState().groups[0].favouriteIds).toContain(42);

    useMovieStore.getState().removeFavouriteFromGroup(group.id, 42);
    expect(useMovieStore.getState().groups[0].favouriteIds).not.toContain(42);
  });

  it('updateList changes list name and description', () => {
    const list = useMovieStore.getState().createList('Initial', 'Desc');
    useMovieStore
      .getState()
      .updateList(list.id, { name: 'Updated', description: 'New Desc' });
    const updated = useMovieStore
      .getState()
      .lists.find((l) => l.id === list.id);
    expect(updated?.name).toBe('Updated');
    expect(updated?.description).toBe('New Desc');
  });

  it('toggleItemInList adds then removes an item', () => {
    const list = useMovieStore.getState().createList('Toggle List');
    useMovieStore.getState().toggleItemInList(list.id, mockMovie);
    expect(useMovieStore.getState().lists[0].items).toHaveLength(1);

    useMovieStore.getState().toggleItemInList(list.id, mockMovie);
    expect(useMovieStore.getState().lists[0].items).toHaveLength(0);
  });
});
