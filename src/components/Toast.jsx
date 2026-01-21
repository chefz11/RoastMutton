import { useEffect } from 'react';
import { X, CheckCircle, AlertCircle } from 'lucide-react';
import './Toast.css';

function Toast({ message, type = 'success', onClose, duration = 3000 }) {
  useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(onClose, duration);
      return () => clearTimeout(timer);
    }
  }, [duration, onClose]);

  return (
    <div className={`toast toast-${type}`}>
      <div className="toast-icon">
        {type === 'success' ? <CheckCircle size={20} /> : <AlertCircle size={20} />}
      </div>
      <div className="toast-message">{message}</div>
      <button className="toast-close" onClick={onClose}>
        <X size={16} />
      </button>
    </div>
  );
}

export default Toast;
