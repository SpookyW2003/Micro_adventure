import { useState, useEffect, useCallback } from 'react';
import { locationService, UserLocation, LocationOptions } from '../services/LocationService';

export interface LocationState {
  location: UserLocation | null;
  isLoading: boolean;
  error: string | null;
  isWatching: boolean;
  permission: 'granted' | 'denied' | 'prompt' | 'unknown';
}

export interface LocationActions {
  getCurrentLocation: (options?: LocationOptions) => Promise<UserLocation | null>;
  startWatching: (options?: LocationOptions) => Promise<void>;
  stopWatching: () => void;
  requestPermission: () => Promise<'granted' | 'denied' | 'prompt'>;
  clearError: () => void;
  calculateDistanceToPoint: (lat: number, lon: number) => number | null;
}

export function useLocation(): LocationState & LocationActions {
  const [state, setState] = useState<LocationState>({
    location: locationService.getCurrentLocation(),
    isLoading: false,
    error: null,
    isWatching: false,
    permission: 'unknown'
  });

  // Check initial permission status
  useEffect(() => {
    const checkPermission = async () => {
      try {
        const permission = await locationService.requestPermission();
        setState(prev => ({ ...prev, permission }));
      } catch (error) {
        setState(prev => ({ 
          ...prev, 
          permission: 'denied',
          error: error instanceof Error ? error.message : 'Permission check failed'
        }));
      }
    };

    checkPermission();
  }, []);

  // Subscribe to location updates
  useEffect(() => {
    const unsubscribe = locationService.addLocationListener((location) => {
      setState(prev => ({
        ...prev,
        location,
        isLoading: false,
        error: location === null && prev.isWatching ? 'Location unavailable' : null
      }));
    });

    return unsubscribe;
  }, []);

  const getCurrentLocation = useCallback(async (options?: LocationOptions): Promise<UserLocation | null> => {
    if (!locationService.isSupported()) {
      setState(prev => ({ 
        ...prev, 
        error: 'Geolocation is not supported by this browser' 
      }));
      return null;
    }

    setState(prev => ({ ...prev, isLoading: true, error: null }));

    try {
      const location = await locationService.getCurrentPosition(options);
      setState(prev => ({ 
        ...prev, 
        location, 
        isLoading: false, 
        permission: 'granted' 
      }));
      return location;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to get location';
      setState(prev => ({ 
        ...prev, 
        isLoading: false, 
        error: errorMessage,
        permission: errorMessage.includes('denied') ? 'denied' : prev.permission
      }));
      return null;
    }
  }, []);

  const startWatching = useCallback(async (options?: LocationOptions): Promise<void> => {
    if (!locationService.isSupported()) {
      setState(prev => ({ 
        ...prev, 
        error: 'Geolocation is not supported by this browser' 
      }));
      return;
    }

    setState(prev => ({ ...prev, isLoading: true, error: null }));

    try {
      await locationService.startWatching(options);
      setState(prev => ({ 
        ...prev, 
        isWatching: true, 
        isLoading: false, 
        permission: 'granted' 
      }));
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to start watching location';
      setState(prev => ({ 
        ...prev, 
        isLoading: false, 
        error: errorMessage,
        isWatching: false,
        permission: errorMessage.includes('denied') ? 'denied' : prev.permission
      }));
    }
  }, []);

  const stopWatching = useCallback((): void => {
    locationService.stopWatching();
    setState(prev => ({ ...prev, isWatching: false }));
  }, []);

  const requestPermission = useCallback(async (): Promise<'granted' | 'denied' | 'prompt'> => {
    try {
      const permission = await locationService.requestPermission();
      setState(prev => ({ ...prev, permission }));
      return permission;
    } catch (error) {
      setState(prev => ({ 
        ...prev, 
        permission: 'denied',
        error: error instanceof Error ? error.message : 'Permission request failed'
      }));
      return 'denied';
    }
  }, []);

  const clearError = useCallback((): void => {
    setState(prev => ({ ...prev, error: null }));
  }, []);

  const calculateDistanceToPoint = useCallback((lat: number, lon: number): number | null => {
    return locationService.calculateDistanceToPoint(lat, lon);
  }, [state.location]); // Re-calculate when location changes

  return {
    ...state,
    getCurrentLocation,
    startWatching,
    stopWatching,
    requestPermission,
    clearError,
    calculateDistanceToPoint
  };
}
