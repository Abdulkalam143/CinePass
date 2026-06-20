/**
 * PaymentSuccessPage — Simulated payment success with animations
 */
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckCircle, Home, Download, Ticket, Calendar, MapPin } from 'lucide-react';
import { useBooking } from '../context/BookingContext';
import { formatPrice } from '../utils/seatUtils';
import { useTranslation } from '../context/LanguageContext';
import './PaymentSuccessPage.css';

const PaymentSuccessPage = () => {
  const navigate = useNavigate();
  const { lastBooking, resetBooking } = useBooking();
  const { t } = useTranslation();
  // Generate confetti pieces statically on initialization
  const [confetti] = useState(() => {
    const colors = ['#e50914', '#eab308', '#22c55e', '#3b82f6', '#a855f7', '#f472b6'];
    return Array.from({ length: 50 }, (_, i) => ({
      id: i,
      color: colors[Math.floor(Math.random() * colors.length)],
      left: Math.random() * 100,
      delay: Math.random() * 2,
      duration: 2 + Math.random() * 3,
      size: 6 + Math.random() * 8,
    }));
  });

  const handleGoHome = () => {
    resetBooking();
    navigate('/');
  };

  if (!lastBooking) {
    return (
      <div className="payment-page__empty container">
        <h2>{t('success.noBookingFound')}</h2>
        <button onClick={() => navigate('/')}>{t('details.goHome')}</button>
      </div>
    );
  }

  return (
    <div className="payment-page" id="payment-success-page">
      {/* Confetti */}
      <div className="payment-page__confetti">
        {confetti.map((piece) => (
          <div
            key={piece.id}
            className="confetti-piece"
            style={{
              left: `${piece.left}%`,
              backgroundColor: piece.color,
              width: `${piece.size}px`,
              height: `${piece.size}px`,
              animationDelay: `${piece.delay}s`,
              animationDuration: `${piece.duration}s`,
            }}
          />
        ))}
      </div>

      <div className="payment-page__container container">
        {/* Success animation */}
        <motion.div
          className="payment-page__success-icon"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 200, damping: 15, delay: 0.2 }}
        >
          <div className="payment-page__circle">
            <CheckCircle size={64} />
          </div>
        </motion.div>

        <motion.h1
          className="payment-page__heading"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          {t('success.successful')}
        </motion.h1>

        <motion.p
          className="payment-page__subtext"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
        >
          {t('success.ticketsBooked')}
        </motion.p>

        {/* Booking ticket card */}
        <motion.div
          className="payment-page__ticket"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9 }}
        >
          <div className="payment-page__ticket-header">
            <Ticket size={20} />
            <span>{t('success.confirmed')}</span>
            <span className="payment-page__booking-id">{lastBooking.bookingId}</span>
          </div>

          <div className="payment-page__ticket-body">
            <div className="payment-page__ticket-row">
              <div className="payment-page__ticket-field">
                <span className="payment-page__ticket-label">{t('success.movie')}</span>
                <span className="payment-page__ticket-value">{lastBooking.movie.title}</span>
              </div>
              <div className="payment-page__ticket-field">
                <span className="payment-page__ticket-label">
                  <Calendar size={12} /> {t('success.showtime')}
                </span>
                <span className="payment-page__ticket-value">{lastBooking.showtime}</span>
              </div>
            </div>

            <div className="payment-page__ticket-row">
              <div className="payment-page__ticket-field">
                <span className="payment-page__ticket-label">
                  <MapPin size={12} /> {t('success.seats')}
                </span>
                <span className="payment-page__ticket-value">
                  {lastBooking.seats.sort().join(', ')}
                </span>
              </div>
              <div className="payment-page__ticket-field">
                <span className="payment-page__ticket-label">{t('success.amountPaid')}</span>
                <span className="payment-page__ticket-value payment-page__ticket-value--amount">
                  {formatPrice(lastBooking.totalPrice + lastBooking.seatCount * 30)}
                </span>
              </div>
            </div>
          </div>

          <div className="payment-page__ticket-footer">
            <span>{t('success.bookedOn')} {new Date(lastBooking.timestamp).toLocaleDateString('en-IN', {
              day: 'numeric', month: 'long', year: 'numeric'
            })}</span>
          </div>
        </motion.div>

        {/* Actions */}
        <motion.div
          className="payment-page__actions"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.1 }}
        >
          <button className="payment-page__home-btn" onClick={handleGoHome} id="go-home-btn">
            <Home size={18} />
            {t('success.backToHome')}
          </button>
          <button className="payment-page__download-btn" onClick={() => window.print()} id="download-ticket-btn">
            <Download size={18} />
            {t('success.downloadTicket')}
          </button>
        </motion.div>
      </div>
    </div>
  );
};

export default PaymentSuccessPage;
