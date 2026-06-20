/**
 * LanguageContext.jsx
 * Global context for application internationalization (i18n).
 * Persists language settings in localStorage, supports dot-notation translation keys,
 * handles replacement variables, and dynamically manages document direction (RTL/LTR).
 */
import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { translations } from '../i18n/translations';

const LanguageContext = createContext(null);

const STORAGE_KEY = 'cinepass_language';

// Helper to resolve dot-notation paths (e.g. 'nav.home' -> translations[lang].nav.home)
const getNestedValue = (obj, path) => {
  if (!obj || !path) return undefined;
  return path.split('.').reduce((acc, part) => acc && acc[part], obj);
};

export const useTranslation = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useTranslation must be used within a LanguageProvider');
  }
  return context;
};

export const LanguageProvider = ({ children }) => {
  const [language, setLanguageState] = useState(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (translations[stored]) return stored;
    } catch { /* ignore */ }
    return 'en';
  });

  // Handle document direction (RTL for Urdu, LTR for others)
  useEffect(() => {
    if (language === 'ur') {
      document.documentElement.setAttribute('dir', 'rtl');
      document.documentElement.setAttribute('lang', 'ur');
    } else {
      document.documentElement.setAttribute('dir', 'ltr');
      document.documentElement.setAttribute('lang', language);
    }
    try {
      localStorage.setItem(STORAGE_KEY, language);
    } catch { /* ignore */ }
  }, [language]);

  const setLanguage = useCallback((code) => {
    if (translations[code]) {
      setLanguageState(code);
    }
  }, []);

  const t = useCallback((key, replacements = {}) => {
    // 1. Try selected language
    let value = getNestedValue(translations[language], key);
    
    // 2. Fallback to English
    if (value === undefined && language !== 'en') {
      value = getNestedValue(translations['en'], key);
    }
    
    // 3. Fallback to the key itself
    if (value === undefined) {
      return key;
    }

    // 4. Interpolate variables (e.g. {year}, {count}, etc.)
    let result = String(value);
    Object.entries(replacements).forEach(([k, val]) => {
      result = result.replace(new RegExp(`{${k}}`, 'g'), val);
    });

    return result;
  }, [language]);

  const value = {
    language,
    setLanguage,
    t,
    languages: [
      { code: 'en', name: 'English', native: 'English' },
      { code: 'hi', name: 'Hindi', native: 'हिन्दी' },
      { code: 'te', name: 'Telugu', native: 'తెలుగు' },
      { code: 'ta', name: 'Tamil', native: 'தமிழ்' },
      { code: 'kn', name: 'Kannada', native: 'ಕನ್ನಡ' },
      { code: 'ml', name: 'Malayalam', native: 'മലയാളം' },
      { code: 'bn', name: 'Bengali', native: 'বাংলা' },
      { code: 'mr', name: 'Marathi', native: 'मराठी' },
      { code: 'gu', name: 'Gujarati', native: 'ગુજરાતી' },
      { code: 'pa', name: 'Punjabi', native: 'ਪੰਜਾਬੀ' },
      { code: 'or', name: 'Odia', native: 'ଓଡ଼ିଆ' },
      { code: 'as', name: 'Assamese', native: 'অসমীয়া' },
      { code: 'ur', name: 'Urdu', native: 'اردو' }
    ]
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};

export default LanguageContext;
