/**
 * SeatLegend — Color legend explaining seat states
 */
import { useTranslation } from '../context/LanguageContext';
import './SeatLegend.css';

const SeatLegend = () => {
  const { t } = useTranslation();
  const items = [
    { color: 'var(--seat-available)', label: t('legend.available') },
    { color: 'var(--seat-selected)', label: t('legend.selected') },
    { color: 'var(--seat-booked-dim)', label: t('legend.booked') },
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
