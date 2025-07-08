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

export const userIntentFlow = (parameters: { patientInformation: any; userInput: any[] }) => {
  console.log('🔧 userIntentFlow tool called with:', parameters);
  window.dispatchEvent(new CustomEvent('user-intent-flow', { 
    detail: parameters 
  }));
  return "User intent flow initiated";
};