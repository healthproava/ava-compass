import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { MapPin, Phone, ExternalLink, Star } from 'lucide-react';

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

interface ResultsMarkdownDisplayProps {
  facilities: Facility[];
  summary?: string;
  onFacilitySelect?: (facility: Facility) => void;
}

const ResultsMarkdownDisplay = ({ 
  facilities, 
  summary, 
  onFacilitySelect 
}: ResultsMarkdownDisplayProps) => {
  const openMapLink = (facility: Facility) => {
    const query = encodeURIComponent(`${facility.name} ${facility.address_line1 || ''}`);
    window.open(`https://www.google.com/maps/search/${query}`, '_blank');
  };

  const callFacility = (phone: string) => {
    window.open(`tel:${phone}`);
  };

  const visitWebsite = (website: string) => {
    if (website) {
      window.open(website.startsWith('http') ? website : `https://${website}`, '_blank');
    }
  };

  return (
    <div className="space-y-6">
      {/* Summary Section */}
      {summary && (
        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <div className="w-2 h-2 bg-primary rounded-full animate-pulse"></div>
              Search Summary
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="prose prose-sm max-w-none">
              <div className="whitespace-pre-wrap text-text-secondary">
                {summary}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Facilities Grid */}
      {facilities.length > 0 && (
        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="text-xl">
              Found {facilities.length} Senior Care Facilities
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {facilities.map((facility) => (
                <Card 
                  key={facility.id} 
                  className="border hover:shadow-lg transition-all duration-300 cursor-pointer group"
                  onClick={() => onFacilitySelect?.(facility)}
                >
                  <CardContent className="p-4">
                    {/* Header */}
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex-1">
                        <h3 className="font-semibold text-text-primary mb-1 group-hover:text-primary-bright transition-colors">
                          {facility.name}
                        </h3>
                        <Badge variant="secondary" className="text-xs">
                          {facility.facility_type || 'Senior Care'}
                        </Badge>
                      </div>
                      {facility.rating && facility.rating > 0 && (
                        <div className="flex items-center space-x-1">
                          <Star className="h-4 w-4 fill-warning text-warning" />
                          <span className="text-sm font-medium">{facility.rating}</span>
                          {facility.reviews_count && facility.reviews_count > 0 && (
                            <span className="text-xs text-text-secondary">
                              ({facility.reviews_count})
                            </span>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Address */}
                    <div className="space-y-2 mb-4">
                      <div className="flex items-start space-x-2">
                        <MapPin className="h-4 w-4 text-text-secondary mt-0.5 flex-shrink-0" />
                        <span className="text-sm text-text-secondary">{facility.address_line1}</span>
                      </div>
                      
                      {facility.phone && (
                        <div className="flex items-center space-x-2">
                          <Phone className="h-4 w-4 text-text-secondary" />
                          <span className="text-sm text-text-secondary">{facility.phone}</span>
                        </div>
                      )}
                    </div>

                    {/* Thumbnail */}
                    {facility.image_urls && facility.image_urls.length > 0 && (
                      <div className="mb-4">
                        <img 
                          src={facility.image_urls[0]} 
                          alt={facility.name}
                          className="w-full h-32 object-cover rounded-md"
                          onError={(e) => {
                            e.currentTarget.style.display = 'none';
                          }}
                        />
                      </div>
                    )}

                    {/* Action Buttons */}
                    <div className="flex space-x-2">
                      {facility.phone && (
                        <Button
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            callFacility(facility.phone!);
                          }}
                          className="flex-1"
                        >
                          <Phone className="mr-1 h-3 w-3" />
                          Call
                        </Button>
                      )}
                      
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={(e) => {
                          e.stopPropagation();
                          openMapLink(facility);
                        }}
                        className="flex-1"
                      >
                        <MapPin className="mr-1 h-3 w-3" />
                        Map
                      </Button>

                      {facility.website && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={(e) => {
                            e.stopPropagation();
                            visitWebsite(facility.website!);
                          }}
                        >
                          <ExternalLink className="h-3 w-3" />
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Empty State */}
      {facilities.length === 0 && !summary && (
        <Card className="glass-card">
          <CardContent className="p-8 text-center">
            <div className="text-text-secondary">
              <MapPin className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p className="text-lg font-medium mb-2">No results yet</p>
              <p className="text-sm">Search results will appear here when available</p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ResultsMarkdownDisplay;