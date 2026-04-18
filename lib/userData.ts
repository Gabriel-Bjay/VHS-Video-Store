// lib/userData.ts
import { db } from './firebase';
import { doc, setDoc, deleteDoc, getDoc } from 'firebase/firestore';
import { TMDBMovie } from './tmdb';

export type Favorite = {
  id: string;
  title: string;
  poster_path: string | null;
  vote_average: number;
  addedAt: number;
};

// Toggle favorite (add or remove)
export async function toggleFavorite(uid: string, movie: TMDBMovie) {
  const favRef = doc(db, `users/${uid}/favorites`, movie.id.toString());
  const snapshot = await getDoc(favRef);

  if (snapshot.exists()) {
    // Remove
    await deleteDoc(favRef);
    return { action: 'removed' as const };
  } else {
    // Add
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