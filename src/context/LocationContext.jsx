/* eslint-disable react-refresh/only-export-components */
/**
 * LocationContext — Manages the user's selected location (City/State)
 * Supports both auto-detection (GPS) and manual selection
 */
import { createContext, useContext, useState } from 'react';

const LocationContext = createContext(null);

export const useLocationContext = () => {
  const context = useContext(LocationContext);
  if (!context) {
    throw new Error('useLocationContext must be used within a LocationProvider');
  }
  return context;
};

export const LocationProvider = ({ children }) => {
  const [selectedCity, setSelectedCity] = useState(() => {
    try {
      const saved = localStorage.getItem('cinepass_manual_location');
      if (saved) {
        const { city } = JSON.parse(saved);
        return city || null;
      }
    } catch (e) {
      console.error('Failed to load manual location', e);
    }
    return null;
  });

  const [selectedState, setSelectedState] = useState(() => {
    try {
      const saved = localStorage.getItem('cinepass_manual_location');
      if (saved) {
        const { state } = JSON.parse(saved);
        return state || null;
      }
    } catch (e) {
      console.error('Failed to load manual location', e);
    }
    return null;
  });

  const [isManual, setIsManual] = useState(() => {
    try {
      const saved = localStorage.getItem('cinepass_manual_location');
      return !!saved;
    } catch (e) {
      console.error('Failed to load manual location', e);
    }
    return false;
  });

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
