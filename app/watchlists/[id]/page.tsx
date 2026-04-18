// app/watchlists/[id]/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { useAuth } from '@/components/AuthProvider';
import ProtectedRoute from '@/components/ProtectedRoute';
import { db } from '@/lib/firebase';
import { collection, onSnapshot, query, deleteDoc, doc } from 'firebase/firestore';
import { getPosterUrl } from '@/lib/tmdb';
import { toast } from 'sonner';

type WatchlistItem = {
  id: string;
  title: string;
  poster_path: string | null;
  vote_average: number;
};

export default function WatchlistDetailPage() {
  const { id } = useParams();
  const { user } = useAuth();
  const [watchlistName, setWatchlistName] = useState('');
  const [items, setItems] = useState<WatchlistItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user || !id) return;

    // Get watchlist name
    const watchlistRef = doc(db, `users/${user.uid}/watchlists`, id as string);
    // Get items in real-time
    const itemsQuery = query(collection(db, `users/${user.uid}/watchlists/${id}/items`));

    const unsubscribeItems = onSnapshot(itemsQuery, (snapshot) => {
      const movieItems = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as WatchlistItem[];
      setItems(movieItems);
      setLoading(false);
    });

    // For simplicity we fetch name once (you can make this real-time too if you want)
    // We'll use the name from the list card for now, or fetch it

    return () => unsubscribeItems();
  }, [user, id]);

  const removeFromList = async (movieId: string) => {
    if (!user || !id) return;
    try {
      await deleteDoc(doc(db, `users/${user.uid}/watchlists/${id}/items`, movieId));
      toast.success('Removed from watchlist');
    } catch (err) {
      toast.error('Failed to remove');
    }
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-background text-foreground">
        {/* Navbar */}
        <nav className="border-b border-border bg-card/80 backdrop-blur-md sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
            <Link href="/" className="flex items-center gap-3">
              <span className="font-display text-4xl text-primary vhs-flicker">VHS</span>
              <span className="text-secondary font-mono-retro text-2xl">VIDEO STORE</span>
            </Link>
            <div className="flex items-center gap-6">
              <Link href="/" className="text-secondary hover:text-glow-cyan font-mono-retro">🏠 HOME</Link>
              <Link href="/favorites" className="text-secondary hover:text-glow-cyan font-mono-retro">❤️ FAVORITES</Link>
              <Link href="/watchlists" className="text-primary font-mono-retro">📼 WATCHLISTS</Link>
              <Link href="/profile" className="text-secondary hover:text-glow-cyan font-mono-retro">PROFILE</Link>
            </div>
          </div>
        </nav>

        <div className="max-w-7xl mx-auto px-6 py-8">
          <Link
            href="/watchlists"
            className="inline-flex items-center gap-2 text-secondary hover:text-glow-cyan mb-6 font-mono-retro"
          >
            ← BACK TO WATCHLISTS
          </Link>

          <h1 className="font-display text-5xl text-primary vhs-flicker mb-2">
            {watchlistName || 'Watchlist'}
          </h1>
          <p className="text-secondary font-mono-retro mb-8">
            {items.length} movies
          </p>

          {loading ? (
            <div className="text-center py-20">
              <div className="text-primary text-2xl font-mono-retro vhs-flicker">LOADING TAPES...</div>
            </div>
          ) : items.length === 0 ? (
            <p className="text-muted-foreground text-xl font-mono-retro text-center py-12">
              This list is empty. Add some movies from the detail page!
            </p>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
              {items.map((item) => (
                <div key={item.id} className="group bg-card rounded overflow-hidden neon-border-soft">
                  <Link href={`/movie/${item.id}`} className="block">
                    <div className="relative aspect-[2/3]">
                      <Image
                        src={getPosterUrl(item.poster_path)}
                        alt={item.title}
                        fill
                        className="object-cover"
                      />
                      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-3">
                        <p className="text-sm text-white font-medium line-clamp-2">{item.title}</p>
                        <div className="text-xs text-muted-foreground mt-1">★ {item.vote_average.toFixed(1)}</div>
                      </div>
                    </div>
                  </Link>
                  <button
                    onClick={() => removeFromList(item.id)}
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