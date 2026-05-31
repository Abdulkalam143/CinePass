/**
 * LocationContext — Manages the user's selected location (City/State)
 * Supports both auto-detection (GPS) and manual selection
 */
import { createContext, useContext, useState, useEffect } from 'react';

const LocationContext = createContext(null);

export const useLocationContext = () => {
  const context = useContext(LocationContext);
  if (!context) {
    throw new Error('useLocationContext must be used within a LocationProvider');
  }
  return context;
};

export const LocationProvider = ({ children }) => {
  const [selectedCity, setSelectedCity] = useState(null);
  const [selectedState, setSelectedState] = useState(null);
  const [isManual, setIsManual] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('cinepass_manual_location');
    if (saved) {
      try {
        const { city, state } = JSON.parse(saved);
        setSelectedCity(city);
        setSelectedState(state);
        setIsManual(true);
      } catch (e) {
        console.error('Failed to load manual location', e);
      }
    }
  }, []);

  const setManualLocation = (city, state) => {
    setSelectedCity(city);
    setSelectedState(state);
    setIsManual(true);
    localStorage.setItem('cinepass_manual_location', JSON.stringify({ city, state }));
  };

  const clearManualLocation = () => {
    setSelectedCity(null);
    setSelectedState(null);
    setIsManual(false);
    localStorage.removeItem('cinepass_manual_location');
  };

  const value = {
    selectedCity,
    selectedState,
    isManual,
    setManualLocation,
    clearManualLocation,
    displayLocation: selectedCity ? `${selectedCity}, ${selectedState}` : null
  };

  return (
    <LocationContext.Provider value={value}>
      {children}
    </LocationContext.Provider>
  );
};

export default LocationContext;
