import { ChevronDown } from 'lucide-react';
import type { MovieFilters, Genre } from '../types/movie';

interface FilterPanelProps {
  genres: Genre[];
  filters: MovieFilters;
  onChange: (filters: MovieFilters) => void;
  onClear: () => void;
}

const years = Array.from({ length: 30 }, (_, i) => new Date().getFullYear() - i);

const sortOptions = [
  { value: 'popularity.desc', label: 'Popularity' },
  { value: 'vote_average.desc', label: 'Rating' },
  { value: 'primary_release_date.desc', label: 'Newest' },
] as const;

function SelectField({
  label,
  value,
  onChange,
  children,
}: {
  label: string;
  value: string | number | undefined;
  onChange: (value: string) => void;
  children: React.ReactNode;
}) {
  return (
    <div className="w-full sm:flex-1 sm:min-w-[130px]">
      <label className="text-gray-500 text-xs font-medium mb-1.5 block">{label}</label>
      <div className="relative">
        <select
          value={value ?? ''}
          onChange={(e) => onChange(e.target.value)}
          className="w-full appearance-none bg-white text-gray-700 text-sm rounded-lg pl-3 pr-8 py-2 border border-gray-200 outline-none hover:border-gray-300 focus:border-accent focus:ring-1 focus:ring-accent/30 transition-colors cursor-pointer"
        >
          {children}
        </select>
        <ChevronDown
          size={14}
          className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
        />
      </div>
    </div>
  );
}

export default function FilterPanel({ genres, filters, onChange, onClear }: FilterPanelProps) {
  const hasActiveFilters = filters.genre || filters.year || filters.minRating;

  return (
    <div className="flex flex-col sm:flex-row sm:flex-wrap sm:items-end gap-4 sm:gap-3">
      <SelectField
        label="Genre"
        value={filters.genre}
        onChange={(v) => onChange({ ...filters, genre: v ? Number(v) : undefined })}
      >
        <option value="">All Genres</option>
        {genres.map((genre) => (
          <option key={genre.id} value={genre.id}>
            {genre.name}
          </option>
        ))}
      </SelectField>

      <SelectField
        label="Year"
        value={filters.year}
        onChange={(v) => onChange({ ...filters, year: v ? Number(v) : undefined })}
      >
        <option value="">All Years</option>
        {years.map((year) => (
          <option key={year} value={year}>
            {year}
          </option>
        ))}
      </SelectField>

      <SelectField
        label="Rating"
        value={filters.minRating}
        onChange={(v) => onChange({ ...filters, minRating: v ? Number(v) : undefined })}
      >
        <option value="">All Ratings</option>
        <option value="9">9+ Stars</option>
        <option value="8">8+ Stars</option>
        <option value="7">7+ Stars</option>
        <option value="6">6+ Stars</option>
      </SelectField>

      <SelectField
        label="Sort By"
        value={filters.sortBy ?? 'popularity.desc'}
        onChange={(v) => onChange({ ...filters, sortBy: v as MovieFilters['sortBy'] })}
      >
        {sortOptions.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </SelectField>

      {hasActiveFilters && (
        <button
          onClick={onClear}
          className="text-accent text-sm font-medium hover:underline pb-2 shrink-0 sm:ml-1 text-left"
        >
          Clear Filters
        </button>
      )}
    </div>
  );
}