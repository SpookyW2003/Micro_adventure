import React, { useState, useEffect, useCallback } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { MapView } from '../components/MapView';
import { LocationAccessButton } from '../components/LocationAccessButton';
import { useNotifications } from '../hooks/useNotifications';
import { useLocation } from '../hooks/useLocation';
import { useLocationBasedRoutes } from '../hooks/useLocationBasedRoutes';
import { Route, Location } from '../types';
import { motion } from 'framer-motion';
import { MapPin, Compass, Navigation, Play, Filter, Search, Bell, Loader } from 'lucide-react';

export const AdventureMapPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [adventures, setAdventures] = useState<Route[]>([]);
  const [userLocation, setUserLocation] = useState<{ latitude: number; longitude: number } | null>(null);
  const [selectedAdventure, setSelectedAdventure] = useState<Route | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [mapCenter, setMapCenter] = useState<[number, number]>([28.6139, 77.2090]); // Default to Delhi, India
  
  // Hooks for notifications and location
  const {
    supported: notificationSupported,
    permission: notificationPermission,
    isFirstVisit,
    requestPermission: requestNotificationPermission,
    showWelcome,
    showLocationEnabled,
    showNearbyAdventure,
    showAdventureStarted,
    markVisited,
    updateStats
  } = useNotifications();
  
  const { calculateDistanceToPoint } = useLocation();
  
  // Location-based routes
  const {
    routes: locationBasedRoutes,
    loading: routesLoading,
    error: routesError,
    userRegion,
    getRoutesForLocation,
    clearRoutes
  } = useLocationBasedRoutes();

  // Mock adventure data for India without ratings/usage stats
  useEffect(() => {
    const mockAdventures: Route[] = [
      {
        id: '1',
        name: 'Delhi Heritage Walk',
        description: 'Explore the rich history of Old Delhi through its iconic monuments and bustling bazaars',
        locations: [
          {
            id: 'l1',
            name: 'Red Fort (Lal Qila)',
            description: 'Historic fortified palace of the Mughal emperors',
            coordinates: [28.6562, 77.2410],
            type: 'start',
            estimatedTime: 45,
            difficulty: 'easy',
            tags: ['historic', 'monument', 'unesco']
          },
          {
            id: 'l2',
            name: 'Jama Masjid',
            description: 'One of the largest mosques in India',
            coordinates: [28.6507, 77.2334],
            type: 'milestone',
            estimatedTime: 30,
            difficulty: 'easy',
            tags: ['mosque', 'architecture', 'heritage']
          },
          {
            id: 'l3',
            name: 'Chandni Chowk',
            description: 'Historic market street with traditional food and crafts',
            coordinates: [28.6506, 77.2303],
            type: 'end',
            estimatedTime: 60,
            difficulty: 'medium',
            tags: ['market', 'food', 'shopping', 'culture']
          }
        ],
        totalDistance: 2.1,
        totalTime: 135,
        difficulty: 'easy',
        createdAt: new Date().toISOString()
      },
      {
        id: '2',
        name: 'Mumbai Marine Drive Circuit',
        description: 'Scenic coastal walk along the Queen\'s Necklace with stunning sea views',
        locations: [
          {
            id: 'l4',
            name: 'Gateway of India',
            description: 'Iconic monument overlooking the Arabian Sea',
            coordinates: [18.9220, 72.8347],
            type: 'start',
            estimatedTime: 20,
            difficulty: 'easy',
            tags: ['monument', 'sea', 'historic']
          },
          {
            id: 'l5',
            name: 'Marine Drive',
            description: 'Famous promenade along the coastline',
            coordinates: [18.9435, 72.8234],
            type: 'milestone',
            estimatedTime: 40,
            difficulty: 'easy',
            tags: ['coastal', 'promenade', 'sunset']
          },
          {
            id: 'l6',
            name: 'Chowpatty Beach',
            description: 'Popular beach with street food and cultural activities',
            coordinates: [18.9545, 72.8156],
            type: 'end',
            estimatedTime: 45,
            difficulty: 'easy',
            tags: ['beach', 'food', 'culture', 'relaxation']
          }
        ],
        totalDistance: 3.5,
        totalTime: 105,
        difficulty: 'easy',
        createdAt: new Date().toISOString()
      },
      {
        id: '3',
        name: 'Jaipur Pink City Explorer',
        description: 'Discover the royal heritage of Rajasthan through magnificent palaces and forts',
        locations: [
          {
            id: 'l7',
            name: 'Hawa Mahal',
            description: 'Palace of Winds with intricate pink sandstone architecture',
            coordinates: [26.9239, 75.8267],
            type: 'start',
            estimatedTime: 30,
            difficulty: 'easy',
            tags: ['palace', 'architecture', 'royal']
          },
          {
            id: 'l8',
            name: 'City Palace',
            description: 'Royal residence complex with museums and courtyards',
            coordinates: [26.9255, 75.8230],
            type: 'milestone',
            estimatedTime: 60,
            difficulty: 'medium',
            tags: ['palace', 'museum', 'heritage']
          },
          {
            id: 'l9',
            name: 'Jantar Mantar',
            description: 'UNESCO World Heritage astronomical observatory',
            coordinates: [26.9244, 75.8246],
            type: 'milestone',
            estimatedTime: 40,
            difficulty: 'easy',
            tags: ['astronomy', 'unesco', 'science']
          },
          {
            id: 'l10',
            name: 'Johari Bazaar',
            description: 'Traditional market famous for jewelry and textiles',
            coordinates: [26.9211, 75.8231],
            type: 'end',
            estimatedTime: 50,
            difficulty: 'medium',
            tags: ['market', 'jewelry', 'textiles', 'shopping']
          }
        ],
        totalDistance: 1.8,
        totalTime: 180,
        difficulty: 'medium',
        createdAt: new Date().toISOString()
      },
      {
        id: '4',
        name: 'Bangalore Garden City Trail',
        description: 'Experience the green spaces and modern culture of India\'s Silicon Valley',
        locations: [
          {
            id: 'l11',
            name: 'Lalbagh Botanical Gardens',
            description: 'Historic botanical garden with diverse flora and glass house',
            coordinates: [12.9507, 77.5848],
            type: 'start',
            estimatedTime: 45,
            difficulty: 'easy',
            tags: ['garden', 'botanical', 'nature']
          },
          {
            id: 'l12',
            name: 'Bangalore Palace',
            description: 'Tudor-style architectural palace with beautiful grounds',
            coordinates: [12.9984, 77.5926],
            type: 'milestone',
            estimatedTime: 40,
            difficulty: 'easy',
            tags: ['palace', 'tudor', 'heritage']
          },
          {
            id: 'l13',
            name: 'UB City Mall',
            description: 'Modern shopping and dining complex',
            coordinates: [12.9716, 77.5946],
            type: 'milestone',
            estimatedTime: 35,
            difficulty: 'easy',
            tags: ['modern', 'shopping', 'dining']
          },
          {
            id: 'l14',
            name: 'Cubbon Park',
            description: 'Central park with lush greenery and walking paths',
            coordinates: [12.9766, 77.5993],
            type: 'end',
            estimatedTime: 30,
            difficulty: 'easy',
            tags: ['park', 'nature', 'walking', 'peaceful']
          }
        ],
        totalDistance: 4.2,
        totalTime: 150,
        difficulty: 'easy',
        createdAt: new Date().toISOString()
      },
      {
        id: '5',
        name: 'Chennai Cultural Heritage Walk',
        description: 'Explore the cultural richness of Tamil Nadu through temples and traditional art',
        locations: [
          {
            id: 'l15',
            name: 'Kapaleeshwarar Temple',
            description: 'Ancient Dravidian temple dedicated to Lord Shiva',
            coordinates: [13.0339, 80.2690],
            type: 'start',
            estimatedTime: 40,
            difficulty: 'easy',
            tags: ['temple', 'ancient', 'spiritual']
          },
          {
            id: 'l16',
            name: 'Government Museum',
            description: 'Museum with rich collection of South Indian art and artifacts',
            coordinates: [13.0615, 80.2693],
            type: 'milestone',
            estimatedTime: 50,
            difficulty: 'easy',
            tags: ['museum', 'art', 'culture']
          },
          {
            id: 'l17',
            name: 'Marina Beach',
            description: 'One of the longest urban beaches in the world',
            coordinates: [13.0500, 80.2824],
            type: 'end',
            estimatedTime: 35,
            difficulty: 'easy',
            tags: ['beach', 'coastal', 'sunset', 'relaxation']
          }
        ],
        totalDistance: 3.1,
        totalTime: 125,
        difficulty: 'easy',
        createdAt: new Date().toISOString()
      }
    ];

    setAdventures(mockAdventures);
  }, []);

  // Handle first visit and notifications
  useEffect(() => {
    const handleFirstVisit = async () => {
      if (isFirstVisit) {
        // Show welcome notification after a short delay
        setTimeout(async () => {
          await showWelcome();
          markVisited();
        }, 2000);
      }
      
      // Update visit stats
      updateStats({ visit: true });
    };
    
    handleFirstVisit();
  }, [isFirstVisit, showWelcome, markVisited, updateStats]);

  // Update map center when user location changes - prioritize user's actual location
  useEffect(() => {
    if (userLocation) {
      // Center map on user's actual location when available
      setMapCenter([userLocation.latitude, userLocation.longitude]);
      
      // Get location-based routes
      getRoutesForLocation({
        latitude: userLocation.latitude,
        longitude: userLocation.longitude
      });
    } else {
      // Clear location-based routes when location is disabled
      clearRoutes();
    }
  }, [userLocation, getRoutesForLocation, clearRoutes]);
  
  // Define handleAdventureSelect before it's used in useEffect
  const handleAdventureSelect = useCallback((adventure: Route) => {
    setSelectedAdventure(adventure);
    if (adventure.locations.length > 0) {
      setMapCenter(adventure.locations[0].coordinates);
    }
  }, []);
  
  // Handle URL parameters for route selection
  useEffect(() => {
    const routeId = searchParams.get('route');
    if (routeId && adventures.length > 0) {
      const route = adventures.find(adventure => adventure.id === routeId);
      if (route) {
        handleAdventureSelect(route);
      }
    }
  }, [searchParams, adventures, handleAdventureSelect]);

  // Check for nearby adventures when location changes
  useEffect(() => {
    if (userLocation && adventures.length > 0) {
      const checkNearbyAdventures = () => {
        adventures.forEach(adventure => {
          if (adventure.locations.length > 0) {
            const startLocation = adventure.locations[0];
            const distance = calculateDistanceToPoint(
              startLocation.coordinates[0],
              startLocation.coordinates[1]
            );
            
            // Show notification for adventures within 2km
            if (distance && distance <= 2) {
              showNearbyAdventure(adventure.name, distance);
            }
          }
        });
      };
      
      // Delay to avoid spam notifications
      setTimeout(checkNearbyAdventures, 3000);
    }
  }, [userLocation, adventures, calculateDistanceToPoint, showNearbyAdventure]);

  const handleStartAdventure = async (adventure: Route) => {
    // Update stats and show notification
    updateStats({ adventureStarted: true });
    await showAdventureStarted(adventure.name);
    
    // In a real app, this would navigate to the navigation page
    console.log('Starting adventure:', adventure.name);
    // You could add navigation here: navigate(`/navigation/${adventure.id}`);
  };
  
  // Create a click handler factory that returns the proper event handler
  const handleStartAdventureClick = useCallback((adventure: Route) => {
    return async (e: React.MouseEvent) => {
      e.stopPropagation();
      await handleStartAdventure(adventure);
    };
  }, [handleStartAdventure]);
  
  const handleLocationChange = async (location: { latitude: number; longitude: number } | null) => {
    setUserLocation(location);
    if (location && notificationPermission === 'granted') {
      // Show location enabled notification
      await showLocationEnabled();
    }
  };

  const getAllLocations = (): Location[] => {
    return adventures.reduce((acc, adventure) => {
      return acc.concat(adventure.locations);
    }, [] as Location[]);
  };

  // Combine default adventures with location-based routes
  const allAdventures = userLocation ? [...adventures, ...locationBasedRoutes] : adventures;
  
  const filteredAdventures = allAdventures.filter(adventure =>
    adventure.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    adventure.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 sm:mb-8"
        >
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 sm:mb-6">
            <div className="mb-4 sm:mb-0">
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-1 sm:mb-2">Adventure Map</h1>
              <p className="text-base sm:text-lg text-gray-600">Discover amazing adventures in your area</p>
            </div>
            <div className="flex items-center space-x-3">
              {notificationSupported && (
                <button
                  onClick={requestNotificationPermission}
                  className={`p-2 rounded-lg transition-colors ${
                    notificationPermission === 'granted' 
                      ? 'bg-green-100 text-green-600 hover:bg-green-200' 
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                  title={notificationPermission === 'granted' ? 'Notifications enabled' : 'Enable notifications'}
                >
                  <Bell className="h-5 w-5" />
                </button>
              )}
              <Compass className="h-8 w-8 text-blue-600" />
            </div>
          </div>

          {/* Location Access */}
          <div className="bg-white rounded-lg shadow-sm border p-4 sm:p-6 mb-4 sm:mb-6">
            <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-2 sm:mb-3">Find Adventures Near You</h3>
            <p className="text-sm sm:text-base text-gray-600 mb-3 sm:mb-4">Enable location access to discover adventures in your area</p>
            <LocationAccessButton 
              variant="primary"
              onLocationChange={handleLocationChange}
            />
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
          {/* Left Sidebar - Adventure List */}
          <div className="lg:col-span-1 space-y-4 sm:space-y-6">
            {/* Search */}
            <div className="bg-white rounded-lg shadow-sm border p-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search adventures..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Adventure List */}
            <div className="bg-white rounded-lg shadow-sm border">
              <div className="p-4 border-b border-gray-200">
                <h3 className="font-semibold text-gray-900">
                  {userLocation && userRegion ? `Adventures in ${userRegion}` : 'Available Adventures'}
                </h3>
                {routesLoading && (
                  <div className="flex items-center mt-2 text-sm text-blue-600">
                    <Loader className="w-4 h-4 animate-spin mr-2" />
                    Finding routes near you...
                  </div>
                )}
                {userLocation && locationBasedRoutes.length > 0 && (
                  <p className="text-xs text-green-600 mt-1">
                    ✓ {locationBasedRoutes.length} personalized routes found
                  </p>
                )}
              </div>
              <div className="divide-y divide-gray-200 max-h-80 sm:max-h-96 overflow-y-auto">
                {filteredAdventures.map((adventure) => (
                  <motion.div
                    key={adventure.id}
                    whileHover={{ backgroundColor: '#f9fafb' }}
                    className={`p-3 sm:p-4 cursor-pointer transition-colors ${
                      selectedAdventure?.id === adventure.id ? 'bg-blue-50 border-r-4 border-blue-500' : ''
                    }`}
                    onClick={() => handleAdventureSelect(adventure)}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <h4 className="font-medium text-gray-900 text-sm sm:text-base pr-2">{adventure.name}</h4>
                      {'distanceFromUser' in adventure && adventure.distanceFromUser < 5 && (
                        <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                          {adventure.distanceFromUser.toFixed(1)}km away
                        </span>
                      )}
                    </div>
                    <p className="text-xs sm:text-sm text-gray-600 mb-2 line-clamp-2">{adventure.description}</p>
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <span>{adventure.locations.length} stops</span>
                      <span>{adventure.totalDistance.toFixed(1)}km</span>
                      <span>{Math.floor(adventure.totalTime / 60)}h {adventure.totalTime % 60}m</span>
                    </div>
                    {'distanceFromUser' in adventure && (
                      <div className="mt-1">
                        <div className="flex items-center text-xs text-blue-600">
                          <MapPin className="w-3 h-3 mr-1" />
                          <span>Personalized for your location</span>
                        </div>
                      </div>
                    )}
                    <div className="mt-2">
                      <button
                        onClick={handleStartAdventureClick(adventure)}
                        className="w-full flex items-center justify-center space-x-1 px-2 sm:px-3 py-1.5 bg-blue-600 text-white text-xs sm:text-sm rounded-md hover:bg-blue-700 transition-colors"
                      >
                        <Play className="h-3 w-3" />
                        <span>Start Adventure</span>
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Selected Adventure Details */}
            {selectedAdventure && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-lg shadow-sm border p-4"
              >
                <h3 className="font-semibold text-gray-900 mb-2">{selectedAdventure.name}</h3>
                <p className="text-sm text-gray-600 mb-3">{selectedAdventure.description}</p>
                <div className="space-y-2">
                  {selectedAdventure.locations.map((location, index) => (
                    <div key={location.id} className="flex items-center space-x-2 text-sm">
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium text-white ${
                        location.type === 'start' ? 'bg-green-500' :
                        location.type === 'end' ? 'bg-red-500' : 'bg-blue-500'
                      }`}>
                        {index + 1}
                      </div>
                      <span className="text-gray-900">{location.name}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </div>

          {/* Main Map Area */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
              <div className="p-4 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-gray-900">
                    {selectedAdventure ? selectedAdventure.name : 'Adventure Map'}
                  </h3>
                  <div className="flex items-center space-x-2">
                    <MapPin className="h-5 w-5 text-gray-400" />
                    <span className="text-sm text-gray-600">
                      {userLocation ? 'Your location enabled' : 'Enable location for better experience'}
                    </span>
                  </div>
                </div>
              </div>

              <MapView
                route={selectedAdventure || undefined}
                locations={selectedAdventure ? selectedAdventure.locations : getAllLocations()}
                center={mapCenter}
                zoom={selectedAdventure ? 14 : userLocation ? 13 : 6}
                className="h-64 sm:h-80 lg:h-[600px]"
                showUserLocation={true}
                centerOnUser={userLocation ? true : false}
                onLocationClick={(location) => {
                  // Find which adventure this location belongs to
                  const adventure = adventures.find(adv => 
                    adv.locations.some(loc => loc.id === location.id)
                  );
                  if (adventure) {
                    setSelectedAdventure(adventure);
                  }
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
