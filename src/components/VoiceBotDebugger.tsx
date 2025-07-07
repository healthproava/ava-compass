import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

const VoiceBotDebugger = () => {
  const [events, setEvents] = useState<string[]>([]);
  const [searchResults, setSearchResults] = useState<any[]>([]);

  useEffect(() => {
    const handleSearchResults = (event: any) => {
      console.log('🎯 Search results event received:', event.detail);
      setEvents(prev => [...prev, `Search Results: ${event.detail.facilities.length} facilities`]);
      setSearchResults(event.detail.facilities);
    };

    const handleDisplayCards = (event: any) => {
      console.log('🎯 Display cards event received:', event.detail);
      setEvents(prev => [...prev, `Display Cards: ${event.detail.cards.length} cards`]);
    };

    const handleTooltip = (event: any) => {
      console.log('🎯 Tooltip event received:', event.detail);
      setEvents(prev => [...prev, `Tooltip: ${event.detail.tooltip.content}`]);
    };

    window.addEventListener('show-search-results', handleSearchResults);
    window.addEventListener('display-cards', handleDisplayCards);
    window.addEventListener('show-tooltip', handleTooltip);

    return () => {
      window.removeEventListener('show-search-results', handleSearchResults);
      window.removeEventListener('display-cards', handleDisplayCards);
      window.removeEventListener('show-tooltip', handleTooltip);
    };
  }, []);

  const testClientTools = () => {
    console.log('🧪 Testing client tools manually...');
    
    // Test search results event
    window.dispatchEvent(new CustomEvent('show-search-results', {
      detail: {
        facilities: [
          { id: 'test-1', name: 'Test Facility 1', care_type: 'Assisted Living', location: 'Phoenix, AZ' },
          { id: 'test-2', name: 'Test Facility 2', care_type: 'Memory Care', location: 'Phoenix, AZ' }
        ],
        timestamp: new Date().toISOString()
      }
    }));

    // Test tooltip event
    window.dispatchEvent(new CustomEvent('show-tooltip', {
      detail: {
        tooltip: { content: 'This is a test tooltip', position: 'top' }
      }
    }));
  };

  const clearEvents = () => {
    setEvents([]);
    setSearchResults([]);
  };

  return (
    <Card className="fixed top-4 right-4 z-50 w-80 max-h-96 overflow-y-auto">
      <div className="p-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-semibold">Voice Bot Debug</h3>
          <div className="space-x-2">
            <Button size="sm" variant="outline" onClick={testClientTools}>
              Test
            </Button>
            <Button size="sm" variant="outline" onClick={clearEvents}>
              Clear
            </Button>
          </div>
        </div>
        
        <div className="space-y-2">
          <div className="text-xs text-gray-600">Events:</div>
          {events.length === 0 ? (
            <div className="text-xs text-gray-400">No events yet...</div>
          ) : (
            events.map((event, index) => (
              <div key={index} className="text-xs bg-green-50 p-2 rounded">
                {event}
              </div>
            ))
          )}
        </div>

        {searchResults.length > 0 && (
          <div className="mt-4">
            <div className="text-xs text-gray-600 mb-2">Search Results:</div>
            {searchResults.map((facility, index) => (
              <div key={index} className="text-xs bg-blue-50 p-2 rounded mb-1">
                <div className="font-medium">{facility.name}</div>
                <div className="text-gray-600">{facility.care_type} - {facility.location}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </Card>
  );
};

export default VoiceBotDebugger;