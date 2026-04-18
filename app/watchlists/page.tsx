// app/watchlists/page.tsx
'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useAuth } from '@/components/AuthProvider';
import ProtectedRoute from '@/components/ProtectedRoute';
import { db } from '@/lib/firebase';
import { collection, onSnapshot, query, orderBy, deleteDoc, doc } from 'firebase/firestore';
import { createWatchlist, deleteWatchlist } from '@/lib/userData';
import { toast } from 'sonner';
import Navbar from '@/components/Navbar';

export default function WatchlistsPage() {
  const { user } = useAuth();
  const [watchlists, setWatchlists] = useState<any[]>([]);
  const [newListName, setNewListName] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    const q = query(
      collection(db, `users/${user.uid}/watchlists`),
      orderBy('createdAt', 'desc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const lists = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setWatchlists(lists);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user]);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newListName.trim() || !user) return;
    await createWatchlist(user.uid, newListName.trim());
    setNewListName('');
    toast.success('New watchlist created');
  };

  const handleDelete = async (watchlistId: string) => {
    if (!user) return;
    if (confirm('Delete this entire watchlist?')) {
      await deleteWatchlist(user.uid, watchlistId);
      toast.success('Watchlist deleted');
    }
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-background text-foreground">
        {/* Navbar */}
        <Navbar />

        <div className="max-w-7xl mx-auto px-6 py-8">
          <h1 className="font-display text-5xl text-primary vhs-flicker mb-2">YOUR WATCHLISTS</h1>

          {/* Create new list */}
          <form onSubmit={handleCreate} className="max-w-md mb-10 flex gap-3">
            <input
              type="text"
              value={newListName}
              onChange={(e) => setNewListName(e.target.value)}
              placeholder="New watchlist name..."
              className="flex-1 bg-input border border-border text-foreground px-5 py-4 rounded font-mono-retro focus:ring-primary"
            />
            <button
              type="submit"
              className="bg-primary text-primary-foreground px-8 py-4 rounded font-display hover:neon-border-pink"
            >
              CREATE
            </button>
          </form>

          {loading ? (
            <div className="text-primary text-2xl font-mono-retro vhs-flicker text-center py-20">LOADING TAPES...</div>
          ) : watchlists.length === 0 ? (
            <p className="text-muted-foreground text-xl font-mono-retro text-center py-12">No watchlists yet. Create one above!</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {watchlists.map((list) => (
                <div key={list.id} className="bg-card p-6 rounded neon-border-soft">
                  <div className="flex justify-between items-start">
                    <h3 className="font-display text-2xl text-secondary">{list.name}</h3>
                    <button
                      onClick={() => handleDelete(list.id)}
                      className="text-red-400 hover:text-red-500 text-sm font-mono-retro"
                    >
                      DELETE
                    </button>
                  </div>
                  
                  {/* THIS IS THE FIXED LINE */}
                  <p className="text-muted-foreground text-sm mt-1">
                    {list.itemCount || 0} movies
                  </p>

                  <Link
                    href={`/watchlists/${list.id}`}
                    className="mt-6 block text-center py-3 border border-secondary text-secondary font-mono-retro rounded hover:neon-border-cyan"
                  >
                    OPEN LIST →
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </ProtectedRoute>
  );
}