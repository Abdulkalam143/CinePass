/**
 * SeatLegend — Color legend explaining seat states
 */
import './SeatLegend.css';

const SeatLegend = () => {
  const items = [
    { color: 'var(--seat-available)', label: 'Available' },
    { color: 'var(--seat-selected)', label: 'Selected' },
    { color: 'var(--seat-booked-dim)', label: 'Booked' },
  ];

  return (
    <div className="seat-legend" id="seat-legend">
      {items.map((item) => (
        <div key={item.label} className="seat-legend__item">
          <span
            className="seat-legend__color"
            style={{ background: item.color }}
          />
          <span className="seat-legend__label">{item.label}</span>
        </div>
      ))}
    </div>
  );
};

export default SeatLegend;
