// app/movie/[id]/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { getMovie, getPosterUrl, getBackdropUrl } from '@/lib/tmdb';
import { useAuth } from '@/components/AuthProvider';
import { toggleFavorite } from '@/lib/userData';
import { toast } from 'sonner';

export default function MovieDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const { user } = useAuth();

  const [movie, setMovie] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isFavorited, setIsFavorited] = useState(false);

  useEffect(() => {
    if (!id) return;

    const fetchMovie = async () => {
      try {
        const data = await getMovie(Number(id));
        setMovie(data);
      } catch (err) {
        toast.error('Could not load movie');
      } finally {
        setLoading(false);
      }
    };

    fetchMovie();
  }, [id]);

  // Real-time favorite status
    const handleToggleFavorite = async () => {
    if (!user || !movie) {
        toast.error('Please log in to save favorites');
        router.push('/login');
        return;
    }

    try {
        const result = await toggleFavorite(user.uid, movie);
        setIsFavorited(result.action === 'added');
        toast.success(
        result.action === 'added'
            ? 'Added to favorites ❤️'
            : 'Removed from favorites'
        );
    } catch (err) {
        console.error(err);
        toast.error('Failed to update favorites');
    }
    };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-primary text-3xl font-mono-retro vhs-flicker">REWINDING TAPE...</div>
      </div>
    );
  }

  if (!movie) return <div className="text-center py-20">Movie not found</div>;

  return (
    <div className="min-h-screen bg-background text-foreground">
      {movie.backdrop_path && (
        <div className="relative h-96 w-full">
          <Image
            src={getBackdropUrl(movie.backdrop_path) || ''}
            alt={movie.title}
            fill
            className="object-cover opacity-70"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background/70 to-background" />
        </div>
      )}

      <div className="max-w-7xl mx-auto px-6 -mt-24 relative z-10">
        <div className="flex flex-col md:flex-row gap-8">
          <div className="w-80 flex-shrink-0">
            <div className="neon-border-soft rounded overflow-hidden">
              <Image
                src={getPosterUrl(movie.poster_path)}
                alt={movie.title}
                width={500}
                height={750}
                className="w-full"
              />
            </div>
          </div>

          <div className="flex-1">
            <Link href="/" className="inline-flex items-center gap-2 text-secondary hover:text-glow-cyan mb-6 font-mono-retro">
              ← BACK TO STORE
            </Link>

            <h1 className="font-display text-5xl text-primary vhs-flicker mb-2">
              {movie.title}
            </h1>
            <p className="text-muted-foreground text-xl mb-6">
              {movie.release_date?.slice(0, 4)} • {movie.vote_average?.toFixed(1)} ★
            </p>

            <p className="text-foreground leading-relaxed max-w-prose mb-8">
              {movie.overview}
            </p>

            <button
              onClick={handleToggleFavorite}
              className={`px-8 py-4 rounded font-display text-xl flex items-center gap-3 transition-all ${
                isFavorited
                  ? 'bg-red-500 text-white neon-border-pink'
                  : 'border border-secondary text-secondary hover:neon-border-cyan'
              }`}
            >
              {isFavorited ? '❤️ REMOVE FROM FAVORITES' : '❤️ ADD TO FAVORITES'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}