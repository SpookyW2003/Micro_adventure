import { useState, useEffect, useCallback } from 'react';
import { locationBasedRouteService, LocationBasedRoute, UserLocationInfo } from '../services/LocationBasedRouteService';

export interface LocationBasedRoutesState {
  routes: LocationBasedRoute[];
  loading: boolean;
  error: string | null;
  userRegion: string | null;
}

export function useLocationBasedRoutes() {
  const [state, setState] = useState<LocationBasedRoutesState>({
    routes: [],
    loading: false,
    error: null,
    userRegion: null
  });

  const getRoutesForLocation = useCallback(async (userLocation: UserLocationInfo) => {
    setState(prev => ({ ...prev, loading: true, error: null }));

    try {
      const routes = await locationBasedRouteService.getLocationBasedRoutes(userLocation);
      const region = determineUserRegion(userLocation.latitude, userLocation.longitude);
      
      setState(prev => ({
        ...prev,
        routes,
        loading: false,
        userRegion: region
      }));
    } catch (error) {
      setState(prev => ({
        ...prev,
        loading: false,
        error: error instanceof Error ? error.message : 'Failed to load location-based routes'
      }));
    }
  }, []);

  const clearRoutes = useCallback(() => {
    setState({
      routes: [],
      loading: false,
      error: null,
      userRegion: null
    });
  }, []);

  return {
    ...state,
    getRoutesForLocation,
    clearRoutes
  };
}

function determineUserRegion(lat: number, lon: number): string {
  // Delhi NCR region
  if (lat >= 28.4 && lat <= 28.8 && lon >= 76.8 && lon <= 77.6) {
    return 'Delhi';
  }
  // Mumbai region
  if (lat >= 18.9 && lat <= 19.3 && lon >= 72.7 && lon <= 73.1) {
    return 'Mumbai';
  }
  // Bangalore region
  if (lat >= 12.8 && lat <= 13.2 && lon >= 77.4 && lon <= 77.8) {
    return 'Bangalore';
  }
  // Chennai region
  if (lat >= 12.8 && lat <= 13.3 && lon >= 80.1 && lon <= 80.4) {
    return 'Chennai';
  }
  // Kolkata region
  if (lat >= 22.4 && lat <= 22.7 && lon >= 88.2 && lon <= 88.5) {
    return 'Kolkata';
  }
  // Pune region
  if (lat >= 18.4 && lat <= 18.7 && lon >= 73.7 && lon <= 74.0) {
    return 'Pune';
  }
  // Hyderabad region
  if (lat >= 17.2 && lat <= 17.6 && lon >= 78.2 && lon <= 78.7) {
    return 'Hyderabad';
  }
  // Jaipur region
  if (lat >= 26.7 && lat <= 27.1 && lon >= 75.6 && lon <= 76.0) {
    return 'Jaipur';
  }
  return 'Your Area';
}
