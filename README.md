# 🎞️ VHS Video Store

A beautiful retro 80s-style movie discovery app with neon VHS aesthetics, real-time favorites & watchlists, and TMDB integration.

## ✨ Features
- Neon magenta/cyan VHS theme with scanlines, grain & flicker
- Email + Google sign-in
- Search + trending movies (TMDB)
- Movie detail pages with posters & backdrops
- Real-time **Favorites** (add/remove)
- Real-time **Watchlists** (create, add/remove movies, live count)
- Profile page with stats
- System architecture diagram (`/about`)
- Fully responsive + protected routes

## 🛠️ Tech Stack
- Next.js 15 (App Router) + TypeScript
- Tailwind CSS v4 + custom VHS design system
- Firebase Auth + Firestore (real-time)
- TMDB API
- Sonner for toasts

## 🚀 Quick Start
1. `git clone https://github.com/Gabriel-Bjay/VHS-Video-Store.git`
2. `cd VHS-Video-Store && npm install`
3. Create `.env.local` with your Firebase + TMDB keys
4. `npm run dev`

## 📁 Key Pages
- `/` — Home + search
- `/movie/[id]` — Movie details + add favorite/watchlist
- `/favorites` — Real-time favorites
- `/watchlists` — Manage watchlists
- `/watchlists/[id]` — View list contents
- `/profile` — Stats + logout
- `/about` — System diagram

## 🔐 Firebase Security Rules
```js
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{uid}/{documents=**} {
      allow read, write: if request.auth != null && request.auth.uid == uid;
    }
  }
}