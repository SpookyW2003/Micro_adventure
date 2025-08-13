import React, { useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, Circle } from 'react-leaflet';
import { Icon } from 'leaflet';
import { Location, Route } from '../types';
import { useLocation } from '../hooks/useLocation';
import 'leaflet/dist/leaflet.css';

// Fix for default markers in react-leaflet
delete (Icon.Default.prototype as any)._getIconUrl;
Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

interface MapViewProps {
  route?: Route;
  locations: Location[];
  center?: [number, number];
  zoom?: number;
  onLocationClick?: (location: Location) => void;
  className?: string;
  showUserLocation?: boolean;
  centerOnUser?: boolean;
}

export const MapView: React.FC<MapViewProps> = ({
  route,
  locations,
  center = [51.505, -0.09],
  zoom = 13,
  onLocationClick,
  className = "h-96",
  showUserLocation = false,
  centerOnUser = false
}) => {
  const { location: userLocation } = useLocation();
  const startIcon = new Icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
  });

  const milestoneIcon = new Icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
  });

  const endIcon = new Icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
  });

  const userIcon = new Icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-violet.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
  });

  const getIcon = (type: Location['type']) => {
    switch (type) {
      case 'start': return startIcon;
      case 'milestone': return milestoneIcon;
      case 'end': return endIcon;
      default: return milestoneIcon;
    }
  };

  const routeCoordinates = route ? route.locations.map(loc => loc.coordinates) : [];
  
  // Use user location as center if available and requested
  const mapCenter = centerOnUser && userLocation ? 
    [userLocation.latitude, userLocation.longitude] as [number, number] : 
    center;

  return (
    <div className={className}>
      <MapContainer
        center={mapCenter}
        zoom={zoom}
        style={{ height: '100%', width: '100%' }}
        className="rounded-lg"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        {locations.map((location) => (
          <Marker
            key={location.id}
            position={location.coordinates}
            icon={getIcon(location.type)}
            eventHandlers={{
              click: () => onLocationClick?.(location)
            }}
          >
            <Popup>
              <div className="p-2">
                <h3 className="font-semibold text-gray-900">{location.name}</h3>
                <p className="text-sm text-gray-600 mt-1">{location.description}</p>
                <div className="flex items-center mt-2 space-x-2">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    location.difficulty === 'easy' ? 'bg-green-100 text-green-800' :
                    location.difficulty === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {location.difficulty}
                  </span>
                  <span className="text-xs text-gray-500">
                    {location.estimatedTime}min
                  </span>
                </div>
              </div>
            </Popup>
          </Marker>
        ))}

        {/* User Location Marker and Accuracy Circle */}
        {showUserLocation && userLocation && (
          <>
            <Marker
              position={[userLocation.latitude, userLocation.longitude]}
              icon={userIcon}
            >
              <Popup>
                <div className="p-2">
                  <h3 className="font-semibold text-gray-900">Your Location</h3>
                  <p className="text-sm text-gray-600 mt-1">
                    Lat: {userLocation.latitude.toFixed(6)}<br/>
                    Lng: {userLocation.longitude.toFixed(6)}
                  </p>
                  <p className="text-xs text-gray-500 mt-2">
                    Accuracy: ±{Math.round(userLocation.accuracy)}m
                  </p>
                  <p className="text-xs text-gray-500">
                    Updated: {new Date(userLocation.timestamp).toLocaleTimeString()}
                  </p>
                </div>
              </Popup>
            </Marker>
            
            {/* Accuracy Circle */}
            <Circle
              center={[userLocation.latitude, userLocation.longitude]}
              radius={userLocation.accuracy}
              fillColor="#8B5CF6"
              fillOpacity={0.1}
              color="#8B5CF6"
              weight={1}
              opacity={0.3}
            />
          </>
        )}

        {route && routeCoordinates.length > 1 && (
          <Polyline
            positions={routeCoordinates}
            color="#2563EB"
            weight={4}
            opacity={0.7}
          />
        )}
      </MapContainer>
    </div>
  );
};