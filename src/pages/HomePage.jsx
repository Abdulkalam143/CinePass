/**
 * HomePage — Location-aware movie browsing with real-time screening data
 * Uses TMDB discover endpoint with theatrical release type filtering
 * and regional language prioritization based on user's city.
 */
import { useState, useEffect, useMemo, useCallback } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, Film, Sparkles, Clock, Flame, CalendarDays } from 'lucide-react';
import MovieCard from '../components/MovieCard';
import SearchBar from '../components/SearchBar';
import FilterBar from '../components/FilterBar';
import SkeletonCard from '../components/SkeletonCard';
import LocationIndicator from '../components/LocationIndicator';
import { useLocationContext } from '../context/LocationContext';
import {
  fetchNowScreening, fetchUpcoming, fetchTrending, searchMovies,
  getLanguageForCity, getLanguageLabel, BACKDROP_PLACEHOLDER,
} from '../utils/api';
import useGeolocation from '../utils/useGeolocation';
import staticMovies from '../data/movies.json';
import './HomePage.css';

const HomePage = () => {
  // Location tracking
  const {
    displayLocation: gpsLocation, tmdbRegion: gpsRegion, loading: locationLoading,
    error: locationError, permissionState, fetchLocation, location: gpsLocationData,
  } = useGeolocation();

  const { displayLocation: manualLocation, isManual, selectedCity } = useLocationContext();

  const displayLocation = manualLocation || gpsLocation;
  // For manual Indian city selections, use 'IN' as the region code
  const tmdbRegion = isManual ? 'IN' : gpsRegion;

  // Derive regional language from city (manual or GPS-detected)
  const activeCity = isManual ? selectedCity : gpsLocationData?.city || '';
  const regionalLanguage = activeCity ? getLanguageForCity(activeCity) : '';

  // Movie data states
  const [nowPlaying, setNowPlaying] = useState([]);
  const [upcoming, setUpcoming] = useState([]);
  const [trending, setTrending] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [activeGenre, setActiveGenre] = useState('All');
  const [activeSection, setActiveSection] = useState('now_playing');
  const [lastRefresh, setLastRefresh] = useState(null);

  /**
   * Load all movie sections — region & language aware
   * Uses /discover with release_type=2|3 for accurate theatrical data
   */
  const loadAllMovies = useCallback(async (region = '', language = '') => {
    setLoading(true);
    try {
      const [npData, upData, trData] = await Promise.allSettled([
        fetchNowScreening(region || 'IN', language),
        fetchUpcoming(1, region),
        fetchTrending('day'),
      ]);

      setNowPlaying(npData.status === 'fulfilled' && npData.value.length > 0 ? npData.value : staticMovies);
      setUpcoming(upData.status === 'fulfilled' ? upData.value : []);
      setTrending(trData.status === 'fulfilled' ? trData.value : []);
      setLastRefresh(new Date());
    } catch {
      setNowPlaying(staticMovies);
    }
    setLoading(false);
  }, []);

  // Initial load (no region yet)
  useEffect(() => {
    loadAllMovies();
  }, []);

  // Re-fetch when user's location/region or regional language changes
  useEffect(() => {
    if (tmdbRegion || regionalLanguage) {
      loadAllMovies(tmdbRegion, regionalLanguage);
    }
  }, [tmdbRegion, regionalLanguage, loadAllMovies]);

  // Handle search with debounce
  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      return;
    }

    const timer = setTimeout(async () => {
      try {
        const results = await searchMovies(searchQuery, tmdbRegion);
        setSearchResults(results);
      } catch {
        const local = [...nowPlaying, ...upcoming, ...trending].filter(m =>
          m.title.toLowerCase().includes(searchQuery.toLowerCase())
        );
        setSearchResults(local);
      }
    }, 400);

    return () => clearTimeout(timer);
  }, [searchQuery, tmdbRegion]);

  // Get the active movie list based on selected section
  const activeMovies = useMemo(() => {
    if (searchQuery.trim()) return searchResults;
    switch (activeSection) {
      case 'upcoming': return upcoming;
      case 'trending': return trending;
      default: return nowPlaying;
    }
  }, [activeSection, nowPlaying, upcoming, trending, searchQuery, searchResults]);

  // Filter by genre
  const filteredMovies = useMemo(() => {
    if (activeGenre === 'All') return activeMovies;
    return activeMovies.filter((m) =>
      m.genre?.some((g) => g.toLowerCase() === activeGenre.toLowerCase())
    );
  }, [activeMovies, activeGenre]);

  // Featured movie (highest rated from now playing)
  const featured = useMemo(() => {
    if (nowPlaying.length === 0) return null;
    return [...nowPlaying].sort((a, b) => b.rating - a.rating)[0];
  }, [nowPlaying]);

  // Section tabs config
  const sectionTabs = [
    { id: 'now_playing', label: 'Now Screening', icon: Film, count: nowPlaying.length },
    { id: 'upcoming', label: 'Coming Soon', icon: CalendarDays, count: upcoming.length },
    { id: 'trending', label: 'Trending Today', icon: Flame, count: trending.length },
  ];

  // Regional language info for display
  const regionalLabel = regionalLanguage ? getLanguageLabel(regionalLanguage) : '';

  return (
    <div className="home-page" id="home-page">
      {/* Hero Section */}
      {featured && !loading && (
        <section
          className="hero"
          style={{
            backgroundImage: featured.backdrop
              ? `url(${featured.backdrop})`
              : `url(${BACKDROP_PLACEHOLDER})`,
          }}
        >
          <div className="hero__overlay" />
          <div className="hero__content container">
            <motion.div
              className="hero__text"
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
            >
              <span className="hero__badge">
                <Sparkles size={14} />
                {displayLocation ? `Now Screening in ${displayLocation}` : 'Now Screening'}
              </span>
              <h1 className="hero__title">{featured.title}</h1>
              <p className="hero__desc">{featured.description?.slice(0, 160)}...</p>
              <div className="hero__meta">
                <span className="hero__rating">⭐ {featured.rating}</span>
                {featured.genre?.map((g) => (
                  <span key={g} className="hero__genre">{g}</span>
                ))}
                {featured.languageLabel && (
                  <span className="hero__lang-badge">{featured.languageLabel}</span>
                )}
                {featured.releaseDate && (
                  <span className="hero__release">
                    📅 {new Date(featured.releaseDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                  </span>
                )}
              </div>
            </motion.div>
          </div>
        </section>
      )}

      {/* Main Content */}
      <section className="home-page__content container">
        {/* Location + Search Bar */}
        <div className="home-page__toolbar">
          <div className="home-page__toolbar-left">
            <LocationIndicator
              displayLocation={displayLocation}
              loading={locationLoading}
              error={locationError}
              permissionState={permissionState}
              onRequestLocation={fetchLocation}
              tmdbRegion={tmdbRegion}
            />
            {lastRefresh && (
              <span className="home-page__last-refresh">
                <Clock size={10} />
                Updated {lastRefresh.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
              </span>
            )}
          </div>
          <SearchBar value={searchQuery} onChange={setSearchQuery} />
        </div>

        {/* Section Tabs — Now Screening / Coming Soon / Trending */}
        {!searchQuery.trim() && (
          <div className="home-page__section-tabs">
            {sectionTabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <motion.button
                  key={tab.id}
                  className={`home-page__section-tab ${activeSection === tab.id ? 'active' : ''}`}
                  onClick={() => setActiveSection(tab.id)}
                  whileTap={{ scale: 0.97 }}
                  id={`tab-${tab.id}`}
                >
                  <Icon size={16} />
                  <span className="home-page__tab-label">{tab.label}</span>
                  {tab.count > 0 && (
                    <span className="home-page__tab-count">{tab.count}</span>
                  )}
                </motion.button>
              );
            })}
          </div>
        )}

        {/* Section header */}
        <div className="home-page__section-header">
          {searchQuery.trim() ? (
            <h2 className="home-page__section-title">
              🔍 Search results for "{searchQuery}"
            </h2>
          ) : (
            <h2 className="home-page__section-title">
              {activeSection === 'now_playing' && (
                <>
                  <TrendingUp size={22} className="home-page__section-icon" />
                  Now Screening{displayLocation ? ` in ${displayLocation}` : ''}
                  {regionalLabel && activeSection === 'now_playing' && (
                    <span className="home-page__region-tag">
                      {regionalLabel} + All India
                    </span>
                  )}
                </>
              )}
              {activeSection === 'upcoming' && (
                <><CalendarDays size={22} className="home-page__section-icon" /> Coming Soon{displayLocation ? ` in ${displayLocation}` : ''}</>
              )}
              {activeSection === 'trending' && (
                <><Flame size={22} className="home-page__section-icon" /> Trending Today</>
              )}
            </h2>
          )}
          <span className="home-page__count">{filteredMovies.length} movies</span>
        </div>

        {/* Genre Filter */}
        <FilterBar activeGenre={activeGenre} onGenreChange={setActiveGenre} />

        {/* Movie Grid */}
        <div className="home-page__grid">
          {loading ? (
            Array.from({ length: 8 }).map((_, i) => <SkeletonCard key={i} />)
          ) : filteredMovies.length > 0 ? (
            filteredMovies.map((movie, i) => (
              <MovieCard key={movie.id} movie={movie} index={i} />
            ))
          ) : (
            <div className="home-page__empty">
              <Film size={48} />
              <h3>No movies found</h3>
              <p>Try adjusting your search, filter, or enable location for regional results</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default HomePage;
