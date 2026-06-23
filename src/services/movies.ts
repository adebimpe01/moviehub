import { api } from './api';
import type { MovieDetails, MovieListResponse, Credits, MovieFilters, Genre } from '../types/movie';

export async function getPopularMovies(page = 1): Promise<MovieListResponse> {
  const { data } = await api.get<MovieListResponse>('/movie/popular', {
    params: { page },
  });
  return data;
}

export async function getTopRatedMovies(page = 1): Promise<MovieListResponse> {
  const { data } = await api.get<MovieListResponse>('/movie/top_rated', {
    params: { page },
  });
  return data;
}

export async function getNowPlayingMovies(page = 1): Promise<MovieListResponse> {
  const { data } = await api.get<MovieListResponse>('/movie/now_playing', {
    params: { page },
  });
  return data;
}

export async function getUpcomingMovies(page = 1): Promise<MovieListResponse> {
  const { data } = await api.get<MovieListResponse>('/movie/upcoming', {
    params: { page },
  });
  return data;
}

export async function getMovieDetails(id: number): Promise<MovieDetails> {
  const { data } = await api.get<MovieDetails>(`/movie/${id}`);
  return data;
}

export async function getMovieCredits(id: number): Promise<Credits> {
  const { data } = await api.get<Credits>(`/movie/${id}/credits`);
  return data;
}

export async function getSimilarMovies(id: number): Promise<MovieListResponse> {
  const { data } = await api.get<MovieListResponse>(`/movie/${id}/similar`);
  return data;
}

export async function getGenres(): Promise<{ genres: Genre[] }> {
  const { data } = await api.get<{ genres: Genre[] }>('/genre/movie/list');
  return data;
}

export async function searchMovies(
  query: string,
  page = 1,
  filters?: MovieFilters
): Promise<MovieListResponse> {
  // If there's a search query, use the search endpoint
  if (query.trim()) {
    const { data } = await api.get<MovieListResponse>('/search/movie', {
      params: { query, page },
    });
    return data;
  }

  // If no query but filters exist, use discover endpoint instead
  const { data } = await api.get<MovieListResponse>('/discover/movie', {
    params: {
      page,
      with_genres: filters?.genre,
      primary_release_year: filters?.year,
      'vote_average.gte': filters?.minRating,
      sort_by: filters?.sortBy ?? 'popularity.desc',
    },
  });
  return data;
}