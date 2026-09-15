import { MediaType } from "@/types/movie";

export const MEDIA_TYPES: Record<string, MediaType> = {
  MOVIE: 'movie',
  TV: 'tv'
} as const;

