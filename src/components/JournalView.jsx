import { useState } from 'react';
import { ArrowLeft, BookOpen, Calendar, Edit3 } from 'lucide-react';
import EditJournalModal from './EditJournalModal';
import './JournalView.css';

function JournalView({ entries, onUpdateEntry, onDeleteEntry, onBack }) {
  const [editingEntry, setEditingEntry] = useState(null);
  const sortedEntries = [...entries].sort((a, b) => {
    const aTime = a.createdAt || a.timestamp || 0;
    const bTime = b.createdAt || b.timestamp || 0;
    return bTime - aTime;
  });

  const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit'
    });
  };

  const groupEntriesByDate = () => {
    return sortedEntries.reduce((groups, entry) => {
      const timestamp = entry.createdAt || entry.timestamp || Date.now();
      const date = new Date(timestamp).toDateString();
      if (!groups[date]) groups[date] = [];
      groups[date].push(entry);
      return groups;
    }, {});
  };

  const groupedEntries = groupEntriesByDate();

  return (
    <div className="journal-view fade-in">
      <header className="journal-header">
        <button onClick={onBack} className="back-button">
          <ArrowLeft size={20} /> Back
        </button>
        <div>
          <h1><Edit3 size={36} /> My Journey Journal</h1>
          <p className="subtitle">Reflections from the Road</p>
        </div>
      </header>

      <div className="journal-stats card golden">
        <div className="stat">
          <div className="stat-value">{entries.length}</div>
          <div className="stat-label">Total Entries</div>
        </div>
        <div className="stat">
          <div className="stat-value">
            {entries.reduce((sum, e) => sum + (e.pagesRead || 0), 0)}
          </div>
          <div className="stat-label">Pages Recorded</div>
        </div>
        <div className="stat">
          <div className="stat-value">
            {Object.keys(groupedEntries).length}
          </div>
          <div className="stat-label">Days Journaled</div>
        </div>
      </div>

      {sortedEntries.length === 0 ? (
        <div className="empty-state card">
          <BookOpen size={64} />
          <h2>No Journal Entries Yet</h2>
          <p>Your thoughts and reflections will appear here as you complete chapters.</p>
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
                  <div
                    key={entry.id}
                    className="journal-entry card"
                    onClick={() => setEditingEntry(entry)}
                  >
                    <div className="entry-header">
                      <div className="entry-meta">
                        <span className="book-badge">{entry.bookTitle}</span>
                        {entry.chapterNumber && (
                          <span className="chapter-badge">
                            Chapter {entry.chapterNumber}: {entry.chapterTitle}
                          </span>
                        )}
                        {entry.isPrivate && (
                          <span className="privacy-badge">🔒 Private</span>
                        )}
                      </div>
                      <div className="entry-time">{formatTime(entry.createdAt || entry.timestamp)}</div>
                    </div>
                    <div className="entry-content">{entry.content}</div>
                    {entry.pagesRead && (
                      <div className="entry-footer">
                        <BookOpen size={14} />
                        <span>{entry.pagesRead} pages</span>
                      </div>
                    )}
                    <div className="edit-hint">
                      <Edit3 size={14} />
                      <span>Click to edit</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="ornament">⚔ ◈ ⚔</div>

      {editingEntry && (
        <EditJournalModal
          entry={editingEntry}
          onSave={onUpdateEntry}
          onDelete={onDeleteEntry}
          onClose={() => setEditingEntry(null)}
        />
      )}
    </div>
  );
}

export default JournalView;
