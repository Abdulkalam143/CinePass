/**
 * App.jsx — Root component with routing and layout
 */
import { useState, useCallback } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { BookingProvider } from './context/BookingContext';
import { ThemeProvider } from './context/ThemeContext';
import Header from './components/Header';
import Footer from './components/Footer';
import Toast from './components/Toast';
import SplashScreen from './components/SplashScreen';
import ProtectedRoute from './components/ProtectedRoute';
import HomePage from './pages/HomePage';
import MovieDetailsPage from './pages/MovieDetailsPage';
import BookingPage from './pages/BookingPage';
import ConfirmationPage from './pages/ConfirmationPage';
import PaymentSuccessPage from './pages/PaymentSuccessPage';
import AboutPage from './pages/AboutPage';
import WalletPage from './pages/WalletPage';
import ContactPage from './pages/ContactPage';
import AuthPage from './pages/AuthPage';
import MyBookingsPage from './pages/MyBookingsPage';
import ProfilePage from './pages/ProfilePage';
import { LocationProvider } from './context/LocationContext';

import './App.css';

// AnimatedRoutes wrapper to enable page transitions
const AnimatedRoutes = () => {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        {/* Public routes — browse freely */}
        <Route path="/" element={<HomePage />} />

        <Route path="/movie/:id" element={<MovieDetailsPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/wallet" element={<WalletPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/login" element={<AuthPage />} />

        {/* Protected routes — login required */}
        <Route path="/booking/:id" element={<ProtectedRoute><BookingPage /></ProtectedRoute>} />
        <Route path="/confirmation" element={<ProtectedRoute><ConfirmationPage /></ProtectedRoute>} />
        <Route path="/payment-success" element={<ProtectedRoute><PaymentSuccessPage /></ProtectedRoute>} />
        <Route path="/my-bookings" element={<ProtectedRoute><MyBookingsPage /></ProtectedRoute>} />
        <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
      </Routes>
    </AnimatePresence>
  );
};

const App = () => {
  const [showSplash, setShowSplash] = useState(true);

  const handleSplashComplete = useCallback(() => {
    setShowSplash(false);
  }, []);

  return (
    <>
      <AnimatePresence>
        {showSplash && <SplashScreen onComplete={handleSplashComplete} />}
      </AnimatePresence>

      <Router>
        <ThemeProvider>
          <LocationProvider>
            <BookingProvider>
              <div className={`app ${showSplash ? 'app--hidden' : ''}`} id="app-root">
                <Header />
                <main className="app__main">
                  <AnimatedRoutes />
                </main>
                <Footer />
                <Toast />
              </div>
            </BookingProvider>
          </LocationProvider>
        </ThemeProvider>
      </Router>
    </>
  );
};

export default App;
