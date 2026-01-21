import { useState } from 'react';
import { ArrowLeft, Check, Film, Edit3, Edit2 } from 'lucide-react';
import EditChapterModal from './EditChapterModal';
import EditJournalModal from './EditJournalModal';
import './BookView.css';

function BookView({
  book,
  progress,
  journalEntries,
  onChapterComplete,
  onAddJournalEntry,
  onUpdateJournalEntry,
  onDeleteJournalEntry,
  onUpdateChapterPages,
  onToggleMovieWatched,
  getChapterPages,
  onBack
}) {
  const [showJournalForm, setShowJournalForm] = useState(false);
  const [selectedChapter, setSelectedChapter] = useState(null);
  const [journalText, setJournalText] = useState('');
  const [pagesRead, setPagesRead] = useState('');
  const [isPrivate, setIsPrivate] = useState(false);
  const [editingChapter, setEditingChapter] = useState(null);
  const [editingJournal, setEditingJournal] = useState(null);

  const isChapterCompleted = (chapterNumber) => {
    return progress.completedChapters.includes(`${book.id}-${chapterNumber}`);
  };

  const handleCompleteChapter = (chapter) => {
    onChapterComplete(book.id, chapter.number);
    setSelectedChapter(chapter);
    setShowJournalForm(true);
  };

  const handleSubmitJournal = (e) => {
    e.preventDefault();
    if (journalText.trim()) {
      onAddJournalEntry({
        bookId: book.id,
        bookTitle: book.title,
        chapterNumber: selectedChapter.number,
        chapterTitle: selectedChapter.title,
        content: journalText,
        pagesRead: parseInt(pagesRead) || selectedChapter.pages,
        type: 'chapter',
        isPrivate: isPrivate
      });
      setJournalText('');
      setPagesRead('');
      setIsPrivate(false);
      setShowJournalForm(false);
      setSelectedChapter(null);
    }
  };

  const getChapterEntries = (chapterNumber) => {
    return journalEntries.filter(
      entry => entry.bookId === book.id && entry.chapterNumber === chapterNumber
    );
  };

  const completedChapters = book.chapters.filter(ch => isChapterCompleted(ch.number)).length;
  const bookProgress = (completedChapters / book.chapters.length) * 100;

  const groupedChapters = book.chapters.reduce((acc, chapter) => {
    if (chapter.book !== undefined) {
      const bookNum = `Book ${chapter.book}`;
      if (!acc[bookNum]) acc[bookNum] = [];
      acc[bookNum].push(chapter);
    } else {
      if (!acc['Chapters']) acc['Chapters'] = [];
      acc['Chapters'].push(chapter);
    }
    return acc;
  }, {});

  return (
    <div className="book-view fade-in">
      <header className="book-header">
        <button onClick={onBack} className="back-button">
          <ArrowLeft size={20} /> Back
        </button>
        <div>
          <h1>{book.title}</h1>
          <p className="book-subtitle">{book.subtitle}</p>
        </div>
      </header>

      <div className="book-progress-section card golden">
        <div className="progress-stats">
          <div className="stat">
            <span className="stat-value">{completedChapters}</span>
            <span className="stat-label">/ {book.chapters.length} Chapters</span>
          </div>
          <div className="stat">
            <span className="stat-value">{Math.round(bookProgress)}%</span>
            <span className="stat-label">Complete</span>
          </div>
        </div>
        <div className="progress-bar">
          <div className="progress-fill" style={{ width: `${bookProgress}%` }}></div>
        </div>
      </div>

      <div className="movie-section card">
        <h3><Film size={24} /> Extended Edition Films</h3>
        <div className="movies-grid">
          {book.movieParts.map(movie => {
            const isWatched = progress.watchedMovies?.includes(movie.id);
            return (
              <div
                key={movie.id}
                className={`movie-card ${isWatched ? 'watched' : ''}`}
                onClick={() => onToggleMovieWatched(movie.id)}
              >
                <div className="movie-watched-indicator">
                  {isWatched ? <Check size={20} /> : <div className="empty-check"></div>}
                </div>
                <h4>{movie.title}</h4>
                <p>{Math.floor(movie.runtime / 60)}h {movie.runtime % 60}m</p>
                <p className="watch-hint">{isWatched ? 'Watched' : 'Click to mark as watched'}</p>
              </div>
            );
          })}
        </div>
      </div>

      <div className="chapters-section">
        {Object.entries(groupedChapters).map(([groupName, chapters]) => (
          <div key={groupName} className="chapter-group">
            <h2>{groupName}</h2>
            <div className="chapters-list">
              {chapters.map((chapter) => {
                const completed = isChapterCompleted(chapter.number);
                const entries = getChapterEntries(chapter.number);
                const displayNumber = chapter.book !== undefined
                  ? `${chapter.book}.${chapter.number}`
                  : chapter.number;
                const actualPages = getChapterPages(book.id, chapter.number, chapter.pages);

                return (
                  <div
                    key={chapter.number}
                    className={`chapter-item card ${completed ? 'completed' : ''}`}
                  >
                    <div className="chapter-header">
                      <div className="chapter-info">
                        <div className="chapter-number">Chapter {displayNumber}</div>
                        <div className="chapter-title">{chapter.title}</div>
                        <div className="chapter-meta">
                          {actualPages} pages
                          <button
                            className="edit-icon-button"
                            onClick={() => setEditingChapter({ ...chapter, pages: actualPages })}
                            title="Edit page count"
                          >
                            <Edit2 size={14} />
                          </button>
                          {chapter.moviePart && (
                            <span className="movie-tag">
                              <Film size={14} />
                              {book.movieParts.find(m => m.id === chapter.moviePart)?.title}
                            </span>
                          )}
                        </div>
                      </div>
                      {!completed ? (
                        <button
                          onClick={() => handleCompleteChapter(chapter)}
                          className="complete-button"
                        >
                          <Check size={18} /> Complete
                        </button>
                      ) : (
                        <div className="completed-badge">
                          <Check size={18} /> Read
                        </div>
                      )}
                    </div>
                    {entries.length > 0 && (
                      <div className="chapter-entries">
                        {entries.map(entry => (
                          <div key={entry.id} className="entry-preview" onClick={() => setEditingJournal(entry)}>
                            <Edit3 size={14} />
                            <span>{entry.content.substring(0, 100)}...</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {showJournalForm && selectedChapter && (
        <div className="modal-overlay" onClick={() => setShowJournalForm(false)}>
          <div className="modal-content card golden" onClick={(e) => e.stopPropagation()}>
            <h2>Journal Entry</h2>
            <h3>Chapter {selectedChapter.number}: {selectedChapter.title}</h3>
            <form onSubmit={handleSubmitJournal}>
              <div className="form-group">
                <label>Pages Read (optional)</label>
                <input
                  type="number"
                  value={pagesRead}
                  onChange={(e) => setPagesRead(e.target.value)}
                  placeholder={`Default: ${selectedChapter.pages} pages`}
                />
              </div>
              <div className="form-group">
                <label>Your Thoughts</label>
                <textarea
                  value={journalText}
                  onChange={(e) => setJournalText(e.target.value)}
                  placeholder="What stood out to you? Favorite moments? Questions or reflections?"
                  autoFocus
                />
              </div>
              <div className="form-group">
                <label className="privacy-toggle">
                  <input
                    type="checkbox"
                    checked={!isPrivate}
                    onChange={(e) => setIsPrivate(!e.target.checked)}
                  />
                  <span>Share with reading buddy</span>
                </label>
                <p className="form-hint">
                  {isPrivate
                    ? 'This entry will be private (only you can see it)'
                    : 'This entry will be shared with your reading buddy'}
                </p>
              </div>
              <div className="form-actions">
                <button type="submit">Save Entry</button>
                <button type="button" onClick={() => setShowJournalForm(false)} className="secondary">
                  Skip for Now
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {editingChapter && (
        <EditChapterModal
          chapter={editingChapter}
          bookId={book.id}
          onSave={onUpdateChapterPages}
          onClose={() => setEditingChapter(null)}
        />
      )}

      {editingJournal && (
        <EditJournalModal
          entry={editingJournal}
          onSave={onUpdateJournalEntry}
          onDelete={onDeleteJournalEntry}
          onClose={() => setEditingJournal(null)}
        />
      )}
    </div>
  );
}

export default BookView;
