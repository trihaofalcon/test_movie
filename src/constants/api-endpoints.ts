export const API_ENDPOINTS = {
  MOVIE_POPULAR: '/movie/popular',
  TV_POPULAR: '/tv/popular',
  SEARCH_MULTI: '/search/multi',
  MOVIE_DETAILS: (id: number) => `/movie/${id}`,
  TV_DETAILS: (id: number) => `/tv/${id}`
} as const;