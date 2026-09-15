export type MediaType = 'movie' | 'tv';

export interface Movie {
  id: number;
  title: string;
  name?: string;
  overview: string;
  poster_path: string;
  backdrop_path: string;
  release_date: string;
  vote_average: number;
  media_type: MediaType;
}

export interface TVShow {
  id: number;
  name: string;
  title?: string;
  overview: string;
  poster_path: string;
  backdrop_path: string;
  first_air_date: string;
  vote_average: number;
  media_type: MediaType;
}

export type MediaItem = Movie | TVShow;

export interface TMDBResponse<T> {
  page: number;
  results: T[];
  total_pages: number;
  total_results: number;
}

export interface MovieDetails extends Movie {
  runtime: number;
  genres: { id: number; name: string }[];
  status: string;
  tagline: string;
}

export interface TVShowDetails extends TVShow {
  number_of_seasons: number;
  number_of_episodes: number;
  genres: { id: number; name: string }[];
  status: string;
  tagline: string;
}

export interface Favourite {
  id: number;
  media_type: MediaType;
  name: string;
  poster_path: string;
  backdrop_path: string;
  vote_average: number;
  release_date: string;
  first_air_date: string;
  addedAt: string;
}

export interface Group {
  id: string;
  name: string;
  description: string;
  createdAt: string;
  favouriteIds: number[];
}

export interface MovieListItem {
  id: number;
  media_type: MediaType;
  title: string;
  poster_path: string;
  backdrop_path: string;
  vote_average: number;
  release_date?: string;
  first_air_date?: string;
  addedAt: string;
}

export interface MovieList {
  id: string;
  name: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
  items: MovieListItem[];
}

