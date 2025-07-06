import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { MessageCircle, Mic, MicOff, Minimize2, Maximize2, X, Send, MapPin, Phone, ExternalLink } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface AvaWidgetProps {
  isFullScreen?: boolean;
  onFullScreenToggle?: () => void;
  context?: string;
}

const AvaWidget = ({ isFullScreen = false, onFullScreenToggle, context = "general" }: AvaWidgetProps) => {
  const [isMinimized, setIsMinimized] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [showFullScreen, setShowFullScreen] = useState(false);
  const [agentReply, setAgentReply] = useState('');
  const [assistantName, setAssistantName] = useState<'greeter' | 'ava' | 'ranger'>('ava');
  const [chatOpen, setChatOpen] = useState(false);
  const [messages, setMessages] = useState<Array<{ text: string; isUser: boolean }>>([]);
  const [textInput, setTextInput] = useState('');
  const [dynamicCards, setDynamicCards] = useState<any[]>([]);
  const [tooltip, setTooltip] = useState<{ content: string; position: string } | null>(null);
  const [mapData, setMapData] = useState<any>(null);
  const navigate = useNavigate();
  const recognitionRef = useRef<SpeechRecognition | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 200 && !showFullScreen) {
        setShowFullScreen(true);
        setChatOpen(true);
        onFullScreenToggle?.();
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [showFullScreen, onFullScreenToggle]);

  // Event listeners for widget commands
  useEffect(() => {
    const handleWidgetCommand = (event: CustomEvent) => {
      const { commandType, commandData } = event.detail;
      processWidgetCommand(commandType, commandData);
    };

    const handleDisplayCards = (event: CustomEvent) => {
      setDynamicCards(event.detail.cards || []);
    };

    const handleNavigate = (event: CustomEvent) => {
      const { url } = event.detail;
      if (url) navigate(url);
    };

    const handlePopulateMap = (event: CustomEvent) => {
      setMapData(event.detail.mapData);
    };

    const handleShowTooltip = (event: CustomEvent) => {
      setTooltip(event.detail.tooltip);
    };

    // Listen for custom DOM events
    window.addEventListener('widget-command', handleWidgetCommand as EventListener);
    window.addEventListener('display-cards', handleDisplayCards as EventListener);
    window.addEventListener('navigate-to', handleNavigate as EventListener);
    window.addEventListener('populate-map', handlePopulateMap as EventListener);
    window.addEventListener('show-tooltip', handleShowTooltip as EventListener);

    return () => {
      window.removeEventListener('widget-command', handleWidgetCommand as EventListener);
      window.removeEventListener('display-cards', handleDisplayCards as EventListener);
      window.removeEventListener('navigate-to', handleNavigate as EventListener);
      window.removeEventListener('populate-map', handlePopulateMap as EventListener);
      window.removeEventListener('show-tooltip', handleShowTooltip as EventListener);
    };
  }, [navigate]);

  const processWidgetCommand = async (commandType: string, commandData: any) => {
    try {
      const { data, error } = await supabase.functions.invoke('widget-commands', {
        body: { commandType, commandData }
      });

      if (error) throw error;

      // Process the response based on command type
      switch (commandType) {
        case 'display_cards':
          setDynamicCards(data.cards || []);
          break;
        case 'navigate':
          if (data.navigationUrl) navigate(data.navigationUrl);
          break;
        case 'populate_map':
          setMapData(data.mapData);
          break;
        case 'show_tooltip':
          setTooltip(data.tooltip);
          break;
      }

      // Log interaction
      await supabase.from('widget_interactions').insert({
        interaction_type: commandType,
        interaction_data: commandData,
        widget_command_id: data.commandId
      });

    } catch (error) {
      console.error('Error processing widget command:', error);
    }
  };

  const handleStartAssessment = () => {
    navigate('/find-care');
    setChatOpen(false);
    setIsMinimized(true);
  };

  const handleSendMessage = () => {
    if (textInput.trim()) {
      setMessages(prev => [...prev, { text: textInput, isUser: true }]);
      
      // Simple mock response - in a real app, this would call an AI service
      const response = `I received your message: "${textInput}". How can I help you with that?`;
      setAgentReply(response);
      setMessages(prev => [...prev, { text: response, isUser: false }]);
      
      if (textInput.toLowerCase().includes('veteran')) {
        setAssistantName('ranger');
      } else {
        setAssistantName('ava');
      }
      
      setTextInput('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };

  const startVoiceRecognition = () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert('Speech recognition is not supported in this browser.');
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = 'en-US';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onresult = async (event: SpeechRecognitionEvent) => {
      const transcript = event.results[0][0].transcript;
      setMessages(prev => [...prev, { text: transcript, isUser: true }]);
      
      // Simple mock response - in a real app, this would call an AI service
      const response = `I heard you say: "${transcript}". How can I help you with that?`;
      setAgentReply(response);
      setMessages(prev => [...prev, { text: response, isUser: false }]);
      
      if (transcript.toLowerCase().includes('veteran')) {
        setAssistantName('ranger');
      } else {
        setAssistantName('ava');
      }
    };

    recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
      console.error('Speech recognition error', event);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognition.start();
    recognitionRef.current = recognition;
    setIsListening(true);
  };

  const stopVoiceRecognition = () => {
    recognitionRef.current?.stop();
    setIsListening(false);
  };

  const getAssistantLabel = () => {
    switch (assistantName) {
      case 'ranger': return 'Ranger, Veteran Support Bot';
      case 'ava': return 'AVA Assistant';
      default: return 'AVA Assistant';
    }
  };

  const getAssistantAvatar = () => {
    switch (assistantName) {
      case 'ranger': return '/images/ranger.png';
      case 'ava': return '/images/ava.png';
      default: return '/images/ava.png';
    }
  };

  if (chatOpen) {
    return (
      <Card className="fixed inset-4 z-50 flex flex-col bg-white shadow-2xl">
        <div className="flex items-center justify-between p-4 border-b">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-full bg-sky-500 flex items-center justify-center">
              <img 
                src={getAssistantAvatar()} 
                alt={getAssistantLabel()} 
                className="w-6 h-6 rounded-full object-cover"
              />
            </div>
            <div>
              <h4 className="text-sm font-semibold">{getAssistantLabel()}</h4>
              <p className="text-xs text-gray-500">Online</p>
            </div>
          </div>
          <Button variant="ghost" size="sm" onClick={() => setChatOpen(false)}>
            <X className="h-4 w-4" />
          </Button>
        </div>
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.length === 0 && (
            <div className="text-center text-gray-500 py-8">
              <p>Start a conversation by clicking the microphone button or typing below.</p>
            </div>
          )}
          {messages.map((message, index) => (
            <div key={index} className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-xs p-3 rounded-lg ${
                message.isUser 
                  ? 'bg-sky-500 text-white' 
                  : 'bg-gray-100 text-gray-800'
              }`}>
                {message.text}
              </div>
            </div>
          ))}
          
          {/* Dynamic Cards Display */}
          {dynamicCards.length > 0 && (
            <div className="space-y-3">
              <h3 className="text-sm font-semibold text-gray-800">Facility Results</h3>
              <div className="grid grid-cols-1 gap-3">
                {dynamicCards.map((card, index) => (
                  <Card key={index} className="p-3 hover:shadow-md transition-shadow">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-semibold text-sm">{card.title}</h4>
                      {card.rating && (
                        <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded">
                          ⭐ {card.rating}
                        </span>
                      )}
                    </div>
                    {card.address && (
                      <div className="flex items-center space-x-1 mb-2">
                        <MapPin className="h-3 w-3 text-gray-500" />
                        <span className="text-xs text-gray-600">{card.address}</span>
                      </div>
                    )}
                    <div className="flex space-x-2">
                      {card.phone && (
                        <Button size="sm" variant="outline" className="text-xs">
                          <Phone className="h-3 w-3 mr-1" />
                          Call
                        </Button>
                      )}
                      {card.website && (
                        <Button size="sm" variant="outline" className="text-xs">
                          <ExternalLink className="h-3 w-3 mr-1" />
                          Visit
                        </Button>
                      )}
                      <Button size="sm" variant="outline" className="text-xs">
                        <MapPin className="h-3 w-3 mr-1" />
                        Map
                      </Button>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          )}
          
          {/* Map Data Display */}
          {mapData && (
            <div className="space-y-2">
              <h3 className="text-sm font-semibold text-gray-800">Map View</h3>
              <div className="bg-gray-100 rounded-lg p-4 text-center">
                <p className="text-xs text-gray-600">
                  Map view with {mapData.markers?.length || 0} locations
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  Center: {mapData.center?.lat}, {mapData.center?.lng}
                </p>
              </div>
            </div>
          )}
        </div>
        
        {/* Tooltip Display */}
        {tooltip && (
          <div className="absolute top-4 right-4 bg-black text-white text-xs p-2 rounded shadow-lg z-50">
            {tooltip.content}
            <button 
              onClick={() => setTooltip(null)}
              className="ml-2 text-gray-300 hover:text-white"
            >
              ×
            </button>
          </div>
        )}
        <div className="p-4 border-t space-y-3">
          <div className="flex space-x-2">
            <Input
              placeholder="Type your message..."
              value={textInput}
              onChange={(e) => setTextInput(e.target.value)}
              onKeyPress={handleKeyPress}
              className="flex-1"
            />
            <Button
              size="sm"
              onClick={handleSendMessage}
              disabled={!textInput.trim()}
              className="bg-sky-500 hover:bg-sky-600 text-white"
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
          <div className="flex space-x-2">
            <Button 
              size="sm" 
              className="flex-1 bg-sky-500 hover:bg-sky-600 text-white"
              onClick={handleStartAssessment}
            >
              Start Assessment
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={isListening ? stopVoiceRecognition : startVoiceRecognition}
              className={isListening ? "border-red-500" : ""}
            >
              {isListening ? <MicOff className="h-3 w-3" /> : <Mic className="h-3 w-3" />}
            </Button>
          </div>
        </div>
      </Card>
    );
  }

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
            <div className="w-8 h-8 rounded-full bg-sky-500 flex items-center justify-center">
              <img 
                src={getAssistantAvatar()} 
                alt={getAssistantLabel()} 
                className="w-6 h-6 rounded-full object-cover"
              />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-gray-800">{getAssistantLabel()}</h4>
              <p className="text-xs text-gray-500">Online</p>
            </div>
          </div>
          <div className="flex items-center space-x-1">
            <Button variant="ghost" size="sm" onClick={() => setChatOpen(true)}>
              <Maximize2 className="h-3 w-3" />
            </Button>
            <Button variant="ghost" size="sm" onClick={() => setIsMinimized(true)}>
              <Minimize2 className="h-3 w-3" />
            </Button>
          </div>
        </div>
        <div className="space-y-3">
          <div className="p-3 bg-gray-50 rounded-lg">
            <p className="text-xs text-gray-700">
              Hi! I'm {getAssistantLabel()}. I can help you find the right support or guide you to the best care.
            </p>
            {agentReply && (
              <div className="mt-2 text-xs text-sky-700">{agentReply}</div>
            )}
          </div>
          <div className="flex space-x-2">
            <Button 
              size="sm" 
              className="flex-1 text-xs bg-sky-500 hover:bg-sky-600 text-white"
              onClick={handleStartAssessment}
            >
              Start Assessment
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={isListening ? stopVoiceRecognition : startVoiceRecognition}
              className={isListening ? "border-red-500" : ""}
            >
              {isListening ? <MicOff className="h-3 w-3" /> : <Mic className="h-3 w-3" />}
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default AvaWidget;
