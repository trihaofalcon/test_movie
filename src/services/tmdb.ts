import { TMDBResponse, Movie, TVShow, MovieDetails, TVShowDetails, MediaItem } from '@/types/movie';
import { API_ENDPOINTS } from '@/constants/api-endpoints';

const API_KEY = process.env.NEXT_PUBLIC_TMDB_API_KEY;
const BASE_URL = 'https://api.themoviedb.org/3';

if (!API_KEY) {
  console.warn('TMDB API key not found. Please set NEXT_PUBLIC_TMDB_API_KEY in .env');
}

class TMDBService {
  private async fetchTMDB<T>(endpoint: string, params?: Record<string, string>): Promise<T> {
    if (!API_KEY) {
      throw new Error('TMDB API key not configured');
    }

    const url = new URL(`${BASE_URL}${endpoint}`);
    url.searchParams.append('api_key', API_KEY);
    
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        url.searchParams.append(key, value);
      });
    }

    const response = await fetch(url.toString());
    
    if (!response.ok) {
      throw new Error(`TMDB API error: ${response.statusText}`);
    }

    return response.json();
  }

  async getPopularMovies(page: number = 1): Promise<TMDBResponse<Movie>> {
    return this.fetchTMDB<TMDBResponse<Movie>>(API_ENDPOINTS.MOVIE_POPULAR, { page: page.toString() });
  }

  async getPopularTVShows(page: number = 1): Promise<TMDBResponse<TVShow>> {
    return this.fetchTMDB<TMDBResponse<TVShow>>(API_ENDPOINTS.TV_POPULAR, { page: page.toString() });
  }

  async searchMulti(query: string, page: number = 1): Promise<TMDBResponse<MediaItem>> {
    return this.fetchTMDB<TMDBResponse<MediaItem>>(API_ENDPOINTS.SEARCH_MULTI, { 
      query, 
      page: page.toString(),
      include_adult: 'false'
    });
  }

  async getMovieDetails(id: number): Promise<MovieDetails> {
    return this.fetchTMDB<MovieDetails>(API_ENDPOINTS.MOVIE_DETAILS(id));
  }

  async getTVShowDetails(id: number): Promise<TVShowDetails> {
    return this.fetchTMDB<TVShowDetails>(API_ENDPOINTS.TV_DETAILS(id));
  }

  getImageUrl(path: string | null, size: 'w500' | 'original' = 'w500'): string {
    if (!path) return '/placeholder.jpg';
    return `https://image.tmdb.org/t/p/${size}${path}`;
  }
}

export const tmdbService = new TMDBService();
