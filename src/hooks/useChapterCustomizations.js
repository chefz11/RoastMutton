import { useEffect, useState } from 'react';
import { ref, onValue, set } from 'firebase/database';
import { database } from '../lib/firebase';

export function useChapterCustomizations(userId) {
  const [customizations, setCustomizations] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) {
      setLoading(false);
      return;
    }

    const customRef = ref(database, `users/${userId}/chapterCustomizations`);

    const unsubscribe = onValue(customRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        setCustomizations(data);
      } else {
        migrateFromLocalStorage(userId);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, [userId]);

  const updateCustomization = async (bookId, chapterNumber, pages) => {
    if (!userId) return { success: false };

    const key = `${bookId}-${chapterNumber}`;
    const customRef = ref(database, `users/${userId}/chapterCustomizations/${key}`);

    try {
      await set(customRef, { pages });
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const getChapterPages = (bookId, chapterNumber, defaultPages) => {
    const key = `${bookId}-${chapterNumber}`;
    return customizations[key]?.pages || defaultPages;
  };

  const migrateFromLocalStorage = async (userId) => {
    const localData = localStorage.getItem('arda-chapter-custom');
    if (localData && !localStorage.getItem('arda-chapter-custom-migrated')) {
      try {
        const parsed = JSON.parse(localData);
        const customRef = ref(database, `users/${userId}/chapterCustomizations`);
        await set(customRef, parsed);
        localStorage.setItem('arda-chapter-custom-migrated', 'true');
      } catch (error) {
        console.error('Error migrating customizations:', error);
      }
    }
  };

  return { customizations, loading, updateCustomization, getChapterPages };
}
