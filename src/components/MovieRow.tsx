import MovieCard from './MovieCard';
import type { Movie } from '../types/movie';

interface MovieRowProps {
  title?: string;
  movies: Movie[];
  onViewAll?: () => void;
  isExpanded?: boolean;
}

export default function MovieRow({ title, movies, onViewAll, isExpanded }: MovieRowProps) {
  const visibleMovies = isExpanded ? movies : movies.slice(0, 7);

  return (
    <section>
      {title && (
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-gray-900 text-base sm:text-lg font-semibold">{title}</h2>
          {onViewAll && (
            <button onClick={onViewAll} className="text-accent text-sm font-medium hover:underline">
              {isExpanded ? 'Show less' : 'View all'}
            </button>
          )}
        </div>
      )}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-7 gap-3 sm:gap-5">
        {visibleMovies.map((movie) => (
          <MovieCard key={movie.id} movie={movie} fixedWidth={false} />
        ))}
      </div>
    </section>
  );
}