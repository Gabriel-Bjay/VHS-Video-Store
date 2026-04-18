import {
  collection,
  doc,
  setDoc,
  deleteDoc,
  getDoc,
  getDocs,
  query,
  orderBy,
  serverTimestamp,
  addDoc,
} from "firebase/firestore";
import { db } from "./firebase";

export interface FavoriteDoc {
  imdbID: string;
  Title: string;
  Year: string;
  Poster: string;
  addedAt?: any;
}

export interface RatingDoc {
  imdbID: string;
  rating: number;
  review?: string;
  updatedAt?: any;
}

export interface WatchlistDoc {
  id: string;
  name: string;
  createdAt?: any;
}

// Favorites
export async function addFavorite(uid: string, m: Omit<FavoriteDoc, "addedAt">) {
  await setDoc(doc(db, "users", uid, "favorites", m.imdbID), { ...m, addedAt: serverTimestamp() });
}
export async function removeFavorite(uid: string, imdbID: string) {
  await deleteDoc(doc(db, "users", uid, "favorites", imdbID));
}
export async function isFavorite(uid: string, imdbID: string) {
  const snap = await getDoc(doc(db, "users", uid, "favorites", imdbID));
  return snap.exists();
}
export async function listFavorites(uid: string): Promise<FavoriteDoc[]> {
  const q = query(collection(db, "users", uid, "favorites"), orderBy("addedAt", "desc"));
  const snap = await getDocs(q);
  return snap.docs.map((d) => d.data() as FavoriteDoc);
}

// Ratings
export async function setRating(uid: string, imdbID: string, rating: number, review = "") {
  await setDoc(doc(db, "users", uid, "ratings", imdbID), {
    imdbID,
    rating,
    review,
    updatedAt: serverTimestamp(),
  });
}
export async function getRating(uid: string, imdbID: string): Promise<RatingDoc | null> {
  const snap = await getDoc(doc(db, "users", uid, "ratings", imdbID));
  return snap.exists() ? (snap.data() as RatingDoc) : null;
}
export async function listRatings(uid: string): Promise<RatingDoc[]> {
  const q = query(collection(db, "users", uid, "ratings"), orderBy("updatedAt", "desc"));
  const snap = await getDocs(q);
  return snap.docs.map((d) => d.data() as RatingDoc);
}

// Watchlists
export async function createWatchlist(uid: string, name: string) {
  const ref = await addDoc(collection(db, "users", uid, "watchlists"), {
    name,
    createdAt: serverTimestamp(),
  });
  return ref.id;
}
export async function listWatchlists(uid: string): Promise<WatchlistDoc[]> {
  const q = query(collection(db, "users", uid, "watchlists"), orderBy("createdAt", "desc"));
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<WatchlistDoc, "id">) }));
}
export async function deleteWatchlist(uid: string, listId: string) {
  await deleteDoc(doc(db, "users", uid, "watchlists", listId));
}
export async function addToWatchlist(uid: string, listId: string, m: Omit<FavoriteDoc, "addedAt">) {
  await setDoc(doc(db, "users", uid, "watchlists", listId, "items", m.imdbID), {
    ...m,
    addedAt: serverTimestamp(),
  });
}
export async function removeFromWatchlist(uid: string, listId: string, imdbID: string) {
  await deleteDoc(doc(db, "users", uid, "watchlists", listId, "items", imdbID));
}
export async function listWatchlistItems(uid: string, listId: string): Promise<FavoriteDoc[]> {
  const q = query(
    collection(db, "users", uid, "watchlists", listId, "items"),
    orderBy("addedAt", "desc")
  );
  const snap = await getDocs(q);
  return snap.docs.map((d) => d.data() as FavoriteDoc);
}

// Profile
export async function getProfile(uid: string) {
  const snap = await getDoc(doc(db, "users", uid));
  return snap.exists() ? snap.data() : null;
}
export async function updateProfileDoc(uid: string, data: Record<string, any>) {
  await setDoc(doc(db, "users", uid), data, { merge: true });
}