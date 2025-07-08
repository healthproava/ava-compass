// Voice Guide Tools for ElevenLabs Agent
// These tools guide users through processes rather than doing them automatically

export const provideGuidance = (parameters: { 
  instruction: string;
  step?: string;
  nextAction?: string;
}) => {
  console.log('🔧 provideGuidance tool called with:', parameters);
  
  // Trigger TTS for the guidance
  window.dispatchEvent(new CustomEvent('ava-speak', { 
    detail: { 
      text: parameters.instruction,
      step: parameters.step,
      nextAction: parameters.nextAction
    } 
  }));
  
  return `Providing guidance: ${parameters.instruction}`;
};

export const highlightFormField = (parameters: { 
  fieldName: string;
  instruction: string;
}) => {
  console.log('🔧 highlightFormField tool called with:', parameters);
  
  // Highlight the specific field and provide voice guidance
  window.dispatchEvent(new CustomEvent('highlight-field', { 
    detail: { 
      fieldName: parameters.fieldName,
      instruction: parameters.instruction
    } 
  }));
  
  // Also trigger TTS
  window.dispatchEvent(new CustomEvent('ava-speak', { 
    detail: { 
      text: parameters.instruction
    } 
  }));
  
  return `Highlighting field ${parameters.fieldName} with guidance`;
};

export const encourageUser = (parameters: { 
  message: string;
  context?: string;
}) => {
  console.log('🔧 encourageUser tool called with:', parameters);
  
  window.dispatchEvent(new CustomEvent('ava-speak', { 
    detail: { 
      text: parameters.message,
      context: parameters.context
    } 
  }));
  
  return `Encouraging user: ${parameters.message}`;
};

export const explainNextSteps = (parameters: { 
  currentStep: string;
  nextSteps: string[];
  explanation: string;
}) => {
  console.log('🔧 explainNextSteps tool called with:', parameters);
  
  window.dispatchEvent(new CustomEvent('ava-speak', { 
    detail: { 
      text: parameters.explanation,
      currentStep: parameters.currentStep,
      nextSteps: parameters.nextSteps
    } 
  }));
  
  return `Explained next steps: ${parameters.currentStep}`;
};