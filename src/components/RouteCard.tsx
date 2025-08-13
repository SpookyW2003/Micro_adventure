import React from 'react';
import { Clock, MapPin, Zap, Calendar } from 'lucide-react';
import { Route } from '../types';
import { motion } from 'framer-motion';

interface RouteCardProps {
  route: Route;
  onSelect?: (route: Route) => void;
  onEdit?: (route: Route) => void;
  showActions?: boolean;
}

export const RouteCard: React.FC<RouteCardProps> = ({
  route,
  onSelect,
  onEdit,
  showActions = true
}) => {
  const [isLoading, setIsLoading] = React.useState(false);
  
  const handleSelect = async () => {
    if (onSelect && !isLoading) {
      setIsLoading(true);
      try {
        await onSelect(route);
      } finally {
        setIsLoading(false);
      }
    }
  };
  
  const handleEdit = async () => {
    if (onEdit && !isLoading) {
      setIsLoading(true);
      try {
        await onEdit(route);
      } finally {
        setIsLoading(false);
      }
    }
  };
  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'bg-green-100 text-green-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'hard': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <motion.div
      whileHover={{ y: -4 }}
      className="bg-white rounded-lg shadow-md border border-gray-200 hover:shadow-lg transition-all duration-300"
    >
      <div className="p-4 sm:p-6">
        <div className="flex items-start justify-between mb-3">
          <h3 className="text-lg sm:text-xl font-bold text-gray-900 pr-2">{route.name}</h3>
          <span className={`px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-medium ${getDifficultyColor(route.difficulty)} whitespace-nowrap`}>
            {route.difficulty}
          </span>
        </div>

        <p className="text-sm sm:text-base text-gray-600 mb-4 line-clamp-2">{route.description}</p>

        <div className="grid grid-cols-2 gap-3 sm:gap-4 mb-4">
          <div className="flex items-center space-x-1 sm:space-x-2 text-xs sm:text-sm text-gray-500">
            <MapPin className="h-3 w-3 sm:h-4 sm:w-4" />
            <span>{route.locations.length} stops</span>
          </div>
          <div className="flex items-center space-x-1 sm:space-x-2 text-xs sm:text-sm text-gray-500">
            <Zap className="h-3 w-3 sm:h-4 sm:w-4" />
            <span>{route.totalDistance.toFixed(1)}km</span>
          </div>
          <div className="flex items-center space-x-1 sm:space-x-2 text-xs sm:text-sm text-gray-500">
            <Clock className="h-3 w-3 sm:h-4 sm:w-4" />
            <span>{Math.floor(route.totalTime / 60)}h {route.totalTime % 60}min</span>
          </div>
          <div className="flex items-center space-x-1 sm:space-x-2 text-xs sm:text-sm text-gray-500">
            <Calendar className="h-3 w-3 sm:h-4 sm:w-4" />
            <span>{formatDate(route.createdAt)}</span>
          </div>
        </div>

        {showActions && (
          <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3">
            <button
              onClick={handleSelect}
              disabled={isLoading}
              className="flex-1 bg-blue-600 text-white px-3 sm:px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Loading...' : 'Start Adventure'}
            </button>
            <button
              onClick={handleEdit}
              disabled={isLoading}
              className="px-3 sm:px-4 py-2 border border-gray-300 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed sm:w-auto"
            >
              Edit
            </button>
          </div>
        )}
      </div>
    </motion.div>
  );
};