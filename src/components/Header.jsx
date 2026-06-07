/**
 * Header — Main navigation bar with glassmorphism effect
 * Includes theme toggle (Light/Dark) and My Bookings link
 */
import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Film, Menu, X, Ticket, User, LogOut, Sun, Moon } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import './Header.css';

const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [user, setUser] = useState(null);
  const location = useLocation();
  const { theme, toggleTheme, isDark } = useTheme();

  // Check for logged-in user session
  useEffect(() => {
    const session = localStorage.getItem('cinepass_session');
    if (session) {
      try {
        const parsed = JSON.parse(session);
        if (parsed.loggedIn) setUser(parsed);
      } catch { /* ignore */ }
    }
  }, [location.pathname]); // Re-check on page change

  const handleLogout = () => {
    localStorage.removeItem('cinepass_session');
    setUser(null);
  };

  const navLinks = [
    { path: '/', label: 'Home' },
    { path: '/my-bookings', label: 'My Bookings' },
    { path: '/about', label: 'About' },
    { path: '/wallet', label: 'Wallet' },
    { path: '/contact', label: 'Support' },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <header className="header" id="main-header">
      <div className="header__container container">
        {/* Logo */}
        <Link to="/" className="header__logo" id="header-logo" onClick={() => setMobileMenuOpen(false)}>
          <div className="header__logo-icon">
            <Film size={24} />
          </div>
          <span className="header__logo-text">CinePass</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="header__nav" id="desktop-nav">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={`header__nav-link ${isActive(link.path) ? 'active' : ''}`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Right side */}
        <div className="header__actions">
          {/* Theme Toggle */}
          <button
            className="header__theme-toggle"
            onClick={toggleTheme}
            aria-label={`Switch to ${isDark ? 'light' : 'dark'} mode`}
            title={`Switch to ${isDark ? 'light' : 'dark'} mode`}
            id="theme-toggle-btn"
          >
            <div className={`header__theme-icon-wrap ${isDark ? '' : 'rotated'}`}>
              {isDark ? <Moon size={18} /> : <Sun size={18} />}
            </div>
          </button>

          {user ? (
            <div className="header__user">
              <Link to="/profile" className="header__user-name" title="View Profile">
                <User size={14} />
                <span className="header__user-name-text">{user.name}</span>
              </Link>
              <button className="header__logout-btn" onClick={handleLogout} title="Logout">
                <LogOut size={16} />
              </button>
            </div>
          ) : (
            <Link to="/login" className="header__login-btn" id="header-login-btn">
              <User size={16} />
              <span>Login</span>
            </Link>
          )}

          <Link to="/" className="header__book-btn" id="header-book-btn">
            <Ticket size={18} />
            <span>Book Now</span>
          </Link>

          {/* Mobile menu toggle */}
          <button
            className="header__menu-btn"
            id="mobile-menu-toggle"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <div className={`header__mobile-menu ${mobileMenuOpen ? 'open' : ''}`}>
        {navLinks.map((link) => (
          <Link
            key={link.path}
            to={link.path}
            className={`header__mobile-link ${isActive(link.path) ? 'active' : ''}`}
            onClick={() => setMobileMenuOpen(false)}
          >
            {link.label}
          </Link>
        ))}
        {/* Mobile theme toggle */}
        <button
          className="header__mobile-link header__mobile-theme-toggle"
          onClick={() => { toggleTheme(); }}
        >
          {isDark ? <Sun size={16} /> : <Moon size={16} />}
          {isDark ? 'Light Mode' : 'Dark Mode'}
        </button>
        {user ? (
          <>
            <Link
              to="/profile"
              className={`header__mobile-link ${isActive('/profile') ? 'active' : ''}`}
              onClick={() => setMobileMenuOpen(false)}
            >
              My Profile
            </Link>
            <button
              className="header__mobile-link"
              onClick={() => { handleLogout(); setMobileMenuOpen(false); }}
            >
              Logout ({user.name})
            </button>
          </>
        ) : (
          <Link
            to="/login"
            className={`header__mobile-link ${isActive('/login') ? 'active' : ''}`}
            onClick={() => setMobileMenuOpen(false)}
          >
            Login / Sign Up
          </Link>
        )}
      </div>
    </header>
  );
};

export default Header;
