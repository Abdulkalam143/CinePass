/**
 * MovieCard — Displays a movie poster card with hover effects
 */
import { Link } from 'react-router-dom';
import { Star, Clock, Play } from 'lucide-react';
import { motion } from 'framer-motion';
import './MovieCard.css';

const MovieCard = ({ movie, index = 0 }) => {
  return (
    <motion.div
      className="movie-card"
      id={`movie-card-${movie.id}`}
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
    >
      <Link to={`/movie/${movie.id}`} className="movie-card__link">
        {/* Poster */}
        <div className="movie-card__poster">
          <img
            src={movie.image}
            alt={movie.title}
            className="movie-card__image"
            loading="lazy"
          />
          <div className="movie-card__overlay">
            <div className="movie-card__play-btn">
              <Play size={32} fill="white" />
            </div>
          </div>

          {/* Rating badge */}
          <div className="movie-card__rating">
            <Star size={12} fill="var(--gold)" stroke="var(--gold)" />
            <span>{movie.rating}</span>
          </div>
        </div>

        {/* Info */}
        <div className="movie-card__info">
          <h3 className="movie-card__title">{movie.title}</h3>
          <div className="movie-card__meta">
            <div className="movie-card__genres">
              {movie.genre?.slice(0, 2).map((g) => (
                <span key={g} className="movie-card__genre-tag">{g}</span>
              ))}
            </div>
            {movie.duration && (
              <span className="movie-card__duration">
                <Clock size={12} />
                {movie.duration}
              </span>
            )}
          </div>

          <button className="movie-card__book-btn">Book Now</button>
        </div>
      </Link>
    </motion.div>
  );
};

export default MovieCard;
