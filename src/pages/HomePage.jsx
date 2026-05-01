/**
 * HomePage — Location-aware movie browsing with real-time tracking
 * Fetches Now Playing, Upcoming, and Trending movies based on user's GPS region
 */
import { useState, useEffect, useMemo, useCallback } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, Film, Sparkles, Clock, Flame, CalendarDays } from 'lucide-react';
import MovieCard from '../components/MovieCard';
import SearchBar from '../components/SearchBar';
import FilterBar from '../components/FilterBar';
import SkeletonCard from '../components/SkeletonCard';
import LocationIndicator from '../components/LocationIndicator';
import { fetchNowPlaying, fetchUpcoming, fetchTrending, searchMovies } from '../utils/api';
import useGeolocation from '../utils/useGeolocation';
import staticMovies from '../data/movies.json';
import './HomePage.css';

const HomePage = () => {
  // Location tracking
  const {
    displayLocation, tmdbRegion, loading: locationLoading,
    error: locationError, permissionState, fetchLocation,
  } = useGeolocation();

  // Movie data states
  const [nowPlaying, setNowPlaying] = useState([]);
  const [upcoming, setUpcoming] = useState([]);
  const [trending, setTrending] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [activeGenre, setActiveGenre] = useState('All');
  const [activeSection, setActiveSection] = useState('now_playing'); // now_playing | upcoming | trending
  const [lastRefresh, setLastRefresh] = useState(null);

  /**
   * Load all movie sections — region-aware
   * Triggered on mount and when tmdbRegion changes
   */
  const loadAllMovies = useCallback(async (region = '') => {
    setLoading(true);
    try {
      // Fetch all 3 sections in parallel for speed
      const [npData, upData, trData] = await Promise.allSettled([
        fetchNowPlaying(1, region),
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

  // Re-fetch when user's location/region changes
  useEffect(() => {
    if (tmdbRegion) {
      loadAllMovies(tmdbRegion);
    }
  }, [tmdbRegion, loadAllMovies]);

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
        // Fallback to local filter
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
    // If searching, show search results
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
    { id: 'now_playing', label: 'Now Playing', icon: Film, count: nowPlaying.length },
    { id: 'upcoming', label: 'Coming Soon', icon: CalendarDays, count: upcoming.length },
    { id: 'trending', label: 'Trending Today', icon: Flame, count: trending.length },
  ];

  return (
    <div className="home-page" id="home-page">
      {/* Hero Section */}
      {featured && !loading && (
        <section
          className="hero"
          style={{
            backgroundImage: featured.backdrop
              ? `url(${featured.backdrop})`
              : 'none',
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
                Featured{displayLocation ? ` in ${displayLocation}` : ''}
              </span>
              <h1 className="hero__title">{featured.title}</h1>
              <p className="hero__desc">{featured.description?.slice(0, 160)}...</p>
              <div className="hero__meta">
                <span className="hero__rating">⭐ {featured.rating}</span>
                {featured.genre?.map((g) => (
                  <span key={g} className="hero__genre">{g}</span>
                ))}
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

        {/* Section Tabs — Now Playing / Coming Soon / Trending */}
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
                <><TrendingUp size={22} className="home-page__section-icon" /> Now Playing{displayLocation ? ` in ${displayLocation}` : ''}</>
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
