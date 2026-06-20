/**
 * LocationIndicator — Shows user's detected location with live status
 * Allows manual location refresh and displays region-specific context
 */
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, Navigation, RefreshCw, Loader, ChevronDown } from 'lucide-react';
import { useState } from 'react';
import { useLocationContext } from '../context/LocationContext';
import LocationSelector from './LocationSelector';
import './LocationIndicator.css';

const LocationIndicator = ({
  displayLocation: gpsLocation,
  loading,
  onRequestLocation,
}) => {
  const { displayLocation: manualLocation, isManual } = useLocationContext();
  const [selectorOpen, setSelectorOpen] = useState(false);

  const activeLocation = manualLocation || gpsLocation;

  return (
    <div className="loc-indicator" id="location-indicator">
      <AnimatePresence mode="wait">
        {/* Location detected — show it */}
        {activeLocation && !loading && (
          <motion.div
            key="located"
            className={`loc-indicator__badge ${isManual ? 'loc-indicator__badge--manual' : 'loc-indicator__badge--active'}`}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
            onClick={() => setSelectorOpen(true)}
          >
            <span className="loc-indicator__pulse" />
            <MapPin size={14} className="loc-indicator__pin" />
            <span className="loc-indicator__text">{activeLocation}</span>
            <ChevronDown size={12} className="loc-indicator__chevron" />
            
            {!isManual && (
              <button
                className="loc-indicator__refresh"
                onClick={(e) => {
                  e.stopPropagation();
                  onRequestLocation();
                }}
                title="Refresh location"
                aria-label="Refresh location"
              >
                <RefreshCw size={12} />
              </button>
            )}
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
        {!activeLocation && !loading && (
          <div className="loc-indicator__prompt-group">
            <motion.button
              key="detect"
              className="loc-indicator__badge loc-indicator__badge--detect"
              onClick={onRequestLocation}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              id="detect-location-btn"
            >
              <Navigation size={14} />
              <span className="loc-indicator__text">Detect My Location</span>
            </motion.button>
            <motion.button
              key="prompt"
              className="loc-indicator__badge loc-indicator__badge--prompt"
              onClick={() => setSelectorOpen(true)}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              id="enable-location-btn"
            >
              <MapPin size={14} />
              <span className="loc-indicator__text">Select City</span>
              <ChevronDown size={14} className="loc-indicator__chevron" />
            </motion.button>
          </div>
        )}
      </AnimatePresence>

      <LocationSelector 
        isOpen={selectorOpen} 
        onClose={() => setSelectorOpen(false)}
        onRequestGps={onRequestLocation}
      />
    </div>
  );
};

export default LocationIndicator;
