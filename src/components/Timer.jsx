/**
 * Timer — Countdown timer for seat hold (5 minutes)
 * Shows visual urgency when time is running low
 */
import { useState, useEffect, useRef } from 'react';
import { Clock, AlertTriangle } from 'lucide-react';
import { useBooking } from '../context/BookingContext';
import './Timer.css';

const HOLD_DURATION = 5 * 60; // 5 minutes in seconds

const Timer = () => {
  const { timerActive, handleTimerExpiry, selectedSeats } = useBooking();
  const [timeLeft, setTimeLeft] = useState(HOLD_DURATION);
  const intervalRef = useRef(null);

  // Start/stop timer based on timerActive state
  useEffect(() => {
    if (timerActive && selectedSeats.length > 0) {
      setTimeLeft(HOLD_DURATION); // Reset on start

      intervalRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(intervalRef.current);
            handleTimerExpiry();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      // Timer inactive — reset
      clearInterval(intervalRef.current);
      setTimeLeft(HOLD_DURATION);
    }

    return () => clearInterval(intervalRef.current);
  }, [timerActive, selectedSeats.length, handleTimerExpiry]);

  // Don't render if no seats are selected
  if (!timerActive || selectedSeats.length === 0) return null;

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const isUrgent = timeLeft <= 60; // Last minute — show urgency
  const progressPercent = (timeLeft / HOLD_DURATION) * 100;

  return (
    <div className={`timer ${isUrgent ? 'timer--urgent' : ''}`} id="booking-timer">
      <div className="timer__header">
        {isUrgent ? <AlertTriangle size={16} /> : <Clock size={16} />}
        <span className="timer__label">
          {isUrgent ? 'Hurry! Seats releasing soon' : 'Seat hold timer'}
        </span>
      </div>

      <div className="timer__display">
        <span className="timer__digits">
          {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
        </span>
      </div>

      {/* Progress bar */}
      <div className="timer__progress-track">
        <div
          className="timer__progress-bar"
          style={{ width: `${progressPercent}%` }}
        />
      </div>
    </div>
  );
};

export default Timer;
