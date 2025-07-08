// Basic ElevenLabs Client Tools
// Core tools for search, display, and map functionality

export const showFacilitiesOnMap = (parameters: { tags: string; location: string }) => {
  console.log('🔧 show_facilities_on_map tool called with:', parameters);
  window.dispatchEvent(new CustomEvent('show-facilities-on-map', { 
    detail: parameters 
  }));
  return `Showing facilities on map for ${parameters.location} with tags: ${parameters.tags}`;
};

export const showSearchResultsPanel = (parameters: { results: string; summary?: string }) => {
  console.log('🔧 showSearchResultsPanel tool called with:', parameters);
  try {
    const parsedResults = JSON.parse(parameters.results);
    window.dispatchEvent(new CustomEvent('show-search-results', { 
      detail: { 
        facilities: parsedResults,
        summary: parameters.summary || '',
        timestamp: new Date().toISOString()
      } 
    }));
    return `Search results panel displayed with ${parsedResults.length} facilities`;
  } catch (error) {
    console.error('Failed to parse search results:', error);
    return "Failed to display search results panel";
  }
};

export const showToastMessage = (parameters: { message: string }) => {
  console.log('🔧 showToastMessage tool called with:', parameters);
  window.dispatchEvent(new CustomEvent('show-toast', { 
    detail: parameters 
  }));
  return `Toast message shown: ${parameters.message}`;
};

export const searchFacilities = async (parameters: { 
  location?: string; 
  facilityType?: string; 
  priceMin?: number; 
  priceMax?: number; 
  acceptsMedicare?: boolean;
  acceptsMedicaid?: boolean;
  acceptsVA?: boolean;
  radius?: number;
}) => {
  console.log('🔧 searchFacilities tool called with:', parameters);
  
  try {
    const response = await fetch('https://fktcmikrsgutyicluegr.supabase.co/functions/v1/search-facilities', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZrdGNtaWtyc2d1dHlpY2x1ZWdyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDUxNjY3MjEsImV4cCI6MjA2MDc0MjcyMX0.JW9mbH8H38aAi2JOycemGsd-Tv_RtgViREaOcctJpR4',
      },
      body: JSON.stringify({ searchParams: parameters })
    });
    
    if (!response.ok) {
      throw new Error(`Search failed: ${response.status}`);
    }
    
    const data = await response.json();
    
    // Navigate to find-care page and dispatch results
    if (window.location.pathname !== '/find-care') {
      window.location.href = '/find-care';
    }
    
    window.dispatchEvent(new CustomEvent('show-search-results', { 
      detail: { 
        facilities: data.facilities || [],
        summary: `Found ${data.total || 0} facilities matching your criteria`,
        timestamp: new Date().toISOString()
      } 
    }));
    
    return `Successfully found ${data.total || 0} facilities matching your criteria`;
  } catch (error) {
    console.error('Error searching facilities:', error);
    return `Failed to search facilities: ${error.message}`;
  }
};

export const displayMap = (parameters: { 
  markers?: any[]; 
  center?: { lat: number; lng: number }; 
  zoom?: number; 
}) => {
  console.log('🔧 displayMap tool called with:', parameters);
  window.dispatchEvent(new CustomEvent('display-content', { 
    detail: { 
      contentType: 'map',
      data: parameters,
      summary: `Interactive map with ${parameters.markers?.length || 0} markers`
    } 
  }));
  return `Interactive map displayed`;
};
