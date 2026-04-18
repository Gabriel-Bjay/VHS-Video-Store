// lib/userData.ts
import { db } from './firebase';
import { doc, setDoc, deleteDoc, getDoc, getDocs, collection, increment, updateDoc } from 'firebase/firestore';
import { TMDBMovie } from './tmdb';

export type Favorite = {
  id: string;
  title: string;
  poster_path: string | null;
  vote_average: number;
  addedAt: number;
};

export type Watchlist = {
  id: string;
  name: string;
  createdAt: number;
  itemCount: number;
};

// ==================== FAVORITES ====================
export async function toggleFavorite(uid: string, movie: TMDBMovie) {
  const favRef = doc(db, `users/${uid}/favorites`, movie.id.toString());
  const snapshot = await getDoc(favRef);

  if (snapshot.exists()) {
    await deleteDoc(favRef);
    return { action: 'removed' as const };
  } else {
    await setDoc(favRef, {
      id: movie.id.toString(),
      title: movie.title,
      poster_path: movie.poster_path,
      vote_average: movie.vote_average,
      addedAt: Date.now(),
    });
    return { action: 'added' as const };
  }
}

// ==================== WATCHLISTS ====================
export async function createWatchlist(uid: string, name: string) {
  const watchlistId = Date.now().toString();
  const watchlistRef = doc(db, `users/${uid}/watchlists`, watchlistId);
  await setDoc(watchlistRef, {
    id: watchlistId,
    name,
    createdAt: Date.now(),
    itemCount: 0,
  });
  return watchlistId;
}

export async function deleteWatchlist(uid: string, watchlistId: string) {
  await deleteDoc(doc(db, `users/${uid}/watchlists`, watchlistId));
}

export async function addToWatchlist(uid: string, watchlistId: string, movie: TMDBMovie) {
  const itemRef = doc(db, `users/${uid}/watchlists/${watchlistId}/items`, movie.id.toString());
  await setDoc(itemRef, {
    id: movie.id.toString(),
    title: movie.title,
    poster_path: movie.poster_path,
    vote_average: movie.vote_average,
    addedAt: Date.now(),
  });

  // Update count
  const watchlistRef = doc(db, `users/${uid}/watchlists`, watchlistId);
  await updateDoc(watchlistRef, { itemCount: increment(1) });
}

export async function removeFromWatchlist(uid: string, watchlistId: string, movieId: string) {
  await deleteDoc(doc(db, `users/${uid}/watchlists/${watchlistId}/items`, movieId));

  // Update count
  const watchlistRef = doc(db, `users/${uid}/watchlists`, watchlistId);
  await updateDoc(watchlistRef, { itemCount: increment(-1) });
}

export async function getWatchlists(uid: string) {
  const snapshot = await getDocs(collection(db, `users/${uid}/watchlists`));
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Watchlist[];
}