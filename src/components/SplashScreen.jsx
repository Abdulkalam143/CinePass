/**
 * SplashScreen — Premium CinePass logo animation on app load
 * Features: animated film reel, glowing logo, particle effects, cinematic reveal
 */
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './SplashScreen.css';

const SplashScreen = ({ onComplete }) => {
  const [phase, setPhase] = useState('enter'); // enter → reveal → exit
  const [particles] = useState(() => {
    return [...Array(20)].map((_, i) => ({
      id: i,
      px: `${Math.random() * 100}%`,
      py: `${Math.random() * 100}%`,
      delay: `${Math.random() * 2}s`,
      size: `${2 + Math.random() * 4}px`,
      duration: `${2 + Math.random() * 3}s`,
    }));
  });

  useEffect(() => {
    const t1 = setTimeout(() => setPhase('reveal'), 800);
    const t2 = setTimeout(() => setPhase('exit'), 4200);
    const t3 = setTimeout(() => onComplete(), 5400);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
  }, [onComplete]);

  return (
    <AnimatePresence>
      {phase !== 'done' && (
        <motion.div
          className="splash"
          id="splash-screen"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8, ease: 'easeInOut' }}
        >
          {/* Background glow orbs */}
          <div className="splash__orb splash__orb--1" />
          <div className="splash__orb splash__orb--2" />
          <div className="splash__orb splash__orb--3" />

          {/* Film strip decorations */}
          <div className="splash__strip splash__strip--left">
            {[...Array(12)].map((_, i) => (
              <div key={i} className="splash__strip-hole" />
            ))}
          </div>
          <div className="splash__strip splash__strip--right">
            {[...Array(12)].map((_, i) => (
              <div key={i} className="splash__strip-hole" />
            ))}
          </div>

          {/* Particles */}
          <div className="splash__particles">
            {particles.map((p) => (
              <div
                key={p.id}
                className="splash__particle"
                style={{
                  '--px': p.px,
                  '--py': p.py,
                  '--delay': p.delay,
                  '--size': p.size,
                  '--duration': p.duration,
                }}
              />
            ))}
          </div>

          {/* Main content */}
          <div className="splash__content">
            {/* Film reel icon */}
            <motion.div
              className="splash__reel"
              initial={{ scale: 0, rotate: -180 }}
              animate={{
                scale: phase === 'exit' ? 1.1 : 1,
                rotate: phase === 'exit' ? 10 : 0,
              }}
              transition={{
                type: 'spring',
                stiffness: 150,
                damping: 12,
                delay: 0.2,
              }}
            >
              {/* Outer ring */}
              <svg className="splash__reel-svg" viewBox="0 0 120 120" fill="none">
                {/* Glow ring */}
                <motion.circle
                  cx="60" cy="60" r="56"
                  stroke="url(#splash-gradient)"
                  strokeWidth="2"
                  strokeDasharray="352"
                  initial={{ strokeDashoffset: 352 }}
                  animate={{ strokeDashoffset: 0 }}
                  transition={{ duration: 1.8, ease: 'easeInOut', delay: 0.3 }}
                />
                {/* Film icon */}
                <motion.g
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.8, duration: 0.5 }}
                >
                  {/* Film strip body */}
                  <rect x="35" y="38" width="50" height="44" rx="4" fill="none" stroke="white" strokeWidth="2.5" />
                  {/* Top perforations */}
                  <rect x="39" y="41" width="5" height="6" rx="1" fill="white" opacity="0.7" />
                  <rect x="48" y="41" width="5" height="6" rx="1" fill="white" opacity="0.7" />
                  <rect x="57" y="41" width="5" height="6" rx="1" fill="white" opacity="0.7" />
                  <rect x="66" y="41" width="5" height="6" rx="1" fill="white" opacity="0.7" />
                  <rect x="75" y="41" width="5" height="6" rx="1" fill="white" opacity="0.7" />
                  {/* Bottom perforations */}
                  <rect x="39" y="73" width="5" height="6" rx="1" fill="white" opacity="0.7" />
                  <rect x="48" y="73" width="5" height="6" rx="1" fill="white" opacity="0.7" />
                  <rect x="57" y="73" width="5" height="6" rx="1" fill="white" opacity="0.7" />
                  <rect x="66" y="73" width="5" height="6" rx="1" fill="white" opacity="0.7" />
                  <rect x="75" y="73" width="5" height="6" rx="1" fill="white" opacity="0.7" />
                  {/* Play triangle */}
                  <motion.path
                    d="M54 52 L54 68 L72 60 Z"
                    fill="white"
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 1.2, duration: 0.4, type: 'spring' }}
                    style={{ transformOrigin: '60px 60px' }}
                  />
                </motion.g>
                <defs>
                  <linearGradient id="splash-gradient" x1="0" y1="0" x2="120" y2="120" gradientUnits="userSpaceOnUse">
                    <stop offset="0%" stopColor="#e50914" />
                    <stop offset="50%" stopColor="#ff4d5a" />
                    <stop offset="100%" stopColor="#e50914" />
                  </linearGradient>
                </defs>
              </svg>

              {/* Glow behind icon */}
              <motion.div
                className="splash__reel-glow"
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: phase === 'reveal' ? 0.6 : 0, scale: 1.2 }}
                transition={{ duration: 1.0, delay: 0.6 }}
              />
            </motion.div>

            {/* Logo text */}
            <motion.div
              className="splash__text"
              initial={{ opacity: 0, y: 30 }}
              animate={{
                opacity: phase === 'exit' ? 0 : 1,
                y: phase === 'exit' ? -20 : 0,
              }}
              transition={{ duration: 0.6, delay: 1.0 }}
            >
              <h1 className="splash__title">
                {'CinePass'.split('').map((char, i) => (
                  <motion.span
                    key={i}
                    className="splash__char"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1.2 + i * 0.1, duration: 0.35, type: 'spring' }}
                  >
                    {char}
                  </motion.span>
                ))}
              </h1>
              <motion.div
                className="splash__divider"
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ delay: 2.4, duration: 0.6, ease: 'easeOut' }}
              />
              <motion.p
                className="splash__tagline"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 2.8, duration: 0.6 }}
              >
                Your Premium Movie Experience
              </motion.p>
            </motion.div>

            {/* Loading bar */}
            <motion.div
              className="splash__loader"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 3.2, duration: 0.3 }}
            >
              <div className="splash__loader-track">
                <motion.div
                  className="splash__loader-fill"
                  initial={{ width: '0%' }}
                  animate={{ width: '100%' }}
                  transition={{ delay: 3.3, duration: 1.2, ease: 'easeInOut' }}
                />
              </div>
            </motion.div>
          </div>

          {/* Cinematic bars (letterbox) */}
          <motion.div
            className="splash__bar splash__bar--top"
            initial={{ height: '50%' }}
            animate={{ height: phase === 'exit' ? '50%' : '0%' }}
            transition={{ duration: 0.8, ease: 'easeInOut' }}
          />
          <motion.div
            className="splash__bar splash__bar--bottom"
            initial={{ height: '50%' }}
            animate={{ height: phase === 'exit' ? '50%' : '0%' }}
            transition={{ duration: 0.8, ease: 'easeInOut' }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default SplashScreen;
