import { useState } from 'react';
import { X, Save } from 'lucide-react';
import './EditChapterModal.css';

function EditChapterModal({ chapter, bookId, onSave, onClose }) {
  const [pages, setPages] = useState(chapter.pages);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(bookId, chapter.number, parseInt(pages));
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content card golden" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Edit Chapter</h2>
          <button className="close-button" onClick={onClose}>
            <X size={24} />
          </button>
        </div>

        <h3>Chapter {chapter.number}: {chapter.title}</h3>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Page Count</label>
            <input
              type="number"
              value={pages}
              onChange={(e) => setPages(e.target.value)}
              min="1"
              required
            />
            <p className="form-hint">Adjust this to match your edition</p>
          </div>

          <div className="form-actions">
            <button type="submit">
              <Save size={18} /> Save Changes
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

export default EditChapterModal;
