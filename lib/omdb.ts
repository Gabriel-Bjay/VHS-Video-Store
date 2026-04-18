const OMDB_KEY = "c77805e0";
const BASE = "https://www.omdbapi.com/";

export interface OmdbSearchItem {
  imdbID: string;
  Title: string;
  Year: string;
  Type: string;
  Poster: string;
}

export interface OmdbSearchResponse {
  Search?: OmdbSearchItem[];
  totalResults?: string;
  Response: "True" | "False";
  Error?: string;
}

export interface OmdbMovieDetail {
  imdbID: string;
  Title: string;
  Year: string;
  Rated: string;
  Released: string;
  Runtime: string;
  Genre: string;
  Director: string;
  Writer: string;
  Actors: string;
  Plot: string;
  Language: string;
  Country: string;
  Poster: string;
  imdbRating: string;
  Type: string;
  Response: "True" | "False";
  Error?: string;
}

export async function searchMovies(query: string, page = 1): Promise<OmdbSearchResponse> {
  const url = `${BASE}?s=${encodeURIComponent(query)}&page=${page}&apikey=${OMDB_KEY}`;
  const res = await fetch(url);
  return res.json();
}

export async function getMovie(imdbID: string): Promise<OmdbMovieDetail> {
  const url = `${BASE}?i=${encodeURIComponent(imdbID)}&plot=full&apikey=${OMDB_KEY}`;
  const res = await fetch(url);
  return res.json();
}