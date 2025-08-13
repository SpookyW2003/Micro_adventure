import React from 'react';
import { MapPin, Clock, Star, Tag } from 'lucide-react';
import { Location } from '../types';
import { motion } from 'framer-motion';

interface LocationCardProps {
  location: Location;
  onSelect?: (location: Location) => void;
  isSelected?: boolean;
  showDistance?: boolean;
  distance?: number;
}

export const LocationCard: React.FC<LocationCardProps> = ({
  location,
  onSelect,
  isSelected = false,
  showDistance = false,
  distance
}) => {
  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'bg-green-100 text-green-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'hard': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'start': return 'bg-emerald-100 text-emerald-800';
      case 'milestone': return 'bg-blue-100 text-blue-800';
      case 'end': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <motion.div
      whileHover={{ y: -2 }}
      whileTap={{ scale: 0.98 }}
      className={`bg-white rounded-lg shadow-md border-2 transition-all duration-200 cursor-pointer ${
        isSelected ? 'border-blue-500 shadow-lg' : 'border-gray-200 hover:border-gray-300'
      }`}
      onClick={() => onSelect?.(location)}
    >
      <div className="p-6">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center space-x-2">
            <MapPin className="h-5 w-5 text-blue-600" />
            <h3 className="text-lg font-semibold text-gray-900">{location.name}</h3>
          </div>
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getTypeColor(location.type)}`}>
            {location.type}
          </span>
        </div>

        <p className="text-gray-600 text-sm mb-4 line-clamp-2">{location.description}</p>

        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-1 text-sm text-gray-500">
              <Clock className="h-4 w-4" />
              <span>{location.estimatedTime}min</span>
            </div>
            {showDistance && distance && (
              <div className="flex items-center space-x-1 text-sm text-gray-500">
                <MapPin className="h-4 w-4" />
                <span>{distance.toFixed(1)}km</span>
              </div>
            )}
          </div>
          
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(location.difficulty)}`}>
            {location.difficulty}
          </span>
        </div>

        {location.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-3">
            {location.tags.slice(0, 3).map((tag, index) => (
              <span
                key={index}
                className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-gray-100 text-gray-700"
              >
                <Tag className="h-3 w-3 mr-1" />
                {tag}
              </span>
            ))}
            {location.tags.length > 3 && (
              <span className="text-xs text-gray-500">+{location.tags.length - 3} more</span>
            )}
          </div>
        )}
      </div>
    </motion.div>
  );
};