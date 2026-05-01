/**
 * useGeolocation — Custom hook for GPS location tracking
 * Gets user's coordinates, reverse-geocodes to city/country,
 * and maps to TMDB region code for location-specific movies
 */
import { useState, useEffect, useCallback } from 'react';

// Reverse geocode coordinates → city, state, country using OpenStreetMap Nominatim
const reverseGeocode = async (lat, lon) => {
  const response = await fetch(
    `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json&accept-language=en`,
    { headers: { 'User-Agent': 'CinePass Movie Booking App' } }
  );
  if (!response.ok) throw new Error('Geocoding failed');
  const data = await response.json();

  return {
    city: data.address?.city || data.address?.town || data.address?.village || data.address?.county || '',
    state: data.address?.state || '',
    country: data.address?.country || '',
    countryCode: (data.address?.country_code || '').toUpperCase(),
    displayName: data.display_name || '',
  };
};

/**
 * Custom hook that provides:
 * - User's lat/lon coordinates
 * - Reverse-geocoded location (city, state, country)
 * - TMDB region code (ISO 3166-1)
 * - Loading / error states
 * - Manual refresh
 */
const useGeolocation = () => {
  const [coordinates, setCoordinates] = useState(null);
  const [location, setLocation] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [permissionState, setPermissionState] = useState('prompt'); // prompt | granted | denied

  // Check permission state on mount
  useEffect(() => {
    if (navigator.permissions) {
      navigator.permissions.query({ name: 'geolocation' }).then((result) => {
        setPermissionState(result.state);
        result.onchange = () => setPermissionState(result.state);

        // Auto-fetch if previously granted
        if (result.state === 'granted') {
          fetchLocation();
        }
      }).catch(() => {
        // permissions API not supported, try to load from cache
        const cached = loadCachedLocation();
        if (cached) {
          setCoordinates(cached.coordinates);
          setLocation(cached.location);
        }
      });
    }
  }, []);

  // Load cached location from localStorage (valid for 30 minutes)
  const loadCachedLocation = () => {
    try {
      const cached = localStorage.getItem('cinepass_location');
      if (!cached) return null;
      const parsed = JSON.parse(cached);
      const age = Date.now() - parsed.timestamp;
      if (age > 30 * 60 * 1000) return null; // Expired (30 min)
      return parsed;
    } catch {
      return null;
    }
  };

  // Save location to localStorage
  const cacheLocation = (coords, loc) => {
    try {
      localStorage.setItem('cinepass_location', JSON.stringify({
        coordinates: coords,
        location: loc,
        timestamp: Date.now(),
      }));
    } catch { /* ignore */ }
  };

  /**
   * Request GPS position and reverse geocode
   */
  const fetchLocation = useCallback(() => {
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by your browser');
      return;
    }

    setLoading(true);
    setError(null);

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const coords = {
          lat: position.coords.latitude,
          lon: position.coords.longitude,
          accuracy: position.coords.accuracy,
        };
        setCoordinates(coords);

        try {
          const geo = await reverseGeocode(coords.lat, coords.lon);
          setLocation(geo);
          cacheLocation(coords, geo);
          setPermissionState('granted');
        } catch (err) {
          console.error('Reverse geocoding failed:', err);
          // Still set coordinates even if geocoding fails
          setLocation({
            city: '',
            state: '',
            country: '',
            countryCode: '',
            displayName: `${coords.lat.toFixed(2)}, ${coords.lon.toFixed(2)}`,
          });
        }
        setLoading(false);
      },
      (err) => {
        setLoading(false);
        switch (err.code) {
          case err.PERMISSION_DENIED:
            setError('Location access denied');
            setPermissionState('denied');
            break;
          case err.POSITION_UNAVAILABLE:
            setError('Location unavailable');
            break;
          case err.TIMEOUT:
            setError('Location request timed out');
            break;
          default:
            setError('Unable to get location');
        }
      },
      {
        enableHighAccuracy: false, // Use coarse location for speed
        timeout: 8000,
        maximumAge: 300000, // Cache for 5 minutes
      }
    );
  }, []);

  /**
   * Get short display string like "Chennai, India"
   */
  const displayLocation = location
    ? [location.city, location.country].filter(Boolean).join(', ') || location.displayName
    : null;

  /**
   * Get TMDB region code (ISO 3166-1 alpha-2)
   */
  const tmdbRegion = location?.countryCode || '';

  return {
    coordinates,
    location,
    displayLocation,
    tmdbRegion,
    loading,
    error,
    permissionState,
    fetchLocation, // Manual trigger
  };
};

export default useGeolocation;
