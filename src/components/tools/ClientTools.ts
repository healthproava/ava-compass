// ElevenLabs Client Tools
// These handle tool calls from the ElevenLabs agent

export const showFacilitiesOnMap = (parameters: { tags: string; location: string }) => {
  console.log('🔧 show_facilities_on_map tool called with:', parameters);
  window.dispatchEvent(new CustomEvent('show-facilities-on-map', { 
    detail: parameters 
  }));
  return `Showing facilities on map for ${parameters.location} with tags: ${parameters.tags}`;
};

export const processAndStructureResults = (parameters: { SearchResults: any }) => {
  console.log('🔧 Process_and_Structure_Results tool called with:', parameters);
  window.dispatchEvent(new CustomEvent('show-search-results', { 
    detail: { 
      facilities: parameters.SearchResults?.facility_data || [],
      timestamp: new Date().toISOString()
    } 
  }));
  return `Processed and structured ${parameters.SearchResults?.facility_data?.length || 0} facilities`;
};

export const showResultsPanel = (parameters: { results: string }) => {
  console.log('🔧 showResultsPanel tool called with:', parameters);
  try {
    const parsedResults = JSON.parse(parameters.results);
    window.dispatchEvent(new CustomEvent('show-search-results', { 
      detail: { 
        facilities: parsedResults,
        timestamp: new Date().toISOString()
      } 
    }));
    return `Results panel displayed with ${parsedResults.length} facilities`;
  } catch (error) {
    console.error('Failed to parse results:', error);
    return "Failed to display results panel";
  }
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

export const alertMissingInfo = (parameters: { message: string; missing_fields: string }) => {
  console.log('🔧 alertMissingInfo tool called with:', parameters);
  window.dispatchEvent(new CustomEvent('alert-missing-info', { 
    detail: parameters 
  }));
  return `Alert displayed for missing fields: ${parameters.missing_fields}`;
};

export const openAmenitiesPicker = (parameters: { currentSelection: string }) => {
  console.log('🔧 openAmenitiesPicker tool called with:', parameters);
  window.dispatchEvent(new CustomEvent('open-amenities-picker', { 
    detail: parameters 
  }));
  return "Amenities picker opened";
};

export const openTourModel = (parameters: { facilityId: string; facilityName: string }) => {
  console.log('🔧 openTourModel tool called with:', parameters);
  window.dispatchEvent(new CustomEvent('open-tour-modal', { 
    detail: parameters 
  }));
  return `Tour modal opened for ${parameters.facilityName}`;
};

export const showToastMessage = (parameters: { message: string }) => {
  console.log('🔧 showToastMessage tool called with:', parameters);
  window.dispatchEvent(new CustomEvent('show-toast', { 
    detail: parameters 
  }));
  return `Toast message shown: ${parameters.message}`;
};

export const highlightFacilityCard = (parameters: { 'facilityId ': string }) => {
  console.log('🔧 highlightFacilityCard tool called with:', parameters);
  window.dispatchEvent(new CustomEvent('highlight-facility', { 
    detail: { facilityId: parameters['facilityId '] } 
  }));
  return `Highlighted facility: ${parameters['facilityId ']}`;
};

export const logMessage = (parameters: { message: string }) => {
  console.log('🔧 logMessage tool called with:', parameters);
  console.log('📝 Agent Log:', parameters.message);
  return `Message logged: ${parameters.message}`;
};

export const navigateToPage = (parameters: { page_name: string }, navigate: (path: string) => void) => {
  console.log('🔧 Navigate-to-page tool called with:', parameters);
  const cleanPage = parameters.page_name.startsWith('/') ? parameters.page_name : `/${parameters.page_name}`;
  navigate(cleanPage);
  return `Navigated to page: ${cleanPage}`;
};

// Helper function to auto-navigate to find care page
const autoNavigateToFindCare = () => {
  if (window.location.pathname !== '/find-care') {
    window.location.href = '/find-care';
  }
};

export const userIntentFlow = (parameters: { patientInformation: any; userInput: any[] }) => {
  console.log('🔧 userIntentFlow tool called with:', parameters);
  window.dispatchEvent(new CustomEvent('user-intent-flow', { 
    detail: parameters 
  }));
  return "User intent flow initiated";
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
    
    // Auto-navigate to find care page and dispatch results
    autoNavigateToFindCare();
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

export const displayEmail = (parameters: { 
  to?: string; 
  subject?: string; 
  body?: string; 
}) => {
  console.log('🔧 displayEmail tool called with:', parameters);
  autoNavigateToFindCare();
  window.dispatchEvent(new CustomEvent('display-content', { 
    detail: { 
      contentType: 'email',
      data: parameters,
      summary: `Email draft for ${parameters.to || 'recipient'}`
    } 
  }));
  return `Email draft displayed`;
};

export const displayDocument = (parameters: { 
  title?: string; 
  type?: string; 
  content?: string; 
}) => {
  console.log('🔧 displayDocument tool called with:', parameters);
  autoNavigateToFindCare();
  window.dispatchEvent(new CustomEvent('display-content', { 
    detail: { 
      contentType: 'document',
      data: parameters,
      summary: `Document: ${parameters.title || 'Untitled'}`
    } 
  }));
  return `Document displayed`;
};

export const displayForm = (parameters: { 
  title?: string; 
  fields?: any[]; 
}) => {
  console.log('🔧 displayForm tool called with:', parameters);
  autoNavigateToFindCare();
  window.dispatchEvent(new CustomEvent('display-content', { 
    detail: { 
      contentType: 'form',
      data: parameters,
      summary: `Form: ${parameters.title || 'Untitled Form'}`
    } 
  }));
  return `Form builder displayed`;
};

export const displayMap = (parameters: { 
  markers?: any[]; 
  center?: { lat: number; lng: number }; 
  zoom?: number; 
}) => {
  console.log('🔧 displayMap tool called with:', parameters);
  autoNavigateToFindCare();
  window.dispatchEvent(new CustomEvent('display-content', { 
    detail: { 
      contentType: 'map',
      data: parameters,
      summary: `Interactive map with ${parameters.markers?.length || 0} markers`
    } 
  }));
  return `Interactive map displayed`;
};

export const displayMarkdown = (parameters: { 
  content: string; 
  title?: string; 
}) => {
  console.log('🔧 displayMarkdown tool called with:', parameters);
  autoNavigateToFindCare();
  window.dispatchEvent(new CustomEvent('display-content', { 
    detail: { 
      contentType: 'markdown',
      data: parameters.content,
      summary: parameters.title || 'Content Display'
    } 
  }));
  return `Markdown content displayed`;
};

// Import assessment tools
import * as AssessmentTools from './AssessmentTools';

// Export all assessment tools
export const {
  collectBasicInformation,
  assessHealthNeeds,
  gatherPreferences,
  requestDocuments,
  completeAssessment,
  displayAssessmentProgress,
  saveAssessmentData,
  generateRecommendations
} = AssessmentTools;