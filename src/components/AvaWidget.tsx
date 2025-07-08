import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { MessageCircle, Mic, MicOff, Minimize2, Send } from 'lucide-react';
import { useTextToSpeech } from '@/hooks/useTextToSpeech';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';

interface AvaWidgetProps {
  isFullScreen?: boolean;
  onFullScreenToggle?: () => void;
  context?: string;
}

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

const AvaWidget = ({ isFullScreen = false, onFullScreenToggle, context = "general" }: AvaWidgetProps) => {
  const [isMinimized, setIsMinimized] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [inputText, setInputText] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { speak, isPlaying: isSpeaking, stop } = useTextToSpeech();
  const { user } = useAuth();
  const recognitionRef = useRef<SpeechRecognition | null>(null);

  // Initialize speech recognition
  useEffect(() => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;
      recognitionRef.current.lang = 'en-US';

      recognitionRef.current.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setInputText(transcript);
        handleSendMessage(transcript);
      };

      recognitionRef.current.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current.onerror = (event: any) => {
        console.error('Speech recognition error:', event.error);
        setIsListening(false);
      };
    }
  }, []);

  const handleSendMessage = async (message: string) => {
    if (!message.trim()) return;

    const userMessage: Message = { role: 'user', content: message };
    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setIsLoading(true);

    try {
      const { data, error } = await supabase.functions.invoke('ava-chat', {
        body: {
          message: message,
          context: context,
          userId: user?.id,
          conversationHistory: messages
        }
      });

      if (error) throw error;

      const assistantMessage: Message = { role: 'assistant', content: data.response };
      setMessages(prev => [...prev, assistantMessage]);
      
      // Speak the response
      if (data.response) {
        speak(data.response);
      }
    } catch (error) {
      console.error('Error sending message:', error);
      const errorMessage: Message = { 
        role: 'assistant', 
        content: 'Sorry, I encountered an error. Please try again.' 
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const startListening = () => {
    if (recognitionRef.current && !isListening) {
      setIsListening(true);
      recognitionRef.current.start();
    }
  };

  const stopListening = () => {
    if (recognitionRef.current && isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    }
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
                  {isLoading ? 'Thinking...' : 'Ready to chat'}
                </p>
              </div>
            </div>
            <Button variant="ghost" size="sm" onClick={() => setIsMinimized(true)}>
              <Minimize2 className="h-3 w-3" />
            </Button>
          </div>
        )}

        <div className={`space-y-3 ${isFullScreen ? 'flex-grow flex flex-col' : ''}`}>
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
                  {isLoading ? 'Thinking...' : 'Ready to chat'}
                </p>
              </div>
            </div>
          )}
          
          {/* Messages */}
          {isFullScreen && messages.length > 0 && (
            <div className="flex-grow overflow-y-auto max-h-64 space-y-2">
              {messages.map((message, index) => (
                <div
                  key={index}
                  className={`p-2 rounded-lg ${
                    message.role === 'user'
                      ? 'bg-sky-100 text-sky-900 ml-auto max-w-xs'
                      : 'bg-gray-100 text-gray-900 mr-auto max-w-xs'
                  }`}
                >
                  <p className="text-sm">{message.content}</p>
                </div>
              ))}
            </div>
          )}
          
          <div className={`bg-gray-50 rounded-lg ${isFullScreen ? 'p-4' : 'p-3'}`}>
            <p className={`text-gray-700 ${isFullScreen ? 'text-sm' : 'text-xs'}`}>
              Hi! I'm AVA, your AI assistant. I can help you find senior care facilities, 
              answer questions, and guide you through the process.
            </p>
            {(isLoading || isSpeaking) && (
              <div className={`mt-2 text-sky-700 flex items-center justify-center ${isFullScreen ? 'text-sm' : 'text-xs'}`}>
                <div className="animate-pulse w-2 h-2 bg-sky-500 rounded-full mr-2"></div>
                {isLoading ? 'Thinking...' : 'Speaking...'}
              </div>
            )}
          </div>

          {/* Input area */}
          <div className="flex space-x-2">
            <Input
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Type your message..."
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage(inputText)}
              className="flex-1"
              disabled={isLoading}
            />
            <Button
              onClick={() => handleSendMessage(inputText)}
              disabled={isLoading || !inputText.trim()}
              size="sm"
            >
              <Send className="h-4 w-4" />
            </Button>
            <Button
              onClick={isListening ? stopListening : startListening}
              variant={isListening ? "default" : "outline"}
              size="sm"
              className={isListening ? "bg-red-500 hover:bg-red-600" : ""}
            >
              {isListening ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default AvaWidget;