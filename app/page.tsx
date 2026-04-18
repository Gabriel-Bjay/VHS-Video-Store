// app/page.tsx
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { searchMovies, getTrendingMovies, getPosterUrl, TMDBMovie } from '@/lib/tmdb';
import { useAuth } from '@/components/AuthProvider';
import { toast } from 'sonner';

export default function HomePage() {
  const [movies, setMovies] = useState<TMDBMovie[]>([]);
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  // Load trending movies on first visit
  useEffect(() => {
    const loadTrending = async () => {
      try {
        const trending = await getTrendingMovies();
        setMovies(trending);
      } catch (err) {
        console.error(err);
        toast.error('Failed to load trending movies');
      } finally {
        setLoading(false);
      }
    };
    loadTrending();
  }, []);

  // Search when user types
  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    try {
      const results = await searchMovies(query);
      setMovies(results);
    } catch (err) {
      toast.error('Search failed. Try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Navbar */}
      <nav className="border-b border-border bg-card/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <span className="font-display text-4xl text-primary vhs-flicker">VHS</span>
            <span className="text-secondary font-mono-retro text-2xl">VIDEO STORE</span>
          </Link>

          <div className="flex items-center gap-6">
            {user ? (
              <>
                <Link href="/favorites" className="text-secondary hover:text-glow-cyan font-mono-retro">❤️ FAVORITES</Link>
                <Link href="/watchlists" className="text-secondary hover:text-glow-cyan font-mono-retro">📼 WATCHLISTS</Link>
                <Link href="/profile" className="text-secondary hover:text-glow-cyan font-mono-retro">PROFILE</Link>
              </>
            ) : (
              <Link
                href="/login"
                className="px-6 py-2 border border-secondary text-secondary font-mono-retro hover:neon-border-cyan transition-all"
              >
                LOG IN
              </Link>
            )}
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Hero / Search */}
        <div className="text-center mb-12">
          <h1 className="font-display text-6xl md:text-7xl text-primary mb-3 vhs-flicker">
            RENT • WATCH • REWIND
          </h1>
          <p className="text-secondary text-xl font-mono-retro mb-8">80s vibes. Modern movies.</p>

          <form onSubmit={handleSearch} className="max-w-xl mx-auto">
            <div className="relative">
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search for any movie..."
                className="w-full bg-input border border-border text-foreground px-6 py-5 rounded-lg font-mono-retro text-lg focus:outline-none focus:ring-2 focus:ring-primary neon-border-soft"
              />
              <button
                type="submit"
                className="absolute right-3 top-1/2 -translate-y-1/2 bg-primary text-primary-foreground px-8 py-3 rounded font-display hover:neon-border-pink transition-all"
              >
                SEARCH
              </button>
            </div>
          </form>
        </div>

        {/* Results Title */}
        <div className="flex items-baseline justify-between mb-6">
          <h2 className="text-3xl font-display text-secondary">
            {query ? `Results for “${query}”` : 'TRENDING THIS WEEK'}
          </h2>
          {query && (
            <button
              onClick={() => {
                setQuery('');
                setLoading(true);
                getTrendingMovies().then(setMovies).finally(() => setLoading(false));
              }}
              className="text-sm text-muted-foreground hover:text-accent font-mono-retro"
            >
              ← CLEAR SEARCH
            </button>
          )}
        </div>

        {/* Movie Grid */}
        {loading ? (
          <div className="text-center py-20">
            <div className="text-primary text-2xl font-mono-retro vhs-flicker">LOADING TAPES...</div>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
            {movies.map((movie) => (
              <Link
                key={movie.id}
                href={`/movie/${movie.id}`}
                className="group block bg-card rounded overflow-hidden neon-border-soft hover:scale-105 transition-transform"
              >
                <div className="relative aspect-[2/3]">
                  <img
                    src={getPosterUrl(movie.poster_path, 'w500')}
                    alt={movie.title}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = '/placeholder-poster.jpg';
                    }}
                  />
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-3">
                    <p className="text-sm text-white font-medium line-clamp-2 group-hover:text-glow-pink transition-colors">
                      {movie.title}
                    </p>
                    <div className="flex justify-between text-xs text-muted-foreground mt-1">
                      <span>{movie.release_date?.slice(0, 4)}</span>
                      <span>★ {movie.vote_average?.toFixed(1)}</span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}

        {movies.length === 0 && !loading && (
          <p className="text-center text-muted-foreground py-12">No movies found. Try a different search.</p>
        )}
      </div>
    </div>
  );
}