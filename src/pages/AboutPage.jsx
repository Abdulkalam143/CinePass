/**
 * AboutPage — Company info, mission, team, and app features
 */
import { motion } from 'framer-motion';
import { Film, Users, Shield, Zap, Globe, Heart, Award, Star } from 'lucide-react';
import './AboutPage.css';

const stats = [
  { value: '10M+', label: 'Tickets Booked' },
  { value: '500+', label: 'Theaters' },
  { value: '50+', label: 'Cities' },
  { value: '4.8★', label: 'App Rating' },
];

const values = [
  { icon: Zap, title: 'Fast Booking', desc: 'Book tickets in under 30 seconds with our streamlined flow.' },
  { icon: Shield, title: 'Secure Payments', desc: 'Bank-grade encryption for every transaction you make.' },
  { icon: Globe, title: 'GPS Discovery', desc: 'Find theaters near you with real-time location tracking.' },
  { icon: Heart, title: 'User First', desc: 'Every pixel is designed for the best movie-going experience.' },
];

const team = [
  { name: 'Abdul Kalam', role: 'Founder & Developer', emoji: '👨‍💻' },
  { name: 'CinePass Team', role: 'Design & UX', emoji: '🎨' },
  { name: 'Open Source', role: 'Community Contributors', emoji: '🌍' },
];

const AboutPage = () => {
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
              <Film size={14} /> About CinePass
            </span>
            <h1 className="about-hero__title">
              The Future of<br />
              <span className="about-hero__accent">Movie Booking</span>
            </h1>
            <p className="about-hero__desc">
              CinePass is a next-generation movie ticket booking platform that combines 
              real-time theater discovery, interactive seat selection, and seamless payments 
              into one beautiful experience.
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
          <Award size={22} /> Why CinePass?
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
          <Users size={22} /> Our Team
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
          <h2>Our Mission</h2>
          <p>
            To make movie-going effortless by bringing real-time theater discovery, 
            transparent pricing, and a premium booking experience to everyone — no matter 
            where they are.
          </p>
        </div>
      </section>
    </motion.div>
  );
};

export default AboutPage;
