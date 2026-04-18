// components/Navbar.tsx
'use client';

import Link from 'next/link';
import { useAuth } from './AuthProvider';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

export default function Navbar() {
  const { user, logout } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await logout();
      toast.success('Logged out successfully');
      router.push('/login');
    } catch (err) {
      toast.error('Logout failed');
    }
  };

  return (
    <nav className="border-b border-border bg-card/80 backdrop-blur-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3">
          <span className="font-display text-4xl text-primary vhs-flicker">VHS</span>
          <span className="text-secondary font-mono-retro text-2xl">VIDEO STORE</span>
        </Link>

        <div className="flex items-center gap-6">
          <Link href="/" className="text-secondary hover:text-glow-cyan font-mono-retro">🏠 HOME</Link>
          <Link href="/favorites" className="text-secondary hover:text-glow-cyan font-mono-retro">❤️ FAVORITES</Link>
          <Link href="/watchlists" className="text-secondary hover:text-glow-cyan font-mono-retro">📼 WATCHLISTS</Link>
          <Link href="/profile" className="text-secondary hover:text-glow-cyan font-mono-retro">PROFILE</Link>

          {user ? (
            <button
              onClick={handleLogout}
              className="px-5 py-2 border border-destructive text-destructive font-mono-retro text-sm rounded hover:neon-border-pink transition-all"
            >
              LOG OUT
            </button>
          ) : (
            <Link
              href="/login"
              className="px-6 py-2 border border-secondary text-secondary font-mono-retro hover:neon-border-cyan"
            >
              LOG IN
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}