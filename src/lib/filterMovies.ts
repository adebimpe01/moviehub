import type { Movie, MovieFilters } from '../types/movie';

export function filterMovies(movies: Movie[], filters: MovieFilters): Movie[] {
  return movies.filter((movie) => {
    if (filters.genre && !movie.genre_ids.includes(filters.genre)) {
      return false;
    }
    if (filters.year) {
      const movieYear = movie.release_date ? Number(movie.release_date.slice(0, 4)) : null;
      if (movieYear !== filters.year) return false;
    }
    if (filters.minRating && movie.vote_average < filters.minRating) {
      return false;
    }
    return true;
  });
}