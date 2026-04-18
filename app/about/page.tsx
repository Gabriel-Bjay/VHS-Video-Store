// app/about/page.tsx
'use client';

import Mermaid from 'react-mermaid2';

const diagram = `
graph TD
    A[User] --> B[Firebase Auth]
    B --> C[Protected Routes]
    A --> D[TMDB API]
    C --> E[Firestore]
    E --> F[favorites]
    E --> G[watchlists]
    D --> H[Movie Search + Detail]
    F & G --> I[Real-time Sync]
    style A fill:#ff00ff,stroke:#00ffff
    style H fill:#00ffff,stroke:#ff00ff
`;

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-background text-foreground p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="font-display text-6xl text-primary vhs-flicker text-center mb-8">SYSTEM ARCHITECTURE</h1>
        
        <div className="bg-card p-8 rounded neon-border-soft">
          <Mermaid chart={diagram} />
        </div>

        <p className="text-center text-muted-foreground mt-12 font-mono-retro">
          Built clean with Next.js 15 • Firebase • TMDB API • Tailwind CSS • Vite • React-Mermaid2
        </p>
      </div>
    </div>
  );
}