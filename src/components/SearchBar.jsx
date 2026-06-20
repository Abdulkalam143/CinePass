/**
 * SearchBar — Animated search input with icon
 */
import { Search, X } from 'lucide-react';
import { useTranslation } from '../context/LanguageContext';
import './SearchBar.css';

const SearchBar = ({ value, onChange, placeholder }) => {
  const { t } = useTranslation();
  const searchPlaceholder = placeholder || t('search.placeholder');

  return (
    <div className="search-bar" id="search-bar">
      <Search size={18} className="search-bar__icon" />
      <input
        type="text"
        className="search-bar__input"
        placeholder={searchPlaceholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        id="search-input"
      />
      {value && (
        <button
          className="search-bar__clear"
          onClick={() => onChange('')}
          aria-label="Clear search"
          id="search-clear-btn"
        >
          <X size={16} />
        </button>
      )}
    </div>
  );
};

export default SearchBar;
