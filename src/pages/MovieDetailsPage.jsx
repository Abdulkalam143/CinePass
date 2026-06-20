/**
 * MovieDetailsPage — Full movie info with trailer, theater/screen selection, and booking CTA
 * Shows which nearby theaters are screening this movie with screen numbers and showtimes
 */
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Star, Clock, Play, ArrowLeft, Armchair } from 'lucide-react';
import { fetchMovieDetails, POSTER_PLACEHOLDER, BACKDROP_PLACEHOLDER } from '../utils/api';
import { useBooking } from '../context/BookingContext';
import { useTranslation } from '../context/LanguageContext';
import TheaterShowtimes from '../components/TheaterShowtimes';
import staticMovies from '../data/movies.json';
import './MovieDetailsPage.css';

const MovieDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { selectMovie, selectShowtime, selectedShowtime } = useBooking();
  const { t } = useTranslation();

  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showTrailer, setShowTrailer] = useState(false);
  // Stores the full theater+screen+time selection
  const [theaterSelection, setTheaterSelection] = useState(null);

  useEffect(() => {
    const loadMovie = async () => {
      setLoading(true);
      try {
        const data = await fetchMovieDetails(id);
        setMovie(data);
        selectMovie(data);
      } catch {
        const staticMovie = staticMovies.find((m) => m.id === Number(id));
        if (staticMovie) {
          setMovie(staticMovie);
          selectMovie(staticMovie);
        }
      }
      setLoading(false);
    };
    loadMovie();
    // Reset theater selection when movie changes
    setTheaterSelection(null);
  }, [id]);

  /**
   * Handle theater showtime selection from TheaterShowtimes component
   */
  const handleTheaterShowtimeSelect = (selection) => {
    setTheaterSelection(selection);
    // Set the display showtime in context for downstream pages
    selectShowtime(selection.fullDisplay);
  };

  /**
   * Handle fallback showtime selection (when theaters aren't loaded)
   */
  const handleFallbackShowtimeSelect = (time) => {
    setTheaterSelection(null);
    selectShowtime(time);
  };

  const handleBookNow = () => {
    if (!selectedShowtime) return;
    navigate(`/booking/${id}`);
  };

  if (loading) {
    return (
      <div className="movie-details__loading">
        <div className="skeleton" style={{ width: '100%', height: '60vh' }} />
      </div>
    );
  }

  if (!movie) {
    return (
      <div className="movie-details__not-found container">
        <h2>{t('details.movieNotFound')}</h2>
        <button onClick={() => navigate('/')}>{t('details.goHome')}</button>
      </div>
    );
  }

  return (
    <motion.div
      className="movie-details"
      id="movie-details-page"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
    >
      {/* Hero backdrop */}
      <div
        className="movie-details__hero"
        style={{
          backgroundImage: `url(${movie.backdrop || movie.image || BACKDROP_PLACEHOLDER})`,
        }}
      >
        <div className="movie-details__hero-overlay" />

        <button className="movie-details__back" onClick={() => navigate(-1)} id="back-btn">
          <ArrowLeft size={20} />
          {t('details.back')}
        </button>

        <div className="movie-details__hero-content container">
          <div className="movie-details__poster-wrapper">
            <img
              src={movie.image || POSTER_PLACEHOLDER}
              alt={movie.title}
              className="movie-details__poster"
              onError={(e) => { e.target.onerror = null; e.target.src = POSTER_PLACEHOLDER; }}
            />
          </div>

          <div className="movie-details__info">
            <h1 className="movie-details__title">{movie.title}</h1>

            <div className="movie-details__meta">
              <span className="movie-details__rating">
                <Star size={16} fill="var(--gold)" stroke="var(--gold)" />
                {movie.rating}/10
              </span>
              <span className="movie-details__duration">
                <Clock size={16} />
                {movie.duration}
              </span>
              <div className="movie-details__genres">
                {movie.genre?.map((g) => (
                  <span key={g} className="movie-details__genre-tag">{g}</span>
                ))}
              </div>
            </div>

            <p className="movie-details__desc">{movie.description}</p>

            {movie.trailerUrl && (
              <button
                className="movie-details__trailer-btn"
                onClick={() => setShowTrailer(!showTrailer)}
                id="watch-trailer-btn"
              >
                <Play size={18} fill="white" />
                {showTrailer ? t('details.hideTrailer') : t('details.watchTrailer')}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Trailer embed */}
      {showTrailer && movie.trailerUrl && (
        <motion.div
          className="movie-details__trailer container"
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          transition={{ duration: 0.3 }}
        >
          <div className="movie-details__trailer-wrapper">
            <iframe
              src={movie.trailerUrl}
              title={`${movie.title} Trailer`}
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="movie-details__trailer-iframe"
            />
          </div>
        </motion.div>
      )}

      {/* Theater & Showtime Selection — GPS-based */}
      <section className="movie-details__showtimes container">
        <TheaterShowtimes
          movieId={Number(id)}
          movieTitle={movie.title}
          onSelectShowtime={handleTheaterShowtimeSelect}
        />

        {/* Selected theater summary */}
        {theaterSelection && (
          <motion.div
            className="movie-details__selection-summary"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Armchair size={16} />
            <span>{theaterSelection.fullDisplay}</span>
          </motion.div>
        )}

        {/* Book button */}
        <motion.button
          className="movie-details__book-btn"
          onClick={handleBookNow}
          disabled={!selectedShowtime}
          whileTap={{ scale: 0.97 }}
          id="select-seats-btn"
        >
          {selectedShowtime
            ? `${t('details.selectSeats')} →`
            : t('details.chooseTheater')}
        </motion.button>
      </section>
    </motion.div>
  );
};

export default MovieDetailsPage;
