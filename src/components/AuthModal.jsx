import { useState } from 'react';
import { X } from 'lucide-react';
import './AuthModal.css';

function AuthModal({ onClose, onSignIn, onGoogleSignIn }) {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    const result = await onSignIn(email);
    setLoading(false);
    if (result.success) {
      setSubmitted(true);
    } else {
      setError(result.error);
    }
  };

  const handleGoogleSignIn = async () => {
    setLoading(true);
    setError('');
    const result = await onGoogleSignIn();
    setLoading(false);
    if (result.success) {
      onClose(); // Close modal on successful Google sign-in
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
          <>
            <button
              type="button"
              className="google-signin-button"
              onClick={handleGoogleSignIn}
              disabled={loading}
            >
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.875 2.684-6.615z" fill="#4285F4"/>
                <path d="M9.003 18c2.43 0 4.467-.806 5.956-2.18L12.05 13.56c-.806.54-1.836.86-3.047.86-2.344 0-4.328-1.584-5.036-3.711H.96v2.332C2.44 15.983 5.485 18 9.003 18z" fill="#34A853"/>
                <path d="M3.964 10.712c-.18-.54-.282-1.117-.282-1.71 0-.593.102-1.17.282-1.71V4.96H.957C.347 6.175 0 7.55 0 9.002c0 1.452.348 2.827.957 4.042l3.007-2.332z" fill="#FBBC05"/>
                <path d="M9.003 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.464.891 11.428 0 9.003 0 5.485 0 2.44 2.017.96 4.958L3.967 7.29c.708-2.127 2.692-3.71 5.036-3.71z" fill="#EA4335"/>
              </svg>
              {loading ? 'Signing in...' : 'Continue with Google'}
            </button>

            <div className="divider">
              <span>or</span>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Email Address</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your.email@example.com"
                  required
                  disabled={loading}
                />
                <p className="form-hint">We'll send you a magic link to sign in. No password needed!</p>
              </div>

              {error && <div className="error-message">{error}</div>}

              <div className="form-actions">
                <button type="submit" disabled={loading}>
                  {loading ? 'Sending...' : 'Send Magic Link'}
                </button>
                <button type="button" onClick={onClose} className="secondary" disabled={loading}>
                  Cancel
                </button>
              </div>
            </form>
          </>
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
