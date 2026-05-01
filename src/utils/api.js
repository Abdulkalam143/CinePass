/**
 * TMDB API utility functions
 * Fetches real movie data from The Movie Database API
 * Falls back to static data if API key is missing or request fails
 */

const API_KEY = import.meta.env.VITE_TMDB_API_KEY;
const BASE_URL = 'https://api.themoviedb.org/3';
const IMG_BASE = 'https://image.tmdb.org/t/p';

// Image URL helpers
export const getImageUrl = (path, size = 'w500') => {
  if (!path) return null;
  if (path.startsWith('http')) return path;
  return `${IMG_BASE}/${size}${path}`;
};

export const getBackdropUrl = (path) => getImageUrl(path, 'original');

/**
 * Generic TMDB fetch wrapper
 */
const tmdbFetch = async (endpoint, params = {}) => {
  if (!API_KEY) throw new Error('No TMDB API key configured');

  const url = new URL(`${BASE_URL}${endpoint}`);
  url.searchParams.append('api_key', API_KEY);
  url.searchParams.append('language', 'en-US');
  Object.entries(params).forEach(([key, value]) => {
    url.searchParams.append(key, value);
  });

  const response = await fetch(url.toString());
  if (!response.ok) throw new Error(`TMDB API error: ${response.status}`);
  return response.json();
};

/**
 * Fetch now playing movies (region-aware)
 * @param {number} page - Page number
 * @param {string} region - ISO 3166-1 country code (e.g., 'IN', 'US')
 */
export const fetchNowPlaying = async (page = 1, region = '') => {
  const params = { page };
  if (region) params.region = region;
  const data = await tmdbFetch('/movie/now_playing', params);
  return data.results.map(normalizeMovie);
};

/**
 * Fetch upcoming movies (region-aware)
 * @param {number} page - Page number
 * @param {string} region - ISO 3166-1 country code
 */
export const fetchUpcoming = async (page = 1, region = '') => {
  const params = { page };
  if (region) params.region = region;
  const data = await tmdbFetch('/movie/upcoming', params);
  return data.results.map(normalizeMovie);
};

/**
 * Fetch trending movies (daily or weekly)
 */
export const fetchTrending = async (timeWindow = 'day') => {
  const data = await tmdbFetch(`/trending/movie/${timeWindow}`);
  return data.results.map(normalizeMovie);
};

/**
 * Search movies by query string
 */
export const searchMovies = async (query, region = '') => {
  if (!query.trim()) return [];
  const params = { query };
  if (region) params.region = region;
  const data = await tmdbFetch('/search/movie', params);
  return data.results.map(normalizeMovie);
};

/**
 * Fetch full movie details including videos (trailers)
 */
export const fetchMovieDetails = async (movieId) => {
  const [details, videos] = await Promise.all([
    tmdbFetch(`/movie/${movieId}`),
    tmdbFetch(`/movie/${movieId}/videos`),
  ]);

  // Find the official YouTube trailer
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
    // Generate showtimes for the movie
    showtimes: generateShowtimes(),
  };
};

/**
 * Fetch genre list from TMDB
 */
export const fetchGenres = async () => {
  const data = await tmdbFetch('/genre/movie/list');
  return data.genres;
};

// Genre ID → Name mapping (used for normalizing)
const GENRE_MAP = {
  28: 'Action', 12: 'Adventure', 16: 'Animation', 35: 'Comedy',
  80: 'Crime', 99: 'Documentary', 18: 'Drama', 10751: 'Family',
  14: 'Fantasy', 36: 'History', 27: 'Horror', 10402: 'Music',
  9648: 'Mystery', 10749: 'Romance', 878: 'Sci-Fi', 10770: 'TV Movie',
  53: 'Thriller', 10752: 'War', 37: 'Western',
};

/**
 * Normalize TMDB movie data to our app's shape
 */
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
});

/**
 * Format runtime in minutes to "Xh Ym"
 */
const formatRuntime = (minutes) => {
  if (!minutes) return '2h 0m';
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return `${h}h ${m}m`;
};

/**
 * Generate random showtimes for a movie
 */
const generateShowtimes = () => {
  const times = ['9:00 AM', '10:30 AM', '11:00 AM', '12:30 PM', '1:00 PM',
    '2:30 PM', '3:00 PM', '4:30 PM', '5:00 PM', '6:30 PM',
    '7:00 PM', '8:30 PM', '9:00 PM', '10:00 PM', '10:30 PM'];
  // Pick 4 random showtimes, sorted
  const shuffled = times.sort(() => 0.5 - Math.random());
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
