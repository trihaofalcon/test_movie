import { MEDIA_TYPES } from '@/constants/common';
import { Favourite, MediaItem, MovieListItem } from '@/types/movie';

export function getMediaTitle(
  item: Favourite | MediaItem | MovieListItem
): string {
  if ('name' in item && item.name) return item.name;
  if ('title' in item && item.title) return item.title;
  return 'Untitled';
}

export function favouriteToMediaItem(favourite: Favourite): MediaItem {
  const title = getMediaTitle(favourite);

  if (favourite.media_type === MEDIA_TYPES.MOVIE) {
    return {
      id: favourite.id,
      title,
      overview: '',
      poster_path: favourite.poster_path,
      backdrop_path: favourite.backdrop_path,
      release_date: favourite.release_date || favourite.first_air_date,
      vote_average: favourite.vote_average,
      media_type: MEDIA_TYPES.MOVIE,
    };
  }
  return {
    id: favourite.id,
    name: title,
    overview: '',
    poster_path: favourite.poster_path,
    backdrop_path: favourite.backdrop_path,
    first_air_date: favourite.first_air_date,
    release_date: favourite.release_date,
    vote_average: favourite.vote_average,
    media_type: MEDIA_TYPES.TV,
  };
}

export function mediaItemToListItem(item: MediaItem): MovieListItem {
  const title = getMediaTitle(item);
  return {
    id: item.id,
    media_type: item.media_type,
    title,
    poster_path: item.poster_path,
    backdrop_path: item.backdrop_path,
    vote_average: item.vote_average,
    release_date: 'release_date' in item ? item.release_date : undefined,
    first_air_date: 'first_air_date' in item ? item.first_air_date : undefined,
    addedAt: new Date().toISOString(),
  };
}

export function listItemToMediaItem(item: MovieListItem): MediaItem {
  if (item.media_type === MEDIA_TYPES.MOVIE) {
    return {
      id: item.id,
      title: item.title,
      overview: '',
      poster_path: item.poster_path,
      backdrop_path: item.backdrop_path,
      release_date: item.release_date || item.first_air_date || '',
      vote_average: item.vote_average,
      media_type: MEDIA_TYPES.MOVIE,
    };
  }
  return {
    id: item.id,
    name: item.title,
    overview: '',
    poster_path: item.poster_path,
    backdrop_path: item.backdrop_path,
    first_air_date: item.first_air_date || item.release_date || '',
    release_date: item.release_date || '',
    vote_average: item.vote_average,
    media_type: MEDIA_TYPES.TV,
  };
}
