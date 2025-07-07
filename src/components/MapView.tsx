// src/components/MapView.tsx

import React from 'react';
import { GoogleMap, useJsApiLoader, Marker } from '@react-google-maps/api';

// --- TYPE DEFINITIONS ---
export interface MapMarker {
  id: string;
  position: { lat: number; lng: number };
  title: string;
}

interface GoogleMapViewProps {
  markers: MapMarker[];
  center?: { lat: number; lng: number };
}

const containerStyle = {
  width: '100%',
  height: '400px',
  borderRadius: '0.5rem',
};

// Default center (Phoenix, AZ) if none is provided
const defaultCenter = {
  lat: 33.4484,
  lng: -112.0740
};

export const GoogleMapView: React.FC<GoogleMapViewProps> = ({ markers = [], center }) => {
  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: import.meta.env.VITE_Maps_API_KEY as string,
  });

  if (!isLoaded) {
    return <div>Loading Map...</div>;
  }

  return (
    <GoogleMap
      mapContainerStyle={containerStyle}
      center={center || defaultCenter}
      zoom={11}
    >
      {/* Create a marker for each facility */}
      {markers.map((marker) => (
        <Marker
          key={marker.id}
          position={marker.position}
          title={marker.title}
        />
      ))}
    </GoogleMap>
  );
};
