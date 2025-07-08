import React, { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { MapPin, List, Globe, Mail, FileText, FormInput } from 'lucide-react';
import ContentRenderer from './ContentRenderer';
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

interface ContentData {
  type: 'facilities' | 'email' | 'document' | 'form' | 'map' | 'markdown';
  data?: any;
  summary?: string;
}

interface ResultsContainerProps {
  facilities?: Facility[];
  summary?: string;
  isVisible?: boolean;
  contentData?: ContentData;
}

const ResultsContainer = ({ 
  facilities = [], 
  summary,
  isVisible = false,
  contentData
}: ResultsContainerProps) => {
  const [activeTab, setActiveTab] = useState('content');
  const [mapMarkers, setMapMarkers] = useState<any[]>([]);
  const [mapCenter, setMapCenter] = useState({ lat: 44.9429, lng: -123.0351 });
  const [currentContent, setCurrentContent] = useState<ContentData>({
    type: 'facilities',
    data: facilities,
    summary
  });

  // Update content when props change
  useEffect(() => {
    if (contentData) {
      setCurrentContent(contentData);
    } else {
      setCurrentContent({
        type: 'facilities',
        data: facilities,
        summary
      });
    }
  }, [contentData, facilities, summary]);

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
    const handleDisplayContent = (event: CustomEvent) => {
      console.log('Display content event:', event.detail);
      if (event.detail.contentType) {
        setCurrentContent({
          type: event.detail.contentType,
          data: event.detail.data,
          summary: event.detail.summary
        });
        setActiveTab('content');
      }
    };

    const handleDisplayCards = (event: CustomEvent) => {
      if (event.detail.cards) {
        setActiveTab('content');
      }
    };

    const handlePopulateMap = (event: CustomEvent) => {
      if (event.detail.mapData) {
        setActiveTab('map');
      }
    };

    window.addEventListener('display-content', handleDisplayContent as EventListener);
    window.addEventListener('display-cards', handleDisplayCards as EventListener);
    window.addEventListener('populate-map', handlePopulateMap as EventListener);

    return () => {
      window.removeEventListener('display-content', handleDisplayContent as EventListener);
      window.removeEventListener('display-cards', handleDisplayCards as EventListener);
      window.removeEventListener('populate-map', handlePopulateMap as EventListener);
    };
  }, []);

  return (
    <div className="space-y-4 h-full">
      {/* Results Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full h-full flex flex-col">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="content" className="flex items-center space-x-2">
            {currentContent.type === 'email' && <Mail className="h-4 w-4" />}
            {currentContent.type === 'document' && <FileText className="h-4 w-4" />}
            {currentContent.type === 'form' && <FormInput className="h-4 w-4" />}
            {(currentContent.type === 'facilities' || currentContent.type === 'markdown') && <List className="h-4 w-4" />}
            <span>Content</span>
          </TabsTrigger>
          <TabsTrigger value="map" className="flex items-center space-x-2">
            <Globe className="h-4 w-4" />
            <span>3D Map</span>
          </TabsTrigger>
        </TabsList>

        {/* Content View */}
        <TabsContent value="content" className="mt-4 flex-1">
          <ContentRenderer
            contentType={currentContent.type}
            data={currentContent.data}
            summary={currentContent.summary}
            isVisible={true}
          />
        </TabsContent>

        {/* 3D Map View */}
        <TabsContent value="map" className="mt-4 flex-1">
          <ThreeMapView
            markers={mapMarkers}
            center={mapCenter}
            onMarkerClick={(marker) => {
              console.log('Clicked marker:', marker);
            }}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ResultsContainer;