/**
 * BookingSummary — Sidebar showing selected seats and price breakdown
 */
import { useBooking } from '../context/BookingContext';
import { getSeatPrice, formatPrice } from '../utils/seatUtils';
import { Ticket, MapPin, Clock, CreditCard } from 'lucide-react';
import './BookingSummary.css';

const BookingSummary = ({ onProceed }) => {
  const { selectedMovie, selectedShowtime, selectedSeats, totalPrice } = useBooking();

  if (!selectedMovie) return null;

  // Group seats by tier for breakdown
  const seatBreakdown = selectedSeats.reduce((acc, seatId) => {
    const row = seatId.charAt(0);
    const price = getSeatPrice(row);
    const key = `₹${price}`;
    if (!acc[key]) acc[key] = { count: 0, price, seats: [] };
    acc[key].count++;
    acc[key].seats.push(seatId);
    return acc;
  }, {});

  return (
    <div className="booking-summary" id="booking-summary">
      <h3 className="booking-summary__title">
        <Ticket size={18} />
        Booking Summary
      </h3>

      {/* Movie info */}
      <div className="booking-summary__movie">
        <img
          src={selectedMovie.image}
          alt={selectedMovie.title}
          className="booking-summary__poster"
        />
        <div className="booking-summary__movie-info">
          <h4 className="booking-summary__movie-title">{selectedMovie.title}</h4>
          {selectedShowtime && (
            <p className="booking-summary__showtime">
              <Clock size={14} />
              {selectedShowtime}
            </p>
          )}
        </div>
      </div>

      {/* Selected seats */}
      {selectedSeats.length > 0 ? (
        <>
          <div className="booking-summary__seats">
            <div className="booking-summary__seats-header">
              <MapPin size={14} />
              <span>Selected Seats ({selectedSeats.length})</span>
            </div>
            <div className="booking-summary__seat-tags">
              {selectedSeats.sort().map((seat) => (
                <span key={seat} className="booking-summary__seat-tag">
                  {seat}
                </span>
              ))}
            </div>
          </div>

          {/* Price breakdown */}
          <div className="booking-summary__breakdown">
            {Object.entries(seatBreakdown).map(([priceLabel, data]) => (
              <div key={priceLabel} className="booking-summary__line">
                <span>{data.count}x Seat @ {priceLabel}</span>
                <span>{formatPrice(data.count * data.price)}</span>
              </div>
            ))}
            <div className="booking-summary__line booking-summary__line--fee">
              <span>Convenience Fee</span>
              <span>{formatPrice(selectedSeats.length * 30)}</span>
            </div>
            <div className="booking-summary__divider" />
            <div className="booking-summary__line booking-summary__line--total">
              <span>Total Amount</span>
              <span>{formatPrice(totalPrice + selectedSeats.length * 30)}</span>
            </div>
          </div>

          {/* Proceed button */}
          <button
            className="booking-summary__btn"
            onClick={onProceed}
            disabled={selectedSeats.length === 0}
            id="proceed-to-payment-btn"
          >
            <CreditCard size={18} />
            Proceed to Payment — {formatPrice(totalPrice + selectedSeats.length * 30)}
          </button>
        </>
      ) : (
        <p className="booking-summary__empty">
          Select seats from the layout to see pricing
        </p>
      )}
    </div>
  );
};

export default BookingSummary;
