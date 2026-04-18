// components/ui/sonner.tsx
'use client';

import { Toaster as Sonner } from 'sonner';

export const Toaster = () => {
  return (
    <Sonner
      theme="dark"
      className="vhs-flicker"
      toastOptions={{
        style: {
          background: 'hsl(var(--card))',
          color: 'hsl(var(--card-foreground))',
          border: '1px solid hsl(var(--border))',
          boxShadow: 'var(--shadow-neon-soft)',
        },
      }}
    />
  );
};