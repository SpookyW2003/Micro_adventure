export interface Location {
  id: string;
  name: string;
  description: string;
  coordinates: [number, number];
  type: 'start' | 'milestone' | 'end';
  estimatedTime: number; // in minutes
  difficulty: 'easy' | 'medium' | 'hard';
  tags: string[];
}

export interface Route {
  id: string;
  name: string;
  description: string;
  locations: Location[];
  totalDistance: number; // in km
  totalTime: number; // in minutes
  difficulty: 'easy' | 'medium' | 'hard';
  createdAt: string;
  userId?: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
}

export interface RouteProgress {
  routeId: string;
  currentLocationIndex: number;
  startTime: string;
  completedLocations: string[];
  totalTimeElapsed: number;
}