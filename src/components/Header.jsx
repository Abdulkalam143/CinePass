/**
 * Header — Main navigation bar with glassmorphism effect
 * Includes theme toggle (Light/Dark) and My Bookings link
 */
import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Film, Menu, X, Ticket, User, LogOut, Sun, Moon, Bell } from 'lucide-react';
import { AnimatePresence } from 'framer-motion';
import { useTheme } from '../context/ThemeContext';
import { useTranslation } from '../context/LanguageContext';
import LanguageSelector from './LanguageSelector';
import NotificationDropdown from './NotificationDropdown';
import './Header.css';

const defaultNotifications = [
  {
    id: 1,
    type: 'alert',
    titleKey: 'notifications.welcomeTitle',
    msgKey: 'notifications.welcomeMsg',
    date: '2026-06-20',
    read: false,
    icon: 'welcome'
  },
  {
    id: 2,
    type: 'offer',
    titleKey: 'notifications.discountTitle',
    msgKey: 'notifications.discountMsg',
    date: '2026-06-20',
    read: false,
    icon: 'discount',
    code: 'CINE100'
  },
  {
    id: 3,
    type: 'alert',
    titleKey: 'notifications.verifyTitle',
    msgKey: 'notifications.verifyMsg',
    date: '2026-06-19',
    read: false,
    icon: 'verify'
  },
  {
    id: 4,
    type: 'offer',
    titleKey: 'notifications.bogoTitle',
    msgKey: 'notifications.bogoMsg',
    date: '2026-06-19',
    read: false,
    icon: 'bogo',
    code: 'BOGOFAST'
  },
  {
    id: 5,
    type: 'alert',
    titleKey: 'notifications.walletTitle',
    msgKey: 'notifications.walletMsg',
    date: '2026-06-18',
    read: true,
    icon: 'wallet'
  },
  {
    id: 6,
    type: 'offer',
    titleKey: 'notifications.comboTitle',
    msgKey: 'notifications.comboMsg',
    date: '2026-06-17',
    read: true,
    icon: 'combo',
    code: 'SNACK20'
  }
];

const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState(() => {
    try {
      const stored = localStorage.getItem('cinepass_notifications');
      return stored ? JSON.parse(stored) : defaultNotifications;
    } catch {
      return defaultNotifications;
    }
  });

  const location = useLocation();
  const { toggleTheme, isDark } = useTheme();
  const { t } = useTranslation();

  // Persist notifications
  useEffect(() => {
    try {
      localStorage.setItem('cinepass_notifications', JSON.stringify(notifications));
    } catch { /* ignore */ }
  }, [notifications]);

  // Check for logged-in user session
  useEffect(() => {
    const session = localStorage.getItem('cinepass_session');
    if (session) {
      try {
        const parsed = JSON.parse(session);
        if (parsed.loggedIn) {
          setTimeout(() => {
            setUser(parsed);
          }, 0);
        }
      } catch { /* ignore */ }
    }
    // Close notifications panel on page change
    setTimeout(() => {
      setShowNotifications(false);
    }, 0);
  }, [location.pathname]); // Re-check on page change

  // Handle click outside to close notifications dropdown
  useEffect(() => {
    const handleClickOutside = (e) => {
      const bellBtn = document.getElementById('notification-bell-btn');
      const dropdownPanel = document.getElementById('notification-dropdown');
      
      if (showNotifications) {
        if (
          bellBtn && !bellBtn.contains(e.target) &&
          dropdownPanel && !dropdownPanel.contains(e.target)
        ) {
          setShowNotifications(false);
        }
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [showNotifications]);

  const handleMarkRead = (id) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const handleDismiss = (id) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  const handleMarkAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const handleClearAll = () => {
    setNotifications([]);
  };

  const handleLogout = () => {
    localStorage.removeItem('cinepass_session');
    setUser(null);
  };

  const navLinks = [
    { path: '/', label: t('nav.home') },
    { path: '/my-bookings', label: t('nav.myBookings') },
    { path: '/about', label: t('nav.about') },
    { path: '/wallet', label: t('nav.wallet') },
    { path: '/contact', label: t('nav.support') },
  ];

  const isActive = (path) => location.pathname === path;
  const unreadCount = notifications.filter((n) => !n.read).length;

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
            aria-label={isDark ? t('nav.lightMode') : t('nav.darkMode')}
            title={isDark ? t('nav.lightMode') : t('nav.darkMode')}
            id="theme-toggle-btn"
          >
            <div className={`header__theme-icon-wrap ${isDark ? '' : 'rotated'}`}>
              {isDark ? <Moon size={18} /> : <Sun size={18} />}
            </div>
          </button>

          {/* Language Selector */}
          <LanguageSelector />

          {/* Notifications Bell */}
          <div className="header__notification-container" style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
            <button
              className={`header__notification-bell ${showNotifications ? 'active' : ''}`}
              onClick={() => {
                setShowNotifications(!showNotifications);
                setMobileMenuOpen(false);
              }}
              aria-label={t('notifications.title')}
              title={t('notifications.title')}
              id="notification-bell-btn"
            >
              <Bell size={18} />
              {unreadCount > 0 && (
                <span className="header__notification-badge">{unreadCount}</span>
              )}
            </button>
            <AnimatePresence>
              {showNotifications && (
                <NotificationDropdown
                  notifications={notifications}
                  onMarkRead={handleMarkRead}
                  onDismiss={handleDismiss}
                  onMarkAllRead={handleMarkAllRead}
                  onClearAll={handleClearAll}
                  onClose={() => setShowNotifications(false)}
                />
              )}
            </AnimatePresence>
          </div>

          {user ? (
            <div className="header__user">
              <Link to="/profile" className="header__user-name" title={t('nav.myProfile')}>
                <User size={14} />
                <span className="header__user-name-text">{user.name}</span>
              </Link>
              <button className="header__logout-btn" onClick={handleLogout} title={t('nav.logout')}>
                <LogOut size={16} />
              </button>
            </div>
          ) : (
            <Link to="/login" className="header__login-btn" id="header-login-btn">
              <User size={16} />
              <span>{t('nav.login')}</span>
            </Link>
          )}

          <Link to="/" className="header__book-btn" id="header-book-btn">
            <Ticket size={18} />
            <span>{t('nav.bookNow')}</span>
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
          {isDark ? t('nav.lightMode') : t('nav.darkMode')}
        </button>
        {user ? (
          <>
            <Link
              to="/profile"
              className={`header__mobile-link ${isActive('/profile') ? 'active' : ''}`}
              onClick={() => setMobileMenuOpen(false)}
            >
              {t('nav.myProfile')}
            </Link>
            <button
              className="header__mobile-link"
              onClick={() => { handleLogout(); setMobileMenuOpen(false); }}
            >
              {t('nav.logout')} ({user.name})
            </button>
          </>
        ) : (
          <Link
            to="/login"
            className={`header__mobile-link ${isActive('/login') ? 'active' : ''}`}
            onClick={() => setMobileMenuOpen(false)}
          >
            {t('nav.loginSignUp')}
          </Link>
        )}
      </div>
    </header>
  );
};

export default Header;
