import React, { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { MapPin, List, Globe, Mail, FileText, FormInput, NotebookText } from 'lucide-react';
import ContentRenderer from './ContentRenderer';
import ThreeMapView from './ThreeMapView';
import { SearchResult, DisplayData, Facility } from '../types';

interface ContentData {
  type: 'facilities' | 'email' | 'document' | 'form' | 'map' | 'markdown';
  data?: any;
  summary?: string;
}

interface ResultsContainerProps {
  searchResults?: SearchResult | null;
  displayData?: DisplayData[];
  isVisible?: boolean;
  isLoading?: boolean;
  error?: string | null;
  onClearResults?: () => void;
  onClearDisplayData?: () => void;
  onClearAll?: () => void;
  // Legacy props for backward compatibility
  facilities?: Facility[];
  summary?: string;
  contentData?: ContentData;
}

const ResultsContainer = ({ 
  searchResults,
  displayData = [],
  isVisible = false,
  isLoading = false,
  error,
  onClearResults,
  onClearDisplayData,
  onClearAll,
  // Legacy props for backward compatibility
  facilities = [], 
  summary,
  contentData
}: ResultsContainerProps) => {
  const [activeTab, setActiveTab] = useState('content');
  const [mapMarkers, setMapMarkers] = useState<any[]>([]);
  const [mapCenter, setMapCenter] = useState({ lat: 44.9429, lng: -123.0351 });
  const [currentContent, setCurrentContent] = useState<ContentData>({
    type: 'facilities',
    data: searchResults?.facilities || facilities,
    summary: searchResults?.summary || summary
  });

  // Update content when props change
  useEffect(() => {
    if (contentData) {
      setCurrentContent(contentData);
    } else if (searchResults) {
      setCurrentContent({
        type: 'facilities',
        data: searchResults.facilities,
        summary: searchResults.summary
      });
    } else {
      setCurrentContent({
        type: 'facilities',
        data: facilities,
        summary
      });
    }
  }, [contentData, searchResults, facilities, summary]);

  // Convert facilities to map markers
  useEffect(() => {
    const facilitiesToMap = searchResults?.facilities || facilities;
    const markers = facilitiesToMap
      .filter(facility => facility.latitude && facility.longitude)
      .map(facility => ({
        id: facility.id,
        position: { 
          lat: facility.latitude!, 
          lng: facility.longitude! 
        },
        title: facility.name,
        address: facility.address_line1 || facility.address || '',
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
  }, [searchResults, facilities]);

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

  if (!isVisible) return null;

  return (
    <div className="space-y-4 h-full">
      {/* Header with controls */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Results</h2>
        <div className="flex space-x-2">
          {searchResults && (
            <button
              onClick={onClearResults}
              className="text-sm text-gray-500 hover:text-gray-700"
            >
              Clear Search
            </button>
          )}
          {displayData.length > 0 && (
            <button
              onClick={onClearDisplayData}
              className="text-sm text-gray-500 hover:text-gray-700"
            >
              Clear Visuals
            </button>
          )}
          {(searchResults || displayData.length > 0) && (
            <button
              onClick={onClearAll}
              className="text-sm text-red-500 hover:text-red-700"
            >
              Clear All
            </button>
          )}
        </div>
      </div>

      {/* Loading state */}
      {isLoading && (
        <div className="flex items-center justify-center h-32">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-sky-500"></div>
        </div>
      )}

      {/* Error state */}
      {error && !isLoading && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
          <p className="text-red-700">{error}</p>
        </div>
      )}

      {/* Search Results */}
      {searchResults && !isLoading && (
        <div className="mb-6">
          <h3 className="text-lg font-medium mb-3">Search Results</h3>
          {searchResults.summary && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
              <p className="text-blue-800">{searchResults.summary}</p>
            </div>
          )}
          <div className="space-y-3">
            {searchResults.facilities.map((facility) => (
              <div key={facility.id} className="border rounded-lg p-4">
                <h4 className="font-medium">{facility.name}</h4>
                <p className="text-gray-600">{facility.address}</p>
                {facility.phone && (
                  <p className="text-sm text-gray-500">{facility.phone}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Display Data / Visualizations */}
      {displayData.length > 0 && !isLoading && (
        <div className="mb-6">
          <h3 className="text-lg font-medium mb-3">Visualizations</h3>
          <div className="space-y-4">
            {displayData.map((item, index) => (
              <div key={index} className="border rounded-lg p-4">
                <h4 className="font-medium mb-2">{item.title}</h4>
                <div className="bg-gray-50 rounded p-2">
                  <span className="text-sm text-gray-600">
                    {item.type} visualization
                  </span>
                  {/* Render actual visualization based on item.type */}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Legacy content renderer for backward compatibility */}
      {(!searchResults && displayData.length === 0 && (facilities.length > 0 || summary || contentData)) && !isLoading && (
        <div className="mb-6">
          {/* Results Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full h-full flex flex-col">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="content" className="flex items-center space-x-2">
            {currentContent.type === 'email' && <Mail className="h-4 w-4" />}
            {currentContent.type === 'document' && <NotebookText className="h-4 w-4" />}
            {currentContent.type === 'form' && <FormInput className="h-4 w-4" />}
            {currentContent.type === 'map' && <MapPin className="h-4 w-4" />}
            {(currentContent.type === 'facilities' || currentContent.type === 'markdown') && <List className="h-4 w-4" />}
            <span>
              {currentContent.type === 'document' && 'Notebook'}
              {currentContent.type === 'email' && 'Email'}
              {currentContent.type === 'form' && 'Form'}
              {currentContent.type === 'map' && 'Map'}
              {(currentContent.type === 'facilities' || currentContent.type === 'markdown') && 'Results'}
            </span>
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
      )}

      {/* Empty state */}
      {!searchResults && displayData.length === 0 && facilities.length === 0 && !isLoading && !error && !summary && !contentData && (
        <div className="flex-1 flex items-center justify-center text-gray-500">
          <div className="text-center">
            <p className="mb-2">No results yet</p>
            <p className="text-sm">Use AVA to search or create visualizations</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default ResultsContainer;