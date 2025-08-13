import React, { useState, useEffect } from 'react';
import { RouteCard } from '../components/RouteCard';
import { Route } from '../types';
import { motion } from 'framer-motion';
import { Plus, Search, Filter } from 'lucide-react';

export const MyRoutesPage: React.FC = () => {
  const [routes, setRoutes] = useState<Route[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'date' | 'name' | 'difficulty' | 'distance'>('date');

  useEffect(() => {
    // Mock user routes
    const mockRoutes: Route[] = [
      {
        id: '1',
        name: 'Morning City Walk',
        description: 'A refreshing morning walk through the city center with coffee stops.',
        locations: [],
        totalDistance: 4.2,
        totalTime: 95,
        difficulty: 'easy',
        createdAt: '2024-01-20T08:00:00Z'
      },
      {
        id: '2',
        name: 'Historic London Tour',
        description: 'Explore London\'s rich history through its most iconic landmarks.',
        locations: [],
        totalDistance: 6.8,
        totalTime: 180,
        difficulty: 'medium',
        createdAt: '2024-01-18T10:30:00Z'
      },
      {
        id: '3',
        name: 'Park & Gardens Adventure',
        description: 'Nature escape through beautiful parks and hidden gardens.',
        locations: [],
        totalDistance: 8.5,
        totalTime: 240,
        difficulty: 'hard',
        createdAt: '2024-01-15T14:15:00Z'
      }
    ];
    setRoutes(mockRoutes);
  }, []);

  const filteredRoutes = routes
    .filter(route => 
      route.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      route.description.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'difficulty':
          const difficultyOrder = { 'easy': 1, 'medium': 2, 'hard': 3 };
          return difficultyOrder[a.difficulty] - difficultyOrder[b.difficulty];
        case 'distance':
          return b.totalDistance - a.totalDistance;
        case 'date':
        default:
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      }
    });

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">My Routes</h1>
              <p className="text-lg text-gray-600">Manage and explore your saved adventures</p>
            </div>
            
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center space-x-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors duration-200"
            >
              <Plus className="h-5 w-5" />
              <span>Create New Route</span>
            </motion.button>
          </div>

          {/* Search and Filter Bar */}
          <div className="bg-white rounded-lg shadow-md p-4 mb-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search your routes..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="date">Sort by Date</option>
                <option value="name">Sort by Name</option>
                <option value="difficulty">Sort by Difficulty</option>
                <option value="distance">Sort by Distance</option>
              </select>
            </div>
          </div>
        </motion.div>

        {/* Routes Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredRoutes.map((route, index) => (
            <motion.div
              key={route.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <RouteCard
                route={route}
                onSelect={(route) => {
                  console.log('Starting route:', route.name);
                }}
                onEdit={(route) => {
                  console.log('Editing route:', route.name);
                }}
              />
            </motion.div>
          ))}
        </div>

        {filteredRoutes.length === 0 && (
          <div className="text-center py-16">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="h-12 w-12 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {searchQuery ? 'No routes found' : 'No routes yet'}
            </h3>
            <p className="text-gray-600 mb-6">
              {searchQuery 
                ? 'Try adjusting your search terms' 
                : 'Create your first micro-adventure route to get started'
              }
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="inline-flex items-center space-x-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors duration-200"
            >
              <Plus className="h-5 w-5" />
              <span>Create Your First Route</span>
            </motion.button>
          </div>
        )}
      </div>
    </div>
  );
};