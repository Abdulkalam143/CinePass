/**
 * ConfirmationPage — Review booking before payment
 */
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Ticket, Clock, MapPin, CreditCard, ShieldCheck } from 'lucide-react';
import { useBooking } from '../context/BookingContext';
import { formatPrice, getSeatPrice } from '../utils/seatUtils';
import './ConfirmationPage.css';

const ConfirmationPage = () => {
  const navigate = useNavigate();
  const {
    selectedMovie, selectedShowtime, selectedSeats,
    totalPrice, confirmBooking,
  } = useBooking();

  // Redirect if no booking data
  if (!selectedMovie || selectedSeats.length === 0) {
    return (
      <div className="confirm-page__empty container">
        <h2>No booking in progress</h2>
        <p>Please select a movie and seats first.</p>
        <button onClick={() => navigate('/')}>Browse Movies</button>
      </div>
    );
  }

  const convenienceFee = selectedSeats.length * 30;
  const grandTotal = totalPrice + convenienceFee;

  const handleConfirm = () => {
    const booking = confirmBooking();
    if (booking) {
      navigate('/payment-success');
    }
  };

  return (
    <motion.div
      className="confirm-page"
      id="confirmation-page"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <div className="confirm-page__container container">
        <button className="confirm-page__back" onClick={() => navigate(-1)} id="confirm-back-btn">
          <ArrowLeft size={20} />
          Back to Seats
        </button>

        <h1 className="confirm-page__heading">
          <ShieldCheck size={24} />
          Confirm Your Booking
        </h1>

        <div className="confirm-page__card">
          {/* Movie Info */}
          <div className="confirm-page__movie">
            <img
              src={selectedMovie.image}
              alt={selectedMovie.title}
              className="confirm-page__poster"
            />
            <div className="confirm-page__movie-info">
              <h2 className="confirm-page__movie-title">{selectedMovie.title}</h2>
              <div className="confirm-page__detail">
                <Clock size={16} />
                <span>{selectedShowtime}</span>
              </div>
              <div className="confirm-page__detail">
                <MapPin size={16} />
                <span>{selectedSeats.length} Seat{selectedSeats.length > 1 ? 's' : ''}: {selectedSeats.sort().join(', ')}</span>
              </div>
              <div className="confirm-page__detail">
                <Ticket size={16} />
                <span>{selectedMovie.duration || '2h 0m'}</span>
              </div>
            </div>
          </div>

          {/* Price breakdown */}
          <div className="confirm-page__pricing">
            <h3>Price Breakdown</h3>
            {selectedSeats.map((seat) => (
              <div key={seat} className="confirm-page__price-line">
                <span>Seat {seat}</span>
                <span>{formatPrice(getSeatPrice(seat.charAt(0)))}</span>
              </div>
            ))}
            <div className="confirm-page__price-line confirm-page__price-line--fee">
              <span>Convenience Fee ({selectedSeats.length}x ₹30)</span>
              <span>{formatPrice(convenienceFee)}</span>
            </div>
            <div className="confirm-page__divider" />
            <div className="confirm-page__price-line confirm-page__price-line--total">
              <span>Grand Total</span>
              <span>{formatPrice(grandTotal)}</span>
            </div>
          </div>

          {/* Actions */}
          <div className="confirm-page__actions">
            <button
              className="confirm-page__confirm-btn"
              onClick={handleConfirm}
              id="confirm-and-pay-btn"
            >
              <CreditCard size={20} />
              Confirm & Pay — {formatPrice(grandTotal)}
            </button>
            <button
              className="confirm-page__cancel-btn"
              onClick={() => navigate(-1)}
            >
              Go Back
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ConfirmationPage;
