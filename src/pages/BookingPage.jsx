/**
 * BookingPage — Seat selection with timer and booking summary
 */
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, AlertCircle } from 'lucide-react';
import SeatMap from '../components/SeatMap';
import SeatLegend from '../components/SeatLegend';
import Timer from '../components/Timer';
import BookingSummary from '../components/BookingSummary';
import { useBooking } from '../context/BookingContext';
import { generateSeatLayout } from '../utils/seatUtils';
import { fetchMovieDetails } from '../utils/api';
import staticMovies from '../data/movies.json';
import { useTranslation } from '../context/LanguageContext';
import cricketData from '../data/cricket.json';
import './BookingPage.css';

const BookingPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const {
    selectedMovie, selectedShowtime, seatLayout,
    setSeatLayout, timerExpired, selectMovie, selectShowtime, addToast,
  } = useBooking();
  const { t } = useTranslation();

  const [loading, setLoading] = useState(true);

  // Load movie/match if not already selected (direct URL access)
  useEffect(() => {
    const init = async () => {
      if (!selectedMovie || (selectedMovie.id !== id && selectedMovie.id !== Number(id))) {
        // Check if it's a cricket match
        if (id.startsWith('match_')) {
          const match = cricketData.find(m => m.id === id);
          if (match) {
            selectMovie(match);
            // Auto-select match time as showtime
            selectShowtime(`${match.date} | ${match.time}`);
          }
        } else {
          try {
            const data = await fetchMovieDetails(id);
            selectMovie(data);
          } catch {
            const staticMovie = staticMovies.find((m) => m.id === Number(id));
            if (staticMovie) selectMovie(staticMovie);
          }
        }
      }

      // Generate seat layout (Stadiums are usually larger)
      const isStadium = id.startsWith('match_');
      const layout = generateSeatLayout(isStadium ? 24 : 10, isStadium ? 15 : 12, 0.15);
      setSeatLayout(layout);
      setLoading(false);
    };
    init();
  }, [id, selectMovie, selectShowtime, setSeatLayout, selectedMovie]);

  // Redirect if no showtime selected
  useEffect(() => {
    if (!loading && !selectedShowtime) {
      addToast(t('booking.selectShowtime'), 'warning');
      navigate(`/movie/${id}`);
    }
  }, [loading, selectedShowtime, addToast, id, navigate, t]);

  const handleProceed = () => {
    navigate('/confirmation');
  };

  if (loading) {
    return (
      <div className="booking-page__loading container">
        <div className="skeleton" style={{ width: '100%', height: 400 }} />
      </div>
    );
  }

  return (
    <motion.div
      className="booking-page"
      id="booking-page"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
    >
      <div className="booking-page__container container">
        {/* Header */}
        <div className="booking-page__header">
          <button className="booking-page__back" onClick={() => navigate(-1)} id="booking-back-btn">
            <ArrowLeft size={20} />
            {t('booking.back')}
          </button>
          <div className="booking-page__header-info">
            <h1 className="booking-page__title">{selectedMovie?.title}</h1>
            <span className="booking-page__showtime">{selectedShowtime}</span>
          </div>
        </div>

        {/* Timer expired warning */}
        {timerExpired && (
          <motion.div
            className="booking-page__expired"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
          >
             <AlertCircle size={18} />
             <span>{t('booking.sessionExpired')}</span>
          </motion.div>
        )}

        {/* Main layout */}
        <div className="booking-page__layout">
          {/* Left — Seat selection */}
          <div className="booking-page__seats-section">
            <SeatLegend />
            <SeatMap layout={seatLayout} isStadium={id.startsWith('match_')} />
          </div>

          {/* Right — Summary & Timer */}
          <div className="booking-page__sidebar">
            <Timer />
            <BookingSummary onProceed={handleProceed} />
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default BookingPage;
