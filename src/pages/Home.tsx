import { useState, useRef, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Filter } from 'lucide-react';
import MovieRow from '../components/MovieRow';
import MovieGrid from '../components/MovieGrid';
import SearchBar from '../components/SearchBar';
import FilterPanel from '../components/FilterPanel';
import LoadingState from '../components/LoadingState';
import ErrorState from '../components/ErrorState';
import EmptyState from '../components/EmptyState';
import { useDebounce } from '../hooks/useDebounce';
import { getNowPlayingMovies, getTopRatedMovies, getGenres, searchMovies } from '../services/movies';
import { filterMovies } from '../lib/filterMovies';
import type { MovieFilters } from '../types/movie';

export default function Home() {
  const [query, setQuery] = useState('');
  const [filters, setFilters] = useState<MovieFilters>({});
  const [showFilters, setShowFilters] = useState(false);
  const [expandedSection, setExpandedSection] = useState<'now_playing' | 'top_rated' | null>(null);
  const filterRef = useRef<HTMLDivElement>(null);
  const debouncedQuery = useDebounce(query, 500);

  const nowPlaying = useQuery({
    queryKey: ['movies', 'now-playing'],
    queryFn: () => getNowPlayingMovies(),
  });

  const popular = useQuery({
    queryKey: ['movies', 'top-rated'],
    queryFn: () => getTopRatedMovies(),
  });

  const genresQuery = useQuery({
    queryKey: ['genres'],
    queryFn: getGenres,
  });

  const searchQuery = useQuery({
    queryKey: ['home-search', debouncedQuery],
    queryFn: () => searchMovies(debouncedQuery),
    enabled: debouncedQuery.trim().length > 0,
  });

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (filterRef.current && !filterRef.current.contains(e.target as Node)) {
        setShowFilters(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleClearFilters = () => setFilters({});
  const hasActiveFilters = !!(filters.genre || filters.year || filters.minRating);
  const isSearching = debouncedQuery.trim().length > 0;

  const filteredNowPlaying = nowPlaying.data ? filterMovies(nowPlaying.data.results, filters) : [];
  const filteredPopular = popular.data ? filterMovies(popular.data.results, filters) : [];
  const filteredSearchResults = searchQuery.data ? filterMovies(searchQuery.data.results, filters) : [];

  const toggleExpand = (section: 'now_playing' | 'top_rated') => {
    setExpandedSection((prev) => (prev === section ? null : section));
  };

  const renderSection = (
    title: string,
    queryResult: typeof nowPlaying,
    filteredMovies: typeof filteredNowPlaying,
    sectionKey: 'now_playing' | 'top_rated'
  ) => (
    <section className="mb-8">
      {queryResult.isLoading && (
        <>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-white text-base sm:text-lg font-semibold">{title}</h2>
          </div>
          <LoadingState />
        </>
      )}

      {queryResult.isError && (
        <ErrorState message={`Couldn't load ${title.toLowerCase()}.`} onRetry={() => queryResult.refetch()} />
      )}

      {queryResult.data && filteredMovies.length === 0 && (
        <>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-white text-base sm:text-lg font-semibold">{title}</h2>
          </div>
          <EmptyState message="No movies match your filters in this section." />
        </>
      )}

      {queryResult.data && filteredMovies.length > 0 && (
        hasActiveFilters ? (
          <>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-gray-900 text-base sm:text-lg font-semibold">{title}</h2>
            </div>
            <MovieGrid movies={filteredMovies} />
          </>
        ) : (
          <MovieRow
            title={title}
            movies={filteredMovies}
            onViewAll={() => toggleExpand(sectionKey)}
            isExpanded={expandedSection === sectionKey}
          />
        )
      )}
    </section>
  );

  return (
    <div>
      {/* Top bar — search + filters */}
      <div className="flex items-center gap-2 sm:gap-3 mb-6 sm:mb-8">
        <SearchBar value={query} onChange={setQuery} />
        <div className="relative" ref={filterRef}>
          <button
            onClick={() => setShowFilters((prev) => !prev)}
            className={`flex items-center gap-1.5 sm:gap-2 text-sm font-medium px-3 sm:px-4 py-2.5 rounded-lg transition-colors shrink-0 ${hasActiveFilters || showFilters
                ? 'bg-accent text-white'
                : 'bg-accent text-white hover:bg-accent-hover'
              }`}
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

      {isSearching ? (
        <div>
          <p className="text-gray-500 text-sm mb-4">
            {searchQuery.data
              ? `Search Results for "${debouncedQuery}" · ${searchQuery.data.total_results} results found`
              : 'Searching...'}
          </p>

          {searchQuery.isLoading && <LoadingState />}

          {searchQuery.isError && (
            <ErrorState message="Couldn't load search results." onRetry={() => searchQuery.refetch()} />
          )}

          {searchQuery.data && filteredSearchResults.length === 0 && (
            <EmptyState message={`No results for "${debouncedQuery}". Try a different search.`} />
          )}

          {searchQuery.data && filteredSearchResults.length > 0 && (
            <MovieGrid movies={filteredSearchResults} />
          )}
        </div>
      ) : (
        <>
          <div className="mb-6 sm:mb-8">
            <h1 className="text-gray-900 text-xl sm:text-2xl font-semibold mb-1">Discover Movies</h1>
            <p className="text-gray-500 text-sm">Find and explore your next favorite movie</p>
          </div>

          {renderSection('Now Playing', nowPlaying, filteredNowPlaying, 'now_playing')}
          {renderSection('Popular Movies', popular, filteredPopular, 'top_rated')}
        </>
      )}
    </div>
  );
}