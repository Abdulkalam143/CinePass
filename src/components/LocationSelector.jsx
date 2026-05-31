/**
 * LocationSelector — Modal for manual city/state selection
 */
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Search, MapPin, ChevronRight, Globe } from 'lucide-react';
import { useLocationContext } from '../context/LocationContext';
import './LocationSelector.css';

const INDIAN_STATES = {
  "Andhra Pradesh": ["Visakhapatnam", "Vijayawada", "Guntur", "Nellore"],
  "Assam": ["Guwahati", "Dibrugarh", "Silchar"],
  "Bihar": ["Patna", "Gaya", "Bhagalpur"],
  "Delhi": ["New Delhi", "Noida", "Gurugram"],
  "Gujarat": ["Ahmedabad", "Surat", "Vadodara", "Rajkot"],
  "Karnataka": ["Bengaluru", "Mysuru", "Hubballi", "Mangaluru"],
  "Kerala": ["Thiruvananthapuram", "Kochi", "Kozhikode"],
  "Maharashtra": ["Mumbai", "Pune", "Nagpur", "Thane", "Nashik"],
  "Punjab": ["Ludhiana", "Amritsar", "Jalandhar"],
  "Rajasthan": ["Jaipur", "Jodhpur", "Udaipur", "Kota"],
  "Tamil Nadu": ["Chennai", "Coimbatore", "Madurai", "Salem"],
  "Telangana": ["Hyderabad", "Warangal", "Nizamabad"],
  "Uttar Pradesh": ["Lucknow", "Kanpur", "Varanasi", "Agra", "Ghaziabad"],
  "West Bengal": ["Kolkata", "Howrah", "Durgapur"]
};

const LocationSelector = ({ isOpen, onClose, onRequestGps }) => {
  const { setManualLocation, clearManualLocation, isManual } = useLocationContext();
  const [search, setSearch] = useState('');
  const [selectedState, setSelectedState] = useState(null);

  const handleCitySelect = (city, state) => {
    setManualLocation(city, state);
    onClose();
  };

  const filteredStates = Object.keys(INDIAN_STATES).filter(state =>
    state.toLowerCase().includes(search.toLowerCase()) ||
    INDIAN_STATES[state].some(city => city.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="loc-selector-overlay">
          <motion.div
            className="loc-selector"
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
          >
            <div className="loc-selector__header">
              <div className="loc-selector__title-row">
                <h3>Select Location</h3>
                <button className="loc-selector__close" onClick={onClose}>
                  <X size={20} />
                </button>
              </div>

              <div className="loc-selector__search">
                <Search size={18} />
                <input
                  type="text"
                  placeholder="Search city or state..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  autoFocus
                />
              </div>

              {isManual && (
                <button className="loc-selector__reset" onClick={() => { clearManualLocation(); if (onRequestGps) onRequestGps(); onClose(); }}>
                  <Globe size={14} />
                  Use Current Location (GPS)
                </button>
              )}
            </div>

            <div className="loc-selector__body">
              {!selectedState ? (
                <div className="loc-selector__states">
                  <p className="loc-selector__label">Select State</p>
                  {filteredStates.map(state => (
                    <button
                      key={state}
                      className="loc-selector__item"
                      onClick={() => setSelectedState(state)}
                    >
                      <MapPin size={16} />
                      <span>{state}</span>
                      <ChevronRight size={16} className="loc-selector__chevron" />
                    </button>
                  ))}
                </div>
              ) : (
                <div className="loc-selector__cities">
                  <button className="loc-selector__back" onClick={() => setSelectedState(null)}>
                    ← Back to States
                  </button>
                  <p className="loc-selector__label">Cities in {selectedState}</p>
                  {INDIAN_STATES[selectedState].map(city => (
                    <button
                      key={city}
                      className="loc-selector__item"
                      onClick={() => handleCitySelect(city, selectedState)}
                    >
                      <div className="loc-selector__dot" />
                      <span>{city}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default LocationSelector;
