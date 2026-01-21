import { useEffect, useState } from 'react';
import { onAuthStateChanged, signInWithEmailLink, sendSignInLinkToEmail, signOut, isSignInWithEmailLink } from 'firebase/auth';
import { auth } from '../lib/firebase';

export function useAuth() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      console.log('Auth state changed:', {
        isAuthenticated: !!user,
        email: user?.email,
        uid: user?.uid
      });
      setUser(user);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const signInWithEmail = async (email) => {
    try {
      const actionCodeSettings = {
        url: window.location.origin + '/auth/complete',
        handleCodeInApp: true,
      };

      await sendSignInLinkToEmail(auth, email, actionCodeSettings);
      window.localStorage.setItem('emailForSignIn', email);
      return { success: true };
    } catch (error) {
      setError(error.message);
      return { success: false, error: error.message };
    }
  };

  const completeSignIn = async () => {
    try {
      if (!isSignInWithEmailLink(auth, window.location.href)) {
        return { success: false, error: 'Invalid sign-in link' };
      }

      let email = window.localStorage.getItem('emailForSignIn');
      if (!email) {
        email = window.prompt('Please provide your email for confirmation');
      }

      const result = await signInWithEmailLink(auth, email, window.location.href);
      window.localStorage.removeItem('emailForSignIn');
      return { success: true, user: result.user };
    } catch (error) {
      setError(error.message);
      return { success: false, error: error.message };
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
      return { success: true };
    } catch (error) {
      setError(error.message);
      return { success: false, error: error.message };
    }
  };

  return { user, loading, error, signInWithEmail, completeSignIn, logout };
}
