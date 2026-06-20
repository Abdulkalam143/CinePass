/**
 * ContactPage — Contact form, FAQs, and support channels
 */
import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Headphones, Mail, Phone, MessageCircle, Send,
  ChevronDown, MapPin, Clock, CheckCircle,
} from 'lucide-react';
import { useTranslation } from '../context/LanguageContext';
import './ContactPage.css';

const faqs = [
  { q: 'How do I book a ticket?', a: 'Browse movies on the home page, select a movie, choose a theater and showtime, pick your seats, and complete payment.' },
  { q: 'Can I cancel my booking?', a: 'Yes, cancellations are allowed up to 2 hours before showtime. A small convenience fee may apply.' },
  { q: 'How does the wallet work?', a: 'Add money to your CinePass wallet for faster checkouts. You earn cashback on every booking which gets credited to your wallet.' },
  { q: 'How do I get a refund?', a: 'Refunds are processed within 3-5 business days to your original payment method or CinePass wallet.' },
  { q: 'Is my payment information secure?', a: 'Absolutely. We use bank-grade encryption and never store your card details on our servers.' },
];

const ContactPage = () => {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });
  const [submitted, setSubmitted] = useState(false);
  const [openFaq, setOpenFaq] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 4000);
    setFormData({ name: '', email: '', subject: '', message: '' });
  };

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  return (
    <motion.div
      className="contact-page"
      id="contact-page"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
    >
      <div className="contact-page__content container">
        {/* Header */}
        <div className="contact-header">
          <span className="contact-header__badge">
            <Headphones size={14} /> {t('contact.title')}
          </span>
          <h1 className="contact-header__title">{t('contact.subtitle')}</h1>
          <p className="contact-header__desc">
            {t('contact.desc')}
          </p>
        </div>

        {/* Support channels */}
        <div className="contact-channels">
          {[
            { icon: Mail, label: t('contact.email'), value: 'support@cinepass.app', color: 'accent' },
            { icon: Phone, label: t('contact.phone'), value: '+91 1800-123-4567', color: 'green' },
            { icon: MessageCircle, label: t('contact.liveChat'), value: 'Available 24/7', color: 'blue' },
            { icon: Clock, label: t('contact.responseTime'), value: 'Under 2 hours', color: 'gold' },
          ].map((ch, i) => {
            const Icon = ch.icon;
            return (
              <motion.div
                key={ch.label}
                className={`contact-channel contact-channel--${ch.color}`}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
              >
                <Icon size={20} />
                <span className="contact-channel__label">{ch.label}</span>
                <span className="contact-channel__value">{ch.value}</span>
              </motion.div>
            );
          })}
        </div>

        <div className="contact-page__grid">
          {/* Contact form */}
          <section className="contact-form-section">
            <h2><Send size={20} /> {t('contact.sendMessage')}</h2>

            {submitted ? (
              <motion.div
                className="contact-form__success"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
              >
                <CheckCircle size={48} />
                <h3>{t('contact.messageSent')}</h3>
                <p>{t('contact.contactText')}</p>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="contact-form">
                <div className="contact-form__row">
                  <div className="contact-form__group">
                    <label htmlFor="name">{t('contact.name')}</label>
                    <input
                      type="text" id="name" name="name"
                      value={formData.name} onChange={handleChange}
                      placeholder="Your name" required
                    />
                  </div>
                  <div className="contact-form__group">
                    <label htmlFor="email">{t('profile.email')}</label>
                    <input
                      type="email" id="email" name="email"
                      value={formData.email} onChange={handleChange}
                      placeholder="your@email.com" required
                    />
                  </div>
                </div>
                <div className="contact-form__group">
                  <label htmlFor="subject">{t('contact.subject')}</label>
                  <input
                    type="text" id="subject" name="subject"
                    value={formData.subject} onChange={handleChange}
                    placeholder="What's this about?" required
                  />
                </div>
                <div className="contact-form__group">
                  <label htmlFor="message">{t('contact.message')}</label>
                  <textarea
                    id="message" name="message" rows="5"
                    value={formData.message} onChange={handleChange}
                    placeholder="Describe your issue or question..." required
                  />
                </div>
                <button type="submit" className="contact-form__submit">
                  <Send size={16} /> {t('contact.sendMessage')}
                </button>
              </form>
            )}
          </section>

          {/* FAQs */}
          <section className="contact-faqs">
            <h2><MessageCircle size={20} /> {t('contact.faqs')}</h2>
            <div className="contact-faqs__list">
              {faqs.map((faq, i) => (
                <div
                  key={i}
                  className={`contact-faq ${openFaq === i ? 'open' : ''}`}
                >
                  <button
                    className="contact-faq__question"
                    onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  >
                    <span>{faq.q}</span>
                    <ChevronDown size={16} className="contact-faq__chevron" />
                  </button>
                  {openFaq === i && (
                    <motion.p
                      className="contact-faq__answer"
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                    >
                      {faq.a}
                    </motion.p>
                  )}
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* Office info */}
        <div className="contact-office">
          <MapPin size={16} />
          <span>{t('contact.office')} — Hyderabad, Telangana, India</span>
        </div>
      </div>
    </motion.div>
  );
};

export default ContactPage;
