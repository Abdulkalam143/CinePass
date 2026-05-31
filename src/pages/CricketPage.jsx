/**
 * CricketPage — Dedicated section for booking cricket matches
 */
import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Trophy, Search, Filter, Calendar, MapPin, Sparkles } from 'lucide-react';
import MatchCard from '../components/MatchCard';
import LocationIndicator from '../components/LocationIndicator';
import useGeolocation from '../utils/useGeolocation';
import cricketData from '../data/cricket.json';
import './CricketPage.css';

const CricketPage = () => {
  const {
    displayLocation, tmdbRegion, loading: locationLoading,
    error: locationError, permissionState, fetchLocation,
  } = useGeolocation();

  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');

  const categories = ['All', 'IPL', 'International', 'WPL'];

  const filteredMatches = useMemo(() => {
    return cricketData.filter(match => {
      const matchesSearch = match.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           match.venue.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = activeCategory === 'All' || match.category === activeCategory;
      return matchesSearch && matchesCategory;
    });
  }, [searchQuery, activeCategory]);

  return (
    <div className="cricket-page">
      {/* Hero Header */}
      <div className="cricket-hero">
        <div className="cricket-hero__overlay" />
        <div className="cricket-hero__content container">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="cricket-hero__badge">
              <Sparkles size={14} />
              Live Sports Booking
            </span>
            <h1 className="cricket-hero__title">Experience the Thrill <br/><span>At the Stadium</span></h1>
            <p className="cricket-hero__desc">
              Book tickets for the most awaited cricket matches of the season. 
              Get the best views and exclusive stadium experiences.
            </p>
          </motion.div>
        </div>
      </div>

      <div className="cricket-page__content container">
        {/* Toolbar */}
        <div className="cricket-toolbar">
          <div className="cricket-toolbar__left">
            <LocationIndicator
              displayLocation={displayLocation}
              loading={locationLoading}
              error={locationError}
              permissionState={permissionState}
              onRequestLocation={fetchLocation}
              tmdbRegion={tmdbRegion}
            />
          </div>

          <div className="cricket-toolbar__right">
            <div className="cricket-search">
              <Search size={18} />
              <input
                type="text"
                placeholder="Search matches or venues..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Categories */}
        <div className="cricket-categories">
          {categories.map(cat => (
            <button
              key={cat}
              className={`cricket-category ${activeCategory === cat ? 'active' : ''}`}
              onClick={() => setActiveCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Match Grid */}
        <div className="cricket-grid">
          {filteredMatches.length > 0 ? (
            filteredMatches.map((match, index) => (
              <MatchCard key={match.id} match={match} index={index} />
            ))
          ) : (
            <div className="cricket-empty">
              <Trophy size={48} />
              <h3>No matches found</h3>
              <p>Try adjusting your search or category filters</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CricketPage;
