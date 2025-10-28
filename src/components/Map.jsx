import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Polyline, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import './Map.css';

// Fix for default marker icon issue in React-Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});

// Create custom vehicle icon using SVG - Modern and clean design
const createVehicleIcon = (rotation = 0) => {
  const svgIcon = `
    <svg width="56" height="56" viewBox="0 0 56 56" fill="none" xmlns="http://www.w3.org/2000/svg" style="transform: rotate(${rotation}deg); transform-origin: center;">
      <!-- Subtle shadow -->
      <ellipse cx="28" cy="48" rx="16" ry="4" fill="rgba(0,0,0,0.15)"/>
      
      <!-- Main car body - streamlined modern design -->
      <g filter="url(#shadow)">
        <!-- Bottom chassis -->
        <rect x="14" y="30" width="28" height="8" rx="2" fill="#2563EB"/>
        
        <!-- Main body -->
        <path d="M16 30 L18 20 C18 20 20 16 28 16 C36 16 38 20 38 20 L40 30 Z" 
              fill="#3B82F6" stroke="#1E40AF" stroke-width="1.2"/>
        
        <!-- Windshield (front) -->
        <path d="M38 20 L40 30 L36 30 L35 22 Z" 
              fill="#60A5FA" opacity="0.8"/>
        
        <!-- Side window -->
        <path d="M25 18 L27 22 L32 22 L31 18 Z" 
              fill="#93C5FD" opacity="0.7"/>
        
        <!-- Rear window -->
        <path d="M18 20 L20 30 L24 30 L23 22 Z" 
              fill="#60A5FA" opacity="0.8"/>
      </g>
      
      <!-- Wheels with modern design -->
      <g>
        <!-- Front wheel -->
        <circle cx="36" cy="38" r="4.5" fill="#1F2937" stroke="#111827" stroke-width="1.2"/>
        <circle cx="36" cy="38" r="2.5" fill="#374151"/>
        <circle cx="36" cy="38" r="1" fill="#6B7280"/>
        
        <!-- Rear wheel -->
        <circle cx="20" cy="38" r="4.5" fill="#1F2937" stroke="#111827" stroke-width="1.2"/>
        <circle cx="20" cy="38" r="2.5" fill="#374151"/>
        <circle cx="20" cy="38" r="1" fill="#6B7280"/>
      </g>
      
      <!-- Headlights - LED style -->
      <g>
        <ellipse cx="40" cy="28" rx="1.5" ry="2" fill="#FCD34D" opacity="0.9"/>
        <ellipse cx="40" cy="28" rx="0.8" ry="1" fill="#FBBF24"/>
      </g>
      
      <!-- Tail lights -->
      <g>
        <ellipse cx="16" cy="28" rx="1.5" ry="2" fill="#EF4444" opacity="0.8"/>
      </g>
      
      <!-- Modern accent line -->
      <path d="M20 25 L36 25" stroke="#1E40AF" stroke-width="0.8" opacity="0.5" stroke-linecap="round"/>
      
      <!-- Roof spoiler detail -->
      <rect x="17" y="19" width="3" height="1" rx="0.5" fill="#1E40AF" opacity="0.6"/>
      
      <!-- Side mirror -->
      <circle cx="38" cy="24" r="1.2" fill="#2563EB" stroke="#1E40AF" stroke-width="0.5"/>
      
      <!-- Shadow filter definition -->
      <defs>
        <filter id="shadow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur in="SourceAlpha" stdDeviation="1"/>
          <feOffset dx="0" dy="1" result="offsetblur"/>
          <feComponentTransfer>
            <feFuncA type="linear" slope="0.2"/>
          </feComponentTransfer>
          <feMerge>
            <feMergeNode/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
      </defs>
    </svg>
  `;

  return new L.DivIcon({
    html: svgIcon,
    className: 'custom-vehicle-marker',
    iconSize: [56, 56],
    iconAnchor: [28, 28],
    popupAnchor: [0, -28],
  });
};

// Component to update map center
function MapUpdater({ center }) {
  const map = useMap();
  useEffect(() => {
    if (center) {
      map.setView(center, map.getZoom());
    }
  }, [center, map]);
  return null;
}

function Map({ currentPosition, routePath, rotation = 0 }) {
  const center = currentPosition || [17.361358, 78.474735];
  const vehicleIcon = createVehicleIcon(rotation);

  return (
    <MapContainer
      center={center}
      zoom={13}
      style={{ height: '100%', width: '100%' }}
      className="z-0"
    >
      {/* CartoDB Positron - Light and clean */}
      <TileLayer
        url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
        maxZoom={19}
      />
      
      {/* Alternative Free Map Options (uncomment to use):
      
      OpenStreetMap - Standard:
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        maxZoom={19}
      />
      
      CartoDB Dark Matter - Dark theme:
      <TileLayer
        url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
        maxZoom={19}
      />
      */}
      
      {/* Vehicle Marker */}
      {currentPosition && (
        <Marker position={currentPosition} icon={vehicleIcon} />
      )}
      
      {/* Route Path */}
      {routePath.length > 0 && (
        <Polyline 
          positions={routePath} 
          color="#3B82F6" 
          weight={4}
          opacity={0.8}
          lineCap="round"
          lineJoin="round"
        />
      )}
      
      <MapUpdater center={currentPosition} />
    </MapContainer>
  );
}

export default Map;