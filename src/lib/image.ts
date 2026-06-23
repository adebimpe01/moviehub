const IMAGE_BASE_URL = import.meta.env.VITE_TMDB_IMAGE_BASE_URL;

type ImageSize = 'w200' | 'w300' | 'w500' | 'w780' | 'original';

export function getImageUrl(path: string | null, size: ImageSize = 'w500'): string {
  if (!path) {
    return '/no-poster.png'; // fallback — we'll add this placeholder image later
  }
  return `${IMAGE_BASE_URL}/${size}/${path}`;
}