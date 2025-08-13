import React from 'react';
import { MapPin, Navigation, AlertCircle, CheckCircle, Loader } from 'lucide-react';
import { useLocation } from '../hooks/useLocation';

interface LocationAccessButtonProps {
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  showStatus?: boolean;
  onLocationChange?: (location: { latitude: number; longitude: number } | null) => void;
  className?: string;
}

export const LocationAccessButton: React.FC<LocationAccessButtonProps> = ({
  variant = 'primary',
  size = 'md',
  showStatus = true,
  onLocationChange,
  className = ''
}) => {
  const {
    location,
    isLoading,
    error,
    isWatching,
    permission,
    getCurrentLocation,
    startWatching,
    stopWatching,
    clearError
  } = useLocation();

  // Notify parent component when location changes
  React.useEffect(() => {
    if (onLocationChange) {
      onLocationChange(location ? {
        latitude: location.latitude,
        longitude: location.longitude
      } : null);
    }
  }, [location, onLocationChange]);

  const handleLocationRequest = async () => {
    clearError();
    
    if (permission === 'denied') {
      // If permission was denied, we can't do much except inform the user
      return;
    }

    if (isWatching) {
      stopWatching();
    } else {
      try {
        await getCurrentLocation();
      } catch (error) {
        console.error('Failed to get location:', error);
      }
    }
  };

  const handleStartWatching = async () => {
    clearError();
    try {
      if (isWatching) {
        stopWatching();
      } else {
        await startWatching();
      }
    } catch (error) {
      console.error('Failed to start watching location:', error);
    }
  };

  const getButtonVariantStyles = () => {
    const baseStyles = 'inline-flex items-center justify-center rounded-lg font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2';
    
    const sizeStyles = {
      sm: 'px-3 py-2 text-sm',
      md: 'px-4 py-2 text-sm',
      lg: 'px-6 py-3 text-base'
    };

    const variantStyles = {
      primary: 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500 disabled:bg-blue-300',
      secondary: 'bg-gray-600 text-white hover:bg-gray-700 focus:ring-gray-500 disabled:bg-gray-300',
      outline: 'border-2 border-blue-600 text-blue-600 hover:bg-blue-50 focus:ring-blue-500 disabled:border-gray-300 disabled:text-gray-300'
    };

    return `${baseStyles} ${sizeStyles[size]} ${variantStyles[variant]}`;
  };

  const getStatusIcon = () => {
    if (isLoading) return <Loader className="w-4 h-4 animate-spin" />;
    if (error && permission === 'denied') return <AlertCircle className="w-4 h-4 text-red-500" />;
    if (location) return <CheckCircle className="w-4 h-4 text-green-500" />;
    if (isWatching) return <Navigation className="w-4 h-4 text-blue-500" />;
    return <MapPin className="w-4 h-4" />;
  };

  const getButtonText = () => {
    if (permission === 'denied') return 'Location Access Denied';
    if (isLoading) return 'Getting Location...';
    if (isWatching) return 'Stop Tracking';
    if (location) return 'Update Location';
    return 'Enable Location';
  };

  const getStatusText = () => {
    if (permission === 'denied') {
      return 'Location access denied. Please enable in browser settings.';
    }
    if (error) {
      return error;
    }
    if (isWatching) {
      return 'Continuously tracking your location';
    }
    if (location) {
      return `Located at ${location.latitude.toFixed(4)}, ${location.longitude.toFixed(4)} (±${Math.round(location.accuracy)}m)`;
    }
    return 'Location not available';
  };

  return (
    <div className={`space-y-2 ${className}`}>
      <div className="flex space-x-2">
        <button
          onClick={handleLocationRequest}
          disabled={isLoading || permission === 'denied'}
          className={getButtonVariantStyles()}
        >
          {getStatusIcon()}
          <span className="ml-2">{getButtonText()}</span>
        </button>

        {location && !isLoading && (
          <button
            onClick={handleStartWatching}
            disabled={permission === 'denied'}
            className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-gray-100 disabled:text-gray-400"
          >
            <Navigation className={`w-4 h-4 mr-2 ${isWatching ? 'text-blue-500' : 'text-gray-400'}`} />
            {isWatching ? 'Stop Tracking' : 'Live Tracking'}
          </button>
        )}
      </div>

      {showStatus && (
        <div className="text-sm text-gray-600">
          {getStatusText()}
        </div>
      )}

      {permission === 'denied' && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-3">
          <div className="flex items-start">
            <AlertCircle className="w-5 h-5 text-red-400 mt-0.5 mr-2 flex-shrink-0" />
            <div>
              <h4 className="text-sm font-medium text-red-800">Location Access Required</h4>
              <p className="text-sm text-red-700 mt-1">
                To use location-based features, please enable location access in your browser settings:
              </p>
              <ul className="text-sm text-red-700 mt-2 ml-4 list-disc">
                <li>Click the location icon in your browser's address bar</li>
                <li>Select "Always allow" or "Allow"</li>
                <li>Refresh the page and try again</li>
              </ul>
            </div>
          </div>
        </div>
      )}

      {error && permission !== 'denied' && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
          <div className="flex items-start">
            <AlertCircle className="w-5 h-5 text-yellow-400 mt-0.5 mr-2 flex-shrink-0" />
            <div>
              <h4 className="text-sm font-medium text-yellow-800">Location Error</h4>
              <p className="text-sm text-yellow-700 mt-1">{error}</p>
              <button
                onClick={clearError}
                className="text-sm text-yellow-800 underline hover:no-underline mt-1"
              >
                Dismiss
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
