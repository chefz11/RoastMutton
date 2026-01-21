import { useEffect, useState } from 'react';
import { ref, onValue, query, orderByChild, equalTo } from 'firebase/database';
import { database } from '../lib/firebase';

export function useBuddyData(buddyId) {
  const [buddyProfile, setBuddyProfile] = useState(null);
  const [buddyProgress, setBuddyProgress] = useState(null);
  const [buddyJournal, setBuddyJournal] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!buddyId) {
      setLoading(false);
      return;
    }

    // Fetch buddy's profile
    const profileRef = ref(database, `users/${buddyId}/profile`);
    onValue(profileRef, (snapshot) => {
      if (snapshot.exists()) {
        setBuddyProfile(snapshot.val());
      }
    });

    // Fetch buddy's progress
    const progressRef = ref(database, `users/${buddyId}/progress`);
    onValue(progressRef, (snapshot) => {
      if (snapshot.exists()) {
        setBuddyProgress(snapshot.val());
      }
    });

    // Fetch buddy's PUBLIC journal entries only
    const journalQuery = query(
      ref(database, 'journalEntries'),
      orderByChild('userId'),
      equalTo(buddyId)
    );

    const unsubscribe = onValue(journalQuery, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val();
        const entries = Object.entries(data)
          .map(([id, entry]) => ({ id, ...entry }))
          .filter(entry => !entry.isPrivate); // Only show public entries

        setBuddyJournal(entries);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, [buddyId]);

  return { buddyProfile, buddyProgress, buddyJournal, loading };
}
