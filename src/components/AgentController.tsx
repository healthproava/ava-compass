'use client';

import React, { useState, useCallback } from 'react';
import { useElevenLabsConversation } from '../hooks/useElevenLabsConversation';
import { Command } from '../types/elevenlabs'; // We will create this type definition
import { AssessmentForm } from './AssessmentForm';
import { ResultsPanel } from './ResultsPanel';
import { MapView } from './MapView';
import { AgentControls } from './AgentControls';

// Define structures for our data
interface Facility {
  id: string;
  name: string;
  address: string;
  rating?: number;
  website?: string;
  [key: string]: any;
}

interface MapData {
  center: { lat: number; lng: number };
  facilities: Facility[];
}

// Your specific Agent ID for "Ava"
const AGENT_ID = 'agent_01jzgsmq2vet0ady1zbqs5ydad';

export const AgentController: React.FC = () => {
  // State for managing the UI view
  const [activeView, setActiveView] = useState<'idle' | 'form' | 'results' | 'map'>('idle');
  
  // State for storing data from the agent
  const [searchResults, setSearchResults] = useState<Facility[]>([]);
  const [mapData, setMapData] = useState<MapData | null>(null);
  
  const handleCommand = useCallback((command: Command) => {
    console.log('Received command from agent:', command.name, command.data);
    
    // Listen for commands from Ava and update the UI state accordingly
    switch (command.name) {
      case 'display_facility_cards':
      case 'showSearchResultsPanel':
        setSearchResults(command.data.facilities || []);
        setActiveView('results');
        break;
      
      case 'populate_map':
        setMapData(command.data);
        setActiveView('map');
        break;

      case 'navigate':
        // Example: a command to show the assessment form
        if (command.data.url === '/assessment-form') {
          setActiveView('form');
        }
        break;
        
      default:
        console.warn('Unhandled command:', command.name);
    }
  }, []);

  const {
    isConnected,
    isListening,
    isSpeaking,
    error,
    transcript,
    response,
    startConversation,
    endConversation,
  } = useElevenLabsConversation(AGENT_ID, handleCommand as (command: any) => void);

  const renderActiveView = () => {
    switch (activeView) {
      case 'form':
        return <AssessmentForm onSubmit={(data) => console.log('Form submitted:', data)} />;
      case 'results':
        return <ResultsPanel facilities={searchResults} />;
      case 'map':
        return <MapView data={mapData} />;
      case 'idle':
      default:
        return (
          <div className="text-center p-8 bg-gray-50 rounded-lg">
            <p className="text-gray-600">Click "Start Conversation" to talk to Ava.</p>
          </div>
        );
    }
  };

  return (
    <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-2xl overflow-hidden">
      <div className="p-6">
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-4">Care Compass</h1>
        <AgentControls
          isConnected={isConnected}
          isListening={isListening}
          isSpeaking={isSpeaking}
          startConversation={startConversation}
          endConversation={endConversation}
        />
        {error && <div className="mt-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg"><strong>Error:</strong> {error}</div>}
        <div className="mt-4 p-4 border rounded-lg bg-gray-50 space-y-2">
            <div><strong className="text-blue-600">You Said:</strong> {transcript || "..."}</div>
            <div><strong className="text-purple-600">Ava Said:</strong> {response || "..."}</div>
        </div>
      </div>
      
      {/* This section will dynamically render the correct UI component */}
      <div className="p-6 border-t border-gray-200">
        {renderActiveView()}
      </div>
    </div>
  );
};
