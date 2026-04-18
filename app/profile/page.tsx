// app/profile/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/components/AuthProvider';
import ProtectedRoute from '@/components/ProtectedRoute';
import { db } from '@/lib/firebase';
import { collection, onSnapshot, query } from 'firebase/firestore';
import Link from 'next/link';
import { toast } from 'sonner';
import Navbar from '@/components/Navbar';

export default function ProfilePage() {
  const { user, logout } = useAuth();
  const [stats, setStats] = useState({
    favorites: 0,
    watchlists: 0,
  });

  useEffect(() => {
    if (!user) return;

    const favQ = query(collection(db, `users/${user.uid}/favorites`));
    const unsubFav = onSnapshot(favQ, (snap) => setStats(prev => ({ ...prev, favorites: snap.size })));

    const listQ = query(collection(db, `users/${user.uid}/watchlists`));
    const unsubList = onSnapshot(listQ, (snap) => setStats(prev => ({ ...prev, watchlists: snap.size })));

    return () => { unsubFav(); unsubList(); };
  }, [user]);

  const handleLogout = async () => {
    try {
      await logout();
      toast.success('Logged out successfully');
    } catch (err) {
      toast.error('Logout failed');
    }
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-background text-foreground">
        <Navbar />

        <div className="max-w-7xl mx-auto px-6 py-12">
          <h1 className="font-display text-6xl text-primary vhs-flicker mb-2">PROFILE</h1>
          <p className="text-secondary font-mono-retro mb-12">Welcome back, {user?.email}</p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-2xl">
            <div className="bg-card p-8 rounded neon-border-soft text-center">
              <div className="text-5xl mb-2">❤️</div>
              <div className="text-4xl font-display text-primary">{stats.favorites}</div>
              <div className="text-muted-foreground font-mono-retro">FAVORITES</div>
            </div>
            <div className="bg-card p-8 rounded neon-border-soft text-center">
              <div className="text-5xl mb-2">📼</div>
              <div className="text-4xl font-display text-primary">{stats.watchlists}</div>
              <div className="text-muted-foreground font-mono-retro">WATCHLISTS</div>
            </div>
          </div>

          <div className="mt-16 text-center">
            <button
              onClick={handleLogout}
              className="px-10 py-4 border border-destructive text-destructive font-display text-xl rounded hover:neon-border-pink transition-all"
            >
              LOG OUT
            </button>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}