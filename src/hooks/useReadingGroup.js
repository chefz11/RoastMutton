import { useEffect, useState } from 'react';
import { ref, onValue, set, push, get } from 'firebase/database';
import { database } from '../lib/firebase';

function generateInviteCode() {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // Exclude confusing chars
  let code = 'MUTTON-';
  for (let i = 0; i < 4; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}

export function useReadingGroup(userId) {
  const [group, setGroup] = useState(null);
  const [buddyId, setBuddyId] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) {
      setLoading(false);
      return;
    }

    // Find user's group by searching for groups where user is a member
    const groupsRef = ref(database, 'readingGroups');

    const unsubscribe = onValue(groupsRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        // Find group where this user is a member
        const userGroup = Object.entries(data).find(([id, group]) =>
          group.members && group.members.includes(userId)
        );

        if (userGroup) {
          const [groupId, groupData] = userGroup;
          setGroup({ id: groupId, ...groupData });

          // Find buddy (other member)
          const otherMember = groupData.members.find(id => id !== userId);
          setBuddyId(otherMember);
        }
      }
      setLoading(false);
    });

    return unsubscribe;
  }, [userId]);

  const createGroup = async () => {
    if (!userId) return { success: false };

    const groupsRef = ref(database, 'readingGroups');
    const newGroupRef = push(groupsRef);
    const inviteCode = generateInviteCode();

    try {
      await set(newGroupRef, {
        name: 'Reading Buddies',
        inviteCode,
        createdAt: Date.now(),
        createdBy: userId,
        members: [userId],
        maxMembers: 2
      });

      return { success: true, inviteCode };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const joinGroup = async (inviteCode) => {
    if (!userId) return { success: false };

    // Find group by invite code
    const groupsRef = ref(database, 'readingGroups');
    const snapshot = await get(groupsRef);

    if (!snapshot.exists()) {
      return { success: false, error: 'No groups found' };
    }

    const groups = snapshot.val();
    const targetGroup = Object.entries(groups).find(([id, group]) =>
      group.inviteCode === inviteCode.toUpperCase()
    );

    if (!targetGroup) {
      return { success: false, error: 'Invalid invite code' };
    }

    const [groupId, groupData] = targetGroup;

    // Check if group is full
    if (groupData.members.length >= groupData.maxMembers) {
      return { success: false, error: 'This reading group is full' };
    }

    // Check if user already in group
    if (groupData.members.includes(userId)) {
      return { success: false, error: 'You are already in this group' };
    }

    // Add user to group
    try {
      const groupRef = ref(database, `readingGroups/${groupId}`);
      await set(groupRef, {
        ...groupData,
        members: [...groupData.members, userId]
      });

      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const leaveGroup = async () => {
    if (!userId || !group) return { success: false };

    try {
      const groupRef = ref(database, `readingGroups/${group.id}`);
      const updatedMembers = group.members.filter(id => id !== userId);

      await set(groupRef, {
        ...group,
        members: updatedMembers
      });

      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  return {
    group,
    buddyId,
    loading,
    createGroup,
    joinGroup,
    leaveGroup
  };
}
