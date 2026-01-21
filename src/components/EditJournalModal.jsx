import { useState } from 'react';
import { X, Save, Trash2 } from 'lucide-react';
import './EditJournalModal.css';

function EditJournalModal({ entry, onSave, onDelete, onClose }) {
  const [content, setContent] = useState(entry.content);
  const [pagesRead, setPagesRead] = useState(entry.pagesRead || '');
  const [isPrivate, setIsPrivate] = useState(entry.isPrivate || false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (content.trim()) {
      onSave({
        ...entry,
        content,
        pagesRead: parseInt(pagesRead) || entry.pagesRead,
        isPrivate: isPrivate
      });
      onClose();
    }
  };

  const handleDelete = () => {
    if (confirm('Are you sure you want to delete this journal entry?')) {
      onDelete(entry.id);
      onClose();
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content card golden" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Edit Journal Entry</h2>
          <button className="close-button" onClick={onClose}>
            <X size={24} />
          </button>
        </div>

        <div className="entry-info">
          <span className="book-badge">{entry.bookTitle}</span>
          {entry.chapterNumber && (
            <span className="chapter-badge">
              Chapter {entry.chapterNumber}: {entry.chapterTitle}
            </span>
          )}
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Pages Read</label>
            <input
              type="number"
              value={pagesRead}
              onChange={(e) => setPagesRead(e.target.value)}
              placeholder="Optional"
            />
          </div>

          <div className="form-group">
            <label>Your Thoughts</label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              required
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
                ? 'This entry is private (only you can see it)'
                : 'This entry is shared with your reading buddy'}
            </p>
          </div>

          <div className="form-actions">
            <button type="submit">
              <Save size={18} /> Save Changes
            </button>
            <button type="button" onClick={handleDelete} className="danger">
              <Trash2 size={18} /> Delete
            </button>
            <button type="button" onClick={onClose} className="secondary">
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default EditJournalModal;
