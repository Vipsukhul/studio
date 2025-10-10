'use client';
    
import { useState, useEffect } from 'react';
import { Auth, onAuthStateChanged, User } from 'firebase/auth';

/**
 * Interface for the return value of the useUser hook.
 */
export interface UseUserResult {
  user: User | null;
  isLoading: boolean;
  error: Error | null;
}

/**
 * React hook to get the current authenticated user from Firebase.
 *
 * @param {Auth} auth - The Firebase Auth instance.
 * @returns {UseUserResult} Object with user, isLoading, error.
 */
export function useUser(auth: Auth | null): UseUserResult {
  const [user, setUser] = useState<User | null>(auth?.currentUser ?? null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!auth) {
      setUser(null);
      setIsLoading(false);
      setError(new Error("Firebase Auth instance is not available."));
      return;
    }
    
    // Set initial state based on synchronous check
    const currentUser = auth.currentUser;
    setUser(currentUser);
    setIsLoading(!currentUser); // Only loading if user is not already available

    const unsubscribe = onAuthStateChanged(
      auth,
      (firebaseUser) => {
        setUser(firebaseUser);
        setIsLoading(false);
      },
      (err) => {
        setError(err);
        setIsLoading(false);
      }
    );

    return () => unsubscribe();
  }, [auth]); // Re-run if the auth instance changes

  return { user, isLoading, error };
}
