/**
 * MatchCard — Display summary of a cricket match
 */
import { motion } from 'framer-motion';
import { MapPin, Calendar, Clock, Trophy, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import './MatchCard.css';

const MatchCard = ({ match, index }) => {
  return (
    <motion.div
      className="match-card"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
    >
      <div className="match-card__image-container">
        <img src={match.image} alt={match.title} className="match-card__image" />
        <div className="match-card__badge">
          <Trophy size={12} />
          {match.category}
        </div>
      </div>

      <div className="match-card__content">
        <div className="match-card__header">
          <h3 className="match-card__title">{match.title}</h3>
          <span className="match-card__rating">⭐ {match.rating}</span>
        </div>

        <div className="match-card__info">
          <div className="match-card__info-item">
            <MapPin size={14} />
            <span>{match.venue}</span>
          </div>
          <div className="match-card__info-row">
            <div className="match-card__info-item">
              <Calendar size={14} />
              <span>{match.date}</span>
            </div>
            <div className="match-card__info-item">
              <Clock size={14} />
              <span>{match.time}</span>
            </div>
          </div>
        </div>

        <div className="match-card__footer">
          <div className="match-card__price">
            <span className="match-card__price-label">Tickets from</span>
            <span className="match-card__price-value">₹{match.price}</span>
          </div>
          <Link to={`/booking/${match.id}`} className="match-card__book-btn">
            Book Now
            <ChevronRight size={16} />
          </Link>
        </div>
      </div>
    </motion.div>
  );
};

export default MatchCard;
