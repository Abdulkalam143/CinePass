/**
 * Footer — Minimal footer with branding
 */
import { Film, Heart } from 'lucide-react';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer" id="main-footer">
      <div className="footer__container container">
        <div className="footer__brand">
          <Film size={20} className="footer__icon" />
          <span className="footer__name">CinePass</span>
        </div>
        <p className="footer__text">
          Made with <Heart size={14} className="footer__heart" /> by Abdul Kalam
        </p>
        <p className="footer__copy">
          © {new Date().getFullYear()} CinePass. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
