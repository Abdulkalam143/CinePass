/**
 * Toast — Animated notification system
 */
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, AlertTriangle, Info, X } from 'lucide-react';
import { useBooking } from '../context/BookingContext';
import './Toast.css';

const ICONS = {
  success: CheckCircle,
  warning: AlertTriangle,
  info: Info,
  error: AlertTriangle,
};

const Toast = () => {
  const { toasts, removeToast } = useBooking();

  return (
    <div className="toast-container" id="toast-container">
      <AnimatePresence>
        {toasts.map((toast) => {
          const Icon = ICONS[toast.type] || Info;
          return (
            <motion.div
              key={toast.id}
              className={`toast toast--${toast.type}`}
              initial={{ opacity: 0, x: 100, scale: 0.9 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 100, scale: 0.9 }}
              transition={{ type: 'spring', stiffness: 300, damping: 25 }}
            >
              <Icon size={18} className="toast__icon" />
              <span className="toast__message">{toast.message}</span>
              <button
                className="toast__close"
                onClick={() => removeToast(toast.id)}
                aria-label="Close notification"
              >
                <X size={14} />
              </button>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
};

export default Toast;
