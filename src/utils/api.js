/**
 * TMDB API utility functions
 * Fetches real-time movie data from The Movie Database API
 * Uses /discover endpoint with theatrical release type filtering
 * and cross-checks digital/OTT release dates to ensure only
 * movies CURRENTLY IN THEATERS are shown (not already on OTT).
 */

const API_KEY = import.meta.env.VITE_TMDB_API_KEY;
const BASE_URL = 'https://api.themoviedb.org/3';
const IMG_BASE = 'https://image.tmdb.org/t/p';

// ─── City → Regional Language Mapping ───────────────────────────
const CITY_LANGUAGE_MAP = {
  // Tamil Nadu
  'Chennai': 'ta', 'Coimbatore': 'ta', 'Madurai': 'ta', 'Salem': 'ta',
  // Telangana / Andhra Pradesh
  'Hyderabad': 'te', 'Warangal': 'te', 'Nizamabad': 'te',
  'Visakhapatnam': 'te', 'Vijayawada': 'te', 'Guntur': 'te', 'Nellore': 'te',
  // Karnataka
  'Bengaluru': 'kn', 'Mysuru': 'kn', 'Hubballi': 'kn', 'Mangaluru': 'kn',
  // Kerala
  'Thiruvananthapuram': 'ml', 'Kochi': 'ml', 'Kozhikode': 'ml',
  // Hindi belt
  'New Delhi': 'hi', 'Noida': 'hi', 'Gurugram': 'hi',
  'Mumbai': 'hi', 'Pune': 'hi', 'Nagpur': 'hi', 'Thane': 'hi', 'Nashik': 'hi',
  'Lucknow': 'hi', 'Kanpur': 'hi', 'Varanasi': 'hi', 'Agra': 'hi', 'Ghaziabad': 'hi',
  'Patna': 'hi', 'Gaya': 'hi', 'Bhagalpur': 'hi',
  'Jaipur': 'hi', 'Jodhpur': 'hi', 'Udaipur': 'hi', 'Kota': 'hi',
  'Ludhiana': 'hi', 'Amritsar': 'hi', 'Jalandhar': 'hi',
  // Gujarat
  'Ahmedabad': 'gu', 'Surat': 'gu', 'Vadodara': 'gu', 'Rajkot': 'gu',
  // West Bengal
  'Kolkata': 'bn', 'Howrah': 'bn', 'Durgapur': 'bn',
  // Assam
  'Guwahati': 'as', 'Dibrugarh': 'as', 'Silchar': 'as',
};

const LANGUAGE_LABELS = {
  ta: 'Tamil', te: 'Telugu', kn: 'Kannada', ml: 'Malayalam',
  hi: 'Hindi', gu: 'Gujarati', bn: 'Bengali', as: 'Assamese',
  mr: 'Marathi', en: 'English', ko: 'Korean', ja: 'Japanese',
  pa: 'Punjabi', or: 'Odia',
};

export const getLanguageForCity = (city) => CITY_LANGUAGE_MAP[city] || 'hi';
export const getLanguageLabel = (code) => LANGUAGE_LABELS[code] || code?.toUpperCase() || '';

// ─── Fallback Placeholder ───────────────────────────────────────
export const POSTER_PLACEHOLDER = `data:image/svg+xml,${encodeURIComponent(
  `<svg xmlns="http://www.w3.org/2000/svg" width="500" height="750" viewBox="0 0 500 750">
    <rect width="500" height="750" fill="#1a1a2e"/>
    <rect x="0" y="0" width="500" height="750" fill="url(#g)" opacity="0.5"/>
    <defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#16213e"/><stop offset="100%" stop-color="#0f3460"/>
    </linearGradient></defs>
    <g transform="translate(250,340)" opacity="0.3">
      <rect x="-40" y="-50" width="80" height="70" rx="6" fill="none" stroke="#e94560" stroke-width="3"/>
      <polygon points="-15,-20 -15,10 15,-5" fill="#e94560"/>
      <rect x="-50" y="30" width="100" height="4" rx="2" fill="#e94560"/>
      <rect x="-35" y="42" width="70" height="4" rx="2" fill="#e94560"/>
    </g>
    <text x="250" y="430" text-anchor="middle" fill="#4a4a6a" font-family="sans-serif" font-size="16" font-weight="500">No Poster Available</text>
  </svg>`
)}`;

export const BACKDROP_PLACEHOLDER = `data:image/svg+xml,${encodeURIComponent(
  `<svg xmlns="http://www.w3.org/2000/svg" width="1280" height="720" viewBox="0 0 1280 720">
    <rect width="1280" height="720" fill="#0a0a1a"/>
    <rect x="0" y="0" width="1280" height="720" fill="url(#bg)" opacity="0.4"/>
    <defs><linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#16213e"/><stop offset="100%" stop-color="#1a1a2e"/>
    </linearGradient></defs>
  </svg>`
)}`;

// ─── Image URL Helpers ──────────────────────────────────────────
export const getImageUrl = (path, size = 'w500') => {
  if (!path) return POSTER_PLACEHOLDER;
  if (path.startsWith('http')) return path;
  return `${IMG_BASE}/${size}${path}`;
};

export const getBackdropUrl = (path) => {
  if (!path) return BACKDROP_PLACEHOLDER;
  if (path.startsWith('http')) return path;
  return `${IMG_BASE}/original${path}`;
};

// ─── Generic TMDB Fetch ─────────────────────────────────────────
const tmdbFetch = async (endpoint, params = {}) => {
  if (!API_KEY) throw new Error('No TMDB API key configured');

  const url = new URL(`${BASE_URL}${endpoint}`);
  url.searchParams.append('api_key', API_KEY);
  url.searchParams.append('language', 'en-US');
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      url.searchParams.append(key, value);
    }
  });

  const response = await fetch(url.toString());
  if (!response.ok) throw new Error(`TMDB API error: ${response.status}`);
  return response.json();
};

// ─── Date Helpers ───────────────────────────────────────────────
const getDateRange = () => {
  const now = new Date();
  const past = new Date(now);
  past.setDate(past.getDate() - 60); // Wider initial window — we'll filter by OTT status later
  const future = new Date(now);
  future.setDate(future.getDate() + 7);

  return {
    gte: past.toISOString().split('T')[0],
    lte: future.toISOString().split('T')[0],
    today: now.toISOString().split('T')[0],
  };
};

// ─── OTT / Digital Release Checker ─────────────────────────────
/**
 * Fetch release dates for a movie and check if it already has
 * a digital/OTT release (type 4) in the given country that has passed.
 * Returns { isOnOTT: boolean, digitalDate: string|null, certification: string }
 */
const checkDigitalRelease = async (movieId, countryCode = 'IN') => {
  try {
    const data = await tmdbFetch(`/movie/${movieId}/release_dates`);
    const countryData = data.results?.find(r => r.iso_3166_1 === countryCode);

    if (!countryData) return { isOnOTT: false, digitalDate: null, certification: '' };

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Check for digital release (type 4), physical (type 5), or TV (type 6)
    const digitalRelease = countryData.release_dates.find(
      r => (r.type === 4 || r.type === 5 || r.type === 6) && r.release_date
    );

    const certification = countryData.release_dates.find(r => r.certification)?.certification || '';

    if (digitalRelease) {
      const digitalDate = new Date(digitalRelease.release_date);
      digitalDate.setHours(0, 0, 0, 0);
      return {
        isOnOTT: digitalDate <= today,
        digitalDate: digitalRelease.release_date.split('T')[0],
        certification,
      };
    }

    return { isOnOTT: false, digitalDate: null, certification };
  } catch {
    // If API call fails, assume NOT on OTT (don't filter out)
    return { isOnOTT: false, digitalDate: null, certification: '' };
  }
};

/**
 * Batch-check digital releases for a list of movies.
 * Filters out movies already on OTT/digital.
 * Returns only movies still exclusively in theaters.
 */
const filterOutOTTMovies = async (movies, countryCode = 'IN') => {
  // Check all movies in parallel
  const checks = await Promise.allSettled(
    movies.map(async (movie) => {
      const { isOnOTT, certification } = await checkDigitalRelease(movie.id, countryCode);
      return { movie, isOnOTT, certification };
    })
  );

  return checks
    .filter(r => r.status === 'fulfilled' && !r.value.isOnOTT)
    .map(r => ({
      ...r.value.movie,
      certification: r.value.certification,
    }));
};

// ─── Now Screening (Theater-Only, OTT-Filtered) ────────────────
/**
 * Fetch movies CURRENTLY SCREENING IN THEATERS:
 * 1. Discover movies with theatrical release type (2|3) in the region
 * 2. Batch-check each movie's release dates
 * 3. REMOVE any movie that already has a digital/OTT release
 * 
 * Result: Only movies still exclusively in cinemas.
 *
 * @param {string} region - ISO 3166-1 country code (e.g., 'IN')
 * @param {string} regionalLanguage - ISO 639-1 language code (e.g., 'ta')
 */
export const fetchNowScreening = async (region = 'IN', regionalLanguage = '') => {
  const dates = getDateRange();

  const baseParams = {
    'with_release_type': '2|3',
    'release_date.gte': dates.gte,
    'release_date.lte': dates.lte,
    region,
    'sort_by': 'popularity.desc',
  };

  let allCandidates = [];

  if (regionalLanguage) {
    // Fetch regional + all-language movies in parallel (2 pages each for volume)
    const [regP1, regP2, allP1, allP2] = await Promise.allSettled([
      tmdbFetch('/discover/movie', { ...baseParams, with_original_language: regionalLanguage, page: 1 }),
      tmdbFetch('/discover/movie', { ...baseParams, with_original_language: regionalLanguage, page: 2 }),
      tmdbFetch('/discover/movie', { ...baseParams, page: 1 }),
      tmdbFetch('/discover/movie', { ...baseParams, page: 2 }),
    ]);

    const regionalMovies = [
      ...(regP1.status === 'fulfilled' ? regP1.value.results : []),
      ...(regP2.status === 'fulfilled' ? regP2.value.results : []),
    ];
    const allMovies = [
      ...(allP1.status === 'fulfilled' ? allP1.value.results : []),
      ...(allP2.status === 'fulfilled' ? allP2.value.results : []),
    ];

    // Merge: regional first, then all-India (deduplicated)
    const seenIds = new Set();
    for (const m of regionalMovies) {
      if (!seenIds.has(m.id)) {
        seenIds.add(m.id);
        allCandidates.push({ ...m, _isRegional: true });
      }
    }
    for (const m of allMovies) {
      if (!seenIds.has(m.id)) {
        seenIds.add(m.id);
        allCandidates.push(m);
      }
    }
  } else {
    // No regional language — fetch all (2 pages)
    const [p1, p2] = await Promise.allSettled([
      tmdbFetch('/discover/movie', { ...baseParams, page: 1 }),
      tmdbFetch('/discover/movie', { ...baseParams, page: 2 }),
    ]);

    const seenIds = new Set();
    const movies = [
      ...(p1.status === 'fulfilled' ? p1.value.results : []),
      ...(p2.status === 'fulfilled' ? p2.value.results : []),
    ];
    for (const m of movies) {
      if (!seenIds.has(m.id)) {
        seenIds.add(m.id);
        allCandidates.push(m);
      }
    }
  }

  // Now filter out movies that are already on OTT/digital
  const theaterOnlyMovies = await filterOutOTTMovies(allCandidates, region);

  return theaterOnlyMovies.map(normalizeMovie);
};

// Keep the old function as fallback
export const fetchNowPlaying = async (page = 1, region = '') => {
  const params = { page };
  if (region) params.region = region;
  const data = await tmdbFetch('/movie/now_playing', params);
  return data.results.map(normalizeMovie);
};

// ─── Upcoming / Coming Soon ─────────────────────────────────────
export const fetchUpcoming = async (page = 1, region = '') => {
  const params = { page };
  if (region) params.region = region;
  const data = await tmdbFetch('/movie/upcoming', params);
  return data.results.map(normalizeMovie);
};

// ─── Trending ───────────────────────────────────────────────────
export const fetchTrending = async (timeWindow = 'day') => {
  const data = await tmdbFetch(`/trending/movie/${timeWindow}`);
  return data.results.map(normalizeMovie);
};

// ─── Search ─────────────────────────────────────────────────────
export const searchMovies = async (query, region = '') => {
  if (!query.trim()) return [];
  const params = { query };
  if (region) params.region = region;
  const data = await tmdbFetch('/search/movie', params);
  return data.results.map(normalizeMovie);
};

// ─── Movie Details ──────────────────────────────────────────────
export const fetchMovieDetails = async (movieId) => {
  const [details, videos] = await Promise.all([
    tmdbFetch(`/movie/${movieId}`),
    tmdbFetch(`/movie/${movieId}/videos`),
  ]);

  const trailer = videos.results?.find(
    (v) => v.site === 'YouTube' && v.type === 'Trailer'
  ) || videos.results?.[0];

  return {
    ...normalizeMovie(details),
    description: details.overview,
    duration: formatRuntime(details.runtime),
    trailerUrl: trailer
      ? `https://www.youtube.com/embed/${trailer.key}`
      : null,
    showtimes: generateShowtimes(),
  };
};

// ─── Genres ─────────────────────────────────────────────────────
export const fetchGenres = async () => {
  const data = await tmdbFetch('/genre/movie/list');
  return data.genres;
};

// Genre ID → Name mapping
const GENRE_MAP = {
  28: 'Action', 12: 'Adventure', 16: 'Animation', 35: 'Comedy',
  80: 'Crime', 99: 'Documentary', 18: 'Drama', 10751: 'Family',
  14: 'Fantasy', 36: 'History', 27: 'Horror', 10402: 'Music',
  9648: 'Mystery', 10749: 'Romance', 878: 'Sci-Fi', 10770: 'TV Movie',
  53: 'Thriller', 10752: 'War', 37: 'Western',
};

// ─── Normalize TMDB → App Shape ─────────────────────────────────
const normalizeMovie = (movie) => ({
  id: movie.id,
  title: movie.title,
  image: getImageUrl(movie.poster_path),
  backdrop: getBackdropUrl(movie.backdrop_path),
  rating: Math.round((movie.vote_average || 0) * 10) / 10,
  genre: (movie.genre_ids || movie.genres?.map((g) => g.id) || [])
    .map((id) => GENRE_MAP[id] || 'Other')
    .slice(0, 3),
  duration: movie.runtime ? formatRuntime(movie.runtime) : '2h 0m',
  description: movie.overview || 'No description available.',
  showtimes: movie.showtimes || generateShowtimes(),
  trailerUrl: movie.trailerUrl || null,
  releaseDate: movie.release_date || null,
  language: movie.original_language || '',
  languageLabel: getLanguageLabel(movie.original_language),
  isRegional: movie._isRegional || false,
  popularity: movie.popularity || 0,
  certification: movie.certification || '',
});

// ─── Helpers ────────────────────────────────────────────────────
const formatRuntime = (minutes) => {
  if (!minutes) return '2h 0m';
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return `${h}h ${m}m`;
};

const generateShowtimes = () => {
  const times = ['9:00 AM', '10:30 AM', '11:00 AM', '12:30 PM', '1:00 PM',
    '2:30 PM', '3:00 PM', '4:30 PM', '5:00 PM', '6:30 PM',
    '7:00 PM', '8:30 PM', '9:00 PM', '10:00 PM', '10:30 PM'];
  const shuffled = [...times].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, 4).sort((a, b) => {
    const toMin = (t) => {
      const [time, period] = t.split(' ');
      let [h, m] = time.split(':').map(Number);
      if (period === 'PM' && h !== 12) h += 12;
      if (period === 'AM' && h === 12) h = 0;
      return h * 60 + m;
    };
    return toMin(a) - toMin(b);
  });
};
