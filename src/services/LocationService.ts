export interface UserLocation {
  latitude: number;
  longitude: number;
  accuracy: number;
  timestamp: number;
}

export interface LocationOptions {
  enableHighAccuracy?: boolean;
  timeout?: number;
  maximumAge?: number;
}

export class LocationService {
  private static instance: LocationService;
  private watchId: number | null = null;
  private currentLocation: UserLocation | null = null;
  private listeners: ((location: UserLocation | null) => void)[] = [];

  static getInstance(): LocationService {
    if (!LocationService.instance) {
      LocationService.instance = new LocationService();
    }
    return LocationService.instance;
  }

  /**
   * Check if geolocation is supported by the browser
   */
  isSupported(): boolean {
    return 'geolocation' in navigator;
  }

  /**
   * Get current position once
   */
  async getCurrentPosition(options: LocationOptions = {}): Promise<UserLocation> {
    return new Promise((resolve, reject) => {
      if (!this.isSupported()) {
        reject(new Error('Geolocation is not supported by this browser'));
        return;
      }

      const defaultOptions: PositionOptions = {
        enableHighAccuracy: options.enableHighAccuracy ?? true,
        timeout: options.timeout ?? 10000,
        maximumAge: options.maximumAge ?? 300000, // 5 minutes
      };

      navigator.geolocation.getCurrentPosition(
        (position) => {
          const userLocation: UserLocation = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            accuracy: position.coords.accuracy,
            timestamp: position.timestamp,
          };
          this.currentLocation = userLocation;
          this.notifyListeners(userLocation);
          resolve(userLocation);
        },
        (error) => {
          let errorMessage = 'Unknown location error';
          
          switch (error.code) {
            case error.PERMISSION_DENIED:
              errorMessage = 'Location access denied by user';
              break;
            case error.POSITION_UNAVAILABLE:
              errorMessage = 'Location information is unavailable';
              break;
            case error.TIMEOUT:
              errorMessage = 'Location request timed out';
              break;
          }
          
          reject(new Error(errorMessage));
        },
        defaultOptions
      );
    });
  }

  /**
   * Start watching user position
   */
  startWatching(options: LocationOptions = {}): Promise<void> {
    return new Promise((resolve, reject) => {
      if (!this.isSupported()) {
        reject(new Error('Geolocation is not supported by this browser'));
        return;
      }

      if (this.watchId !== null) {
        this.stopWatching();
      }

      const defaultOptions: PositionOptions = {
        enableHighAccuracy: options.enableHighAccuracy ?? true,
        timeout: options.timeout ?? 10000,
        maximumAge: options.maximumAge ?? 60000, // 1 minute for watching
      };

      this.watchId = navigator.geolocation.watchPosition(
        (position) => {
          const userLocation: UserLocation = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            accuracy: position.coords.accuracy,
            timestamp: position.timestamp,
          };
          this.currentLocation = userLocation;
          this.notifyListeners(userLocation);
          resolve();
        },
        (error) => {
          let errorMessage = 'Unknown location error';
          
          switch (error.code) {
            case error.PERMISSION_DENIED:
              errorMessage = 'Location access denied by user';
              break;
            case error.POSITION_UNAVAILABLE:
              errorMessage = 'Location information is unavailable';
              break;
            case error.TIMEOUT:
              errorMessage = 'Location request timed out';
              break;
          }
          
          this.notifyListeners(null);
          reject(new Error(errorMessage));
        },
        defaultOptions
      );
    });
  }

  /**
   * Stop watching user position
   */
  stopWatching(): void {
    if (this.watchId !== null) {
      navigator.geolocation.clearWatch(this.watchId);
      this.watchId = null;
    }
  }

  /**
   * Get the last known location
   */
  getCurrentLocation(): UserLocation | null {
    return this.currentLocation;
  }

  /**
   * Subscribe to location updates
   */
  addLocationListener(callback: (location: UserLocation | null) => void): () => void {
    this.listeners.push(callback);
    
    // Return unsubscribe function
    return () => {
      const index = this.listeners.indexOf(callback);
      if (index > -1) {
        this.listeners.splice(index, 1);
      }
    };
  }

  /**
   * Calculate distance between user location and a point
   */
  calculateDistanceToPoint(targetLat: number, targetLon: number): number | null {
    if (!this.currentLocation) return null;

    return this.calculateDistance(
      this.currentLocation.latitude,
      this.currentLocation.longitude,
      targetLat,
      targetLon
    );
  }

  /**
   * Calculate distance between two points using Haversine formula
   */
  private calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const R = 6371; // Earth's radius in kilometers
    const dLat = this.toRadians(lat2 - lat1);
    const dLon = this.toRadians(lon2 - lon1);
    
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.toRadians(lat1)) * Math.cos(this.toRadians(lat2)) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }

  private toRadians(degrees: number): number {
    return degrees * (Math.PI / 180);
  }

  private notifyListeners(location: UserLocation | null): void {
    this.listeners.forEach(callback => callback(location));
  }

  /**
   * Request location permission
   */
  async requestPermission(): Promise<'granted' | 'denied' | 'prompt'> {
    if (!this.isSupported()) {
      return 'denied';
    }

    try {
      const result = await navigator.permissions.query({ name: 'geolocation' });
      return result.state;
    } catch (error) {
      // Fallback for browsers that don't support permissions API
      try {
        await this.getCurrentPosition({ timeout: 1000 });
        return 'granted';
      } catch {
        return 'denied';
      }
    }
  }
}

export const locationService = LocationService.getInstance();
