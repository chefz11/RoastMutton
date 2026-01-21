import { ArrowLeft, TrendingUp, Calendar, BookOpen, Target, Award } from 'lucide-react';
import { BOOKS } from '../data/books';
import './StatsView.css';

function StatsView({ progress, journalEntries, onBack }) {
  const getDaysIntoJourney = () => {
    if (!progress.startDate) return 0;
    const start = new Date(progress.startDate);
    const now = new Date();
    const diffTime = Math.abs(now - start);
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  const getTotalPagesRead = () => {
    return journalEntries.reduce((sum, entry) => sum + (entry.pagesRead || 0), 0);
  };

  const getAveragePagesPerDay = () => {
    const days = getDaysIntoJourney();
    if (days === 0) return 0;
    return Math.round(getTotalPagesRead() / days);
  };

  const getTotalChapters = () => {
    return BOOKS.reduce((sum, book) => sum + book.chapters.length, 0);
  };

  const getCompletedChapters = () => {
    return progress.completedChapters.length;
  };

  const getEstimatedCompletionDate = () => {
    const totalPages = BOOKS.reduce((sum, book) => sum + book.totalPages, 0);
    const pagesRead = getTotalPagesRead();
    const pagesRemaining = totalPages - pagesRead;
    const avgPages = getAveragePagesPerDay();

    if (avgPages === 0) return null;

    const daysRemaining = Math.ceil(pagesRemaining / avgPages);
    const completionDate = new Date();
    completionDate.setDate(completionDate.getDate() + daysRemaining);

    return completionDate.toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const getReadingStreak = () => {
    if (journalEntries.length === 0) return 0;

    const sortedEntries = [...journalEntries].sort((a, b) =>
      new Date(b.timestamp) - new Date(a.timestamp)
    );

    let streak = 0;
    let currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0);

    for (let i = 0; i < sortedEntries.length; i++) {
      const entryDate = new Date(sortedEntries[i].timestamp);
      entryDate.setHours(0, 0, 0, 0);

      const diffDays = Math.floor((currentDate - entryDate) / (1000 * 60 * 60 * 24));

      if (diffDays === streak) {
        streak++;
      } else if (diffDays > streak) {
        break;
      }
    }

    return streak;
  };

  const getBookStats = () => {
    return BOOKS.map(book => {
      const bookChapters = book.chapters.length;
      const completedInBook = progress.completedChapters.filter(c => c.startsWith(book.id)).length;
      const percentage = Math.round((completedInBook / bookChapters) * 100);

      return {
        title: book.title,
        completed: completedInBook,
        total: bookChapters,
        percentage
      };
    });
  };

  const getAchievements = () => {
    const achievements = [];
    const chaptersCompleted = getCompletedChapters();
    const streak = getReadingStreak();
    const totalPages = getTotalPagesRead();

    if (chaptersCompleted >= 1) achievements.push({ icon: '📖', title: 'First Steps', description: 'Completed your first chapter' });
    if (chaptersCompleted >= 10) achievements.push({ icon: '🗺️', title: 'Seasoned Traveler', description: 'Completed 10 chapters' });
    if (chaptersCompleted >= 25) achievements.push({ icon: '⚔️', title: 'Warrior of Words', description: 'Completed 25 chapters' });
    if (chaptersCompleted >= 50) achievements.push({ icon: '👑', title: 'Champion Reader', description: 'Completed 50 chapters' });
    if (streak >= 3) achievements.push({ icon: '🔥', title: 'Building Momentum', description: '3-day reading streak' });
    if (streak >= 7) achievements.push({ icon: '⭐', title: 'Week Warrior', description: '7-day reading streak' });
    if (streak >= 30) achievements.push({ icon: '💎', title: 'Dedicated Scholar', description: '30-day reading streak' });
    if (totalPages >= 100) achievements.push({ icon: '📚', title: 'Century Club', description: 'Read 100 pages' });
    if (totalPages >= 500) achievements.push({ icon: '🏆', title: 'Epic Journey', description: 'Read 500 pages' });
    if (totalPages >= 1000) achievements.push({ icon: '🌟', title: 'Master of Lore', description: 'Read 1000 pages' });

    const bookStats = getBookStats();
    if (bookStats[0]?.percentage === 100) achievements.push({ icon: '🎒', title: 'There and Back Again', description: 'Completed The Hobbit' });
    if (bookStats[1]?.percentage === 100) achievements.push({ icon: '💍', title: 'Ring Bearer', description: 'Completed Fellowship' });
    if (bookStats[2]?.percentage === 100) achievements.push({ icon: '🏰', title: 'Defender of Rohan', description: 'Completed Two Towers' });
    if (bookStats[3]?.percentage === 100) achievements.push({ icon: '👑', title: 'Returned King', description: 'Completed Return of the King' });

    return achievements;
  };

  const days = getDaysIntoJourney();
  const totalPages = getTotalPagesRead();
  const avgPages = getAveragePagesPerDay();
  const completedChapters = getCompletedChapters();
  const totalChapters = getTotalChapters();
  const streak = getReadingStreak();
  const estimatedCompletion = getEstimatedCompletionDate();
  const bookStats = getBookStats();
  const achievements = getAchievements();

  return (
    <div className="stats-view fade-in">
      <header className="stats-header">
        <button onClick={onBack} className="back-button">
          <ArrowLeft size={20} /> Back
        </button>
        <div>
          <h1><TrendingUp size={36} /> Journey Statistics</h1>
          <p className="subtitle">Track your progress through Middle-earth</p>
        </div>
      </header>

      <div className="stats-grid">
        <div className="stat-card card golden">
          <Calendar size={32} />
          <div className="stat-value">{days}</div>
          <div className="stat-label">Days Traveling</div>
        </div>

        <div className="stat-card card golden">
          <BookOpen size={32} />
          <div className="stat-value">{totalPages}</div>
          <div className="stat-label">Pages Read</div>
        </div>

        <div className="stat-card card golden">
          <Target size={32} />
          <div className="stat-value">{avgPages}</div>
          <div className="stat-label">Avg Pages/Day</div>
        </div>

        <div className="stat-card card golden">
          <Award size={32} />
          <div className="stat-value">{streak}</div>
          <div className="stat-label">Day Streak</div>
        </div>
      </div>

      <div className="progress-overview card">
        <h2>Overall Progress</h2>
        <div className="overall-stat">
          <div className="stat-large">
            {completedChapters} / {totalChapters}
          </div>
          <div className="stat-label">Chapters Completed</div>
        </div>
        <div className="progress-bar">
          <div className="progress-fill" style={{ width: `${(completedChapters / totalChapters) * 100}%` }}></div>
        </div>
        {estimatedCompletion && (
          <div className="completion-estimate">
            At your current pace, you'll finish by <strong>{estimatedCompletion}</strong>
          </div>
        )}
      </div>

      <div className="books-progress card">
        <h2>Books Progress</h2>
        <div className="books-stats-list">
          {bookStats.map((book, index) => (
            <div key={index} className="book-stat">
              <div className="book-stat-header">
                <h3>{book.title}</h3>
                <span className="percentage">{book.percentage}%</span>
              </div>
              <div className="book-stat-details">
                {book.completed} / {book.total} chapters
              </div>
              <div className="progress-bar">
                <div className="progress-fill" style={{ width: `${book.percentage}%` }}></div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {achievements.length > 0 && (
        <div className="achievements card golden">
          <h2>🏆 Achievements Unlocked</h2>
          <div className="achievements-grid">
            {achievements.map((achievement, index) => (
              <div key={index} className="achievement-badge">
                <div className="achievement-icon">{achievement.icon}</div>
                <div className="achievement-title">{achievement.title}</div>
                <div className="achievement-description">{achievement.description}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="ornament">⚔ ◈ ⚔</div>
    </div>
  );
}

export default StatsView;
