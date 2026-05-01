/**
 * SeatMap — Interactive theater seat grid
 * Handles seat selection/deselection with visual feedback
 */
import { motion } from 'framer-motion';
import { useBooking } from '../context/BookingContext';
import './SeatMap.css';

const SeatMap = ({ layout }) => {
  const { selectedSeats, toggleSeat } = useBooking();

  /**
   * Get CSS class for a seat based on its state
   */
  const getSeatClass = (seat) => {
    if (seat.status === 'booked') return 'seat--booked';
    if (selectedSeats.includes(seat.id)) return 'seat--selected';
    return 'seat--available';
  };

  return (
    <div className="seat-map" id="seat-map">
      {/* Screen indicator */}
      <div className="seat-map__screen-wrapper">
        <div className="seat-map__screen">
          <span>SCREEN</span>
        </div>
        <div className="seat-map__screen-glow" />
      </div>

      {/* Seat grid */}
      <div className="seat-map__grid">
        {layout.map((row, rowIndex) => (
          <div key={rowIndex} className="seat-map__row">
            {/* Row label */}
            <span className="seat-map__row-label">{row[0]?.row}</span>

            {/* Seats */}
            <div className="seat-map__seats">
              {row.map((seat) => (
                <motion.button
                  key={seat.id}
                  className={`seat ${getSeatClass(seat)} ${seat.tier?.toLowerCase()}`}
                  onClick={() => seat.status !== 'booked' && toggleSeat(seat.id)}
                  disabled={seat.status === 'booked'}
                  whileHover={seat.status !== 'booked' ? { scale: 1.2 } : {}}
                  whileTap={seat.status !== 'booked' ? { scale: 0.9 } : {}}
                  title={`${seat.id} - ₹${seat.price} (${seat.tier})`}
                  id={`seat-${seat.id}`}
                  aria-label={`Seat ${seat.id}, ${seat.status === 'booked' ? 'Booked' : selectedSeats.includes(seat.id) ? 'Selected' : 'Available'}, ₹${seat.price}`}
                  style={{
                    marginRight: seat.isAisleRight ? '16px' : '0',
                  }}
                >
                  <span className="seat__number">{seat.col}</span>
                </motion.button>
              ))}
            </div>

            {/* Row label (right) */}
            <span className="seat-map__row-label">{row[0]?.row}</span>
          </div>
        ))}
      </div>

      {/* Tier labels */}
      <div className="seat-map__tiers">
        <div className="seat-map__tier premium">
          <span className="seat-map__tier-line" />
          <span className="seat-map__tier-label">Premium — ₹350</span>
        </div>
        <div className="seat-map__tier standard">
          <span className="seat-map__tier-line" />
          <span className="seat-map__tier-label">Standard — ₹250</span>
        </div>
        <div className="seat-map__tier budget">
          <span className="seat-map__tier-line" />
          <span className="seat-map__tier-label">Budget — ₹150</span>
        </div>
      </div>
    </div>
  );
};

export default SeatMap;
