/**
 * FilterBar — Genre filter chips for movie filtering
 */
import { motion } from 'framer-motion';
import './FilterBar.css';

const GENRES = ['All', 'Action', 'Comedy', 'Drama', 'Sci-Fi', 'Horror', 'Thriller'];

const FilterBar = ({ activeGenre, onGenreChange }) => {
  return (
    <div className="filter-bar" id="filter-bar">
      {GENRES.map((genre) => (
        <motion.button
          key={genre}
          className={`filter-bar__chip ${activeGenre === genre ? 'active' : ''}`}
          onClick={() => onGenreChange(genre)}
          whileTap={{ scale: 0.95 }}
          id={`filter-${genre.toLowerCase()}`}
        >
          {genre}
        </motion.button>
      ))}
    </div>
  );
};

export default FilterBar;
