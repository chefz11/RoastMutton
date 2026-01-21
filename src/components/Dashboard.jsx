import { BOOKS } from '../data/books';
import { Book, ScrollText, BarChart3, MapPin, Users, TrendingUp, LogOut } from 'lucide-react';
import { useReadingGroup } from '../hooks/useReadingGroup';
import { useBuddyData } from '../hooks/useBuddyData';
import GroupSetup from './GroupSetup';
import './Dashboard.css';

function Dashboard({ progress, journalEntries, userId, userEmail, onStartReading, onViewJournal, onViewStats, onViewBuddyJournal, onViewSharedStats, onLogout }) {
  const { group, buddyId, createGroup, joinGroup } = useReadingGroup(userId);
  const { buddyProfile, buddyProgress, buddyJournal } = useBuddyData(buddyId);

  const totalChapters = BOOKS.reduce((sum, book) => sum + book.chapters.length, 0);
  const completedCount = progress?.completedChapters?.length || 0;
  const overallProgress = (completedCount / totalChapters) * 100;

  const hasBuddy = group && group.members.length === 2;
  const needsGroupSetup = userId && (!group || group.members.length < 2);

  const getCurrentBookProgress = (bookId) => {
    const book = BOOKS.find(b => b.id === bookId);
    if (!book) return 0;
    const bookChapters = book.chapters.length;
    const completedInBook = (progress?.completedChapters || []).filter(c => c.startsWith(bookId)).length;
    return (completedInBook / bookChapters) * 100;
  };

  const getDaysIntoJourney = () => {
    if (!progress?.startDate) return 0;
    const start = new Date(progress.startDate);
    const now = new Date();
    const diffTime = Math.abs(now - start);
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  const getTodaysPagesRead = () => {
    const today = new Date().toDateString();
    return (journalEntries || [])
      .filter(entry => new Date(entry.createdAt || entry.timestamp).toDateString() === today)
      .reduce((sum, entry) => sum + (entry.pagesRead || 0), 0);
  };

  return (
    <div className="dashboard fade-in">
      <header className="dashboard-header">
        <div className="header-content">
          <div>
            <h1>Roast Mutton</h1>
            <p className="subtitle">A companion for your passage through Middle-earth</p>
          </div>
          {userEmail && (
            <div className="user-info">
              <span className="user-email">{userEmail}</span>
              <button onClick={onLogout} className="logout-button" title="Sign out">
                <LogOut size={18} />
              </button>
            </div>
          )}
        </div>
        <div className="ornament">⚔ ◈ ⚔</div>
      </header>

      {needsGroupSetup && (
        <GroupSetup
          group={group}
          onCreateGroup={createGroup}
          onJoinGroup={joinGroup}
        />
      )}

      {hasBuddy && buddyProgress && (
        <div className="buddy-progress card">
          <h3>📖 Reading Buddy Progress</h3>
          <div className="buddy-info">
            <div className="buddy-name">
              {buddyProfile?.displayName || buddyProfile?.email?.split('@')[0] || 'Your Friend'}
            </div>
            <div className="buddy-current">
              Currently reading: <strong>{buddyProgress.currentBook || 'Not started'}</strong>
              {buddyProgress.currentChapter && ` - Chapter ${buddyProgress.currentChapter}`}
            </div>
            <div className="buddy-stats-row">
              <span>{buddyProgress.completedChapters?.length || 0} chapters completed</span>
              <span>{buddyJournal?.length || 0} journal entries</span>
            </div>
          </div>
          <button onClick={onViewBuddyJournal}>View Their Journal</button>
        </div>
      )}

      {progress?.startDate && (
        <div className="journey-stats card golden">
          <h3>Your Journey</h3>
          <div className="stats-grid">
            <div className="stat">
              <div className="stat-value">{getDaysIntoJourney()}</div>
              <div className="stat-label">Days on the Road</div>
            </div>
            <div className="stat">
              <div className="stat-value">{completedCount}</div>
              <div className="stat-label">Chapters Completed</div>
            </div>
            <div className="stat">
              <div className="stat-value">{getTodaysPagesRead()}/{progress.dailyGoal || 30}</div>
              <div className="stat-label">Pages Today</div>
            </div>
            <div className="stat">
              <div className="stat-value">{journalEntries?.length || 0}</div>
              <div className="stat-label">Journal Entries</div>
            </div>
          </div>
          <div className="overall-progress">
            <div className="progress-header">
              <span>Overall Progress</span>
              <span>{Math.round(overallProgress)}%</span>
            </div>
            <div className="progress-bar">
              <div className="progress-fill" style={{ width: `${overallProgress}%` }}></div>
            </div>
          </div>
        </div>
      )}

      <div className="books-grid">
        {BOOKS.map((book, index) => {
          const bookProgress = getCurrentBookProgress(book.id);
          const isCurrentBook = progress?.currentBook === book.id;
          const isCompleted = bookProgress === 100;
          const isLocked = index > 0 && getCurrentBookProgress(BOOKS[index - 1].id) < 100;

          return (
            <div
              key={book.id}
              className={`book-card card ${isCurrentBook ? 'current' : ''} ${isCompleted ? 'completed' : ''} ${isLocked ? 'locked' : ''}`}
            >
              <div className="book-icon">
                <Book size={48} />
              </div>
              <h3>{book.title}</h3>
              <p className="book-subtitle">{book.subtitle}</p>
              <div className="book-meta">
                <div>{book.chapters.length} chapters</div>
                <div>{book.totalPages} pages</div>
                <div>{book.movieParts.length} film{book.movieParts.length > 1 ? 's' : ''}</div>
              </div>
              {bookProgress > 0 && (
                <div className="book-progress">
                  <div className="progress-bar">
                    <div className="progress-fill" style={{ width: `${bookProgress}%` }}></div>
                  </div>
                  <div className="progress-text">{Math.round(bookProgress)}% complete</div>
                </div>
              )}
              <button
                onClick={() => onStartReading(book.id)}
                disabled={isLocked}
                className={isCurrentBook ? 'primary' : 'secondary'}
              >
                {isLocked ? '🔒 Locked' : isCompleted ? '✓ Review' : isCurrentBook ? 'Continue' : 'Begin'}
              </button>
            </div>
          );
        })}
      </div>

      <div className="quick-actions">
        <button onClick={onViewJournal} className="action-button">
          <ScrollText size={24} />
          <span>My Journal</span>
        </button>

        {hasBuddy && (
          <>
            <button onClick={onViewBuddyJournal} className="action-button">
              <Users size={24} />
              <span>Buddy's Journal</span>
            </button>
            <button onClick={onViewSharedStats} className="action-button">
              <TrendingUp size={24} />
              <span>Shared Stats</span>
            </button>
          </>
        )}

        <button onClick={onViewStats} className="action-button">
          <BarChart3 size={24} />
          <span>My Statistics</span>
        </button>
      </div>

      {!progress?.startDate && !needsGroupSetup && (
        <div className="welcome-message card golden">
          <MapPin size={48} className="welcome-icon" />
          <h2>Welcome, Traveler!</h2>
          <p>Your journey through Middle-earth awaits. Choose <em>The Hobbit</em> above to begin your adventure.</p>
          <p className="quote">"It's a dangerous business, Frodo, going out your door. You step onto the road, and if you don't keep your feet, there's no knowing where you might be swept off to."</p>
        </div>
      )}
    </div>
  );
}

export default Dashboard;
