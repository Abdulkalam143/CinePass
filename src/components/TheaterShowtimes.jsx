/**
 * TheaterShowtimes — Shows which nearby theaters are screening this movie
 * Each theater shows screen number and available showtimes
 * Uses GPS to find real nearby cinema names from OpenStreetMap
 */
import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  MapPin, Navigation, Loader, Monitor, Clock,
  ChevronRight, Building2, Armchair, Wifi,
} from 'lucide-react';
import './TheaterShowtimes.css';

/**
 * Calculate distance between two coordinates (Haversine)
 */
const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
};

/**
 * Fetch nearby cinemas from OpenStreetMap Overpass API
 */
const fetchNearbyCinemas = async (lat, lon) => {
  const query = `
    [out:json][timeout:12];
    (
      node["amenity"="cinema"](around:20000,${lat},${lon});
      way["amenity"="cinema"](around:20000,${lat},${lon});
    );
    out center body;
  `;
  const response = await fetch('https://overpass-api.de/api/interpreter', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: `data=${encodeURIComponent(query)}`,
  });
  if (!response.ok) throw new Error('Failed to fetch');
  const data = await response.json();

  return data.elements
    .map((el) => {
      const elLat = el.lat || el.center?.lat;
      const elLon = el.lon || el.center?.lon;
      if (!elLat || !elLon) return null;
      return {
        id: el.id,
        name: el.tags?.name || 'Cinema',
        lat: elLat,
        lon: elLon,
        distance: Math.round(calculateDistance(lat, lon, elLat, elLon) * 10) / 10,
        address: el.tags?.['addr:street']
          ? `${el.tags['addr:street']}${el.tags['addr:city'] ? ', ' + el.tags['addr:city'] : ''}`
          : el.tags?.['addr:city'] || '',
        brand: el.tags?.brand || '',
        screenCount: el.tags?.screens ? parseInt(el.tags.screens) : null,
      };
    })
    .filter((t) => t && t.name !== 'Cinema') // Skip unnamed
    .sort((a, b) => a.distance - b.distance)
    .slice(0, 8);
};

/**
 * Generate simulated screens & showtimes for a theater
 * Uses movie ID as seed so same movie always gets same times per theater
 */
const generateTheaterScreens = (theaterId, movieId) => {
  // Seed-based pseudo-random to keep consistency
  const seed = (theaterId * 7 + movieId * 13) % 100;
  const screenCount = 1 + (seed % 3); // 1-3 screens per theater

  const allTimes = [
    '9:00 AM', '9:30 AM', '10:00 AM', '10:30 AM',
    '11:00 AM', '12:00 PM', '12:30 PM', '1:00 PM',
    '1:30 PM', '2:00 PM', '3:00 PM', '3:30 PM',
    '4:00 PM', '4:30 PM', '5:00 PM', '6:00 PM',
    '6:30 PM', '7:00 PM', '7:30 PM', '8:00 PM',
    '9:00 PM', '9:30 PM', '10:00 PM', '10:30 PM',
  ];

  const formats = ['2D', '3D', 'IMAX', '4DX', 'Dolby Atmos'];
  const screens = [];

  for (let i = 0; i < screenCount; i++) {
    const screenSeed = (seed + i * 17) % allTimes.length;
    const timeCount = 3 + (screenSeed % 3); // 3-5 showtimes
    const startIdx = (screenSeed * 3) % (allTimes.length - timeCount);

    // Pick sequential showtimes for realism
    const showtimes = [];
    const usedIndices = new Set();
    let idx = startIdx;
    while (showtimes.length < timeCount && idx < allTimes.length) {
      if (!usedIndices.has(idx)) {
        showtimes.push(allTimes[idx]);
        usedIndices.add(idx);
        idx += 2 + (screenSeed % 2); // Skip 2-3 slots between shows
      } else {
        idx++;
      }
    }

    const formatIdx = (seed + i * 7) % formats.length;
    screens.push({
      screenNumber: i + 1 + ((seed % 4) * 2), // Realistic screen numbers
      format: formats[formatIdx],
      showtimes,
      price: formatIdx >= 2 ? 350 : formatIdx === 1 ? 300 : 250, // IMAX/4DX more expensive
    });
  }

  return screens;
};

const TheaterShowtimes = ({ movieId, movieTitle, onSelectShowtime }) => {
  const [theaters, setTheaters] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [locationRequested, setLocationRequested] = useState(false);
  const [selectedTheater, setSelectedTheater] = useState(null);
  const [selectedScreen, setSelectedScreen] = useState(null);
  const [selectedTime, setSelectedTime] = useState('');
  const [expandedTheater, setExpandedTheater] = useState(null);

  // Check if location was previously granted
  useEffect(() => {
    if (navigator.permissions) {
      navigator.permissions.query({ name: 'geolocation' }).then((result) => {
        if (result.state === 'granted') {
          findTheaters();
        }
      }).catch(() => {});
    }
  }, [movieId]);

  const findTheaters = useCallback(() => {
    if (!navigator.geolocation) {
      setError('Geolocation not supported');
      return;
    }

    setLoading(true);
    setError(null);
    setLocationRequested(true);

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const cinemas = await fetchNearbyCinemas(
            position.coords.latitude,
            position.coords.longitude
          );

          // Attach screen & showtime data to each theater
          const theatersWithScreens = cinemas.map((theater) => ({
            ...theater,
            screens: generateTheaterScreens(theater.id, movieId),
          }));

          setTheaters(theatersWithScreens);
          if (theatersWithScreens.length > 0) {
            setExpandedTheater(theatersWithScreens[0].id);
          }
          if (theatersWithScreens.length === 0) {
            setError('No theaters found nearby. Try enabling location or searching manually.');
          }
        } catch {
          setError('Could not fetch nearby theaters. Please try again.');
        }
        setLoading(false);
      },
      () => {
        setLoading(false);
        setError('Location access denied. Please enable in browser settings.');
      },
      { enableHighAccuracy: false, timeout: 8000, maximumAge: 300000 }
    );
  }, [movieId]);

  /**
   * Handle showtime selection
   */
  const handleSelectTime = (theater, screen, time) => {
    setSelectedTheater(theater);
    setSelectedScreen(screen);
    setSelectedTime(time);

    // Pass selection up to parent
    onSelectShowtime({
      theaterName: theater.name,
      theaterDistance: theater.distance,
      screenNumber: screen.screenNumber,
      format: screen.format,
      time,
      displayText: `${time} • Screen ${screen.screenNumber} (${screen.format})`,
      fullDisplay: `${theater.name} — Screen ${screen.screenNumber} (${screen.format}) — ${time}`,
    });
  };

  const isSelected = (theaterId, screenNum, time) =>
    selectedTheater?.id === theaterId &&
    selectedScreen?.screenNumber === screenNum &&
    selectedTime === time;

  return (
    <section className="theater-showtimes" id="theater-showtimes">
      <h2 className="theater-showtimes__title">
        <Building2 size={22} />
        Select Theater & Showtime
      </h2>
      <p className="theater-showtimes__subtitle">
        Theaters showing <strong>{movieTitle}</strong> near you
      </p>

      {/* Location prompt */}
      {!locationRequested && !loading && theaters.length === 0 && (
        <div className="theater-showtimes__prompt">
          <div className="theater-showtimes__prompt-icon">
            <Navigation size={28} />
          </div>
          <p>Enable location to see theaters screening this movie near you</p>
          <button
            className="theater-showtimes__location-btn"
            onClick={findTheaters}
            id="find-theaters-for-movie-btn"
          >
            <MapPin size={16} />
            Find Theaters Near Me
          </button>
        </div>
      )}

      {/* Loading */}
      {loading && (
        <div className="theater-showtimes__loading">
          <Loader size={24} className="theater-showtimes__spinner" />
          <p>Finding theaters showing this movie...</p>
        </div>
      )}

      {/* Error */}
      {error && !loading && (
        <div className="theater-showtimes__error">
          <span>{error}</span>
          <button onClick={findTheaters} className="theater-showtimes__retry">
            Try Again
          </button>
        </div>
      )}

      {/* Theater List */}
      {!loading && theaters.length > 0 && (
        <div className="theater-showtimes__list">
          {theaters.map((theater, idx) => (
            <motion.div
              key={theater.id}
              className={`theater-item ${expandedTheater === theater.id ? 'expanded' : ''}`}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.06 }}
            >
              {/* Theater header — click to expand/collapse */}
              <button
                className="theater-item__header"
                onClick={() =>
                  setExpandedTheater(expandedTheater === theater.id ? null : theater.id)
                }
                id={`theater-header-${theater.id}`}
              >
                <div className="theater-item__info">
                  <h3 className="theater-item__name">
                    {theater.name}
                    {theater.brand && (
                      <span className="theater-item__brand">{theater.brand}</span>
                    )}
                  </h3>
                  {theater.address && (
                    <p className="theater-item__address">{theater.address}</p>
                  )}
                </div>

                <div className="theater-item__right">
                  <span className="theater-item__distance">{theater.distance} km</span>
                  <span className="theater-item__screens-count">
                    {theater.screens.length} screen{theater.screens.length > 1 ? 's' : ''}
                  </span>
                  <ChevronRight
                    size={18}
                    className={`theater-item__chevron ${expandedTheater === theater.id ? 'rotated' : ''}`}
                  />
                </div>
              </button>

              {/* Expanded: screens & showtimes */}
              <AnimatePresence>
                {expandedTheater === theater.id && (
                  <motion.div
                    className="theater-item__screens"
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.25 }}
                  >
                    {theater.screens.map((screen) => (
                      <div key={screen.screenNumber} className="screen-row">
                        <div className="screen-row__info">
                          <Monitor size={14} />
                          <span className="screen-row__number">
                            Screen {screen.screenNumber}
                          </span>
                          <span className={`screen-row__format format--${screen.format.toLowerCase().replace(/\s/g, '')}`}>
                            {screen.format}
                          </span>
                          <span className="screen-row__price">₹{screen.price}</span>
                        </div>

                        <div className="screen-row__times">
                          {screen.showtimes.map((time) => (
                            <button
                              key={time}
                              className={`screen-row__time-btn ${isSelected(theater.id, screen.screenNumber, time) ? 'selected' : ''}`}
                              onClick={() => handleSelectTime(theater, screen, time)}
                              id={`time-${theater.id}-${screen.screenNumber}-${time.replace(/[\s:]/g, '')}`}
                            >
                              <Clock size={11} />
                              {time}
                            </button>
                          ))}
                        </div>
                      </div>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}

          {/* Amenities legend */}
          <div className="theater-showtimes__legend">
            <span className="legend-item"><Armchair size={12} /> Recliner available</span>
            <span className="legend-item"><Wifi size={12} /> Online booking</span>
            <span className="legend-item format--imax">IMAX</span>
            <span className="legend-item format--dolbyatmos">Dolby Atmos</span>
            <span className="legend-item format--4dx">4DX</span>
          </div>
        </div>
      )}
    </section>
  );
};

export default TheaterShowtimes;
