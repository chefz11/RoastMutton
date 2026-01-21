import { useState } from 'react';
import { X } from 'lucide-react';
import './AuthModal.css';

function AuthModal({ onClose, onSignIn }) {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await onSignIn(email);
    if (result.success) {
      setSubmitted(true);
    } else {
      setError(result.error);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content card golden" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Sign In to Roast Mutton</h2>
          <button className="close-button" onClick={onClose}>
            <X size={24} />
          </button>
        </div>

        {!submitted ? (
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your.email@example.com"
                required
              />
              <p className="form-hint">We'll send you a magic link to sign in. No password needed!</p>
            </div>

            {error && <div className="error-message">{error}</div>}

            <div className="form-actions">
              <button type="submit">Send Magic Link</button>
              <button type="button" onClick={onClose} className="secondary">
                Cancel
              </button>
            </div>
          </form>
        ) : (
          <div className="success-message">
            <h3>Check Your Email!</h3>
            <p>We've sent a magic link to <strong>{email}</strong></p>
            <p>Click the link in the email to sign in. You can close this window.</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default AuthModal;
