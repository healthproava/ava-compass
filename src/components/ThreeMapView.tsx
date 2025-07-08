import React, { useEffect, useRef } from 'react';
import { GoogleMapView } from './MapView';

export interface MapMarker {
  id: string;
  position: { lat: number; lng: number };
  title: string;
  address?: string;
  rating?: number;
  type?: string;
}

interface ThreeMapViewProps {
  markers: MapMarker[];
  center?: { lat: number; lng: number };
  isFullScreen?: boolean;
  onToggleFullScreen?: () => void;
  onMarkerClick?: (marker: MapMarker) => void;
}

const ThreeMapView: React.FC<ThreeMapViewProps> = ({ 
  markers, 
  center, 
  isFullScreen, 
  onToggleFullScreen, 
  onMarkerClick 
}) => {
  const defaultCenter = center || { lat: 44.9429, lng: -123.0351 };
  
  return (
    <div className="w-full h-full">
      <GoogleMapView 
        markers={markers}
        center={defaultCenter}
      />
    </div>
  );
};

export default ThreeMapView;