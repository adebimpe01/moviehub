import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useSearchParams } from 'react-router-dom';
import { Filter } from 'lucide-react';

import SearchBar from '../components/SearchBar';
import FilterPanel from '../components/FilterPanel';
import MovieGrid from '../components/MovieGrid';
import LoadingState from '../components/LoadingState';
import ErrorState from '../components/ErrorState';
import EmptyState from '../components/EmptyState';

import { useDebounce } from '../hooks/useDebounce';
import {
  searchMovies,
  getGenres,
  getNowPlayingMovies,
  getTopRatedMovies,
} from '../services/movies';

import type { MovieFilters } from '../types/movie';

export default function Search() {
  const [searchParams] = useSearchParams();
  const initialQuery = searchParams.get('q') ?? '';
  const category = searchParams.get('category');

  const [query, setQuery] = useState(initialQuery);
  const [filters, setFilters] = useState<MovieFilters>({});
  const [showFilters, setShowFilters] = useState(false);

  const debouncedQuery = useDebounce(query, 500);

  useEffect(() => {
    setQuery(initialQuery);
  }, [initialQuery]);

  const genresQuery = useQuery({
    queryKey: ['genres'],
    queryFn: getGenres,
  });

  const categoryQuery = useQuery({
    queryKey: ['category', category],
    queryFn: () =>
      category === 'now_playing'
        ? getNowPlayingMovies()
        : getTopRatedMovies(),
    enabled: !!category && !debouncedQuery && Object.keys(filters).length === 0,
  });

  const resultsQuery = useQuery({
    queryKey: ['search', debouncedQuery, filters],
    queryFn: () => searchMovies(debouncedQuery, 1, filters),
    enabled: debouncedQuery.length > 0 || Object.keys(filters).length > 0,
  });

  const handleClearFilters = () => setFilters({});

  const isCategoryMode =
    !!category && !debouncedQuery && Object.keys(filters).length === 0;

  const hasSearched =
    isCategoryMode ||
    debouncedQuery.length > 0 ||
    Object.keys(filters).length > 0;

  const activeQuery = isCategoryMode ? categoryQuery : resultsQuery;

  return (
    <div>
      {/* Header */}
      <div className="flex items-center gap-2 sm:gap-3 mb-4">
        <SearchBar value={query} onChange={setQuery} />

        {/* Filter Button + Dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowFilters((prev) => !prev)}
            className="flex items-center gap-1.5 sm:gap-2 text-sm font-medium px-3 sm:px-4 py-2.5 rounded-lg bg-accent hover:bg-accent-hover text-white transition-colors shrink-0"
          >
            <Filter size={16} />
            <span className="hidden sm:inline">Filters</span>
          </button>

          {showFilters && genresQuery.data && (
            <FilterPanel
              genres={genresQuery.data.genres}
              filters={filters}
              onChange={setFilters}
              onClear={handleClearFilters}
            />
          )}
        </div>
      </div>

      {/* Search label */}
      {query && (
        <p className="text-gray-900 text-sm font-medium mb-3">
          Search Results for "{query}"
        </p>
      )}

      {/* Results count */}
      {hasSearched && activeQuery.data && (
        <p className="text-gray-500 text-sm mb-4">
          {activeQuery.data.total_results} results found
        </p>
      )}

      {/* States */}
      {!hasSearched && (
        <EmptyState message="Start typing or apply a filter to discover movies." />
      )}

      {hasSearched && activeQuery.isLoading && <LoadingState />}

      {hasSearched && activeQuery.isError && (
        <ErrorState
          message="Couldn't load results."
          onRetry={() => activeQuery.refetch()}
        />
      )}

      {hasSearched &&
        activeQuery.data &&
        activeQuery.data.results.length === 0 && (
          <EmptyState message="No movies found. Try a different search." />
        )}

      {hasSearched &&
        activeQuery.data &&
        activeQuery.data.results.length > 0 && (
          <MovieGrid movies={activeQuery.data.results} />
        )}
    </div>
  );
}