import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useConversation } from '@elevenlabs/react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { MessageCircle, Mic, MicOff, Minimize2, Volume2, VolumeX } from 'lucide-react';
import { useTextToSpeech } from '@/hooks/useTextToSpeech';
import { useAuth } from '@/hooks/useAuth';
import * as ClientTools from '@/components/tools/ClientTools';

interface AvaWidgetProps {
  isFullScreen?: boolean;
  onFullScreenToggle?: () => void;
  context?: string;
}

const AvaWidget = ({ isFullScreen = false, onFullScreenToggle, context = "general" }: AvaWidgetProps) => {
  const [isMinimized, setIsMinimized] = useState(false);
  const [volume, setVolume] = useState(0.8);
  const [isMuted, setIsMuted] = useState(false);
  const { speak, isPlaying: isSpeaking } = useTextToSpeech();
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const conversation = useConversation({
    onConnect: () => {
      console.log('✅ Connected to ElevenLabs');
    },
    onDisconnect: () => {
      console.log('❌ Disconnected from ElevenLabs');
    },
    onMessage: (message) => {
      console.log('📨 Message received:', message);
    },
    onError: (error) => {
      console.error('❌ ElevenLabs error:', error);
    },
    clientTools: {
      show_facilities_on_map: ClientTools.showFacilitiesOnMap,
      showSearchResultsPanel: ClientTools.showSearchResultsPanel,
      searchFacilities: ClientTools.searchFacilities,
      displayMap: ClientTools.displayMap,
      showToastMessage: ClientTools.showToastMessage
    },
    overrides: {
      agent: {
        prompt: {
          prompt: `You are AVA, a helpful senior care advisor. The current user ID is: ${user?.id || 'anonymous'}. Always include this user ID when calling functions that need it. Be patient and wait for user responses - don't disconnect after asking questions.`
        }
      }
    }
  });

  // Listen for TTS events
  useEffect(() => {
    const handleAvaSpeak = (event: CustomEvent) => {
      console.log('AVA speak event:', event.detail);
      if (event.detail.text) {
        speak(event.detail.text);
      }
    };

    const handleHighlightField = (event: CustomEvent) => {
      console.log('Highlight field event:', event.detail);
      // Add visual highlighting to form fields
      const fieldName = event.detail.fieldName;
      const field = document.querySelector(`[name="${fieldName}"], #${fieldName}, [data-field="${fieldName}"]`);
      if (field) {
        field.scrollIntoView({ behavior: 'smooth', block: 'center' });
        field.classList.add('ring-2', 'ring-primary-bright', 'ring-opacity-50');
        setTimeout(() => {
          field.classList.remove('ring-2', 'ring-primary-bright', 'ring-opacity-50');
        }, 3000);
      }
    };

    window.addEventListener('ava-speak', handleAvaSpeak as EventListener);
    window.addEventListener('highlight-field', handleHighlightField as EventListener);

    return () => {
      window.removeEventListener('ava-speak', handleAvaSpeak as EventListener);
      window.removeEventListener('highlight-field', handleHighlightField as EventListener);
    };
  }, [speak]);

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

  if (isMinimized && !isFullScreen) {
    return (
      <Button
        className="fixed bottom-6 right-6 z-40 w-14 h-14 rounded-full bg-sky-500 hover:bg-sky-600 shadow-lg"
        onClick={() => setIsMinimized(false)}
      >
        <MessageCircle className="h-6 w-6 text-white" />
      </Button>
    );
  }

  const containerClass = isFullScreen 
    ? "w-full h-full flex flex-col" 
    : "fixed bottom-6 right-6 z-40 w-80 shadow-lg animate-fade-in";

  return (
    <Card className={containerClass}>
      <div className={isFullScreen ? "p-6 h-full flex flex-col" : "p-4"}>
        {!isFullScreen && (
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
                <h4 className="font-semibold text-gray-800 text-sm">AVA Assistant</h4>
                <p className="text-gray-500 text-xs">
                  {conversation.status === 'connected' ? 'Connected' : 'Ready to chat'}
                </p>
              </div>
            </div>
            <Button variant="ghost" size="sm" onClick={() => setIsMinimized(true)}>
              <Minimize2 className="h-3 w-3" />
            </Button>
          </div>
        )}

        <div className={`space-y-3 ${isFullScreen ? 'flex-grow flex flex-col justify-center items-center' : ''}`}>
          {isFullScreen && (
            <div className="flex flex-col items-center space-y-4 mb-8">
              <div className="w-20 h-20 rounded-full overflow-hidden">
                <img 
                  src="/lovable-uploads/7518e2b4-1e66-4ed5-b127-9469488ec7d7.png" 
                  alt="AVA Assistant" 
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="text-center">
                <h4 className="font-semibold text-gray-800 text-xl">AVA Assistant</h4>
                <p className="text-gray-500 text-sm">
                  {conversation.status === 'connected' ? 'Connected' : 'Ready to chat'}
                </p>
              </div>
            </div>
          )}
          
          <div className={`bg-gray-50 rounded-lg ${isFullScreen ? 'p-4 max-w-md text-center' : 'p-3'}`}>
            <p className={`text-gray-700 ${isFullScreen ? 'text-sm' : 'text-xs'}`}>
              Hi! I'm AVA, your AI assistant. I can help you find senior care facilities, 
              answer questions, and guide you through the process.
            </p>
            {(conversation.isSpeaking || isSpeaking) && (
              <div className={`mt-2 text-sky-700 flex items-center justify-center ${isFullScreen ? 'text-sm' : 'text-xs'}`}>
                <div className="animate-pulse w-2 h-2 bg-sky-500 rounded-full mr-2"></div>
                {conversation.isSpeaking ? 'Listening...' : 'Speaking...'}
              </div>
            )}
          </div>

          <div className={`flex space-x-2 ${isFullScreen ? 'justify-center' : ''}`}>
            {conversation.status === 'connected' ? (
              <Button 
                size={isFullScreen ? "lg" : "sm"}
                variant="outline"
                className={`border-red-500 text-red-600 hover:bg-red-50 ${isFullScreen ? 'text-base px-8' : 'text-xs flex-1'}`}
                onClick={handleEndConversation}
              >
                <MicOff className={`mr-1 ${isFullScreen ? 'h-5 w-5' : 'h-3 w-3'}`} />
                End Chat
              </Button>
            ) : (
              <Button 
                size={isFullScreen ? "lg" : "sm"}
                className={`bg-sky-500 hover:bg-sky-600 text-white ${isFullScreen ? 'text-base px-8' : 'text-xs flex-1'}`}
                onClick={handleStartConversation}
              >
                <Mic className={`mr-1 ${isFullScreen ? 'h-5 w-5' : 'h-3 w-3'}`} />
                Start Voice Chat
              </Button>
            )}
            
            <Button
              variant="outline"
              size={isFullScreen ? "lg" : "sm"}
              onClick={toggleMute}
              className="px-2"
            >
              {isMuted ? 
                <VolumeX className={isFullScreen ? "h-5 w-5" : "h-3 w-3"} /> : 
                <Volume2 className={isFullScreen ? "h-5 w-5" : "h-3 w-3"} />
              }
            </Button>
          </div>

          {conversation.status === 'connected' && (
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <span className={`text-gray-600 ${isFullScreen ? 'text-sm' : 'text-xs'}`}>Volume:</span>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.1"
                  value={volume}
                  onChange={(e) => handleVolumeChange(parseFloat(e.target.value))}
                  className="flex-1 h-1 bg-gray-300 rounded-lg appearance-none cursor-pointer"
                />
                <span className={`text-gray-600 w-8 ${isFullScreen ? 'text-sm' : 'text-xs'}`}>
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