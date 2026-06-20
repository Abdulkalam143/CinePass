/**
 * MovieCard — Displays a movie poster card with hover effects
 * Shows real-time metadata: release date, language, and screening status
 */
import { Link } from 'react-router-dom';
import { Star, Clock, Play, Calendar } from 'lucide-react';
import { POSTER_PLACEHOLDER } from '../utils/api';
import { useTranslation } from '../context/LanguageContext';
import './MovieCard.css';

/**
 * Format a release date string into a short human-readable form
 */
const formatReleaseDate = (dateStr, lang = 'en') => {
  if (!dateStr) return '';
  try {
    const date = new Date(dateStr + 'T00:00:00');
    const localeMap = {
      en: 'en-IN',
      hi: 'hi-IN',
      te: 'te-IN',
      ta: 'ta-IN',
      kn: 'kn-IN',
      ml: 'ml-IN',
      bn: 'bn-IN',
      mr: 'mr-IN',
      gu: 'gu-IN',
      pa: 'pa-IN',
      or: 'or-IN',
      as: 'as-IN',
      ur: 'ur-IN'
    };
    const locale = localeMap[lang] || 'en-IN';
    return date.toLocaleDateString(locale, { day: 'numeric', month: 'short', year: 'numeric' });
  } catch {
    return dateStr;
  }
};

/**
 * Check if a movie is currently in theaters (released within the last 45 days)
 */
const isCurrentlyScreening = (dateStr) => {
  if (!dateStr) return false;
  const releaseDate = new Date(dateStr + 'T00:00:00');
  const now = new Date();
  const diffDays = (now - releaseDate) / (1000 * 60 * 60 * 24);
  return diffDays >= -7 && diffDays <= 45; // Includes 7-day advance + 45-day window
};

/**
 * Check if a movie is newly released (within last 7 days)
 */
const isNewRelease = (dateStr) => {
  if (!dateStr) return false;
  const releaseDate = new Date(dateStr + 'T00:00:00');
  const now = new Date();
  const diffDays = (now - releaseDate) / (1000 * 60 * 60 * 24);
  return diffDays >= 0 && diffDays <= 7;
};

const MovieCard = ({ movie, index = 0 }) => {
  const { t, language } = useTranslation();
  const screening = isCurrentlyScreening(movie.releaseDate);
  const newRelease = isNewRelease(movie.releaseDate);

  return (
    <div
      className="movie-card"
      id={`movie-card-${movie.id}`}
      style={{ animationDelay: `${index * 0.05}s` }}
    >
      <Link to={`/movie/${movie.id}`} className="movie-card__link">
        {/* Poster */}
        <div className="movie-card__poster">
          <img
            src={movie.image || POSTER_PLACEHOLDER}
            alt={movie.title}
            className="movie-card__image"
            loading="lazy"
            onError={(e) => { e.target.onerror = null; e.target.src = POSTER_PLACEHOLDER; }}
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

          {/* Language badge */}
          {movie.languageLabel && (
            <div className={`movie-card__lang-badge ${movie.isRegional ? 'movie-card__lang-badge--regional' : ''}`}>
              {movie.languageLabel}
            </div>
          )}

          {/* Status badges — all movies are verified theater-only */}
          {newRelease && (
            <div className="movie-card__status-badge movie-card__status-badge--new">
              {t('card.newRelease')}
            </div>
          )}
          {!newRelease && (
            <div className="movie-card__status-badge movie-card__status-badge--screening">
              {t('card.inTheaters')}
            </div>
          )}

          {/* Certification badge */}
          {movie.certification && (
            <div className="movie-card__cert-badge">
              {movie.certification}
            </div>
          )}
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

          {/* Release date */}
          {movie.releaseDate && (
            <div className="movie-card__release-date">
              <Calendar size={11} />
              <span>{formatReleaseDate(movie.releaseDate, language)}</span>
            </div>
          )}

          <button className="movie-card__book-btn">{t('card.bookNow')}</button>
        </div>
      </Link>
    </div>
  );
};

export default MovieCard;
