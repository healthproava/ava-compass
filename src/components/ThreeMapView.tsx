import React from 'react';

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
  return (
    <div className="w-full h-96 bg-gray-100 rounded-lg flex items-center justify-center">
      <div className="text-center">
        <h3 className="text-lg font-medium text-gray-700 mb-2">3D Map View</h3>
        <p className="text-gray-500">3D map component placeholder</p>
        <p className="text-sm text-gray-400 mt-2">{markers.length} markers found</p>
      </div>
    </div>
  );
};

export default ThreeMapView;