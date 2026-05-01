/**
 * NearbyTheaters — Shows theaters near user's location using GPS
 * Uses OpenStreetMap Overpass API (free, no key needed) to find cinemas
 */
import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, Navigation, Loader, AlertCircle, ExternalLink, ChevronDown, ChevronUp } from 'lucide-react';
import './NearbyTheaters.css';

/**
 * Calculate distance between two coordinates using Haversine formula
 * Returns distance in km
 */
const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371; // Earth radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

/**
 * Fetch nearby cinemas from OpenStreetMap Overpass API
 */
const fetchNearbyCinemas = async (lat, lon, radiusMeters = 15000) => {
  const query = `
    [out:json][timeout:15];
    (
      node["amenity"="cinema"](around:${radiusMeters},${lat},${lon});
      way["amenity"="cinema"](around:${radiusMeters},${lat},${lon});
    );
    out center body;
  `;

  const response = await fetch('https://overpass-api.de/api/interpreter', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: `data=${encodeURIComponent(query)}`,
  });

  if (!response.ok) throw new Error('Failed to fetch nearby theaters');

  const data = await response.json();

  return data.elements
    .map((el) => {
      const elLat = el.lat || el.center?.lat;
      const elLon = el.lon || el.center?.lon;
      if (!elLat || !elLon) return null;

      const distance = calculateDistance(lat, lon, elLat, elLon);
      return {
        id: el.id,
        name: el.tags?.name || 'Unnamed Cinema',
        lat: elLat,
        lon: elLon,
        distance: Math.round(distance * 10) / 10, // 1 decimal
        address: el.tags?.['addr:street']
          ? `${el.tags['addr:street']}${el.tags['addr:city'] ? ', ' + el.tags['addr:city'] : ''}`
          : el.tags?.['addr:city'] || '',
        phone: el.tags?.phone || el.tags?.['contact:phone'] || '',
        website: el.tags?.website || el.tags?.['contact:website'] || '',
        brand: el.tags?.brand || '',
        screens: el.tags?.screens || '',
        wheelchair: el.tags?.wheelchair || '',
      };
    })
    .filter(Boolean)
    .sort((a, b) => a.distance - b.distance)
    .slice(0, 10); // Top 10 nearest
};

const NearbyTheaters = () => {
  const [theaters, setTheaters] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [userLocation, setUserLocation] = useState(null);
  const [expanded, setExpanded] = useState(true);
  const [locationRequested, setLocationRequested] = useState(false);

  /**
   * Request user's GPS location and fetch nearby theaters
   */
  const findTheaters = useCallback(() => {
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by your browser');
      return;
    }

    setLoading(true);
    setError(null);
    setLocationRequested(true);

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        setUserLocation({ lat: latitude, lon: longitude });

        try {
          const cinemas = await fetchNearbyCinemas(latitude, longitude);
          if (cinemas.length === 0) {
            setError('No theaters found within 15 km. Try expanding your search area.');
          }
          setTheaters(cinemas);
        } catch (err) {
          console.error('Error fetching theaters:', err);
          setError('Unable to fetch nearby theaters. Please try again.');
        }
        setLoading(false);
      },
      (err) => {
        setLoading(false);
        switch (err.code) {
          case err.PERMISSION_DENIED:
            setError('Location access denied. Please enable location permissions in your browser settings.');
            break;
          case err.POSITION_UNAVAILABLE:
            setError('Location information is unavailable.');
            break;
          case err.TIMEOUT:
            setError('Location request timed out. Please try again.');
            break;
          default:
            setError('An unknown error occurred while getting your location.');
        }
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 300000, // Cache location for 5 minutes
      }
    );
  }, []);

  /**
   * Open theater location in Google Maps
   */
  const openInMaps = (theater) => {
    const url = `https://www.google.com/maps/search/?api=1&query=${theater.lat},${theater.lon}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <section className="nearby-theaters" id="nearby-theaters">
      <div className="nearby-theaters__header" onClick={() => setExpanded(!expanded)}>
        <div className="nearby-theaters__title-row">
          <MapPin size={20} className="nearby-theaters__icon" />
          <h2 className="nearby-theaters__title">Nearby Theaters</h2>
        </div>
        <button className="nearby-theaters__toggle" aria-label="Toggle theaters">
          {expanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
        </button>
      </div>

      <AnimatePresence>
        {expanded && (
          <motion.div
            className="nearby-theaters__content"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            {/* Initial state — show find button */}
            {!locationRequested && (
              <div className="nearby-theaters__prompt">
                <div className="nearby-theaters__prompt-icon">
                  <Navigation size={32} />
                </div>
                <p className="nearby-theaters__prompt-text">
                  Find cinemas near your current location
                </p>
                <button
                  className="nearby-theaters__find-btn"
                  onClick={findTheaters}
                  id="find-theaters-btn"
                >
                  <MapPin size={16} />
                  Use My Location
                </button>
                <p className="nearby-theaters__prompt-hint">
                  We'll use your GPS to find the nearest theaters
                </p>
              </div>
            )}

            {/* Loading state */}
            {loading && (
              <div className="nearby-theaters__loading">
                <Loader size={24} className="nearby-theaters__spinner" />
                <p>Finding theaters near you...</p>
              </div>
            )}

            {/* Error state */}
            {error && !loading && (
              <div className="nearby-theaters__error">
                <AlertCircle size={18} />
                <span>{error}</span>
                <button
                  className="nearby-theaters__retry-btn"
                  onClick={findTheaters}
                >
                  Try Again
                </button>
              </div>
            )}

            {/* Theater list */}
            {!loading && theaters.length > 0 && (
              <div className="nearby-theaters__list">
                {userLocation && (
                  <p className="nearby-theaters__location-info">
                    📍 Showing theaters within 15 km of your location
                  </p>
                )}

                {theaters.map((theater, index) => (
                  <motion.div
                    key={theater.id}
                    className="theater-card"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.08 }}
                    onClick={() => openInMaps(theater)}
                    id={`theater-${theater.id}`}
                  >
                    <div className="theater-card__rank">
                      {index + 1}
                    </div>

                    <div className="theater-card__info">
                      <h3 className="theater-card__name">
                        {theater.name}
                        {theater.brand && (
                          <span className="theater-card__brand">{theater.brand}</span>
                        )}
                      </h3>

                      {theater.address && (
                        <p className="theater-card__address">{theater.address}</p>
                      )}

                      <div className="theater-card__meta">
                        {theater.screens && (
                          <span className="theater-card__screens">
                            🎬 {theater.screens} screens
                          </span>
                        )}
                        {theater.phone && (
                          <span className="theater-card__phone">
                            📞 {theater.phone}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="theater-card__distance">
                      <span className="theater-card__km">{theater.distance} km</span>
                      <ExternalLink size={14} className="theater-card__link-icon" />
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default NearbyTheaters;
