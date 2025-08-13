export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
}

export interface Location {
  id: string;
  name: string;
  description: string;
  coordinates: [number, number];
  type: 'start' | 'milestone' | 'end';
  estimatedTime: number;
  difficulty: 'easy' | 'medium' | 'hard';
  tags: string[];
}

export interface Route {
  id: string;
  name: string;
  description: string;
  locations: Location[];
  totalDistance: number;
  totalTime: number;
  difficulty: 'easy' | 'medium' | 'hard';
  createdAt: string;
  createdBy?: string;
  tags?: string[];
  imageUrl?: string;
}

export interface SearchFilters {
  difficulty?: 'easy' | 'medium' | 'hard';
  maxDistance?: number;
  maxDuration?: number;
  tags?: string[];
}
