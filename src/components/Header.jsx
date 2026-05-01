/**
 * Header — Main navigation bar with glassmorphism effect
 */
import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Film, Menu, X, Ticket } from 'lucide-react';
import './Header.css';

const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  const navLinks = [
    { path: '/', label: 'Home' },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <header className="header" id="main-header">
      <div className="header__container container">
        {/* Logo */}
        <Link to="/" className="header__logo" id="header-logo">
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
      </div>
    </header>
  );
};

export default Header;
