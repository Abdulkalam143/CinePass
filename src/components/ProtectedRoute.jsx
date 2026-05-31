/**
 * ProtectedRoute — Auth guard for booking-related pages
 * Redirects unauthenticated users to login with a return URL
 */
import { Navigate, useLocation } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
  const location = useLocation();

  // Check localStorage for session
  const session = localStorage.getItem('cinepass_session');
  let isLoggedIn = false;

  if (session) {
    try {
      const parsed = JSON.parse(session);
      isLoggedIn = !!parsed.loggedIn;
    } catch { /* ignore */ }
  }

  if (!isLoggedIn) {
    // Redirect to login, save intended destination
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }

  return children;
};

export default ProtectedRoute;
