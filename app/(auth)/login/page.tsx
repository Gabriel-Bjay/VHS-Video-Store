// app/(auth)/login/page.tsx
'use client';

import { useState } from 'react';
import { useAuth } from '@/components/AuthProvider';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { toast } from 'sonner';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { login, loginWithGoogle } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(email, password);
      toast.success('Welcome back to the store!');
      router.push('/');
    } catch (error: any) {
      toast.error(error.message || 'Invalid credentials');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogle = async () => {
    try {
      await loginWithGoogle();
      toast.success('Signed in with Google');
      router.push('/');
    } catch (error: any) {
      toast.error('Google sign-in failed');
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6">
      <div className="max-w-md w-full bg-card p-8 rounded-lg neon-border-soft">
        <h1 className="font-display text-5xl text-primary text-center mb-2 vhs-flicker">VHS</h1>
        <p className="text-secondary text-center font-mono-retro mb-8">VIDEO STORE</p>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-input border border-border text-foreground p-4 rounded focus:outline-none focus:ring-2 focus:ring-primary font-mono-retro"
              required
            />
          </div>
          <div>
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-input border border-border text-foreground p-4 rounded focus:outline-none focus:ring-2 focus:ring-primary font-mono-retro"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary text-primary-foreground py-4 rounded font-display text-xl hover:neon-border-pink transition-all"
          >
            {loading ? 'REWINDING...' : 'LOG IN'}
          </button>
        </form>

        <button
          onClick={handleGoogle}
          className="w-full mt-4 border border-secondary text-secondary py-4 rounded font-mono-retro hover:neon-border-cyan"
        >
          ▶ SIGN IN WITH GOOGLE
        </button>

        <p className="text-center text-muted-foreground mt-8">
          No account yet?{' '}
          <Link href="/signup" className="text-accent hover:text-glow-pink">
            SIGN UP
          </Link>
        </p>
      </div>
    </div>
  );
}