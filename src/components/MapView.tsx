// src/components/MapView.tsx

import React, { useState, useEffect } from 'react';
import { GoogleMap, useJsApiLoader, Marker } from '@react-google-maps/api';
import { supabase } from '@/integrations/supabase/client';

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
  const [apiKey, setApiKey] = useState<string>('');

  useEffect(() => {
    const fetchApiKey = async () => {
      try {
        const { data, error } = await supabase.functions.invoke('get-google-maps-key');
        if (error) throw error;
        setApiKey(data.apiKey);
      } catch (error) {
        console.error('Error fetching Google Maps API key:', error);
      }
    };
    fetchApiKey();
  }, []);

  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: apiKey,
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
