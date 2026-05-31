/**
 * Footer — Premium multi-column footer with navigation,
 * social links, newsletter, and branding
 */
import { Link } from 'react-router-dom';
import {
  Film, Heart, Mail, Phone, MapPin,
  Globe, MessageCircle, Camera, PlayCircle,
  Send, Smartphone, ExternalLink,
} from 'lucide-react';
import { useState } from 'react';
import './Footer.css';

const Footer = () => {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email.trim()) {
      setSubscribed(true);
      setEmail('');
      setTimeout(() => setSubscribed(false), 3000);
    }
  };

  const quickLinks = [
    { path: '/', label: 'Home' },
    { path: '/my-bookings', label: 'My Bookings' },
    { path: '/wallet', label: 'Wallet' },
    { path: '/about', label: 'About Us' },
  ];

  const supportLinks = [
    { path: '/contact', label: 'Contact Support' },
    { path: '/about', label: 'FAQ' },
    { path: '/about', label: 'Terms & Conditions' },
    { path: '/about', label: 'Privacy Policy' },
    { path: '/about', label: 'Refund Policy' },
  ];

  const socialLinks = [
    { icon: Globe, label: 'Website', href: '#' },
    { icon: MessageCircle, label: 'Twitter', href: '#' },
    { icon: Camera, label: 'Instagram', href: '#' },
    { icon: PlayCircle, label: 'YouTube', href: '#' },
  ];

  return (
    <footer className="footer" id="main-footer">
      {/* Top wave separator */}
      <div className="footer__wave" />

      <div className="footer__content">
        <div className="footer__grid container">
          {/* Column 1: Brand */}
          <div className="footer__col footer__col--brand">
            <Link to="/" className="footer__brand-link">
              <div className="footer__logo-icon">
                <Film size={22} />
              </div>
              <span className="footer__brand-name">CinePass</span>
            </Link>
            <p className="footer__tagline">
              Your premium destination for movie and event tickets. 
              Experience entertainment like never before.
            </p>
            <div className="footer__social">
              {socialLinks.map((social) => {
                const Icon = social.icon;
                return (
                  <a
                    key={social.label}
                    href={social.href}
                    className="footer__social-link"
                    aria-label={social.label}
                    title={social.label}
                  >
                    <Icon size={18} />
                  </a>
                );
              })}
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div className="footer__col">
            <h4 className="footer__col-title">Quick Links</h4>
            <ul className="footer__links">
              {quickLinks.map((link) => (
                <li key={link.label}>
                  <Link to={link.path} className="footer__link">
                    <ExternalLink size={12} />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Help & Support */}
          <div className="footer__col">
            <h4 className="footer__col-title">Help & Support</h4>
            <ul className="footer__links">
              {supportLinks.map((link, i) => (
                <li key={i}>
                  <Link to={link.path} className="footer__link">
                    <ExternalLink size={12} />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4: Stay Connected */}
          <div className="footer__col footer__col--newsletter">
            <h4 className="footer__col-title">Stay Connected</h4>
            <p className="footer__newsletter-desc">
              Subscribe for exclusive offers, new releases & more!
            </p>
            <form className="footer__newsletter-form" onSubmit={handleSubscribe}>
              <div className="footer__input-wrap">
                <Mail size={16} className="footer__input-icon" />
                <input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="footer__input"
                  required
                />
                <button type="submit" className="footer__subscribe-btn" title="Subscribe">
                  <Send size={16} />
                </button>
              </div>
              {subscribed && (
                <p className="footer__subscribed-msg">✅ Subscribed successfully!</p>
              )}
            </form>

            {/* Contact Info */}
            <div className="footer__contact">
              <div className="footer__contact-item">
                <Phone size={14} />
                <span>+91 1800-XXX-XXXX</span>
              </div>
              <div className="footer__contact-item">
                <Mail size={14} />
                <span>support@cinepass.in</span>
              </div>
              <div className="footer__contact-item">
                <MapPin size={14} />
                <span>India</span>
              </div>
            </div>
          </div>
        </div>

        {/* ── Sitemap Directory Section ── */}
        <div className="footer__sitemap container">
          <div className="footer__sitemap-section">
            <h5 className="footer__sitemap-title">Movies Now Showing in Hyderabad</h5>
            <div className="footer__sitemap-links">
              {['Drishyam 3', 'Vasoolraajakela', 'Star Wars: The Mandalorian and Grogu', 'Chand Mera Dil', 'Ugly Story', 'Parushurama', 'Krishnavamsam (Vol 1): The Mount', 'Ramani Kalyanam', 'Pati Patni Aur Woh 2in', 'Gobar Gullipasha'].map((m, i) => (
                <a key={i} href="#" className="footer__sitemap-link">{m}</a>
              ))}
            </div>
          </div>

          <div className="footer__sitemap-section">
            <h5 className="footer__sitemap-title">Upcoming Movies Per Week</h5>
            <div className="footer__sitemap-links">
              {['Upcoming Movies Today', 'Upcoming Movies Tomorrow', 'Upcoming Movies This Weekend'].map((m, i) => (
                <a key={i} href="#" className="footer__sitemap-link">{m}</a>
              ))}
            </div>
          </div>

          <div className="footer__sitemap-section">
            <h5 className="footer__sitemap-title">Movies by Genre</h5>
            <div className="footer__sitemap-links">
              {['Drama Movies', 'Comedy Movies', 'Action Movies', 'Thriller Movies', 'Adventure Movies', 'Romantic Movies', 'Fantasy Movies', 'Horror Movies', 'Animation Movies', 'Musical Movies'].map((m, i) => (
                <a key={i} href="#" className="footer__sitemap-link">{m}</a>
              ))}
            </div>
          </div>

          <div className="footer__sitemap-section">
            <h5 className="footer__sitemap-title">Movies by Language</h5>
            <div className="footer__sitemap-links">
              {['Movies in English', 'Movies in Hindi', 'Movies in Telugu', 'Movies in Malayalam', 'Movies in Tamil', 'Movies in Marathi', 'Movies in Kannada', 'Movies in Sindhi', 'Movies in Bengali', 'Movies in Urdu'].map((m, i) => (
                <a key={i} href="#" className="footer__sitemap-link">{m}</a>
              ))}
            </div>
          </div>

          <div className="footer__sitemap-section">
            <h5 className="footer__sitemap-title">Sports Events in Hyderabad</h5>
            <div className="footer__sitemap-links">
              {['Running', 'Bowling', 'Mixed Martial Arts', 'Basketball', 'Cricket', 'Horse Race', 'Sailing', 'Chess', 'Cycling', 'E-Sports'].map((m, i) => (
                <a key={i} href="#" className="footer__sitemap-link">{m}</a>
              ))}
            </div>
          </div>

          <div className="footer__sitemap-section">
            <h5 className="footer__sitemap-title">Events in Top Cities</h5>
            <div className="footer__sitemap-links">
              {['Events in Mumbai', 'Events in Delhi-NCR', 'Events in Chennai', 'Events in Bengaluru', 'Events in Hyderabad', 'Events in Pune', 'Events in Ahmedabad', 'Events in Kolkata', 'Events in Kochi'].map((m, i) => (
                <a key={i} href="#" className="footer__sitemap-link">{m}</a>
              ))}
            </div>
          </div>

          <div className="footer__sitemap-section">
            <h5 className="footer__sitemap-title">Cinemas in Top Cities</h5>
            <div className="footer__sitemap-links">
              {['Cinemas in Mumbai', 'Cinemas in Delhi-NCR', 'Cinemas in Chennai', 'Cinemas in Bengaluru', 'Cinemas in Hyderabad', 'Cinemas in Pune', 'Cinemas in Ahmedabad', 'Cinemas in Kolkata', 'Cinemas in Kochi'].map((m, i) => (
                <a key={i} href="#" className="footer__sitemap-link">{m}</a>
              ))}
            </div>
          </div>

          <div className="footer__sitemap-section">
            <h5 className="footer__sitemap-title">Plays in Top Cities</h5>
            <div className="footer__sitemap-links">
              {['Plays in Mumbai', 'Plays in Delhi-NCR', 'Plays in Chennai', 'Plays in Bengaluru', 'Plays in Hyderabad', 'Plays in Pune', 'Plays in Ahmedabad', 'Plays in Kolkata', 'Plays in Kochi'].map((m, i) => (
                <a key={i} href="#" className="footer__sitemap-link">{m}</a>
              ))}
            </div>
          </div>

          <div className="footer__sitemap-section">
            <h5 className="footer__sitemap-title">Activities in Top Cities</h5>
            <div className="footer__sitemap-links">
              {['Activities in Mumbai', 'Activities in Delhi-NCR', 'Activities in Chennai', 'Activities in Bengaluru', 'Activities in Hyderabad', 'Activities in Pune', 'Activities in Ahmedabad', 'Activities in Kolkata', 'Activities in Kochi'].map((m, i) => (
                <a key={i} href="#" className="footer__sitemap-link">{m}</a>
              ))}
            </div>
          </div>

          <div className="footer__sitemap-section">
            <h5 className="footer__sitemap-title">Movies Now Showing</h5>
            <div className="footer__sitemap-links">
              {['Chand Mera Dil', 'Kaagaz', 'Pati Patni Aur Woh 2in', 'Drishyam 3', 'Dacoil Rawl 2', 'Star Wars: The Mandalorian and Grogu', 'Visweshwariah', 'Shubh Mangal Dhamal', 'Sandalwood Cappuccino', 'Bhoothi Bangla'].map((m, i) => (
                <a key={i} href="#" className="footer__sitemap-link">{m}</a>
              ))}
            </div>
          </div>

          <div className="footer__sitemap-section">
            <h5 className="footer__sitemap-title">Countries</h5>
            <div className="footer__sitemap-links">
              {['Indonesia', 'Singapore', 'Sri Lanka', 'West Indies'].map((m, i) => (
                <a key={i} href="#" className="footer__sitemap-link">{m}</a>
              ))}
            </div>
          </div>

          <div className="footer__sitemap-section">
            <h5 className="footer__sitemap-title">Help</h5>
            <div className="footer__sitemap-links">
              {['About Us', 'Contact Us', 'Current Opening', 'Press Release', 'Press Coverage', 'FAQs', 'Terms and Conditions', 'Privacy Policy'].map((m, i) => (
                <a key={i} href="#" className="footer__sitemap-link">{m}</a>
              ))}
            </div>
          </div>

          <div className="footer__sitemap-section">
            <h5 className="footer__sitemap-title">CinePass Exclusives</h5>
            <div className="footer__sitemap-links">
              {['CinePass India', 'BookAChange', 'Corporate Vouchers', 'Gift Cards', 'List My Show', 'Offers', 'Stream', 'Trailers'].map((m, i) => (
                <a key={i} href="#" className="footer__sitemap-link">{m}</a>
              ))}
            </div>
          </div>
        </div>

        {/* ── CinePass Logo ── */}
        <div className="footer__logo-section">
          <Link to="/" className="footer__logo-brand">
            <div className="footer__logo-icon-lg">
              <Film size={28} />
            </div>
            <span className="footer__logo-text-lg">CinePass</span>
          </Link>
        </div>

        {/* Bottom Bar */}
        <div className="footer__bottom">
          <div className="footer__bottom-inner container">
            <p className="footer__copy">
              © {new Date().getFullYear()} CinePass. All rights reserved.
            </p>
            <p className="footer__made">
              Made with <Heart size={14} className="footer__heart" /> by Abdul Kalam
            </p>
            <div className="footer__badges">
              <span className="footer__badge">
                <Smartphone size={12} />
                App Coming Soon
              </span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
