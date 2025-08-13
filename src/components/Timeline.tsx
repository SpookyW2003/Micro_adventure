import React from 'react';
import { Check, MapPin, Clock } from 'lucide-react';
import { Location } from '../types';
import { motion } from 'framer-motion';

interface TimelineProps {
  locations: Location[];
  currentIndex: number;
  completedLocations: string[];
  onLocationClick?: (location: Location, index: number) => void;
}

export const Timeline: React.FC<TimelineProps> = ({
  locations,
  currentIndex,
  completedLocations,
  onLocationClick
}) => {
  const getStatusColor = (index: number, locationId: string) => {
    if (completedLocations.includes(locationId)) {
      return 'bg-green-500 border-green-500';
    } else if (index === currentIndex) {
      return 'bg-blue-500 border-blue-500';
    } else if (index < currentIndex) {
      return 'bg-gray-400 border-gray-400';
    }
    return 'bg-white border-gray-300';
  };

  const getLineColor = (index: number) => {
    if (index < currentIndex) {
      return 'bg-green-500';
    } else if (index === currentIndex) {
      return 'bg-blue-500';
    }
    return 'bg-gray-300';
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-6">Route Progress</h3>
      
      <div className="relative">
        {locations.map((location, index) => (
          <div key={location.id} className="relative">
            <div
              className="flex items-start cursor-pointer group"
              onClick={() => onLocationClick?.(location, index)}
            >
              {/* Timeline dot */}
              <div className="flex flex-col items-center">
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${getStatusColor(index, location.id)}`}
                >
                  {completedLocations.includes(location.id) && (
                    <Check className="h-2.5 w-2.5 text-white" />
                  )}
                </motion.div>
                
                {/* Connecting line */}
                {index < locations.length - 1 && (
                  <div className={`w-0.5 h-16 mt-2 ${getLineColor(index)}`} />
                )}
              </div>

              {/* Content */}
              <div className="ml-4 pb-8 flex-1 group-hover:bg-gray-50 p-3 rounded-lg transition-colors duration-200">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-medium text-gray-900">{location.name}</h4>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    location.type === 'start' ? 'bg-emerald-100 text-emerald-800' :
                    location.type === 'milestone' ? 'bg-blue-100 text-blue-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {location.type}
                  </span>
                </div>
                
                <p className="text-xs text-gray-600 mt-1 line-clamp-2">{location.description}</p>
                
                <div className="flex items-center space-x-3 mt-2">
                  <div className="flex items-center space-x-1 text-xs text-gray-500">
                    <Clock className="h-3 w-3" />
                    <span>{location.estimatedTime}min</span>
                  </div>
                  <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                    location.difficulty === 'easy' ? 'bg-green-100 text-green-700' :
                    location.difficulty === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                    'bg-red-100 text-red-700'
                  }`}>
                    {location.difficulty}
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};