import { useState, useEffect } from 'react';
import { BOOKS } from './data/books';
import { useAuth } from './hooks/useAuth';
import { useProgress } from './hooks/useProgress';
import { useJournal } from './hooks/useJournal';
import { useChapterCustomizations } from './hooks/useChapterCustomizations';
import { useReadingGroup } from './hooks/useReadingGroup';
import { useBuddyData } from './hooks/useBuddyData';
import Dashboard from './components/Dashboard';
import BookView from './components/BookView';
import JournalView from './components/JournalView';
import StatsView from './components/StatsView';
import AuthModal from './components/AuthModal';
import BuddyJournalView from './components/BuddyJournalView';
import SharedStatsView from './components/SharedStatsView';
import Toast from './components/Toast';
import './App.css';

function App() {
  const { user, loading: authLoading, signInWithEmail, signInWithGoogle, logout } = useAuth();
  const { progress, loading: progressLoading, updateProgress } = useProgress(user?.uid);
  const { group, buddyId } = useReadingGroup(user?.uid);
  const { entries: journalEntries, loading: journalLoading, addEntry, updateEntry, deleteEntry } = useJournal(user?.uid, group?.id);
  const { customizations, loading: customLoading, updateCustomization, getChapterPages } = useChapterCustomizations(user?.uid);
  const { buddyProfile, buddyProgress, buddyJournal } = useBuddyData(buddyId);

  const [showAuthModal, setShowAuthModal] = useState(false);
  const [currentView, setCurrentView] = useState('dashboard');
  const [selectedBook, setSelectedBook] = useState(null);
  const [toast, setToast] = useState(null);

  // Show auth modal if user not logged in
  useEffect(() => {
    if (!authLoading && !user) {
      setShowAuthModal(true);
    }
  }, [authLoading, user]);

  const handleStartReading = (bookId) => {
    if (!progress.startDate) {
      updateProgress({ ...progress, currentBook: bookId, startDate: new Date().toISOString() });
    } else {
      updateProgress({ ...progress, currentBook: bookId });
    }
    setSelectedBook(BOOKS.find(b => b.id === bookId));
    setCurrentView('book');
  };

  const handleChapterComplete = (bookId, chapterNumber) => {
    const chapterId = `${bookId}-${chapterNumber}`;
    if (!progress.completedChapters.includes(chapterId)) {
      updateProgress({
        ...progress,
        completedChapters: [...progress.completedChapters, chapterId],
        currentChapter: chapterNumber
      });
    }
  };

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
  };

  const handleAddJournalEntry = async (entry) => {
    const result = await addEntry(entry);
    if (result.success) {
      showToast('Journal entry saved successfully!');
    } else {
      showToast(result.error || 'Failed to save journal entry. Please check your connection.', 'error');
      console.error('Failed to add journal entry:', result.error);
    }
    return result;
  };

  const handleUpdateJournalEntry = async (updatedEntry) => {
    const result = await updateEntry(updatedEntry.id, updatedEntry);
    if (result.success) {
      showToast('Journal entry updated successfully!');
    } else {
      showToast(result.error || 'Failed to update journal entry. Please check your connection.', 'error');
      console.error('Failed to update journal entry:', result.error);
    }
    return result;
  };

  const handleDeleteJournalEntry = async (entryId) => {
    const result = await deleteEntry(entryId);
    if (result.success) {
      showToast('Journal entry deleted successfully!');
    } else {
      showToast(result.error || 'Failed to delete journal entry. Please check your connection.', 'error');
      console.error('Failed to delete journal entry:', result.error);
    }
    return result;
  };

  const handleUpdateChapterPages = async (bookId, chapterNumber, pages) => {
    await updateCustomization(bookId, chapterNumber, pages);
  };

  const handleToggleMovieWatched = (movieId) => {
    const watched = progress.watchedMovies || [];
    if (watched.includes(movieId)) {
      updateProgress({
        ...progress,
        watchedMovies: watched.filter(id => id !== movieId)
      });
    } else {
      updateProgress({
        ...progress,
        watchedMovies: [...watched, movieId]
      });
    }
  };

  const renderView = () => {
    switch (currentView) {
      case 'book':
        return (
          <BookView
            book={selectedBook}
            progress={progress}
            journalEntries={journalEntries}
            onChapterComplete={handleChapterComplete}
            onAddJournalEntry={handleAddJournalEntry}
            onUpdateJournalEntry={handleUpdateJournalEntry}
            onDeleteJournalEntry={handleDeleteJournalEntry}
            onUpdateChapterPages={handleUpdateChapterPages}
            onToggleMovieWatched={handleToggleMovieWatched}
            getChapterPages={getChapterPages}
            onBack={() => setCurrentView('dashboard')}
          />
        );
      case 'journal':
        return (
          <JournalView
            entries={journalEntries}
            onUpdateEntry={handleUpdateJournalEntry}
            onDeleteEntry={handleDeleteJournalEntry}
            onBack={() => setCurrentView('dashboard')}
          />
        );
      case 'stats':
        return (
          <StatsView
            progress={progress}
            journalEntries={journalEntries}
            chapterCustomizations={customizations}
            onBack={() => setCurrentView('dashboard')}
          />
        );
      case 'buddy-journal':
        return (
          <BuddyJournalView
            buddyProfile={buddyProfile}
            buddyJournal={buddyJournal}
            onBack={() => setCurrentView('dashboard')}
          />
        );
      case 'shared-stats':
        return (
          <SharedStatsView
            yourProgress={progress}
            yourJournal={journalEntries}
            buddyProgress={buddyProgress}
            buddyJournal={buddyJournal}
            buddyProfile={buddyProfile}
            onBack={() => setCurrentView('dashboard')}
          />
        );
      default:
        return (
          <Dashboard
            progress={progress}
            journalEntries={journalEntries}
            userId={user?.uid}
            userEmail={user?.email}
            onStartReading={handleStartReading}
            onViewJournal={() => setCurrentView('journal')}
            onViewStats={() => setCurrentView('stats')}
            onViewBuddyJournal={() => setCurrentView('buddy-journal')}
            onViewSharedStats={() => setCurrentView('shared-stats')}
            onLogout={logout}
          />
        );
    }
  };

  if (authLoading || (user && (progressLoading || journalLoading || customLoading))) {
    return (
      <div className="app loading-screen">
        <div className="loading-content">
          <h1>Roast Mutton</h1>
          <p>Loading your journey...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="app">
      {showAuthModal && !user && (
        <AuthModal
          onClose={() => setShowAuthModal(false)}
          onSignIn={signInWithEmail}
          onGoogleSignIn={signInWithGoogle}
        />
      )}
      {renderView()}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
}

export default App;
