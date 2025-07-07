import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useConversation } from '@elevenlabs/react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { MessageCircle, Mic, MicOff, Minimize2, Volume2, VolumeX } from 'lucide-react';

interface AvaWidgetProps {
  isFullScreen?: boolean;
  onFullScreenToggle?: () => void;
  context?: string;
}

const AvaWidget = ({ isFullScreen = false, onFullScreenToggle, context = "general" }: AvaWidgetProps) => {
  const [isMinimized, setIsMinimized] = useState(false);
  const [volume, setVolume] = useState(0.8);
  const [isMuted, setIsMuted] = useState(false);
  const navigate = useNavigate();
  
  const conversation = useConversation({
    onConnect: () => {
      console.log('Connected to ElevenLabs');
    },
    onDisconnect: () => {
      console.log('Disconnected from ElevenLabs');
    },
    onMessage: (message) => {
      console.log('Message received:', message);
    },
    onError: (error) => {
      console.error('ElevenLabs error:', error);
    },
    clientTools: {
      startAssessment: () => {
        console.log('startAssessment tool called');
        navigate('/find-care');
        setIsMinimized(true);
        return "Assessment started";
      },
      navigate: (parameters: { url: string }) => {
        const cleanUrl = parameters.url.startsWith('/') ? parameters.url : `/${parameters.url}`;
        navigate(cleanUrl);
        return `Navigated to ${cleanUrl}`;
      },
      navigateToPage: (parameters: { page: string }) => {
        navigate(`/${parameters.page}`);
        return `Navigated to ${parameters.page}`;
      },
      showSearchResultsPanel: (parameters: { facility_data: string[] }) => {
        // Parse the facility data and format for display
        const facilities = parameters.facility_data.map((facilityString: string, index: number) => {
          // Parse the facility string (assuming format: "{name}, {care_type}, {location}")
          const parts = facilityString.split(', ');
          return {
            id: `facility-${index}`,
            name: parts[0] || 'Unknown Facility',
            care_type: parts[1] || 'Care Services',
            location: parts[2] || 'Location TBD',
            rawData: facilityString
          };
        });

        // Dispatch event to show results panel
        window.dispatchEvent(new CustomEvent('show-search-results', { 
          detail: { 
            facilities: facilities,
            timestamp: new Date().toISOString()
          } 
        }));
        
        return `Search results panel displayed with ${facilities.length} facilities`;
      },
      displayFacilities: (parameters: { facilities: any[] }) => {
        // This could trigger a custom event to display facilities
        window.dispatchEvent(new CustomEvent('display-cards', { 
          detail: { cards: parameters.facilities } 
        }));
        return `Displayed ${parameters.facilities.length} facilities`;
      },
      showTooltip: (parameters: { content: string; position?: string }) => {
        window.dispatchEvent(new CustomEvent('show-tooltip', { 
          detail: { tooltip: parameters } 
        }));
        return "Tooltip displayed";
      }
    }
  });

  const handleStartConversation = async () => {
    try {
      // Request microphone permissions first
      await navigator.mediaDevices.getUserMedia({ audio: true });
      
      // Start the conversation with your ElevenLabs agent
      await conversation.startSession({ 
        agentId: 'agent_01jzgsmq2vet0ady1zbqs5ydad'
      });
    } catch (error) {
      console.error('Failed to start conversation:', error);
      alert('Failed to start conversation. Please check microphone permissions.');
    }
  };

  const handleEndConversation = async () => {
    try {
      await conversation.endSession();
    } catch (error) {
      console.error('Failed to end conversation:', error);
    }
  };

  const handleVolumeChange = async (newVolume: number) => {
    setVolume(newVolume);
    try {
      await conversation.setVolume({ volume: newVolume });
    } catch (error) {
      console.error('Failed to set volume:', error);
    }
  };

  const toggleMute = () => {
    const newMuted = !isMuted;
    setIsMuted(newMuted);
    handleVolumeChange(newMuted ? 0 : volume);
  };

  if (isMinimized) {
    return (
      <Button
        className="fixed bottom-6 right-6 z-40 w-14 h-14 rounded-full bg-sky-500 hover:bg-sky-600 shadow-lg"
        onClick={() => setIsMinimized(false)}
      >
        <MessageCircle className="h-6 w-6 text-white" />
      </Button>
    );
  }

  return (
    <Card className="fixed bottom-6 right-6 z-40 w-80 shadow-lg animate-fade-in">
      <div className="p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-full overflow-hidden">
              <img 
                src="/lovable-uploads/7518e2b4-1e66-4ed5-b127-9469488ec7d7.png" 
                alt="AVA Assistant" 
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-gray-800">AVA Assistant</h4>
              <p className="text-xs text-gray-500">
                {conversation.status === 'connected' ? 'Connected' : 'Ready to chat'}
              </p>
            </div>
          </div>
          <Button variant="ghost" size="sm" onClick={() => setIsMinimized(true)}>
            <Minimize2 className="h-3 w-3" />
          </Button>
        </div>

        <div className="space-y-3">
          <div className="p-3 bg-gray-50 rounded-lg">
            <p className="text-xs text-gray-700">
              Hi! I'm AVA, your AI assistant. I can help you find senior care facilities, 
              answer questions, and guide you through the process.
            </p>
            {conversation.isSpeaking && (
              <div className="mt-2 text-xs text-sky-700 flex items-center">
                <div className="animate-pulse w-2 h-2 bg-sky-500 rounded-full mr-2"></div>
                Speaking...
              </div>
            )}
          </div>

          <div className="flex space-x-2">
            {conversation.status === 'connected' ? (
              <Button 
                size="sm" 
                variant="outline"
                className="flex-1 text-xs border-red-500 text-red-600 hover:bg-red-50"
                onClick={handleEndConversation}
              >
                <MicOff className="h-3 w-3 mr-1" />
                End Chat
              </Button>
            ) : (
              <Button 
                size="sm" 
                className="flex-1 text-xs bg-sky-500 hover:bg-sky-600 text-white"
                onClick={handleStartConversation}
              >
                <Mic className="h-3 w-3 mr-1" />
                Start Voice Chat
              </Button>
            )}
            
            <Button
              variant="outline"
              size="sm"
              onClick={toggleMute}
              className="px-2"
            >
              {isMuted ? <VolumeX className="h-3 w-3" /> : <Volume2 className="h-3 w-3" />}
            </Button>
          </div>

          {conversation.status === 'connected' && (
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <span className="text-xs text-gray-600">Volume:</span>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.1"
                  value={volume}
                  onChange={(e) => handleVolumeChange(parseFloat(e.target.value))}
                  className="flex-1 h-1 bg-gray-300 rounded-lg appearance-none cursor-pointer"
                />
                <span className="text-xs text-gray-600 w-8">
                  {Math.round(volume * 100)}%
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
    </Card>
  );
};

export default AvaWidget;