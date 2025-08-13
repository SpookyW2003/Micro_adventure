import React, { useState } from 'react';
import { MapView } from '../components/MapView';
import { LocationCard } from '../components/LocationCard';
import { SearchBox } from '../components/SearchBox';
import { LocationAccessButton } from '../components/LocationAccessButton';
import { Location, Route } from '../types';
import { motion } from 'framer-motion';
import { Plus, Route as RouteIcon, Save, Shuffle } from 'lucide-react';

export const RoutePlannerPage: React.FC = () => {
  const [selectedLocations, setSelectedLocations] = useState<Location[]>([]);
  const [availableLocations, setAvailableLocations] = useState<Location[]>([]);
  const [currentRoute, setCurrentRoute] = useState<Route | null>(null);
  const [routeName, setRouteName] = useState('');
  const [routeDescription, setRouteDescription] = useState('');
  const [userLocation, setUserLocation] = useState<{ latitude: number; longitude: number } | null>(null);

  // Mock available Indian locations
  React.useEffect(() => {
    const mockLocations: Location[] = [
      {
        id: 'loc1',
        name: 'India Gate',
        description: 'War memorial dedicated to soldiers of the Indian Army',
        coordinates: [28.6129, 77.2295],
        type: 'milestone',
        estimatedTime: 30,
        difficulty: 'easy',
        tags: ['monument', 'memorial', 'iconic']
      },
      {
        id: 'loc2',
        name: 'Lotus Temple',
        description: 'Bahá\'í House of Worship known for its lotus-like shape',
        coordinates: [28.5535, 77.2588],
        type: 'milestone',
        estimatedTime: 45,
        difficulty: 'easy',
        tags: ['spiritual', 'architecture', 'peaceful']
      },
      {
        id: 'loc3',
        name: 'Humayun\'s Tomb',
        description: 'UNESCO World Heritage Site and precursor to the Taj Mahal',
        coordinates: [28.5933, 77.2507],
        type: 'milestone',
        estimatedTime: 60,
        difficulty: 'easy',
        tags: ['unesco', 'mughal', 'heritage']
      },
      {
        id: 'loc4',
        name: 'Qutub Minar',
        description: 'Tallest brick minaret in the world and UNESCO World Heritage Site',
        coordinates: [28.5244, 77.1855],
        type: 'milestone',
        estimatedTime: 50,
        difficulty: 'medium',
        tags: ['unesco', 'historic', 'architecture']
      },
      {
        id: 'loc5',
        name: 'Connaught Place',
        description: 'Popular commercial and business center with Georgian architecture',
        coordinates: [28.6315, 77.2167],
        type: 'milestone',
        estimatedTime: 40,
        difficulty: 'easy',
        tags: ['shopping', 'colonial', 'central']
      },
      {
        id: 'loc6',
        name: 'Akshardham Temple',
        description: 'Modern Hindu temple complex showcasing Indian culture',
        coordinates: [28.6127, 77.2773],
        type: 'milestone',
        estimatedTime: 90,
        difficulty: 'medium',
        tags: ['temple', 'culture', 'modern']
      },
      {
        id: 'loc7',
        name: 'Purana Qila',
        description: 'Ancient fort with rich history dating back to Indraprastha',
        coordinates: [28.6096, 77.2426],
        type: 'milestone',
        estimatedTime: 55,
        difficulty: 'easy',
        tags: ['fort', 'ancient', 'history']
      },
      {
        id: 'loc8',
        name: 'Lodi Gardens',
        description: 'Beautiful park with 15th century tombs and lush greenery',
        coordinates: [28.5931, 77.2197],
        type: 'milestone',
        estimatedTime: 35,
        difficulty: 'easy',
        tags: ['park', 'nature', 'tombs']
      }
    ];
    setAvailableLocations(mockLocations);
  }, []);

  const handleLocationSelect = (location: Location) => {
    if (!selectedLocations.find(loc => loc.id === location.id)) {
      const newLocations = [...selectedLocations, location];
      setSelectedLocations(newLocations);
      updateRoute(newLocations);
    }
  };

  const handleLocationRemove = (locationId: string) => {
    const newLocations = selectedLocations.filter(loc => loc.id !== locationId);
    setSelectedLocations(newLocations);
    updateRoute(newLocations);
  };

  const updateRoute = (locations: Location[]) => {
    if (locations.length >= 2) {
      const totalTime = locations.reduce((sum, loc) => sum + loc.estimatedTime, 0);
      const totalDistance = calculateTotalDistance(locations);
      const maxDifficulty = getMaxDifficulty(locations);

      const route: Route = {
        id: 'temp-route',
        name: routeName || 'My Custom Route',
        description: routeDescription || 'A custom micro-adventure route',
        locations,
        totalDistance,
        totalTime,
        difficulty: maxDifficulty,
        createdAt: new Date().toISOString()
      };

      setCurrentRoute(route);
    } else {
      setCurrentRoute(null);
    }
  };

  const calculateTotalDistance = (locations: Location[]): number => {
    // Simplified distance calculation (in real app, use proper geo calculations)
    let totalDistance = 0;
    for (let i = 0; i < locations.length - 1; i++) {
      const [lat1, lon1] = locations[i].coordinates;
      const [lat2, lon2] = locations[i + 1].coordinates;
      const distance = Math.sqrt(Math.pow(lat2 - lat1, 2) + Math.pow(lon2 - lon1, 2)) * 111; // Rough km conversion
      totalDistance += distance;
    }
    return totalDistance;
  };

  const getMaxDifficulty = (locations: Location[]): 'easy' | 'medium' | 'hard' => {
    const difficulties = locations.map(loc => loc.difficulty);
    if (difficulties.includes('hard')) return 'hard';
    if (difficulties.includes('medium')) return 'medium';
    return 'easy';
  };

  const optimizeRoute = () => {
    // Simple optimization: sort by proximity (in real app, use proper TSP algorithm)
    if (selectedLocations.length > 2) {
      const optimized = [...selectedLocations];
      // Keep start and end, optimize middle points
      const start = optimized[0];
      const end = optimized[optimized.length - 1];
      const middle = optimized.slice(1, -1);
      
      // Simple nearest neighbor optimization for middle points
      const sortedMiddle = middle.sort((a, b) => {
        const distA = Math.sqrt(
          Math.pow(a.coordinates[0] - start.coordinates[0], 2) +
          Math.pow(a.coordinates[1] - start.coordinates[1], 2)
        );
        const distB = Math.sqrt(
          Math.pow(b.coordinates[0] - start.coordinates[0], 2) +
          Math.pow(b.coordinates[1] - start.coordinates[1], 2)
        );
        return distA - distB;
      });

      const newLocations = [start, ...sortedMiddle, end];
      setSelectedLocations(newLocations);
      updateRoute(newLocations);
    }
  };

  const saveRoute = () => {
    if (currentRoute && routeName) {
      // In real app, save to backend/local storage
      console.log('Saving route:', currentRoute);
      alert('Route saved successfully!');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Route Planner</h1>
          <p className="text-lg text-gray-600">Create your custom micro-adventure route</p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Panel - Location Selection */}
          <div className="lg:col-span-1 space-y-6">
            {/* Location Access */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Your Location</h3>
              <p className="text-gray-600 mb-4 text-sm">Enable location access to add nearby places and optimize routes.</p>
              <LocationAccessButton 
                variant="outline"
                size="sm"
                onLocationChange={setUserLocation}
              />
            </div>

            <SearchBox
              onSearch={() => {}}
              onFilterChange={() => {}}
              placeholder="Search for locations to add..."
            />

            {/* Route Details */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Route Details</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Route Name
                  </label>
                  <input
                    type="text"
                    value={routeName}
                    onChange={(e) => setRouteName(e.target.value)}
                    placeholder="Enter route name..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description
                  </label>
                  <textarea
                    value={routeDescription}
                    onChange={(e) => setRouteDescription(e.target.value)}
                    placeholder="Describe your adventure..."
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                {currentRoute && (
                  <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Total Distance:</span>
                      <span className="font-medium">{currentRoute.totalDistance.toFixed(1)}km</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Estimated Time:</span>
                      <span className="font-medium">
                        {Math.floor(currentRoute.totalTime / 60)}h {currentRoute.totalTime % 60}min
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Difficulty:</span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        currentRoute.difficulty === 'easy' ? 'bg-green-100 text-green-800' :
                        currentRoute.difficulty === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {currentRoute.difficulty}
                      </span>
                    </div>
                  </div>
                )}

                <div className="flex space-x-2">
                  <button
                    onClick={optimizeRoute}
                    disabled={selectedLocations.length < 3}
                    className="flex-1 flex items-center justify-center space-x-2 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors duration-200"
                  >
                    <Shuffle className="h-4 w-4" />
                    <span>Optimize</span>
                  </button>
                  
                  <button
                    onClick={saveRoute}
                    disabled={!currentRoute || !routeName}
                    className="flex-1 flex items-center justify-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors duration-200"
                  >
                    <Save className="h-4 w-4" />
                    <span>Save</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Selected Locations */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Selected Locations ({selectedLocations.length})
              </h3>
              
              {selectedLocations.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <RouteIcon className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                  <p>Select locations to build your route</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {selectedLocations.map((location, index) => (
                    <div
                      key={location.id}
                      className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                    >
                      <div className="flex items-center space-x-3">
                        <span className="flex items-center justify-center w-6 h-6 bg-blue-600 text-white text-xs font-bold rounded-full">
                          {index + 1}
                        </span>
                        <div>
                          <h4 className="font-medium text-gray-900">{location.name}</h4>
                          <p className="text-xs text-gray-500">{location.estimatedTime}min</p>
                        </div>
                      </div>
                      <button
                        onClick={() => handleLocationRemove(location.id)}
                        className="text-red-500 hover:text-red-700 transition-colors duration-200"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Available Locations */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Available Locations</h3>
              
              <div className="grid gap-4">
                {availableLocations
                  .filter(loc => !selectedLocations.find(selected => selected.id === loc.id))
                  .map((location) => (
                    <motion.div
                      key={location.id}
                      whileHover={{ scale: 1.02 }}
                      className="border border-gray-200 rounded-lg p-4 hover:border-blue-300 transition-colors duration-200 cursor-pointer"
                      onClick={() => handleLocationSelect(location)}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-medium text-gray-900">{location.name}</h4>
                          <p className="text-sm text-gray-600 line-clamp-1">{location.description}</p>
                          <div className="flex items-center space-x-2 mt-1">
                            <span className="text-xs text-gray-500">{location.estimatedTime}min</span>
                            <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                              location.difficulty === 'easy' ? 'bg-green-100 text-green-700' :
                              location.difficulty === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                              'bg-red-100 text-red-700'
                            }`}>
                              {location.difficulty}
                            </span>
                          </div>
                        </div>
                        <Plus className="h-5 w-5 text-blue-600" />
                      </div>
                    </motion.div>
                  ))}
              </div>
            </div>
          </div>

          {/* Right Panel - Map */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="p-4 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900">Route Preview</h3>
                {currentRoute && (
                  <p className="text-sm text-gray-600 mt-1">
                    {currentRoute.locations.length} locations • {currentRoute.totalDistance.toFixed(1)}km • {Math.floor(currentRoute.totalTime / 60)}h {currentRoute.totalTime % 60}min
                  </p>
                )}
              </div>
              
              <MapView
                route={currentRoute || undefined}
                locations={selectedLocations}
                center={userLocation ? [userLocation.latitude, userLocation.longitude] : 
                       selectedLocations.length > 0 ? selectedLocations[0].coordinates : [28.6139, 77.2090]}
                zoom={userLocation ? 14 : selectedLocations.length > 0 ? 13 : 6}
                className="h-[600px]"
                showUserLocation={true}
                centerOnUser={!!userLocation && selectedLocations.length === 0}
                onLocationClick={(location) => {
                  console.log('Map location clicked:', location.name);
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};