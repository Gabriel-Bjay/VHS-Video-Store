// app/favorites/page.tsx
'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useAuth } from '@/components/AuthProvider';
import ProtectedRoute from '@/components/ProtectedRoute';
import { db } from '@/lib/firebase';
import { collection, onSnapshot, query, orderBy, deleteDoc, doc } from 'firebase/firestore';
import { getPosterUrl } from '@/lib/tmdb';
import { toast } from 'sonner';
import Navbar from '@/components/Navbar';

type Favorite = {
  id: string;
  title: string;
  poster_path: string | null;
  vote_average: number;
  addedAt: number;
};

export default function FavoritesPage() {
  const { user } = useAuth();
  const [favorites, setFavorites] = useState<Favorite[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    const q = query(
      collection(db, `users/${user.uid}/favorites`),
      orderBy('addedAt', 'desc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const favs = snapshot.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      })) as Favorite[];
      setFavorites(favs);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user]);

  const removeFavorite = async (movieId: string) => {
    if (!user) return;
    try {
      await deleteDoc(doc(db, `users/${user.uid}/favorites`, movieId));
      toast.success('Removed from favorites');
    } catch (err) {
      toast.error('Failed to remove');
    }
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-background text-foreground">
        {/* Navbar - same as homepage */}
        <Navbar />

        <div className="max-w-7xl mx-auto px-6 py-8">
          <h1 className="font-display text-5xl text-primary vhs-flicker mb-2">
            YOUR FAVORITES
          </h1>
          <p className="text-secondary font-mono-retro mb-8">
            {favorites.length} tapes saved
          </p>

          {loading ? (
            <div className="text-center py-20">
              <div className="text-primary text-2xl font-mono-retro vhs-flicker">
                LOADING YOUR TAPES...
              </div>
            </div>
          ) : favorites.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-muted-foreground text-xl font-mono-retro">
                No favorites yet. Start adding some movies! ❤️
              </p>
              <Link
                href="/"
                className="inline-block mt-6 px-8 py-4 bg-primary text-primary-foreground font-display rounded hover:neon-border-pink"
              >
                BROWSE THE STORE
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
              {favorites.map((fav) => (
                <div key={fav.id} className="group bg-card rounded overflow-hidden neon-border-soft">
                  <Link href={`/movie/${fav.id}`} className="block">
                    <div className="relative aspect-[2/3]">
                      <Image
                        src={getPosterUrl(fav.poster_path)}
                        alt={fav.title}
                        fill
                        className="object-cover"
                      />
                      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-3">
                        <p className="text-sm text-white font-medium line-clamp-2">{fav.title}</p>
                        <div className="text-xs text-muted-foreground mt-1">★ {fav.vote_average.toFixed(1)}</div>
                      </div>
                    </div>
                  </Link>
                  <button
                    onClick={() => removeFavorite(fav.id)}
                    className="w-full py-3 text-red-400 hover:bg-red-500/10 font-mono-retro text-sm flex items-center justify-center gap-2 border-t border-border"
                  >
                    🗑 REMOVE
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </ProtectedRoute>
  );
}