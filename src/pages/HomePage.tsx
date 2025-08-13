import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapView } from '../components/MapView';
import { RouteCard } from '../components/RouteCard';
import { SearchBox } from '../components/SearchBox';
import { LocationAccessButton } from '../components/LocationAccessButton';
import { useLocationBasedRoutes } from '../hooks/useLocationBasedRoutes';
import { Route, Location } from '../types';
import { motion } from 'framer-motion';
import { Compass, TrendingUp, Users, Star, MapPin } from 'lucide-react';

export const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const [featuredRoutes, setFeaturedRoutes] = useState<Route[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Route[]>([]);
  const [userLocation, setUserLocation] = useState<{ latitude: number; longitude: number } | null>(null);
  
  // Location-based routes
  const {
    routes: locationBasedRoutes,
    loading: routesLoading,
    userRegion,
    getRoutesForLocation,
    clearRoutes
  } = useLocationBasedRoutes();

  // Mock Indian routes data
  useEffect(() => {
    const mockRoutes: Route[] = [
      {
        id: '1',
        name: 'Old Delhi Heritage Trail',
        description: 'Journey through the historic streets of Old Delhi with its magnificent Mughal architecture and vibrant bazaars.',
        locations: [
          {
            id: 'l1',
            name: 'Red Fort (Lal Qila)',
            description: 'UNESCO World Heritage Site and symbol of Mughal power',
            coordinates: [28.6562, 77.2410],
            type: 'start',
            estimatedTime: 45,
            difficulty: 'easy',
            tags: ['historic', 'unesco', 'mughal']
          },
          {
            id: 'l2',
            name: 'Chandni Chowk',
            description: 'Bustling market street with traditional food and crafts',
            coordinates: [28.6506, 77.2303],
            type: 'milestone',
            estimatedTime: 60,
            difficulty: 'medium',
            tags: ['market', 'food', 'shopping']
          },
          {
            id: 'l3',
            name: 'Raj Ghat',
            description: 'Memorial dedicated to Mahatma Gandhi',
            coordinates: [28.6417, 77.2488],
            type: 'end',
            estimatedTime: 30,
            difficulty: 'easy',
            tags: ['memorial', 'history', 'peaceful']
          }
        ],
        totalDistance: 4.5,
        totalTime: 135,
        difficulty: 'easy',
        createdAt: '2024-01-15T10:00:00Z'
      },
      {
        id: '2',
        name: 'Mumbai Coastal Walk',
        description: 'Experience the charm of Mumbai through its iconic seafront and colonial architecture.',
        locations: [
          {
            id: 'l4',
            name: 'Gateway of India',
            description: 'Iconic monument and symbol of Mumbai',
            coordinates: [18.9220, 72.8347],
            type: 'start',
            estimatedTime: 20,
            difficulty: 'easy',
            tags: ['monument', 'colonial', 'iconic']
          },
          {
            id: 'l5',
            name: 'Marine Drive',
            description: 'The Queen\'s Necklace - beautiful promenade along the coastline',
            coordinates: [18.9435, 72.8234],
            type: 'milestone',
            estimatedTime: 45,
            difficulty: 'easy',
            tags: ['coastal', 'promenade', 'sunset']
          },
          {
            id: 'l6',
            name: 'Hanging Gardens',
            description: 'Terraced gardens on the slopes of Malabar Hill',
            coordinates: [18.9567, 72.8054],
            type: 'milestone',
            estimatedTime: 35,
            difficulty: 'medium',
            tags: ['garden', 'nature', 'view']
          },
          {
            id: 'l7',
            name: 'Chowpatty Beach',
            description: 'Popular beach famous for street food and cultural events',
            coordinates: [18.9545, 72.8156],
            type: 'end',
            estimatedTime: 40,
            difficulty: 'easy',
            tags: ['beach', 'food', 'culture']
          }
        ],
        totalDistance: 5.2,
        totalTime: 140,
        difficulty: 'easy',
        createdAt: '2024-01-14T14:30:00Z'
      }
    ];

    setFeaturedRoutes(mockRoutes);
  }, []);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (query.trim()) {
      const results = featuredRoutes.filter(route =>
        route.name.toLowerCase().includes(query.toLowerCase()) ||
        route.description.toLowerCase().includes(query.toLowerCase())
      );
      setSearchResults(results);
    } else {
      setSearchResults([]);
    }
  };

  const handleFilterChange = (filters: any) => {
    // Implementation for filter logic
    console.log('Filters changed:', filters);
  };
  
  const handleStartPlanning = () => {
    // Navigate to route planner or adventure map
    console.log('Starting planning - navigate to /adventure-map');
    navigate('/adventure-map');
  };
  
  const handleRouteSelect = (route: Route) => {
    // Navigate to route detail or start adventure
    console.log('Starting route:', route.name);
    // Navigate to adventure map with route parameter
    navigate(`/adventure-map?route=${route.id}`);
  };
  
  const handleRouteEdit = (route: Route) => {
    // Navigate to route editor
    console.log('Editing route:', route.name);
    // Navigate to route planner with edit parameter
    navigate(`/planner?edit=${route.id}`);
  };
  
  // Get location-based routes when user location changes
  useEffect(() => {
    if (userLocation) {
      getRoutesForLocation({
        latitude: userLocation.latitude,
        longitude: userLocation.longitude
      });
    } else {
      clearRoutes();
    }
  }, [userLocation, getRoutesForLocation, clearRoutes]);
  
  // Combine featured routes with location-based routes
  const allRoutes = userLocation ? [...featuredRoutes, ...locationBasedRoutes] : featuredRoutes;
  const displayRoutes = searchQuery ? searchResults : allRoutes;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20 lg:py-24">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 sm:mb-6">
              Discover Your Next
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-blue-300">
                Micro-Adventure
              </span>
            </h1>
            <p className="text-lg sm:text-xl text-blue-100 mb-6 sm:mb-8 max-w-3xl mx-auto px-4">
              Plan, optimize, and navigate custom routes through your city. Turn everyday walks into extraordinary adventures.
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleStartPlanning}
              className="bg-emerald-500 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-xl text-base sm:text-lg font-semibold hover:bg-emerald-400 transition-colors duration-200"
            >
              Start Planning
            </motion.button>
          </motion.div>
        </div>
      </section>


      {/* Search Section */}
      <section className="py-12 sm:py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-8 sm:mb-12"
          >
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3 sm:mb-4">Find Your Perfect Route</h2>
            <p className="text-base sm:text-lg text-gray-600 px-4">Discover curated micro-adventures in your area</p>
          </motion.div>

          {/* Location Access Section */}
          <div className="mb-6 sm:mb-8 bg-white rounded-xl p-4 sm:p-6 border border-gray-200">
            <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-2 sm:mb-3">Enable Location Services</h3>
            <p className="text-sm sm:text-base text-gray-600 mb-3 sm:mb-4">
              Allow location access to find routes near you and get personalized recommendations.
              {userLocation && userRegion && (
                <span className="text-green-600 font-medium"> Showing routes in {userRegion}!</span>
              )}
            </p>
            <LocationAccessButton 
              variant="primary"
              onLocationChange={setUserLocation}
              className="mb-3 sm:mb-4"
            />
          </div>

          <div className="mb-8">
            <SearchBox
              onSearch={handleSearch}
              onFilterChange={handleFilterChange}
            />
          </div>

          {/* Featured Routes */}
          <div className="mb-8 sm:mb-12">
            <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 sm:mb-6 px-2">
              {searchQuery ? `Search Results (${displayRoutes.length})` : 
               userLocation && userRegion ? `Routes in ${userRegion} (${displayRoutes.length})` : 
               'Featured Routes'}
            </h3>
            {userLocation && locationBasedRoutes.length > 0 && (
              <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                <p className="text-sm text-green-800">
                  ✓ Found {locationBasedRoutes.length} personalized routes based on your location!
                </p>
              </div>
            )}
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {displayRoutes.map((route, index) => (
                <motion.div
                  key={route.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <RouteCard
                    route={route}
                    onSelect={handleRouteSelect}
                    onEdit={handleRouteEdit}
                  />
                </motion.div>
              ))}
            </div>

            {displayRoutes.length === 0 && searchQuery && (
              <div className="text-center py-12">
                <MapPin className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No routes found</h3>
                <p className="text-gray-600">Try adjusting your search terms or filters</p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Map Preview Section */}
      <section className="py-12 sm:py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-8 sm:mb-12"
          >
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3 sm:mb-4">Interactive Route Planning</h2>
            <p className="text-base sm:text-lg text-gray-600 px-4">Visualize your adventures before you start</p>
          </motion.div>

          <div className="bg-gray-100 rounded-xl p-3 sm:p-6">
            <MapView
              route={featuredRoutes[0]}
              locations={featuredRoutes[0]?.locations || []}
              center={userLocation ? [userLocation.latitude, userLocation.longitude] : [28.6139, 77.2090]}
              zoom={userLocation ? 13 : 6}
              className="h-64 sm:h-80 lg:h-96"
              showUserLocation={true}
              centerOnUser={!!userLocation}
            />
          </div>
        </div>
      </section>
    </div>
  );
};