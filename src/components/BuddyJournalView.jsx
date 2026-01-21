import { ArrowLeft, BookOpen, Calendar, User } from 'lucide-react';
import './BuddyJournalView.css';

function BuddyJournalView({ buddyProfile, buddyJournal, onBack }) {
  const sortedEntries = [...buddyJournal].sort((a, b) =>
    new Date(b.createdAt || b.timestamp) - new Date(a.createdAt || a.timestamp)
  );

  const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const groupEntriesByDate = () => {
    return sortedEntries.reduce((groups, entry) => {
      const date = new Date(entry.createdAt || entry.timestamp).toDateString();
      if (!groups[date]) groups[date] = [];
      groups[date].push(entry);
      return groups;
    }, {});
  };

  const groupedEntries = groupEntriesByDate();
  const displayName = buddyProfile?.displayName || buddyProfile?.email?.split('@')[0] || 'Your Reading Buddy';

  return (
    <div className="buddy-journal-view fade-in">
      <header className="buddy-journal-header">
        <button onClick={onBack} className="back-button">
          <ArrowLeft size={20} /> Back
        </button>
        <div>
          <h1>
            <User size={36} /> {displayName}'s Journal
          </h1>
          <p className="subtitle">Following their journey through Middle-earth</p>
        </div>
      </header>

      <div className="buddy-stats card golden">
        <div className="stat">
          <div className="stat-value">{buddyJournal.length}</div>
          <div className="stat-label">Entries Shared</div>
        </div>
        <div className="stat">
          <div className="stat-value">
            {buddyJournal.reduce((sum, e) => sum + (e.pagesRead || 0), 0)}
          </div>
          <div className="stat-label">Pages Read</div>
        </div>
      </div>

      {sortedEntries.length === 0 ? (
        <div className="empty-state card">
          <BookOpen size={64} />
          <h2>No Entries Yet</h2>
          <p>{displayName} hasn't shared any journal entries yet.</p>
        </div>
      ) : (
        <div className="entries-timeline">
          {Object.entries(groupedEntries).map(([date, dateEntries]) => (
            <div key={date} className="date-group">
              <div className="date-header">
                <Calendar size={20} />
                <h2>{formatDate(dateEntries[0].createdAt || dateEntries[0].timestamp)}</h2>
              </div>
              <div className="entries-list">
                {dateEntries.map(entry => (
                  <div key={entry.id} className="buddy-entry card">
                    <div className="entry-header">
                      <div className="entry-meta">
                        <span className="book-badge">{entry.bookTitle}</span>
                        {entry.chapterNumber && (
                          <span className="chapter-badge">
                            Chapter {entry.chapterNumber}: {entry.chapterTitle}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="entry-content">{entry.content}</div>
                    {entry.pagesRead && (
                      <div className="entry-footer">
                        <BookOpen size={14} />
                        <span>{entry.pagesRead} pages</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="ornament">⚔ ◈ ⚔</div>
    </div>
  );
}

export default BuddyJournalView;
