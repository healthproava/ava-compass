import React, { useRef, useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { MapPin, Download, Search } from 'lucide-react';
import { GoogleMapView } from '../MapView';

interface MapMarker {
  id: string;
  lat: number;
  lng: number;
  title: string;
  description?: string;
}

interface InteractiveMapProps {
  markers?: MapMarker[];
  center?: { lat: number; lng: number };
  zoom?: number;
  onDownload?: () => void;
}

const InteractiveMap = ({ markers = [], center = { lat: 39.8283, lng: -98.5795 }, zoom = 4, onDownload }: InteractiveMapProps) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMarker, setSelectedMarker] = useState<MapMarker | null>(null);

  // Simple map visualization using CSS and positioning
  // In a real implementation, you'd use Google Maps, Mapbox, or similar
  const handleSearch = () => {
    console.log('Searching for:', searchQuery);
    // In a real implementation, this would geocode the address and add markers
  };

  const addMarker = (lat: number, lng: number, title: string) => {
    const newMarker: MapMarker = {
      id: `marker_${Date.now()}`,
      lat,
      lng,
      title,
      description: `Location at ${lat.toFixed(4)}, ${lng.toFixed(4)}`
    };
    console.log('Adding marker:', newMarker);
  };

  return (
    <Card className="p-6 h-full">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-2">
          <MapPin className="h-5 w-5" />
          <h2 className="text-xl font-semibold">Interactive Map</h2>
        </div>
        <Button variant="outline" size="sm" onClick={onDownload}>
          <Download className="h-4 w-4 mr-1" />
          PDF
        </Button>
      </div>

      <div className="space-y-4">
        {/* Map Controls */}
        <div className="flex space-x-2">
          <div className="flex-1">
            <Label htmlFor="search">Search Location</Label>
            <div className="flex space-x-2">
              <Input
                id="search"
                placeholder="Enter address or location"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <Button onClick={handleSearch}>
                <Search className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Map Container */}
        <div className="relative">
          <div className="w-full h-96 rounded-lg overflow-hidden">
            <GoogleMapView 
              markers={markers.map(marker => ({
                id: marker.id,
                position: { lat: marker.lat, lng: marker.lng },
                title: marker.title
              }))}
              center={center}
            />
          </div>

          {/* Marker Info Panel */}
          {selectedMarker && (
            <Card className="absolute top-2 right-2 p-3 bg-white shadow-lg max-w-xs">
              <h4 className="font-semibold">{selectedMarker.title}</h4>
              <p className="text-sm text-gray-600">{selectedMarker.description}</p>
              <Button 
                variant="ghost" 
                size="sm" 
                className="mt-2"
                onClick={() => setSelectedMarker(null)}
              >
                Close
              </Button>
            </Card>
          )}
        </div>

        {/* Map Legend */}
        <div className="flex items-center space-x-4 text-sm text-gray-600">
          <div className="flex items-center space-x-1">
            <div className="w-3 h-3 bg-red-500 rounded-full"></div>
            <span>Markers ({markers.length})</span>
          </div>
          <div className="flex items-center space-x-1">
            <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
            <span>Search Results</span>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default InteractiveMap;