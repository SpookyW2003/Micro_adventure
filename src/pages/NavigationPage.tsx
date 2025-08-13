import React, { useState, useEffect } from 'react';
import { MapView } from '../components/MapView';
import { Timeline } from '../components/Timeline';
import { Route, RouteProgress } from '../types';
import { motion } from 'framer-motion';
import { Play, Pause, RotateCcw, Navigation, CheckCircle } from 'lucide-react';

interface NavigationPageProps {
  route: Route;
}

export const NavigationPage: React.FC<NavigationPageProps> = ({ route }) => {
  const [progress, setProgress] = useState<RouteProgress>({
    routeId: route.id,
    currentLocationIndex: 0,
    startTime: '',
    completedLocations: [],
    totalTimeElapsed: 0
  });
  const [isActive, setIsActive] = useState(false);
  const [timer, setTimer] = useState(0);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isActive) {
      interval = setInterval(() => {
        setTimer(timer => timer + 1);
        setProgress(prev => ({
          ...prev,
          totalTimeElapsed: prev.totalTimeElapsed + 1
        }));
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [isActive]);

  const startNavigation = () => {
    setIsActive(true);
    setProgress(prev => ({
      ...prev,
      startTime: new Date().toISOString()
    }));
  };

  const pauseNavigation = () => {
    setIsActive(false);
  };

  const resetNavigation = () => {
    setIsActive(false);
    setTimer(0);
    setProgress({
      routeId: route.id,
      currentLocationIndex: 0,
      startTime: '',
      completedLocations: [],
      totalTimeElapsed: 0
    });
  };

  const markLocationComplete = (locationId: string) => {
    setProgress(prev => {
      const newCompleted = [...prev.completedLocations, locationId];
      const nextIndex = Math.min(prev.currentLocationIndex + 1, route.locations.length - 1);
      
      return {
        ...prev,
        completedLocations: newCompleted,
        currentLocationIndex: nextIndex
      };
    });
  };

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  };

  const completionPercentage = (progress.completedLocations.length / route.locations.length) * 100;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-gray-900 mb-2">{route.name}</h1>
          <p className="text-lg text-gray-600">{route.description}</p>
        </motion.div>

        {/* Progress Bar */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Adventure Progress</h3>
            <span className="text-sm text-gray-600">
              {progress.completedLocations.length} of {route.locations.length} completed
            </span>
          </div>
          
          <div className="w-full bg-gray-200 rounded-full h-3 mb-4">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${completionPercentage}%` }}
              className="bg-gradient-to-r from-emerald-500 to-blue-500 h-3 rounded-full"
              transition={{ duration: 0.5 }}
            />
          </div>

          <div className="flex items-center justify-between text-sm text-gray-600">
            <span>Started: {progress.startTime ? new Date(progress.startTime).toLocaleTimeString() : 'Not started'}</span>
            <span>Elapsed: {formatTime(timer)}</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Panel - Timeline */}
          <div className="lg:col-span-1">
            <Timeline
              locations={route.locations}
              currentIndex={progress.currentLocationIndex}
              completedLocations={progress.completedLocations}
              onLocationClick={(location, index) => {
                if (index <= progress.currentLocationIndex) {
                  console.log('Viewing location details:', location.name);
                }
              }}
            />

            {/* Control Panel */}
            <div className="bg-white rounded-lg shadow-md p-6 mt-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Navigation Controls</h3>
              
              <div className="space-y-3">
                {!isActive && timer === 0 ? (
                  <button
                    onClick={startNavigation}
                    className="w-full flex items-center justify-center space-x-2 bg-emerald-600 text-white px-4 py-3 rounded-lg hover:bg-emerald-700 transition-colors duration-200"
                  >
                    <Play className="h-5 w-5" />
                    <span>Start Adventure</span>
                  </button>
                ) : (
                  <div className="space-y-3">
                    {isActive ? (
                      <button
                        onClick={pauseNavigation}
                        className="w-full flex items-center justify-center space-x-2 bg-yellow-600 text-white px-4 py-3 rounded-lg hover:bg-yellow-700 transition-colors duration-200"
                      >
                        <Pause className="h-5 w-5" />
                        <span>Pause</span>
                      </button>
                    ) : (
                      <button
                        onClick={() => setIsActive(true)}
                        className="w-full flex items-center justify-center space-x-2 bg-emerald-600 text-white px-4 py-3 rounded-lg hover:bg-emerald-700 transition-colors duration-200"
                      >
                        <Play className="h-5 w-5" />
                        <span>Resume</span>
                      </button>
                    )}
                    
                    <button
                      onClick={resetNavigation}
                      className="w-full flex items-center justify-center space-x-2 bg-gray-600 text-white px-4 py-3 rounded-lg hover:bg-gray-700 transition-colors duration-200"
                    >
                      <RotateCcw className="h-5 w-5" />
                      <span>Reset</span>
                    </button>
                  </div>
                )}

                {/* Mark Current Location Complete */}
                {isActive && progress.currentLocationIndex < route.locations.length && (
                  <button
                    onClick={() => markLocationComplete(route.locations[progress.currentLocationIndex].id)}
                    disabled={progress.completedLocations.includes(route.locations[progress.currentLocationIndex].id)}
                    className="w-full flex items-center justify-center space-x-2 bg-blue-600 text-white px-4 py-3 rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors duration-200"
                  >
                    <CheckCircle className="h-5 w-5" />
                    <span>Mark Complete</span>
                  </button>
                )}
              </div>

              {/* Current Location Info */}
              {progress.currentLocationIndex < route.locations.length && (
                <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                  <h4 className="font-medium text-blue-900 mb-2">Current Destination</h4>
                  <p className="text-sm text-blue-800">
                    {route.locations[progress.currentLocationIndex].name}
                  </p>
                  <p className="text-xs text-blue-600 mt-1">
                    Estimated time: {route.locations[progress.currentLocationIndex].estimatedTime} minutes
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Right Panel - Map */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="p-4 border-b border-gray-200 flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">Live Navigation</h3>
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <Navigation className="h-4 w-4" />
                  <span>GPS Tracking: Active</span>
                </div>
              </div>
              
              <MapView
                route={route}
                locations={route.locations}
                center={route.locations[progress.currentLocationIndex]?.coordinates || route.locations[0].coordinates}
                zoom={15}
                className="h-[600px]"
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