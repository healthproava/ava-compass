import React, { useState, useCallback } from 'react';
import { useElevenLabsConversation } from '../hooks/useElevenLabsConversation';
import { Command } from '../types/elevenlabs';
import ThreeMapView, { MapMarker } from './ThreeMapView';
import { AgentControls } from './AgentControls';

// Your specific Agent ID for "Ava"
const AGENT_ID = 'agent_01jzgsmq2vet0ady1zbqs5ydad';

export const AgentController: React.FC = () => {
  const [activeView, setActiveView] = useState<'idle' | 'map'>('idle');
  const [mapMarkers, setMapMarkers] = useState<MapMarker[]>([]);
  const [mapCenter, setMapCenter] = useState<{ lat: number; lng: number }>();
  const [isFullScreen, setIsFullScreen] = useState(false);

  const handleCommand = useCallback((command: Command) => {
    console.log('Received command:', command.name, command.data);
    
    if (command.name === 'populate_map' && command.data.facilities) {
      // Transform agent data into the format the map component expects
      const newMarkers = command.data.facilities.map((facility: any) => ({
        id: facility.id,
        position: { lat: facility.latitude, lng: facility.longitude },
        title: facility.name,
        address: facility.address,
        rating: facility.rating,
      }));
      setMapMarkers(newMarkers);
      setMapCenter(command.data.center);
      setActiveView('map');
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
  } = useElevenLabsConversation(AGENT_ID);

  const renderActiveView = () => {
    if (activeView === 'map') {
      return (
        <ThreeMapView 
          markers={mapMarkers}
          center={mapCenter}
          isFullScreen={isFullScreen}
          onToggleFullScreen={() => setIsFullScreen(!isFullScreen)}
          onMarkerClick={(marker) => console.log('Marker clicked:', marker)}
        />
      );
    }
    return (
      <div className="text-center p-8 bg-gray-50 rounded-lg">
        <p className="text-gray-600">Click "Start Conversation" to begin your facility search.</p>
      </div>
    );
  };

  return (
    <div className={`transition-all duration-300 ${isFullScreen ? 'fixed inset-0 bg-black/80 z-40 p-4' : 'relative max-w-4xl mx-auto'}`}>
        <div className="bg-white rounded-xl shadow-2xl overflow-hidden">
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
            <div className="p-6 border-t border-gray-200 bg-gray-50">
                {renderActiveView()}
            </div>
        </div>
    </div>
  );
};
