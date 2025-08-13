import React, { useState } from 'react';
import { Search, MapPin, Filter } from 'lucide-react';
import { motion } from 'framer-motion';

interface SearchBoxProps {
  onSearch: (query: string) => void;
  onFilterChange: (filters: LocalSearchFilters) => void;
  placeholder?: string;
}

interface LocalSearchFilters {
  difficulty: string[];
  type: string[];
  estimatedTime: [number, number];
}

export const SearchBox: React.FC<SearchBoxProps> = ({
  onSearch,
  onFilterChange,
  placeholder = "Search for locations, landmarks, or activities..."
}) => {
  const [query, setQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState<LocalSearchFilters>({
    difficulty: [],
    type: [],
    estimatedTime: [0, 240]
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(query);
  };

  const handleFilterChange = (newFilters: Partial<LocalSearchFilters>) => {
    const updatedFilters = { ...filters, ...newFilters };
    setFilters(updatedFilters);
    onFilterChange(updatedFilters);
  };

  const toggleFilter = (category: keyof Pick<LocalSearchFilters, 'difficulty' | 'type'>, value: string) => {
    const current = filters[category];
    const updated = current.includes(value)
      ? current.filter(item => item !== value)
      : [...current, value];
    
    handleFilterChange({ [category]: updated });
  };

  return (
    <div className="bg-white rounded-lg shadow-md border border-gray-200">
      <form onSubmit={handleSubmit} className="p-4">
        <div className="flex items-center space-x-3">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={placeholder}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <button
            type="button"
            onClick={() => setShowFilters(!showFilters)}
            className={`px-4 py-3 border border-gray-300 rounded-lg transition-colors duration-200 ${
              showFilters ? 'bg-blue-50 border-blue-300 text-blue-600' : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            <Filter className="h-5 w-5" />
          </button>
          <button
            type="submit"
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
          >
            Search
          </button>
        </div>
      </form>

      {showFilters && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="border-t border-gray-200 p-4"
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Difficulty Filter */}
            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">
                Difficulty
              </label>
              <div className="space-y-2">
                {['easy', 'medium', 'hard'].map((difficulty) => (
                  <label key={difficulty} className="flex items-center">
                    <input
                      type="checkbox"
                      checked={filters.difficulty.includes(difficulty)}
                      onChange={() => toggleFilter('difficulty', difficulty)}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <span className="ml-2 text-sm text-gray-700 capitalize">{difficulty}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Type Filter */}
            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">
                Location Type
              </label>
              <div className="space-y-2">
                {['start', 'milestone', 'end'].map((type) => (
                  <label key={type} className="flex items-center">
                    <input
                      type="checkbox"
                      checked={filters.type.includes(type)}
                      onChange={() => toggleFilter('type', type)}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <span className="ml-2 text-sm text-gray-700 capitalize">{type}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Time Filter */}
            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">
                Estimated Time (minutes)
              </label>
              <div className="space-y-2">
                <input
                  type="range"
                  min="0"
                  max="240"
                  value={filters.estimatedTime[1]}
                  onChange={(e) => handleFilterChange({
                    estimatedTime: [filters.estimatedTime[0], parseInt(e.target.value)]
                  })}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                />
                <div className="flex justify-between text-xs text-gray-500">
                  <span>0 min</span>
                  <span>{filters.estimatedTime[1]} min</span>
                  <span>240 min</span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
};