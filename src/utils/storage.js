/**
 * localStorage utility functions
 * Handles persisting booking history and user preferences
 */

const STORAGE_KEYS = {
  BOOKINGS: 'cinepass_bookings',
  LAST_BOOKING: 'cinepass_last_booking',
};

/**
 * Save a booking to localStorage
 */
export const saveBooking = (booking) => {
  try {
    const bookings = getBookings();
    const newBooking = {
      ...booking,
      bookingId: generateBookingId(),
      timestamp: new Date().toISOString(),
    };
    bookings.unshift(newBooking); // Add to beginning (newest first)
    localStorage.setItem(STORAGE_KEYS.BOOKINGS, JSON.stringify(bookings));
    localStorage.setItem(STORAGE_KEYS.LAST_BOOKING, JSON.stringify(newBooking));
    return newBooking;
  } catch (error) {
    console.error('Error saving booking:', error);
    return null;
  }
};

/**
 * Get all saved bookings
 */
export const getBookings = () => {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.BOOKINGS);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
};

/**
 * Get the last booking made
 */
export const getLastBooking = () => {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.LAST_BOOKING);
    return data ? JSON.parse(data) : null;
  } catch {
    return null;
  }
};

/**
 * Clear all booking data
 */
export const clearBookings = () => {
  localStorage.removeItem(STORAGE_KEYS.BOOKINGS);
  localStorage.removeItem(STORAGE_KEYS.LAST_BOOKING);
};

/**
 * Generate a unique booking ID
 * Format: CP-XXXXXX (6 alphanumeric characters)
 */
const generateBookingId = () => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let id = 'CP-';
  for (let i = 0; i < 6; i++) {
    id += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return id;
};
