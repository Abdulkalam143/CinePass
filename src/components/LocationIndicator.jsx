/**
 * LocationIndicator — Shows user's detected location with live status
 * Allows manual location refresh and displays region-specific context
 */
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, Navigation, RefreshCw, Loader, X, Globe } from 'lucide-react';
import './LocationIndicator.css';

const LocationIndicator = ({
  displayLocation,
  loading,
  error,
  permissionState,
  onRequestLocation,
  tmdbRegion,
}) => {
  return (
    <div className="loc-indicator" id="location-indicator">
      <AnimatePresence mode="wait">
        {/* Location detected — show it */}
        {displayLocation && !loading && (
          <motion.div
            key="located"
            className="loc-indicator__badge loc-indicator__badge--active"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
          >
            <span className="loc-indicator__pulse" />
            <MapPin size={14} className="loc-indicator__pin" />
            <span className="loc-indicator__text">{displayLocation}</span>
            {tmdbRegion && (
              <span className="loc-indicator__region">{tmdbRegion}</span>
            )}
            <button
              className="loc-indicator__refresh"
              onClick={onRequestLocation}
              title="Refresh location"
              aria-label="Refresh location"
            >
              <RefreshCw size={12} />
            </button>
          </motion.div>
        )}

        {/* Loading */}
        {loading && (
          <motion.div
            key="loading"
            className="loc-indicator__badge loc-indicator__badge--loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <Loader size={14} className="loc-indicator__spinner" />
            <span className="loc-indicator__text">Detecting location...</span>
          </motion.div>
        )}

        {/* Not yet requested or denied */}
        {!displayLocation && !loading && (
          <motion.button
            key="prompt"
            className="loc-indicator__badge loc-indicator__badge--prompt"
            onClick={onRequestLocation}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            id="enable-location-btn"
          >
            {error ? (
              <>
                <X size={14} className="loc-indicator__error-icon" />
                <span className="loc-indicator__text">{error}</span>
                <span className="loc-indicator__retry">Retry</span>
              </>
            ) : (
              <>
                <Navigation size={14} />
                <span className="loc-indicator__text">
                  {permissionState === 'denied'
                    ? 'Location blocked — Enable in settings'
                    : 'Enable location for regional movies'}
                </span>
                <Globe size={14} className="loc-indicator__globe" />
              </>
            )}
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
};

export default LocationIndicator;
