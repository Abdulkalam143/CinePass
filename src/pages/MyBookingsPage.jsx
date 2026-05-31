/**
 * MyBookingsPage — Displays all past booking history
 * Reads from localStorage via BookingContext
 */
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Ticket, Clock, MapPin, Calendar,
  Film, ArrowLeft, CheckCircle2, Hash,
  IndianRupee, Armchair,
} from 'lucide-react';
import { useBooking } from '../context/BookingContext';
import { formatPrice } from '../utils/seatUtils';
import './MyBookingsPage.css';

const MyBookingsPage = () => {
  const navigate = useNavigate();
  const { bookingHistory } = useBooking();

  const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  };

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('en-IN', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    });
  };

  return (
    <motion.div
      className="mybookings-page"
      id="my-bookings-page"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <div className="mybookings-page__container container">
        {/* Header */}
        <div className="mybookings-page__header">
          <button
            className="mybookings-page__back"
            onClick={() => navigate('/')}
            id="mybookings-back-btn"
          >
            <ArrowLeft size={20} />
            Back
          </button>
          <h1 className="mybookings-page__title">
            <Ticket size={28} />
            My Bookings
          </h1>
          <p className="mybookings-page__subtitle">
            {bookingHistory.length > 0
              ? `You have ${bookingHistory.length} booking${bookingHistory.length > 1 ? 's' : ''}`
              : 'Your booking history will appear here'}
          </p>
        </div>

        {/* Empty State */}
        {bookingHistory.length === 0 ? (
          <motion.div
            className="mybookings-page__empty"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
          >
            <div className="mybookings-page__empty-icon">
              <Film size={64} />
            </div>
            <h2>No bookings yet</h2>
            <p>Book your first movie ticket and it'll show up here!</p>
            <button
              className="mybookings-page__browse-btn"
              onClick={() => navigate('/')}
            >
              <Film size={18} />
              Browse Movies
            </button>
          </motion.div>
        ) : (
          /* Bookings Grid */
          <div className="mybookings-page__grid">
            {bookingHistory.map((booking, index) => (
              <motion.div
                key={booking.bookingId || index}
                className="booking-card"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.08, duration: 0.4 }}
              >
                {/* Status Badge */}
                <div className="booking-card__status">
                  <CheckCircle2 size={14} />
                  Confirmed
                </div>

                {/* Movie Info */}
                <div className="booking-card__movie">
                  {booking.movie?.image && (
                    <img
                      src={booking.movie.image}
                      alt={booking.movie.title}
                      className="booking-card__poster"
                    />
                  )}
                  <div className="booking-card__info">
                    <h3 className="booking-card__title">
                      {booking.movie?.title || 'Movie'}
                    </h3>
                    <div className="booking-card__meta">
                      <span className="booking-card__meta-item">
                        <Hash size={12} />
                        {booking.bookingId}
                      </span>
                      <span className="booking-card__meta-item">
                        <Calendar size={12} />
                        {formatDate(booking.timestamp)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Divider */}
                <div className="booking-card__divider" />

                {/* Details Grid */}
                <div className="booking-card__details">
                  <div className="booking-card__detail">
                    <Clock size={14} />
                    <div>
                      <span className="booking-card__detail-label">Showtime</span>
                      <span className="booking-card__detail-value">{booking.showtime}</span>
                    </div>
                  </div>
                  <div className="booking-card__detail">
                    <Armchair size={14} />
                    <div>
                      <span className="booking-card__detail-label">
                        Seats ({booking.seatCount || booking.seats?.length || 0})
                      </span>
                      <span className="booking-card__detail-value">
                        {booking.seats?.sort().join(', ') || 'N/A'}
                      </span>
                    </div>
                  </div>
                  <div className="booking-card__detail">
                    <MapPin size={14} />
                    <div>
                      <span className="booking-card__detail-label">Booked At</span>
                      <span className="booking-card__detail-value">
                        {formatTime(booking.timestamp)}
                      </span>
                    </div>
                  </div>
                  <div className="booking-card__detail">
                    <IndianRupee size={14} />
                    <div>
                      <span className="booking-card__detail-label">Amount Paid</span>
                      <span className="booking-card__detail-value booking-card__detail-value--price">
                        {formatPrice(booking.totalPrice)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Ticket Tear Effect */}
                <div className="booking-card__tear" />
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default MyBookingsPage;
