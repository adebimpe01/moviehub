import { useNavigate } from 'react-router-dom';
import { Star } from 'lucide-react';
import { getImageUrl } from '../lib/image';
import type { Movie } from '../types/movie';

interface MovieCardProps {
  movie: Movie;
  fixedWidth?: boolean;
}

export default function MovieCard({ movie, fixedWidth = true }: MovieCardProps) {
  const navigate = useNavigate();
  const year = movie.release_date ? movie.release_date.slice(0, 4) : '—';
  const rating = movie.vote_average ? movie.vote_average.toFixed(1) : 'N/A';

  return (
    <button
      onClick={() => navigate(`/movie/${movie.id}`)}
      className={`group flex flex-col text-left cursor-pointer ${
        fixedWidth ? 'w-32 sm:w-40 shrink-0' : 'w-full'
      }`}
    >
      <div className="relative rounded-xl overflow-hidden aspect-[2/3] bg-gray-100">
        <img
          src={getImageUrl(movie.poster_path, 'w300')}
          alt={movie.title}
          loading="lazy"
          className="w-full h-full object-cover transition-transform duration-200 group-hover:scale-105"
        />
        <div className="absolute top-2 left-2 flex items-center gap-1 bg-black/70 backdrop-blur-sm rounded-full px-2 py-0.5">
          <Star size={12} className="text-rating fill-rating" />
          <span className="text-white text-xs font-medium">{rating}</span>
        </div>
      </div>
      <p className="text-gray-900 text-sm font-medium mt-2 line-clamp-1">{movie.title}</p>
      <p className="text-gray-500 text-xs">{year}</p>
    </button>
  );
}