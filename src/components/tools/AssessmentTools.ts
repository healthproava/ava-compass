// Assessment Client Tools for ElevenLabs Agent
// These handle comprehensive care assessment through conversation

export const collectBasicInformation = (parameters: { 
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  address?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  dateOfBirth?: string;
  gender?: string;
}) => {
  console.log('🔧 collectBasicInformation tool called with:', parameters);
  window.dispatchEvent(new CustomEvent('assessment-basic-info', { 
    detail: parameters 
  }));
  return `Basic information collected for ${parameters.firstName} ${parameters.lastName}`;
};

export const assessHealthNeeds = (parameters: {
  healthConditions?: string;
  medications?: string;
  mobilityStatus?: string;
  adlNeeds?: string[];
  medicalEquipment?: string;
  currentProvider?: string;
}) => {
  console.log('🔧 assessHealthNeeds tool called with:', parameters);
  window.dispatchEvent(new CustomEvent('assessment-health-needs', { 
    detail: parameters 
  }));
  return `Health and care needs assessed: ${parameters.adlNeeds?.length || 0} ADL needs identified`;
};

export const gatherPreferences = (parameters: {
  careType?: string;
  preferredLocation?: string;
  locationRadius?: string;
  roomPreference?: string;
  monthlyBudget?: string;
  paymentMethod?: string[];
  amenities?: string[];
}) => {
  console.log('🔧 gatherPreferences tool called with:', parameters);
  window.dispatchEvent(new CustomEvent('assessment-preferences', { 
    detail: parameters 
  }));
  return `Preferences gathered: ${parameters.careType} care in ${parameters.preferredLocation}`;
};

export const requestDocuments = (parameters: {
  documentsNeeded?: string[];
  uploadInstructions?: string;
}) => {
  console.log('🔧 requestDocuments tool called with:', parameters);
  window.dispatchEvent(new CustomEvent('assessment-documents', { 
    detail: parameters 
  }));
  return `Document requirements explained: ${parameters.documentsNeeded?.length || 0} documents needed`;
};

export const completeAssessment = (parameters: {
  assessmentSummary?: string;
  completionStatus?: string;
}) => {
  console.log('🔧 completeAssessment tool called with:', parameters);
  window.dispatchEvent(new CustomEvent('assessment-complete', { 
    detail: parameters 
  }));
  return `Assessment completed successfully`;
};

export const displayAssessmentProgress = (parameters: {
  currentStep?: number;
  totalSteps?: number;
  completedSections?: string[];
}) => {
  console.log('🔧 displayAssessmentProgress tool called with:', parameters);
  window.dispatchEvent(new CustomEvent('assessment-progress', { 
    detail: parameters 
  }));
  return `Assessment progress: ${parameters.currentStep}/${parameters.totalSteps} steps completed`;
};

export const saveAssessmentData = (parameters: {
  assessmentData?: any;
  userId?: string;
}) => {
  console.log('🔧 saveAssessmentData tool called with:', parameters);
  window.dispatchEvent(new CustomEvent('save-assessment', { 
    detail: parameters 
  }));
  return `Assessment data saved successfully`;
};

export const generateRecommendations = (parameters: {
  assessmentData?: any;
  recommendationCount?: number;
}) => {
  console.log('🔧 generateRecommendations tool called with:', parameters);
  window.dispatchEvent(new CustomEvent('generate-recommendations', { 
    detail: parameters 
  }));
  return `Generated ${parameters.recommendationCount || 0} personalized facility recommendations`;
};