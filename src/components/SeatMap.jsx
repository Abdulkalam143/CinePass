/**
 * SeatMap — Interactive theater seat grid
 * Rows grouped by pricing tier with clear section headers and per-row pricing
 */
import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { useBooking } from '../context/BookingContext';
import { getSeatTier, getSeatPrice } from '../utils/seatUtils';
import './SeatMap.css';

/**
 * Group rows into pricing tiers
 */
const groupRowsByTier = (layout) => {
  const tiers = [];
  let currentTier = null;

  layout.forEach((row, rowIndex) => {
    const tierName = row[0]?.tier || 'Standard';
    const price = row[0]?.price || 0;

    if (!currentTier || currentTier.name !== tierName) {
      currentTier = { name: tierName, price, rows: [], startIndex: rowIndex };
      tiers.push(currentTier);
    }
    currentTier.rows.push(row);
  });

  return tiers;
};

/**
 * Get tier CSS class
 */
const getTierClass = (tierName) => {
  switch (tierName?.toLowerCase()) {
    case 'premium': return 'tier--premium';
    case 'basic': return 'tier--basic';
    default: return 'tier--standard';
  }
};

/**
 * Get tier icon/emoji
 */
const getTierIcon = (tierName) => {
  switch (tierName?.toLowerCase()) {
    case 'premium': return '👑';
    case 'basic': return '🎬';
    default: return '🪑';
  }
};

const SeatMap = ({ layout, isStadium }) => {
  const { selectedSeats, toggleSeat } = useBooking();

  const getSeatClass = (seat, uniqueId) => {
    if (seat.status === 'booked') return 'seat--booked';
    if (selectedSeats.includes(uniqueId)) return 'seat--selected';
    return 'seat--available';
  };

  // Group rows by tier
  const tiers = useMemo(() => groupRowsByTier(layout), [layout]);

  // Stadium constants
  const BASE_RADIUS = 240;
  const ROW_SPACING = 20;
  const SEAT_ANGLE_SPACING = 1.8;

  return (
    <div className={`seat-map ${isStadium ? 'seat-map--stadium-pro' : ''}`} id="seat-map">
      {isStadium ? (
        <div className="stadium-view">
          {/* Ground */}
          <div className="stadium-pitch-center">
            <div className="cricket-ground">
              <div className="pitch-strip" />
              <div className="inner-circle" />
            </div>
            <div className="stadium-label">STADIUM GROUND</div>
          </div>

          {/* Real Concentric Seating */}
          <div className="stadium-geometry">
            {(() => {
              const allSeats = [];
              const standsConfig = [
                { name: 'NORTH', prefix: 'N', offset: 0 },
                { name: 'NORTH EAST', prefix: 'NE', offset: 45 },
                { name: 'EAST', prefix: 'E', offset: 90 },
                { name: 'SOUTH EAST', prefix: 'SE', offset: 135 },
                { name: 'SOUTH', prefix: 'S', offset: 180 },
                { name: 'SOUTH WEST', prefix: 'SW', offset: 225 },
                { name: 'WEST', prefix: 'W', offset: 270 },
                { name: 'NORTH WEST', prefix: 'NW', offset: 315 }
              ];

              layout.forEach((row, rIdx) => {
                const radius = BASE_RADIUS + (rIdx * ROW_SPACING);
                const rowWidth = row.length * SEAT_ANGLE_SPACING;
                const startAngle = -rowWidth / 2;

                row.forEach((seat, sIdx) => {
                  const angle = startAngle + (sIdx * SEAT_ANGLE_SPACING);
                  
                  standsConfig.forEach(stand => {
                    const uniqueId = `${stand.prefix}-${seat.id}`;
                    allSeats.push({
                      ...seat,
                      uniqueId,
                      radius,
                      angle: angle + stand.offset
                    });
                  });
                });
              });

              return allSeats.map(s => (
                <motion.button
                  key={s.uniqueId}
                  className={`seat ${getSeatClass(s, s.uniqueId)} ${s.tier?.toLowerCase()}`}
                  onClick={() => s.status !== 'booked' && toggleSeat(s.uniqueId)}
                  disabled={s.status === 'booked'}
                  whileHover={s.status !== 'booked' ? { scale: 1.5, zIndex: 100 } : {}}
                  title={`${s.uniqueId} | ₹${s.price}`}
                  style={{
                    position: 'absolute',
                    transform: `rotate(${s.angle}deg) translateY(-${s.radius}px)`,
                    transformOrigin: 'center center'
                  }}
                />
              ));
            })()}
            
            {/* Stand Labels */}
            {[
              { n: 'NORTH', a: 0 }, { n: 'N. EAST', a: 45 }, { n: 'EAST', a: 90 }, { n: 'S. EAST', a: 135 },
              { n: 'SOUTH', a: 180 }, { n: 'S. WEST', a: 225 }, { n: 'WEST', a: 270 }, { n: 'N. WEST', a: 315 }
            ].map((st) => {
              const radius = BASE_RADIUS + (layout.length * ROW_SPACING) + 40;
              const x = Math.sin(st.a * (Math.PI / 180)) * radius;
              const y = -Math.cos(st.a * (Math.PI / 180)) * radius;
              
              return (
                <div 
                  key={st.n}
                  className="geo-stand-label"
                  style={{ 
                    position: 'absolute',
                    left: `calc(50% + ${x}px)`,
                    top: `calc(50% + ${y}px)`,
                    transform: 'translate(-50%, -50%)'
                  }}
                >
                  {st.n}
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        <>
          {/* ── Screen ── */}
          <div className="seat-map__screen-wrapper">
            <div className="seat-map__screen">
              <span>SCREEN</span>
            </div>
            <div className="seat-map__screen-glow" />
          </div>

          {/* ── Seat Grid grouped by Tiers ── */}
          <div className="seat-map__grid">
            {tiers.map((tier) => (
              <div key={tier.name} className={`seat-map__tier-section ${getTierClass(tier.name)}`}>
                {/* Tier Header */}
                <div className="seat-map__tier-header">
                  <span className="seat-map__tier-divider" />
                  <span className="seat-map__tier-badge">
                    <span className="seat-map__tier-icon">{getTierIcon(tier.name)}</span>
                    <span className="seat-map__tier-name">{tier.name}</span>
                    <span className="seat-map__tier-price">₹{tier.price.toLocaleString('en-IN')}</span>
                  </span>
                  <span className="seat-map__tier-divider" />
                </div>

                {/* Rows in this tier */}
                {tier.rows.map((row, rowIndex) => (
                  <div key={row[0]?.row || rowIndex} className="seat-map__row">
                    <span className="seat-map__row-label">{row[0]?.row}</span>
                    <div className="seat-map__seats">
                      {row.map((seat) => (
                        <motion.button
                          key={seat.id}
                          className={`seat ${getSeatClass(seat, seat.id)} ${seat.tier?.toLowerCase()}`}
                          onClick={() => seat.status !== 'booked' && toggleSeat(seat.id)}
                          disabled={seat.status === 'booked'}
                          whileHover={seat.status !== 'booked' ? { scale: 1.2 } : {}}
                          whileTap={seat.status !== 'booked' ? { scale: 0.9 } : {}}
                          title={`${seat.id} - ₹${seat.price} (${seat.tier})`}
                          style={{ marginRight: seat.isAisleRight ? '16px' : '0' }}
                        >
                          <span className="seat__number">{seat.col}</span>
                        </motion.button>
                      ))}
                    </div>
                    <span className="seat-map__row-label">{row[0]?.row}</span>
                    <span className="seat-map__row-price">₹{row[0]?.price?.toLocaleString('en-IN')}</span>
                  </div>
                ))}
              </div>
            ))}
          </div>

          {/* ── Seat Legend (bottom) ── */}
          <div className="seat-map__legend">
            <div className="seat-map__legend-item">
              <span className="seat-map__legend-seat seat--available" />
              <span>Available</span>
            </div>
            <div className="seat-map__legend-item">
              <span className="seat-map__legend-seat seat--selected" />
              <span>Selected</span>
            </div>
            <div className="seat-map__legend-item">
              <span className="seat-map__legend-seat seat--booked" />
              <span>Sold</span>
            </div>
          </div>
        </>
      )}

      {/* Stadium tiers (only for stadium) */}
      {isStadium && (
        <div className="seat-map__tiers">
          <div className="seat-map__tier basic">
            <span className="seat-map__tier-line" />
            <span className="seat-map__tier-label">Basic — ₹500</span>
          </div>
          <div className="seat-map__tier standard">
            <span className="seat-map__tier-line" />
            <span className="seat-map__tier-label">Standard — ₹1,000</span>
          </div>
          <div className="seat-map__tier premium">
            <span className="seat-map__tier-line" />
            <span className="seat-map__tier-label">Premium — ₹2,000</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default SeatMap;
