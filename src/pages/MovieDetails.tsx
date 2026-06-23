import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { ArrowLeft, Star, Heart } from 'lucide-react';
import { getMovieDetails, getSimilarMovies, getMovieCredits } from '../services/movies';
import { getImageUrl } from '../lib/image';
import Badge from '../components/Badge';
import MovieRow from '../components/MovieRow';
import LoadingState from '../components/LoadingState';
import ErrorState from '../components/ErrorState';

export default function MovieDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const movieId = Number(id);

  const detailsQuery = useQuery({
    queryKey: ['movie', movieId],
    queryFn: () => getMovieDetails(movieId),
    enabled: !!movieId,
  });

  const similarQuery = useQuery({
    queryKey: ['movie', movieId, 'similar'],
    queryFn: () => getSimilarMovies(movieId),
    enabled: !!movieId,
  });

  const creditsQuery = useQuery({
    queryKey: ['movie', movieId, 'credits'],
    queryFn: () => getMovieCredits(movieId),
    enabled: !!movieId,
  });

  if (detailsQuery.isLoading) {
    return (
      <div>
        <div className="h-6 w-32 bg-gray-100 rounded animate-pulse mb-6" />
        <div className="flex gap-8">
          <div className="w-64 aspect-[2/3] bg-gray-100 rounded-xl animate-pulse shrink-0" />
          <div className="flex-1 space-y-4">
            <div className="h-8 w-1/2 bg-gray-100 rounded animate-pulse" />
            <div className="h-4 w-1/4 bg-gray-100 rounded animate-pulse" />
            <div className="h-20 w-full bg-gray-100 rounded animate-pulse" />
          </div>
        </div>
      </div>
    );
  }

  if (detailsQuery.isError || !detailsQuery.data) {
    return (
      <ErrorState
        message="Couldn't load this movie's details."
        onRetry={() => detailsQuery.refetch()}
      />
    );
  }

  const movie = detailsQuery.data;
  const year = movie.release_date ? movie.release_date.slice(0, 4) : '—';
  const hours = Math.floor(movie.runtime / 60);
  const minutes = movie.runtime % 60;

  return (
    <div>
      {/* Back button */}
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-gray-500 hover:text-gray-900 text-sm mb-6 transition-colors"
      >
        <ArrowLeft size={16} />
        Back
      </button>

      {/* Main details */}
      <div className="flex gap-8 flex-col md:flex-row">
        <img
          src={getImageUrl(movie.poster_path, 'w500')}
          alt={movie.title}
          className="w-full max-w-xs md:w-64 rounded-xl object-cover shrink-0 self-center md:self-start"
        />

        <div className="flex-1">
          <h1 className="text-gray-900 text-2xl font-semibold mb-2">{movie.title}</h1>

          <div className="flex items-center gap-3 text-gray-500 text-sm mb-4">
            <span>{year}</span>
            <span>•</span>
            <span>
              {hours}h {minutes}m
            </span>
            {movie.status && (
              <>
                <span>•</span>
                <span>{movie.status}</span>
              </>
            )}
          </div>

          <div className="flex items-center gap-4 mb-5">
            <div className="flex items-center gap-1.5 bg-gray-100 px-3 py-1.5 rounded-lg">
              <Star size={16} className="text-rating fill-rating" />
              <span className="text-gray-900 font-medium">{movie.vote_average.toFixed(1)}</span>
              <span className="text-gray-500 text-sm">({movie.vote_count.toLocaleString()} votes)</span>
            </div>
            <button className="flex items-center gap-2 bg-accent hover:bg-accent-hover text-gray-900 text-sm font-medium px-4 py-2 rounded-lg transition-colors">
              <Heart size={16} />
              Add to Favorites
            </button>
          </div>

          {movie.tagline && (
            <p className="text-gray-500 text-sm italic mb-3">{movie.tagline}</p>
          )}

          <h2 className="text-gray-900 font-medium mb-2">Overview</h2>
          <p className="text-gray-700 text-sm leading-relaxed mb-5">{movie.overview}</p>

          <div className="flex gap-2 flex-wrap mb-5">
            {movie.genres.map((genre) => (
              <Badge key={genre.id}>{genre.name}</Badge>
            ))}
          </div>

          <dl className="grid grid-cols-1 sm:grid-cols-2 gap-y-2 text-sm max-w-sm">
            <dt className="text-gray-800">Release Date</dt>
            <dd className="text-gray-700">{movie.release_date}</dd>

            <dt className="text-gray-800">Director</dt>
            <dd className="text-gray-700">
              {creditsQuery.data?.crew.find((c) => c.job === 'Director')?.name ?? '—'}
            </dd>

            <dt className="text-gray-800">Cast</dt>
            <dd className="text-gray-700">
              {creditsQuery.data?.cast.slice(0, 3).map((c) => c.name).join(', ') || '—'}
            </dd>

            <dt className="text-gray-800">Language</dt>
            <dd className="text-gray-700">
              {movie.spoken_languages.map((l) => l.english_name).join(', ') || '—'}
            </dd>

            {movie.budget > 0 && (
              <>
                <dt className="text-gray-800">Budget</dt>
                <dd className="text-gray-700">${movie.budget.toLocaleString()}</dd>
              </>
            )}

            {movie.revenue > 0 && (
              <>
                <dt className="text-gray-800">Revenue</dt>
                <dd className="text-gray-700">${movie.revenue.toLocaleString()}</dd>
              </>
            )}
          </dl>
        </div>
      </div>

      {/* Similar movies */}
      <div className="mt-10">
        {similarQuery.isLoading && (
          <section>
            <h2 className="text-white text-lg font-semibold mb-4">Similar Movies</h2>
            <LoadingState />
          </section>
        )}
        {similarQuery.data && similarQuery.data.results.length > 0 && (
          <MovieRow title="Similar Movies" movies={similarQuery.data.results} />
        )}
      </div>
    </div>
  );
}