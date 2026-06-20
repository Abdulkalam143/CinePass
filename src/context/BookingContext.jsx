/* eslint-disable react-refresh/only-export-components */
/**
 * BookingContext — Global state management for the booking flow
 * Manages selected movie, seats, showtime, timer, and booking history
 */
import { createContext, useContext, useState, useCallback } from 'react';
import { saveBooking, getBookings } from '../utils/storage';
import { calculateTotal } from '../utils/seatUtils';

const BookingContext = createContext(null);

export const useBooking = () => {
  const context = useContext(BookingContext);
  if (!context) {
    throw new Error('useBooking must be used within a BookingProvider');
  }
  return context;
};

export const BookingProvider = ({ children }) => {
  // Currently selected movie
  const [selectedMovie, setSelectedMovie] = useState(null);
  // Selected showtime string
  const [selectedShowtime, setSelectedShowtime] = useState('');
  // Array of selected seat IDs (e.g., ['A1', 'A2'])
  const [selectedSeats, setSelectedSeats] = useState([]);
  // Seat layout (2D array generated for a specific showtime)
  const [seatLayout, setSeatLayout] = useState([]);
  // Total price
  const [totalPrice, setTotalPrice] = useState(0);
  // Timer state
  const [timerActive, setTimerActive] = useState(false);
  const [timerExpired, setTimerExpired] = useState(false);
  // Toast messages
  const [toasts, setToasts] = useState([]);
  // Last confirmed booking
  const [lastBooking, setLastBooking] = useState(null);
  // Booking history
  const [bookingHistory, setBookingHistory] = useState(getBookings());

  /**
   * Toast notification system
   */
  const addToast = useCallback((message, type = 'info') => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);
    // Auto-remove after 4 seconds
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  }, []);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  /**
   * Select a movie for booking
   */
  const selectMovie = useCallback((movie) => {
    setSelectedMovie(movie);
    setSelectedShowtime('');
    setSelectedSeats([]);
    setTotalPrice(0);
    setTimerActive(false);
    setTimerExpired(false);
  }, []);

  /**
   * Select a showtime
   */
  const selectShowtime = useCallback((showtime) => {
    setSelectedShowtime(showtime);
    setSelectedSeats([]);
    setTotalPrice(0);
  }, []);

  /**
   * Toggle seat selection (select/deselect)
   */
  const toggleSeat = useCallback((seatId) => {
    setSelectedSeats((prev) => {
      const isSelected = prev.includes(seatId);
      const updated = isSelected
        ? prev.filter((id) => id !== seatId)
        : [...prev, seatId];

      // Recalculate total
      const newTotal = calculateTotal(updated, seatLayout);
      setTotalPrice(newTotal);

      // Start timer when first seat is selected
      if (updated.length > 0 && !isSelected) {
        setTimerActive(true);
        setTimerExpired(false);
      }

      // Stop timer if no seats selected
      if (updated.length === 0) {
        setTimerActive(false);
      }

      return updated;
    });
  }, [seatLayout]);

  /**
   * Clear all selected seats (used on timer expiry)
   */
  const clearSeats = useCallback(() => {
    setSelectedSeats([]);
    setTotalPrice(0);
    setTimerActive(false);
  }, []);

  /**
   * Handle timer expiry
   */
  const handleTimerExpiry = useCallback(() => {
    clearSeats();
    setTimerExpired(true);
    addToast('⏰ Session expired! Your selected seats have been released.', 'warning');
  }, [clearSeats, addToast]);

  /**
   * Confirm booking — save to localStorage
   */
  const confirmBooking = useCallback(() => {
    if (!selectedMovie || selectedSeats.length === 0) return null;

    const booking = saveBooking({
      movie: {
        id: selectedMovie.id,
        title: selectedMovie.title,
        image: selectedMovie.image,
      },
      showtime: selectedShowtime,
      seats: selectedSeats,
      totalPrice,
      seatCount: selectedSeats.length,
    });

    if (booking) {
      setLastBooking(booking);
      setBookingHistory(getBookings());
      addToast('🎬 Booking confirmed! Enjoy the movie!', 'success');
    }

    return booking;
  }, [selectedMovie, selectedShowtime, selectedSeats, totalPrice, addToast]);

  /**
   * Full reset after booking
   */
  const resetBooking = useCallback(() => {
    setSelectedMovie(null);
    setSelectedShowtime('');
    setSelectedSeats([]);
    setSeatLayout([]);
    setTotalPrice(0);
    setTimerActive(false);
    setTimerExpired(false);
  }, []);

  const value = {
    // State
    selectedMovie,
    selectedShowtime,
    selectedSeats,
    seatLayout,
    totalPrice,
    timerActive,
    timerExpired,
    toasts,
    lastBooking,
    bookingHistory,
    // Actions
    selectMovie,
    selectShowtime,
    toggleSeat,
    clearSeats,
    handleTimerExpiry,
    confirmBooking,
    resetBooking,
    setSeatLayout,
    setTimerActive,
    setTimerExpired,
    addToast,
    removeToast,
  };

  return (
    <BookingContext.Provider value={value}>
      {children}
    </BookingContext.Provider>
  );
};

export default BookingContext;
