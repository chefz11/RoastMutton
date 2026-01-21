import { ArrowLeft, Users, TrendingUp } from 'lucide-react';
import './SharedStatsView.css';

function SharedStatsView({
  yourProgress,
  yourJournal,
  buddyProgress,
  buddyJournal,
  buddyProfile,
  onBack
}) {
  const yourName = 'You';
  const buddyName = buddyProfile?.displayName || buddyProfile?.email?.split('@')[0] || 'Your Buddy';

  const getTotalPagesRead = (journal) => {
    return journal.reduce((sum, entry) => sum + (entry.pagesRead || 0), 0);
  };

  const getChaptersCompleted = (progress) => {
    return progress?.completedChapters?.length || 0;
  };

  const getDaysIntoJourney = (startDate) => {
    if (!startDate) return 0;
    const start = new Date(startDate);
    const now = new Date();
    return Math.ceil((now - start) / (1000 * 60 * 60 * 24));
  };

  const getAveragePagesPerDay = (journal, startDate) => {
    const days = getDaysIntoJourney(startDate);
    if (days === 0) return 0;
    return Math.round(getTotalPagesRead(journal) / days);
  };

  const yourPages = getTotalPagesRead(yourJournal);
  const buddyPages = getTotalPagesRead(buddyJournal);
  const yourChapters = getChaptersCompleted(yourProgress);
  const buddyChapters = getChaptersCompleted(buddyProgress);
  const yourDays = getDaysIntoJourney(yourProgress?.startDate);
  const buddyDays = getDaysIntoJourney(buddyProgress?.startDate);
  const yourPace = getAveragePagesPerDay(yourJournal, yourProgress?.startDate);
  const buddyPace = getAveragePagesPerDay(buddyJournal, buddyProgress?.startDate);

  const totalPages = yourPages + buddyPages;
  const totalChapters = yourChapters + buddyChapters;

  return (
    <div className="shared-stats-view fade-in">
      <header className="stats-header">
        <button onClick={onBack} className="back-button">
          <ArrowLeft size={20} /> Back
        </button>
        <div>
          <h1><Users size={36} /> Reading Buddies Stats</h1>
          <p className="subtitle">Your combined journey through Middle-earth</p>
        </div>
      </header>

      <div className="combined-stats card golden">
        <h2>Combined Progress</h2>
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-value">{totalPages}</div>
            <div className="stat-label">Total Pages Read</div>
          </div>
          <div className="stat-card">
            <div className="stat-value">{totalChapters}</div>
            <div className="stat-label">Total Chapters Completed</div>
          </div>
          <div className="stat-card">
            <div className="stat-value">{yourJournal.length + buddyJournal.length}</div>
            <div className="stat-label">Journal Entries Written</div>
          </div>
        </div>
      </div>

      <div className="comparison-stats card">
        <h2>Individual Progress</h2>
        <div className="comparison-grid">
          <div className="comparison-column">
            <h3>{yourName}</h3>
            <div className="comparison-stat">
              <span className="label">Pages Read</span>
              <span className="value">{yourPages}</span>
            </div>
            <div className="comparison-stat">
              <span className="label">Chapters Completed</span>
              <span className="value">{yourChapters}</span>
            </div>
            <div className="comparison-stat">
              <span className="label">Days Reading</span>
              <span className="value">{yourDays}</span>
            </div>
            <div className="comparison-stat">
              <span className="label">Avg Pages/Day</span>
              <span className="value">{yourPace}</span>
            </div>
          </div>

          <div className="comparison-divider"></div>

          <div className="comparison-column">
            <h3>{buddyName}</h3>
            <div className="comparison-stat">
              <span className="label">Pages Read</span>
              <span className="value">{buddyPages}</span>
            </div>
            <div className="comparison-stat">
              <span className="label">Chapters Completed</span>
              <span className="value">{buddyChapters}</span>
            </div>
            <div className="comparison-stat">
              <span className="label">Days Reading</span>
              <span className="value">{buddyDays}</span>
            </div>
            <div className="comparison-stat">
              <span className="label">Avg Pages/Day</span>
              <span className="value">{buddyPace}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="pace-comparison card golden">
        <h2><TrendingUp size={24} /> Who's Ahead?</h2>
        {yourChapters > buddyChapters && (
          <p>You're ahead by {yourChapters - buddyChapters} chapters! Keep up the great pace!</p>
        )}
        {buddyChapters > yourChapters && (
          <p>{buddyName} is ahead by {buddyChapters - yourChapters} chapters. Time to catch up!</p>
        )}
        {yourChapters === buddyChapters && (
          <p>You're neck and neck! Both at {yourChapters} chapters completed.</p>
        )}
      </div>

      <div className="ornament">⚔ ◈ ⚔</div>
    </div>
  );
}

export default SharedStatsView;
