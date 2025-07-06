import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { MapPin, Phone, ExternalLink, Star } from 'lucide-react';

interface Facility {
  id: string;
  title: string;
  address: string;
  rating?: number;
  rating_count?: number;
  phone_number?: string;
  website?: string;
  place_type?: string;
  thumbnail_url?: string;
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
    const query = encodeURIComponent(`${facility.title} ${facility.address}`);
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
                          {facility.title}
                        </h3>
                        <Badge variant="secondary" className="text-xs">
                          {facility.place_type || 'Senior Care'}
                        </Badge>
                      </div>
                      {facility.rating && facility.rating > 0 && (
                        <div className="flex items-center space-x-1">
                          <Star className="h-4 w-4 fill-warning text-warning" />
                          <span className="text-sm font-medium">{facility.rating}</span>
                          {facility.rating_count && facility.rating_count > 0 && (
                            <span className="text-xs text-text-secondary">
                              ({facility.rating_count})
                            </span>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Address */}
                    <div className="space-y-2 mb-4">
                      <div className="flex items-start space-x-2">
                        <MapPin className="h-4 w-4 text-text-secondary mt-0.5 flex-shrink-0" />
                        <span className="text-sm text-text-secondary">{facility.address}</span>
                      </div>
                      
                      {facility.phone_number && (
                        <div className="flex items-center space-x-2">
                          <Phone className="h-4 w-4 text-text-secondary" />
                          <span className="text-sm text-text-secondary">{facility.phone_number}</span>
                        </div>
                      )}
                    </div>

                    {/* Thumbnail */}
                    {facility.thumbnail_url && (
                      <div className="mb-4">
                        <img 
                          src={facility.thumbnail_url} 
                          alt={facility.title}
                          className="w-full h-32 object-cover rounded-md"
                          onError={(e) => {
                            e.currentTarget.style.display = 'none';
                          }}
                        />
                      </div>
                    )}

                    {/* Action Buttons */}
                    <div className="flex space-x-2">
                      {facility.phone_number && (
                        <Button
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            callFacility(facility.phone_number!);
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