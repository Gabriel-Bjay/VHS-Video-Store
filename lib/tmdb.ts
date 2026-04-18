// lib/tmdb.ts
const TMDB_API_KEY = process.env.NEXT_PUBLIC_TMDB_API_KEY;
const BASE_URL = 'https://api.themoviedb.org/3';

if (!TMDB_API_KEY) {
  console.warn('⚠️ NEXT_PUBLIC_TMDB_API_KEY is missing in .env.local');
}

export type TMDBMovie = {
  id: number;
  title: string;
  original_title: string;
  overview: string;
  poster_path: string | null;
  backdrop_path: string | null;
  release_date: string;
  vote_average: number;
  vote_count: number;
  genre_ids: number[];
  popularity: number;
  imdb_id?: string; // added when we fetch full details
};

// Helper to build image URLs
export const getPosterUrl = (path: string | null, size: 'w200' | 'w500' | 'original' = 'w500') =>
  path ? `https://image.tmdb.org/t/p/${size}${path}` : '/placeholder-poster.jpg';

export const getBackdropUrl = (path: string | null) =>
  path ? `https://image.tmdb.org/t/p/original${path}` : null;

// Search movies
export async function searchMovies(query: string, page = 1) {
  const res = await fetch(
    `${BASE_URL}/search/movie?api_key=${TMDB_API_KEY}&query=${encodeURIComponent(query)}&page=${page}&language=en-US`
  );
  if (!res.ok) throw new Error('Failed to search movies');
  const data = await res.json();
  return data.results as TMDBMovie[];
}

// Get single movie details (by TMDB id)
export async function getMovie(tmdbId: number) {
  const res = await fetch(
    `${BASE_URL}/movie/${tmdbId}?api_key=${TMDB_API_KEY}&language=en-US&append_to_response=credits,images`
  );
  if (!res.ok) throw new Error('Failed to fetch movie');
  return await res.json();
}

// Bonus: Trending movies (great for homepage)
export async function getTrendingMovies() {
  const res = await fetch(
    `${BASE_URL}/trending/movie/day?api_key=${TMDB_API_KEY}&language=en-US`
  );
  if (!res.ok) throw new Error('Failed to fetch trending');
  const data = await res.json();
  return data.results as TMDBMovie[];
}