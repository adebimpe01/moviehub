import axios from 'axios';

const apiKey = import.meta.env.VITE_TMDB_API_KEY;
const baseURL = import.meta.env.VITE_TMDB_BASE_URL;

if (!apiKey) {
  throw new Error('VITE_TMDB_API_KEY is missing. Add it to your .env file.');
}

export const api = axios.create({
  baseURL,
  params: {
    api_key: apiKey,
  },
});