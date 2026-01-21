import { useEffect, useState } from 'react';
import { ref, onValue, push, set, remove, query, orderByChild, equalTo } from 'firebase/database';
import { database } from '../lib/firebase';

export function useJournal(userId, groupId = null) {
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) {
      setLoading(false);
      return;
    }

    // Listen to user's own entries
    const userEntriesRef = query(
      ref(database, 'journalEntries'),
      orderByChild('userId'),
      equalTo(userId)
    );

    const unsubscribe = onValue(userEntriesRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const entriesArray = Object.entries(data).map(([id, entry]) => ({
          id,
          ...entry
        }));
        setEntries(entriesArray);
      } else {
        migrateFromLocalStorage(userId);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, [userId]);

  const addEntry = async (entry) => {
    if (!userId) return { success: false };

    const entriesRef = ref(database, 'journalEntries');
    const newEntryRef = push(entriesRef);

    try {
      await set(newEntryRef, {
        ...entry,
        userId,
        groupId: groupId || null,
        isPrivate: entry.isPrivate !== undefined ? entry.isPrivate : false,
        createdAt: Date.now(),
        updatedAt: Date.now()
      });
      return { success: true, id: newEntryRef.key };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const updateEntry = async (entryId, updates) => {
    if (!userId) return { success: false };

    const entryRef = ref(database, `journalEntries/${entryId}`);

    try {
      const existing = entries.find(e => e.id === entryId);
      await set(entryRef, {
        ...existing,
        ...updates,
        updatedAt: Date.now()
      });
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const deleteEntry = async (entryId) => {
    if (!userId) return { success: false };

    const entryRef = ref(database, `journalEntries/${entryId}`);

    try {
      await remove(entryRef);
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const migrateFromLocalStorage = async (userId) => {
    const localData = localStorage.getItem('arda-journal');
    if (localData && !localStorage.getItem('arda-journal-migrated')) {
      try {
        const parsed = JSON.parse(localData);
        for (const entry of parsed) {
          await addEntry(entry);
        }
        localStorage.setItem('arda-journal-migrated', 'true');
      } catch (error) {
        console.error('Error migrating journal:', error);
      }
    }
  };

  return { entries, loading, addEntry, updateEntry, deleteEntry };
}
