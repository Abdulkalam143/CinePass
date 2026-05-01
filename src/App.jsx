/**
 * App.jsx — Root component with routing and layout
 */
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { BookingProvider } from './context/BookingContext';
import Header from './components/Header';
import Footer from './components/Footer';
import Toast from './components/Toast';
import HomePage from './pages/HomePage';
import MovieDetailsPage from './pages/MovieDetailsPage';
import BookingPage from './pages/BookingPage';
import ConfirmationPage from './pages/ConfirmationPage';
import PaymentSuccessPage from './pages/PaymentSuccessPage';
import './App.css';

// AnimatedRoutes wrapper to enable page transitions
const AnimatedRoutes = () => {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<HomePage />} />
        <Route path="/movie/:id" element={<MovieDetailsPage />} />
        <Route path="/booking/:id" element={<BookingPage />} />
        <Route path="/confirmation" element={<ConfirmationPage />} />
        <Route path="/payment-success" element={<PaymentSuccessPage />} />
      </Routes>
    </AnimatePresence>
  );
};

const App = () => {
  return (
    <Router>
      <BookingProvider>
        <div className="app" id="app-root">
          <Header />
          <main className="app__main">
            <AnimatedRoutes />
          </main>
          <Footer />
          <Toast />
        </div>
      </BookingProvider>
    </Router>
  );
};

export default App;
