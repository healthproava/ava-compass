import React, { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MapPin, List, Globe } from 'lucide-react';
import ResultsMarkdownDisplay from './ResultsMarkdownDisplay';
import ThreeMapView from './ThreeMapView';

interface Facility {
  id: string;
  name: string;
  address_line1?: string;
  latitude?: number;
  longitude?: number;
  rating?: number;
  reviews_count?: number;
  phone?: string;
  website?: string;
  facility_type?: string;
  image_urls?: string[];
}

interface ResultsContainerProps {
  facilities: Facility[];
  summary?: string;
  isVisible?: boolean;
}

const ResultsContainer = ({ 
  facilities = [], 
  summary,
  isVisible = false 
}: ResultsContainerProps) => {
  const [activeTab, setActiveTab] = useState('list');
  const [mapMarkers, setMapMarkers] = useState<any[]>([]);
  const [mapCenter, setMapCenter] = useState({ lat: 44.9429, lng: -123.0351 });

  // Convert facilities to map markers
  useEffect(() => {
    const markers = facilities
      .filter(facility => facility.latitude && facility.longitude)
      .map(facility => ({
        id: facility.id,
        position: { 
          lat: facility.latitude!, 
          lng: facility.longitude! 
        },
        title: facility.name,
        address: facility.address_line1 || '',
        rating: facility.rating,
        type: facility.facility_type
      }));

    setMapMarkers(markers);

    // Calculate center point if we have markers
    if (markers.length > 0) {
      const avgLat = markers.reduce((sum, marker) => sum + marker.position.lat, 0) / markers.length;
      const avgLng = markers.reduce((sum, marker) => sum + marker.position.lng, 0) / markers.length;
      setMapCenter({ lat: avgLat, lng: avgLng });
    }
  }, [facilities]);

  // Listen for custom events from the widget
  useEffect(() => {
    const handleDisplayCards = (event: CustomEvent) => {
      if (event.detail.cards) {
        // Auto-switch to list view when cards are displayed
        setActiveTab('list');
      }
    };

    const handlePopulateMap = (event: CustomEvent) => {
      if (event.detail.mapData) {
        // Auto-switch to map view when map data is populated
        setActiveTab('map');
      }
    };

    window.addEventListener('display-cards', handleDisplayCards as EventListener);
    window.addEventListener('populate-map', handlePopulateMap as EventListener);

    return () => {
      window.removeEventListener('display-cards', handleDisplayCards as EventListener);
      window.removeEventListener('populate-map', handlePopulateMap as EventListener);
    };
  }, []);

  if (!isVisible && facilities.length === 0 && !summary) {
    return null; // Don't show anything when empty
  }

  return (
    <div className="space-y-4">
      {/* Results Header */}
      {(facilities.length > 0 || summary) && (
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <h2 className="text-xl font-semibold">Search Results</h2>
            {facilities.length > 0 && (
              <Badge variant="secondary">
                {facilities.length} facilities found
              </Badge>
            )}
          </div>
        </div>
      )}

      {/* Results Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="list" className="flex items-center space-x-2">
            <List className="h-4 w-4" />
            <span>List View</span>
          </TabsTrigger>
          <TabsTrigger value="map" className="flex items-center space-x-2">
            <Globe className="h-4 w-4" />
            <span>3D Map</span>
          </TabsTrigger>
        </TabsList>

        {/* List View */}
        <TabsContent value="list" className="mt-4">
          <ResultsMarkdownDisplay
            facilities={facilities}
            summary={summary}
            onFacilitySelect={(facility) => {
              console.log('Selected facility:', facility);
              // Could trigger map view or detailed view
            }}
          />
        </TabsContent>

        {/* 3D Map View */}
        <TabsContent value="map" className="mt-4">
          <ThreeMapView
            markers={mapMarkers}
            center={mapCenter}
            onMarkerClick={(marker) => {
              console.log('Clicked marker:', marker);
              // Could show facility details or switch to list view
            }}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ResultsContainer;