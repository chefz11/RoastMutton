import { useEffect, useState } from 'react';
import { ref, onValue, set } from 'firebase/database';
import { database } from '../lib/firebase';

export function useProgress(userId) {
  const [progress, setProgress] = useState({
    currentBook: null,
    currentChapter: null,
    completedChapters: [],
    watchedMovies: [],
    dailyGoal: 30,
    startDate: null
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) {
      setLoading(false);
      return;
    }

    const progressRef = ref(database, `users/${userId}/progress`);

    // Set up real-time listener
    const unsubscribe = onValue(progressRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        setProgress(data);
      } else {
        // Initialize with localStorage data if exists
        migrateFromLocalStorage(userId);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, [userId]);

  const updateProgress = async (updates) => {
    if (!userId) return { success: false };

    const progressRef = ref(database, `users/${userId}/progress`);
    const newProgress = { ...progress, ...updates };

    try {
      await set(progressRef, newProgress);
      return { success: true };
    } catch (error) {
      console.error('Error updating progress:', error);
      return { success: false, error: error.message };
    }
  };

  const migrateFromLocalStorage = async (userId) => {
    const localData = localStorage.getItem('arda-progress');
    if (localData && !localStorage.getItem('arda-progress-migrated')) {
      try {
        const parsed = JSON.parse(localData);
        await updateProgress(parsed);
        localStorage.setItem('arda-progress-migrated', 'true');
      } catch (error) {
        console.error('Error migrating progress:', error);
      }
    }
  };

  return { progress, loading, updateProgress };
}
