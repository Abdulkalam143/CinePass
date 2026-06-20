/**
 * AboutPage — Company info, mission, team, and app features
 */
import { motion } from 'framer-motion';
import { Film, Users, Shield, Zap, Globe, Heart, Award, Star } from 'lucide-react';
import { useTranslation } from '../context/LanguageContext';
import './AboutPage.css';

const AboutPage = () => {
  const { t } = useTranslation();

  const stats = [
    { value: '10M+', label: t('about.stats.tickets') },
    { value: '500+', label: t('about.stats.theaters') },
    { value: '1M+', label: t('about.stats.activeUsers') },
    { value: '4.8★', label: t('about.stats.rating') },
  ];

  const values = [
    { icon: Zap, title: t('auth.instantBooking'), desc: 'Book tickets in under 30 seconds with our streamlined flow.' },
    { icon: Shield, title: 'Secure Payments', desc: 'Bank-grade encryption for every transaction you make.' },
    { icon: Globe, title: t('auth.gpsDiscovery'), desc: 'Find theaters near you with real-time location tracking.' },
    { icon: Heart, title: 'User First', desc: 'Every pixel is designed for the best movie-going experience.' },
  ];

  const team = [
    { name: 'Abdul Kalam', role: 'Founder & Developer', emoji: '👨‍💻' },
    { name: 'CinePass Team', role: 'Design & UX', emoji: '🎨' },
    { name: 'Open Source', role: 'Community Contributors', emoji: '🌍' },
  ];

  return (
    <motion.div
      className="about-page"
      id="about-page"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
    >
      {/* Hero */}
      <section className="about-hero">
        <div className="about-hero__bg" />
        <div className="about-hero__content container">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="about-hero__badge">
              <Film size={14} /> {t('about.title')}
            </span>
            <h1 className="about-hero__title">
              The Future of<br />
              <span className="about-hero__accent">Movie Booking</span>
            </h1>
            <p className="about-hero__desc">
              {t('about.desc')}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Stats */}
      <section className="about-stats container">
        {stats.map((stat, i) => (
          <motion.div
            key={stat.label}
            className="about-stat"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
          >
            <span className="about-stat__value">{stat.value}</span>
            <span className="about-stat__label">{stat.label}</span>
          </motion.div>
        ))}
      </section>

      {/* Values */}
      <section className="about-values container">
        <h2 className="about-section__title">
          <Award size={22} /> {t('about.valuesTitle')}
        </h2>
        <div className="about-values__grid">
          {values.map((val, i) => {
            const Icon = val.icon;
            return (
              <motion.div
                key={val.title}
                className="about-value-card"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 + i * 0.1 }}
              >
                <div className="about-value-card__icon">
                  <Icon size={24} />
                </div>
                <h3>{val.title}</h3>
                <p>{val.desc}</p>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* Team */}
      <section className="about-team container">
        <h2 className="about-section__title">
          <Users size={22} /> {t('about.teamTitle')}
        </h2>
        <div className="about-team__grid">
          {team.map((member, i) => (
            <motion.div
              key={member.name}
              className="about-team-card"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 + i * 0.1 }}
            >
              <span className="about-team-card__emoji">{member.emoji}</span>
              <h3>{member.name}</h3>
              <p>{member.role}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Mission */}
      <section className="about-mission container">
        <div className="about-mission__card">
          <Star size={28} className="about-mission__icon" />
          <h2>{t('about.missionTitle')}</h2>
          <p>
            {t('about.missionText')}
          </p>
        </div>
      </section>
    </motion.div>
  );
};

export default AboutPage;
