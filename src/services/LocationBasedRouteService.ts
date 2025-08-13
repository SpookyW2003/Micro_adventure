import { Route, Location } from '../types';

export interface UserLocationInfo {
  latitude: number;
  longitude: number;
  city?: string;
  country?: string;
  region?: string;
}

export interface LocationBasedRoute extends Route {
  distanceFromUser: number;
  relevanceScore: number;
}

export class LocationBasedRouteService {
  private static instance: LocationBasedRouteService;

  static getInstance(): LocationBasedRouteService {
    if (!LocationBasedRouteService.instance) {
      LocationBasedRouteService.instance = new LocationBasedRouteService();
    }
    return LocationBasedRouteService.instance;
  }

  /**
   * Get route recommendations based on user's current location
   */
  async getLocationBasedRoutes(userLocation: UserLocationInfo): Promise<LocationBasedRoute[]> {
    const routes = await this.generateRoutesForLocation(userLocation);
    return this.sortRoutesByRelevance(routes, userLocation);
  }

  /**
   * Generate routes based on user's geographic location
   */
  private async generateRoutesForLocation(userLocation: UserLocationInfo): Promise<Route[]> {
    const { latitude, longitude } = userLocation;
    
    // Determine region and generate appropriate routes
    const region = this.determineRegion(latitude, longitude);
    
    switch (region) {
      case 'delhi':
        return this.getDelhiRoutes(userLocation);
      case 'mumbai':
        return this.getMumbaiRoutes(userLocation);
      case 'bangalore':
        return this.getBangaloreRoutes(userLocation);
      case 'chennai':
        return this.getChennaiRoutes(userLocation);
      case 'kolkata':
        return this.getKolkataRoutes(userLocation);
      case 'pune':
        return this.getPuneRoutes(userLocation);
      case 'hyderabad':
        return this.getHyderabadRoutes(userLocation);
      case 'jaipur':
        return this.getJaipurRoutes(userLocation);
      default:
        return this.getGenericIndianRoutes(userLocation);
    }
  }

  /**
   * Determine which region/city the user is in
   */
  private determineRegion(lat: number, lon: number): string {
    // Delhi NCR region
    if (lat >= 28.4 && lat <= 28.8 && lon >= 76.8 && lon <= 77.6) {
      return 'delhi';
    }
    // Mumbai region
    if (lat >= 18.9 && lat <= 19.3 && lon >= 72.7 && lon <= 73.1) {
      return 'mumbai';
    }
    // Bangalore region
    if (lat >= 12.8 && lat <= 13.2 && lon >= 77.4 && lon <= 77.8) {
      return 'bangalore';
    }
    // Chennai region
    if (lat >= 12.8 && lat <= 13.3 && lon >= 80.1 && lon <= 80.4) {
      return 'chennai';
    }
    // Kolkata region
    if (lat >= 22.4 && lat <= 22.7 && lon >= 88.2 && lon <= 88.5) {
      return 'kolkata';
    }
    // Pune region
    if (lat >= 18.4 && lat <= 18.7 && lon >= 73.7 && lon <= 74.0) {
      return 'pune';
    }
    // Hyderabad region
    if (lat >= 17.2 && lat <= 17.6 && lon >= 78.2 && lon <= 78.7) {
      return 'hyderabad';
    }
    // Jaipur region
    if (lat >= 26.7 && lat <= 27.1 && lon >= 75.6 && lon <= 76.0) {
      return 'jaipur';
    }
    return 'generic';
  }

  /**
   * Generate Delhi-specific routes around user's location
   */
  private getDelhiRoutes(userLocation: UserLocationInfo): Route[] {
    const { latitude, longitude } = userLocation;
    
    return [
      {
        id: 'delhi-1',
        name: 'Historic Delhi Explorer',
        description: 'Discover the Mughal heritage and bustling markets near your location',
        locations: this.generateNearbyLocations(latitude, longitude, [
          { name: 'Red Fort', type: 'monument', coords: [28.6562, 77.2410] },
          { name: 'Jama Masjid', type: 'religious', coords: [28.6507, 77.2334] },
          { name: 'Chandni Chowk', type: 'market', coords: [28.6506, 77.2303] },
        ]),
        totalDistance: this.calculateRouteDistance(latitude, longitude, 3),
        totalTime: 150,
        difficulty: 'easy',
        createdAt: new Date().toISOString()
      },
      {
        id: 'delhi-2',
        name: 'Modern Delhi Circuit',
        description: 'Experience contemporary Delhi with parks and monuments',
        locations: this.generateNearbyLocations(latitude, longitude, [
          { name: 'India Gate', type: 'monument', coords: [28.6129, 77.2295] },
          { name: 'Lotus Temple', type: 'spiritual', coords: [28.5535, 77.2588] },
          { name: 'Humayun\'s Tomb', type: 'heritage', coords: [28.5933, 77.2507] },
        ]),
        totalDistance: this.calculateRouteDistance(latitude, longitude, 2.5),
        totalTime: 120,
        difficulty: 'easy',
        createdAt: new Date().toISOString()
      }
    ];
  }

  /**
   * Generate Mumbai-specific routes around user's location
   */
  private getMumbaiRoutes(userLocation: UserLocationInfo): Route[] {
    const { latitude, longitude } = userLocation;
    
    return [
      {
        id: 'mumbai-1',
        name: 'Coastal Mumbai Walk',
        description: 'Scenic coastal route with iconic Mumbai landmarks',
        locations: this.generateNearbyLocations(latitude, longitude, [
          { name: 'Gateway of India', type: 'monument', coords: [18.9220, 72.8347] },
          { name: 'Marine Drive', type: 'promenade', coords: [18.9435, 72.8234] },
          { name: 'Chowpatty Beach', type: 'beach', coords: [18.9545, 72.8156] },
        ]),
        totalDistance: this.calculateRouteDistance(latitude, longitude, 4),
        totalTime: 140,
        difficulty: 'easy',
        createdAt: new Date().toISOString()
      }
    ];
  }

  /**
   * Generate Bangalore-specific routes around user's location
   */
  private getBangaloreRoutes(userLocation: UserLocationInfo): Route[] {
    const { latitude, longitude } = userLocation;
    
    return [
      {
        id: 'bangalore-1',
        name: 'Garden City Experience',
        description: 'Explore Bangalore\'s famous gardens and tech culture',
        locations: this.generateNearbyLocations(latitude, longitude, [
          { name: 'Lalbagh Botanical Garden', type: 'garden', coords: [12.9507, 77.5848] },
          { name: 'Cubbon Park', type: 'park', coords: [12.9766, 77.5993] },
          { name: 'UB City Mall', type: 'modern', coords: [12.9716, 77.5946] },
        ]),
        totalDistance: this.calculateRouteDistance(latitude, longitude, 3.5),
        totalTime: 130,
        difficulty: 'easy',
        createdAt: new Date().toISOString()
      }
    ];
  }

  /**
   * Generate Chennai-specific routes around user's location
   */
  private getChennaiRoutes(userLocation: UserLocationInfo): Route[] {
    const { latitude, longitude } = userLocation;
    
    return [
      {
        id: 'chennai-1',
        name: 'Chennai Cultural Trail',
        description: 'Experience Tamil culture and coastal beauty',
        locations: this.generateNearbyLocations(latitude, longitude, [
          { name: 'Kapaleeshwarar Temple', type: 'temple', coords: [13.0339, 80.2690] },
          { name: 'Marina Beach', type: 'beach', coords: [13.0500, 80.2824] },
          { name: 'Government Museum', type: 'museum', coords: [13.0615, 80.2693] },
        ]),
        totalDistance: this.calculateRouteDistance(latitude, longitude, 3),
        totalTime: 120,
        difficulty: 'easy',
        createdAt: new Date().toISOString()
      }
    ];
  }

  /**
   * Generate Kolkata-specific routes around user's location
   */
  private getKolkataRoutes(userLocation: UserLocationInfo): Route[] {
    const { latitude, longitude } = userLocation;
    
    return [
      {
        id: 'kolkata-1',
        name: 'Colonial Kolkata Heritage',
        description: 'Explore the city of joy\'s colonial past and vibrant culture',
        locations: this.generateNearbyLocations(latitude, longitude, [
          { name: 'Victoria Memorial', type: 'monument', coords: [22.5448, 88.3426] },
          { name: 'Howrah Bridge', type: 'landmark', coords: [22.5958, 88.3468] },
          { name: 'Park Street', type: 'cultural', coords: [22.5533, 88.3617] },
        ]),
        totalDistance: this.calculateRouteDistance(latitude, longitude, 4),
        totalTime: 160,
        difficulty: 'medium',
        createdAt: new Date().toISOString()
      }
    ];
  }

  /**
   * Generate Pune-specific routes around user's location
   */
  private getPuneRoutes(userLocation: UserLocationInfo): Route[] {
    const { latitude, longitude } = userLocation;
    
    return [
      {
        id: 'pune-1',
        name: 'Pune Hills & Heritage',
        description: 'Discover Pune\'s historical sites and natural beauty',
        locations: this.generateNearbyLocations(latitude, longitude, [
          { name: 'Shaniwar Wada', type: 'historical', coords: [18.5196, 73.8553] },
          { name: 'Aga Khan Palace', type: 'heritage', coords: [18.5579, 73.8957] },
          { name: 'Sinhagad Fort', type: 'fort', coords: [18.3664, 73.7562] },
        ]),
        totalDistance: this.calculateRouteDistance(latitude, longitude, 5),
        totalTime: 180,
        difficulty: 'medium',
        createdAt: new Date().toISOString()
      }
    ];
  }

  /**
   * Generate Hyderabad-specific routes around user's location
   */
  private getHyderabadRoutes(userLocation: UserLocationInfo): Route[] {
    const { latitude, longitude } = userLocation;
    
    return [
      {
        id: 'hyderabad-1',
        name: 'Nizami Heritage Trail',
        description: 'Experience the royal heritage of the Nizams',
        locations: this.generateNearbyLocations(latitude, longitude, [
          { name: 'Charminar', type: 'monument', coords: [17.3616, 78.4747] },
          { name: 'Golconda Fort', type: 'fort', coords: [17.3833, 78.4011] },
          { name: 'Hussain Sagar', type: 'lake', coords: [17.4239, 78.4738] },
        ]),
        totalDistance: this.calculateRouteDistance(latitude, longitude, 4.5),
        totalTime: 170,
        difficulty: 'medium',
        createdAt: new Date().toISOString()
      }
    ];
  }

  /**
   * Generate Jaipur-specific routes around user's location
   */
  private getJaipurRoutes(userLocation: UserLocationInfo): Route[] {
    const { latitude, longitude } = userLocation;
    
    return [
      {
        id: 'jaipur-1',
        name: 'Pink City Royal Circuit',
        description: 'Explore the magnificent palaces and forts of Jaipur',
        locations: this.generateNearbyLocations(latitude, longitude, [
          { name: 'Hawa Mahal', type: 'palace', coords: [26.9239, 75.8267] },
          { name: 'City Palace', type: 'palace', coords: [26.9255, 75.8230] },
          { name: 'Jantar Mantar', type: 'observatory', coords: [26.9244, 75.8246] },
        ]),
        totalDistance: this.calculateRouteDistance(latitude, longitude, 2),
        totalTime: 150,
        difficulty: 'easy',
        createdAt: new Date().toISOString()
      }
    ];
  }

  /**
   * Generate generic routes for other locations in India
   */
  private getGenericIndianRoutes(userLocation: UserLocationInfo): Route[] {
    const { latitude, longitude } = userLocation;
    
    return [
      {
        id: 'generic-1',
        name: 'Local Area Explorer',
        description: 'Discover interesting places around your current location',
        locations: this.generateGenericNearbyLocations(latitude, longitude),
        totalDistance: this.calculateRouteDistance(latitude, longitude, 3),
        totalTime: 120,
        difficulty: 'easy',
        createdAt: new Date().toISOString()
      }
    ];
  }

  /**
   * Generate Location objects for nearby places
   */
  private generateNearbyLocations(
    userLat: number, 
    userLon: number, 
    places: Array<{name: string, type: string, coords: [number, number]}>
  ): Location[] {
    return places.map((place, index) => ({
      id: `loc-${index + 1}`,
      name: place.name,
      description: `Explore ${place.name} - a beautiful ${place.type} location`,
      coordinates: place.coords,
      type: index === 0 ? 'start' as const : index === places.length - 1 ? 'end' as const : 'milestone' as const,
      estimatedTime: 30 + Math.floor(Math.random() * 30),
      difficulty: 'easy' as const,
      tags: [place.type, 'nearby', 'recommended']
    }));
  }

  /**
   * Generate generic nearby locations when specific city data isn't available
   */
  private generateGenericNearbyLocations(userLat: number, userLon: number): Location[] {
    const offset = 0.01; // Roughly 1km
    return [
      {
        id: 'nearby-1',
        name: 'Local Park',
        description: 'A peaceful park area near your location',
        coordinates: [userLat + offset, userLon + offset],
        type: 'start',
        estimatedTime: 25,
        difficulty: 'easy',
        tags: ['park', 'nearby', 'nature']
      },
      {
        id: 'nearby-2',
        name: 'Community Center',
        description: 'Local community gathering place',
        coordinates: [userLat - offset, userLon + offset],
        type: 'milestone',
        estimatedTime: 30,
        difficulty: 'easy',
        tags: ['community', 'nearby', 'cultural']
      },
      {
        id: 'nearby-3',
        name: 'Market Area',
        description: 'Local market with shops and eateries',
        coordinates: [userLat + offset, userLon - offset],
        type: 'end',
        estimatedTime: 40,
        difficulty: 'easy',
        tags: ['market', 'nearby', 'shopping']
      }
    ];
  }

  /**
   * Calculate approximate route distance
   */
  private calculateRouteDistance(userLat: number, userLon: number, baseDistance: number): number {
    // Add some variation based on user location
    const variation = Math.random() * 1.5 + 0.5; // 0.5 to 2.0
    return baseDistance * variation;
  }

  /**
   * Sort routes by relevance to user location
   */
  private sortRoutesByRelevance(routes: Route[], userLocation: UserLocationInfo): LocationBasedRoute[] {
    return routes.map(route => {
      const distanceFromUser = this.calculateDistanceToRoute(userLocation, route);
      const relevanceScore = this.calculateRelevanceScore(userLocation, route, distanceFromUser);
      
      return {
        ...route,
        distanceFromUser,
        relevanceScore
      };
    }).sort((a, b) => b.relevanceScore - a.relevanceScore);
  }

  /**
   * Calculate distance from user to route start
   */
  private calculateDistanceToRoute(userLocation: UserLocationInfo, route: Route): number {
    if (route.locations.length === 0) return Infinity;
    
    const startLocation = route.locations[0];
    return this.haversineDistance(
      userLocation.latitude,
      userLocation.longitude,
      startLocation.coordinates[0],
      startLocation.coordinates[1]
    );
  }

  /**
   * Calculate relevance score based on distance and other factors
   */
  private calculateRelevanceScore(userLocation: UserLocationInfo, route: Route, distance: number): number {
    let score = 100;
    
    // Penalize distance (closer is better)
    score -= distance * 2;
    
    // Bonus for shorter routes (easier to complete)
    if (route.difficulty === 'easy') score += 10;
    
    // Bonus for reasonable duration
    if (route.totalTime >= 60 && route.totalTime <= 180) score += 15;
    
    return Math.max(0, score);
  }

  /**
   * Calculate distance between two points using Haversine formula
   */
  private haversineDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
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
}

export const locationBasedRouteService = LocationBasedRouteService.getInstance();
