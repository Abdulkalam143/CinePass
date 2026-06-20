/**
 * LanguageSelector.jsx
 * Premium language selector dropdown for the navbar actions area.
 * Displays native language scripts and has smooth framer-motion animations.
 */
import { useState, useRef, useEffect } from 'react';
import { Globe, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from '../context/LanguageContext';
import './LanguageSelector.css';

const LanguageSelector = () => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const { language, setLanguage, languages } = useTranslation();

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const currentLang = languages.find((lang) => lang.code === language) || languages[0];

  const handleLanguageSelect = (code) => {
    setLanguage(code);
    setIsOpen(false);
  };

  // Animation variants
  const dropdownVariants = {
    hidden: { 
      opacity: 0, 
      y: 10,
      scale: 0.95,
      transition: { duration: 0.15 } 
    },
    visible: { 
      opacity: 1, 
      y: 0,
      scale: 1,
      transition: { 
        type: 'spring', 
        stiffness: 300, 
        damping: 24,
        duration: 0.2 
      } 
    },
    exit: { 
      opacity: 0, 
      y: 10,
      scale: 0.95,
      transition: { duration: 0.1 } 
    }
  };

  return (
    <div className="lang-selector" ref={dropdownRef}>
      <button
        className={`lang-selector__btn ${isOpen ? 'active' : ''}`}
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
        aria-haspopup="true"
        title="Change Language"
        aria-label="Change Language"
      >
        <Globe size={18} className="lang-selector__globe" />
        <span className="lang-selector__label">{currentLang.native}</span>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="lang-selector__dropdown"
            variants={dropdownVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            <div className="lang-selector__dropdown-inner">
              <div className="lang-selector__dropdown-header">
                Select Language
              </div>
              <ul className="lang-selector__list" role="listbox">
                {languages.map((lang) => {
                  const isSelected = lang.code === language;
                  return (
                    <li key={lang.code} role="option" aria-selected={isSelected}>
                      <button
                        className={`lang-selector__option ${isSelected ? 'selected' : ''}`}
                        onClick={() => handleLanguageSelect(lang.code)}
                      >
                        <span className="lang-selector__option-native">{lang.native}</span>
                        <span className="lang-selector__option-name">{lang.name}</span>
                        {isSelected && (
                          <Check size={16} className="lang-selector__check" />
                        )}
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default LanguageSelector;
