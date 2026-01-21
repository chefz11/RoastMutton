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
    console.log('addEntry called:', { userId, hasGroupId: !!groupId, entry });

    if (!userId) {
      console.error('addEntry failed: No userId');
      return { success: false, error: 'User not authenticated' };
    }

    const entriesRef = ref(database, 'journalEntries');
    const newEntryRef = push(entriesRef);

    try {
      const entryData = {
        ...entry,
        userId,
        groupId: groupId || null,
        isPrivate: entry.isPrivate !== undefined ? entry.isPrivate : false,
        createdAt: Date.now(),
        updatedAt: Date.now()
      };
      console.log('Attempting to save journal entry:', entryData);
      await set(newEntryRef, entryData);
      console.log('Journal entry saved successfully:', newEntryRef.key);
      return { success: true, id: newEntryRef.key };
    } catch (error) {
      console.error('Failed to save journal entry:', error);
      return { success: false, error: error.message };
    }
  };

  const updateEntry = async (entryId, updates) => {
    console.log('updateEntry called:', { userId, entryId, updates });

    if (!userId) {
      console.error('updateEntry failed: No userId');
      return { success: false, error: 'User not authenticated' };
    }

    const entryRef = ref(database, `journalEntries/${entryId}`);

    try {
      const existing = entries.find(e => e.id === entryId);
      const updatedData = {
        ...existing,
        ...updates,
        updatedAt: Date.now()
      };
      console.log('Attempting to update journal entry:', updatedData);
      await set(entryRef, updatedData);
      console.log('Journal entry updated successfully');
      return { success: true };
    } catch (error) {
      console.error('Failed to update journal entry:', error);
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
