import { Location } from '../types';

// Haversine formula to calculate distance between two coordinates
export const calculateDistance = (coord1: [number, number], coord2: [number, number]): number => {
  const [lat1, lon1] = coord1;
  const [lat2, lon2] = coord2;
  
  const R = 6371; // Earth's radius in kilometers
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLon/2) * Math.sin(dLon/2);
  
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  const distance = R * c;
  
  return distance;
};

// Simple nearest neighbor optimization for route planning
export const optimizeRoute = (locations: Location[]): Location[] => {
  if (locations.length <= 2) return locations;

  // Keep start and end points fixed if they exist
  const startPoints = locations.filter(loc => loc.type === 'start');
  const endPoints = locations.filter(loc => loc.type === 'end');
  const milestones = locations.filter(loc => loc.type === 'milestone');

  if (startPoints.length === 0 && endPoints.length === 0) {
    // No fixed start/end points, optimize entire route
    return nearestNeighborTSP(locations);
  }

  // Optimize milestones between start and end points
  const start = startPoints[0] || locations[0];
  const end = endPoints[0] || locations[locations.length - 1];
  
  if (milestones.length === 0) {
    return [start, end];
  }

  const optimizedMilestones = nearestNeighborTSP(milestones, start.coordinates);
  
  return [start, ...optimizedMilestones, end];
};

// Nearest neighbor algorithm for TSP approximation
const nearestNeighborTSP = (locations: Location[], startCoord?: [number, number]): Location[] => {
  if (locations.length <= 1) return locations;

  const unvisited = [...locations];
  const route: Location[] = [];
  
  // Start from provided coordinates or first location
  let current = startCoord 
    ? unvisited.reduce((closest, loc) => {
        const distToCurrent = calculateDistance(startCoord, loc.coordinates);
        const distToClosest = calculateDistance(startCoord, closest.coordinates);
        return distToCurrent < distToClosest ? loc : closest;
      })
    : unvisited[0];

  route.push(current);
  unvisited.splice(unvisited.indexOf(current), 1);

  // Find nearest unvisited location iteratively
  while (unvisited.length > 0) {
    let nearest = unvisited[0];
    let minDistance = calculateDistance(current.coordinates, nearest.coordinates);

    for (const location of unvisited) {
      const distance = calculateDistance(current.coordinates, location.coordinates);
      if (distance < minDistance) {
        minDistance = distance;
        nearest = location;
      }
    }

    route.push(nearest);
    unvisited.splice(unvisited.indexOf(nearest), 1);
    current = nearest;
  }

  return route;
};

// Calculate total route distance
export const calculateTotalDistance = (locations: Location[]): number => {
  let totalDistance = 0;
  
  for (let i = 0; i < locations.length - 1; i++) {
    totalDistance += calculateDistance(
      locations[i].coordinates,
      locations[i + 1].coordinates
    );
  }
  
  return totalDistance;
};

// Estimate travel time based on distance and difficulty
export const estimateTravelTime = (distance: number, difficulty: 'easy' | 'medium' | 'hard'): number => {
  // Base walking speed: 5 km/h for easy, 4 km/h for medium, 3 km/h for hard
  const speedMultiplier = {
    easy: 5,
    medium: 4,
    hard: 3
  };

  const hours = distance / speedMultiplier[difficulty];
  return Math.round(hours * 60); // Convert to minutes
};