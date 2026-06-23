import { SearchX } from 'lucide-react';

interface EmptyStateProps {
  message?: string;
}

export default function EmptyState({
  message = 'No movies found. Try a different search.',
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-12 text-center">
      <SearchX size={32} className="text-gray-400" />
      <p className="text-gray-500 text-sm">{message}</p>
    </div>
  );
}