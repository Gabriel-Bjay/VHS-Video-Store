'use client';

export default function Home() {
  return (
    <div className="min-h-screen bg-background text-foreground p-8">
      <div className="max-w-4xl mx-auto">
        {/* Big heading with retro font + neon glow */}
        <h1 className="font-display text-7xl text-primary text-glow-pink mb-4 vhs-flicker">
          VHS VIDEO STORE
        </h1>
        
        <p className="text-2xl text-secondary mb-8 font-mono-retro">
          Retro 80s Movie Rental • Neon Dreams • Real VHS Vibes
        </p>

        {/* Test cards with your colors and effects */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-card p-6 rounded-lg neon-border-pink">
            <h2 className="text-primary text-2xl mb-2">Neon Magenta</h2>
            <p className="text-card-foreground">Primary color test + glow</p>
          </div>

          <div className="bg-card p-6 rounded-lg neon-border-cyan">
            <h2 className="text-secondary text-2xl mb-2">Neon Cyan</h2>
            <p className="text-card-foreground">Secondary color test</p>
          </div>

          <div className="bg-card p-6 rounded-lg neon-border-soft">
            <h2 className="text-accent text-2xl mb-2">Accent Yellow</h2>
            <p className="text-card-foreground">Accent + soft neon border</p>
          </div>
        </div>

        {/* Scanlines & grain should be visible on the whole background */}
        <div className="mt-12 p-8 bg-muted rounded border border-border text-center">
          <p className="text-muted-foreground">
            If you see scanlines overlay + subtle grain across the page, 
            and the neon glows/flicker effects are working → your VHS theme is good!
          </p>
        </div>
      </div>
    </div>
  );
}