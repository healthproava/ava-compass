import { useState, useRef, useCallback } from 'react';

interface ConversationState {
  isConnected: boolean;
  isListening: boolean;
  isSpeaking: boolean;
  error: string | null;
  transcript: string;
  response: string;
}

interface UseElevenLabsConversationReturn extends ConversationState {
  startConversation: () => Promise<void>;
  endConversation: () => void;
  sendMessage: (message: string) => Promise<void>;
}

export const useElevenLabsConversation = (agentId: string): UseElevenLabsConversationReturn => {
  const [state, setState] = useState<ConversationState>({
    isConnected: false,
    isListening: false,
    isSpeaking: false,
    error: null,
    transcript: '',
    response: ''
  });

  const websocketRef = useRef<WebSocket | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const conversationIdRef = useRef<string | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const keepAliveIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const updateState = useCallback((updates: Partial<ConversationState>) => {
    setState(prev => ({ ...prev, ...updates }));
  }, []);

  const checkAudioSupport = useCallback(() => {
    // Check if getUserMedia is supported
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      throw new Error('Your browser does not support audio recording. Please use Chrome, Firefox, Safari, or Edge.');
    }

    // Check if MediaRecorder is supported
    if (!window.MediaRecorder) {
      throw new Error('Your browser does not support audio recording. Please update your browser.');
    }

    // Check if WebSocket is supported
    if (!window.WebSocket) {
      throw new Error('Your browser does not support WebSocket connections. Please update your browser.');
    }

    // Check if AudioContext is supported
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContextClass) {
      throw new Error('Your browser does not support Web Audio API. Please update your browser.');
    }

    return true;
  }, []);

  const getSupportedMimeType = useCallback(() => {
    const types = [
      'audio/webm;codecs=opus',
      'audio/webm',
      'audio/mp4;codecs=mp4a.40.2',
      'audio/mp4',
      'audio/mpeg',
      'audio/wav'
    ];

    for (const type of types) {
      if (MediaRecorder.isTypeSupported(type)) {
        console.log('Using supported audio format:', type);
        return type;
      }
    }

    throw new Error('No supported audio format found. Please try a different browser.');
  }, []);

  const initializeAudioContext = useCallback(async () => {
    try {
      console.log('Checking audio support...');
      checkAudioSupport();

      console.log('Requesting microphone access...');
      
      // Request microphone permission with fallback constraints
      let stream: MediaStream;
      try {
        // Try with optimal settings first
        stream = await navigator.mediaDevices.getUserMedia({ 
          audio: {
            echoCancellation: true,
            noiseSuppression: true,
            autoGainControl: true,
            sampleRate: { ideal: 44100, min: 16000 },
            channelCount: 1,
            latency: { ideal: 0.01, max: 0.1 }
          } 
        });
      } catch (err) {
        console.warn('Failed with optimal settings, trying basic audio:', err);
        // Fallback to basic audio constraints
        stream = await navigator.mediaDevices.getUserMedia({ 
          audio: true
        });
      }
      
      streamRef.current = stream;
      console.log('Microphone access granted');
      
      // Initialize AudioContext with proper settings
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      audioContextRef.current = new AudioContextClass({
        sampleRate: 44100,
        latencyHint: 'interactive'
      });
      
      // Resume audio context if suspended (required by some browsers)
      if (audioContextRef.current.state === 'suspended') {
        await audioContextRef.current.resume();
        console.log('Audio context resumed');
      }
      
      // Get supported MIME type
      const mimeType = getSupportedMimeType();
        
      mediaRecorderRef.current = new MediaRecorder(stream, {
        mimeType: mimeType,
        audioBitsPerSecond: 128000
      });

      mediaRecorderRef.current.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
          console.log('Audio chunk received:', event.data.size, 'bytes');
        }
      };

      mediaRecorderRef.current.onstop = async () => {
        if (audioChunksRef.current.length > 0 && websocketRef.current?.readyState === WebSocket.OPEN) {
          const audioBlob = new Blob(audioChunksRef.current, { 
            type: mediaRecorderRef.current?.mimeType || mimeType 
          });
          audioChunksRef.current = [];
          console.log('Sending audio blob:', audioBlob.size, 'bytes');
          await sendAudioToAgent(audioBlob);
        }
      };

      mediaRecorderRef.current.onstart = () => {
        console.log('MediaRecorder started successfully');
        updateState({ isListening: true, error: null });
      };

      mediaRecorderRef.current.onerror = (event: any) => {
        console.error('MediaRecorder error:', event);
        updateState({ 
          error: 'Audio recording error. Please check your microphone permissions and try again.',
          isListening: false 
        });
      };

      return true;
    } catch (error: any) {
      console.error('Failed to initialize audio:', error);
      
      let errorMessage = 'Failed to initialize audio. ';
      if (error.name === 'NotAllowedError' || error.name === 'PermissionDeniedError') {
        errorMessage += 'Please allow microphone access and refresh the page.';
      } else if (error.name === 'NotFoundError') {
        errorMessage += 'No microphone found. Please connect a microphone and try again.';
      } else if (error.name === 'NotSupportedError') {
        errorMessage += 'Your browser does not support audio recording. Please use Chrome, Firefox, Safari, or Edge.';
      } else {
        errorMessage += error.message || 'Please check your microphone and browser settings.';
      }
      
      updateState({ error: errorMessage });
      return false;
    }
  }, [checkAudioSupport, getSupportedMimeType]);

  const sendAudioToAgent = useCallback(async (audioBlob: Blob) => {
    if (!websocketRef.current || websocketRef.current.readyState !== WebSocket.OPEN) {
      console.error('WebSocket not connected');
      return;
    }

    try {
      // Convert audio blob to base64
      const arrayBuffer = await audioBlob.arrayBuffer();
      const base64Audio = btoa(String.fromCharCode(...new Uint8Array(arrayBuffer)));
      
      const message = {
        user_audio_chunk: base64Audio
      };

      websocketRef.current.send(JSON.stringify(message));
      console.log('Audio sent to agent, size:', base64Audio.length);
    } catch (error) {
      console.error('Failed to send audio:', error);
      updateState({ error: 'Failed to send audio. Please try again.' });
    }
  }, []);

  const playAudioResponse = useCallback(async (audioBase64: string, mimeType: string = 'audio/mpeg') => {
    try {
      updateState({ isSpeaking: true, isListening: false });
      console.log('Playing audio response, size:', audioBase64.length);
      console.log('Using MIME type:', mimeType);
      
      // Stop recording while AI is speaking to prevent feedback
      if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
        mediaRecorderRef.current.stop();
      }
      
      // Decode base64 audio
      const binaryString = atob(audioBase64);
      const audioBuffer = new Uint8Array(binaryString.length);
      for (let i = 0; i < binaryString.length; i++) {
        audioBuffer[i] = binaryString.charCodeAt(i);
      }
      
      // Create audio blob and play
      const audioBlob = new Blob([audioBuffer], { type: mimeType });
      const audioUrl = URL.createObjectURL(audioBlob);
      
      const audio = new Audio(audioUrl);
      audio.volume = 1.0;
      
      audio.onended = () => {
        updateState({ isSpeaking: false });
        URL.revokeObjectURL(audioUrl);
        console.log('Audio playback finished');
        
        // Resume recording after AI finishes speaking
        if (websocketRef.current?.readyState === WebSocket.OPEN && 
            mediaRecorderRef.current && 
            mediaRecorderRef.current.state === 'inactive') {
          try {
            mediaRecorderRef.current.start(1000);
            updateState({ isListening: true });
            console.log('Resumed recording after AI response');
          } catch (err) {
            console.error('Failed to resume recording:', err);
          }
        }
      };
      
      audio.onerror = (error) => {
        console.error('Audio playback error:', error);
        updateState({ isSpeaking: false, error: 'Failed to play audio response.' });
        URL.revokeObjectURL(audioUrl);
      };
      
      await audio.play();
    } catch (error) {
      console.error('Failed to play audio response:', error);
      updateState({ isSpeaking: false, error: 'Failed to play audio response.' });
    }
  }, []);

  const setupKeepAlive = useCallback(() => {
    // Send ping every 30 seconds to keep connection alive
    keepAliveIntervalRef.current = setInterval(() => {
      if (websocketRef.current?.readyState === WebSocket.OPEN) {
        websocketRef.current.send(JSON.stringify({ type: 'ping' }));
        console.log('Sent keep-alive ping');
      }
    }, 30000);
  }, []);

  const startConversation = useCallback(async () => {
    try {
      updateState({ error: null });
      
      const apiKey = import.meta.env.VITE_ELEVENLABS_API_KEY;
      if (!apiKey) {
        updateState({ error: 'ElevenLabs API key not configured. Please add VITE_ELEVENLABS_API_KEY to your environment variables.' });
        return;
      }

      if (!agentId) {
        updateState({ error: 'Agent ID not provided. Please check your configuration.' });
        return;
      }

      console.log('Starting conversation with agent:', agentId);

      // Initialize audio first
      const audioInitialized = await initializeAudioContext();
      if (!audioInitialized) return;

      // Connect to ElevenLabs WebSocket
      const wsUrl = `wss://api.elevenlabs.io/v1/convai/conversation?agent_id=${agentId}`;
      console.log('Connecting to:', wsUrl);
      
      websocketRef.current = new WebSocket(wsUrl);

      websocketRef.current.onopen = () => {
        console.log('WebSocket connected successfully');
        
        // Send authentication message
        const authMessage = {
          type: 'conversation_initiation_client_data',
          custom_llm_extra_body: {
            xi_api_key: apiKey
          }
        };
        
        console.log('Sending authentication message');
        websocketRef.current?.send(JSON.stringify(authMessage));
        updateState({ isConnected: true });
        
        // Setup keep-alive
        setupKeepAlive();
      };

      websocketRef.current.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          console.log('Received WebSocket message:', data.type);
          
          switch (data.type) {
            case 'conversation_initiation_metadata':
              conversationIdRef.current = data.conversation_id;
              console.log('Conversation initiated with ID:', data.conversation_id);
              
              // Start recording after successful initialization
              setTimeout(() => {
                if (mediaRecorderRef.current && 
                    mediaRecorderRef.current.state === 'inactive' &&
                    websocketRef.current?.readyState === WebSocket.OPEN) {
                  try {
                    mediaRecorderRef.current.start(1000);
                    console.log('Started audio recording');
                  } catch (err) {
                    console.error('Failed to start recording:', err);
                    updateState({ error: 'Failed to start audio recording. Please check your microphone.' });
                  }
                }
              }, 500);
              break;
              
            case 'audio':
              console.log('Received audio response');
              if (data.audio_event?.audio_base_64) {
                const mimeType = data.audio_event?.mime_type || 'audio/mpeg';
                console.log('Audio event MIME type:', mimeType);
                playAudioResponse(data.audio_event.audio_base_64, mimeType);
              }
              break;
              
            case 'interruption':
              console.log('Conversation interrupted by user');
              updateState({ isSpeaking: false });
              // Restart recording if not already recording
              if (mediaRecorderRef.current?.state === 'inactive') {
                try {
                  mediaRecorderRef.current.start(1000);
                  updateState({ isListening: true });
                } catch (err) {
                  console.error('Failed to restart recording after interruption:', err);
                }
              }
              break;
              
            case 'ping':
              websocketRef.current?.send(JSON.stringify({ type: 'pong' }));
              console.log('Responded to ping');
              break;
              
            case 'pong':
              console.log('Received pong response');
              break;
              
            case 'user_transcript':
              console.log('User transcript received:', data.user_transcript?.text);
              if (data.user_transcript?.text) {
                updateState({ transcript: data.user_transcript.text });
              }
              break;
              
            case 'agent_response':
              console.log('Agent text response:', data.agent_response?.text);
              if (data.agent_response?.text) {
                updateState({ response: data.agent_response.text });
              }
              break;

            case 'agent_response_correction':
              console.log('Agent response correction:', data.agent_response_correction?.text);
              if (data.agent_response_correction?.text) {
                updateState({ response: data.agent_response_correction.text });
              }
              break;

            case 'conversation_end':
              console.log('Conversation ended by server');
              endConversation();
              break;

            case 'error':
              console.error('Server error:', data.error);
              updateState({ error: `Server error: ${data.error?.message || 'Unknown error'}` });
              break;
              
            default:
              console.log('Unknown message type:', data.type);
          }
        } catch (error) {
          console.error('Failed to parse WebSocket message:', error, event.data);
        }
      };

      websocketRef.current.onerror = (error) => {
        console.error('WebSocket error:', error);
        updateState({ error: 'Connection error. Please check your internet connection and API key.' });
      };

      websocketRef.current.onclose = (event) => {
        console.log('WebSocket closed:', event.code, event.reason);
        
        // Clear keep-alive interval
        if (keepAliveIntervalRef.current) {
          clearInterval(keepAliveIntervalRef.current);
          keepAliveIntervalRef.current = null;
        }
        
        let errorMessage = null;
        if (event.code !== 1000) {
          switch (event.code) {
            case 1006:
              errorMessage = 'Connection lost unexpectedly. Please check your internet connection and try again.';
              break;
            case 1008:
              errorMessage = 'Connection rejected. Please check your API key and agent configuration.';
              break;
            case 1011:
              errorMessage = 'Server error. Please try again in a moment.';
              break;
            case 4001:
              errorMessage = 'Invalid API key. Please check your ElevenLabs API key in the environment variables.';
              break;
            case 4003:
              errorMessage = 'Agent not found. Please check your agent ID configuration.';
              break;
            case 4004:
              errorMessage = 'Insufficient credits. Please check your ElevenLabs account balance.';
              break;
            default:
              errorMessage = `Connection closed (${event.code}): ${event.reason || 'Unknown error'}`;
          }
        }
        
        updateState({ 
          isConnected: false, 
          isListening: false, 
          isSpeaking: false,
          error: errorMessage
        });
        
        // Stop recording if active
        if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
          mediaRecorderRef.current.stop();
        }
      };

    } catch (error: any) {
      console.error('Failed to start conversation:', error);
      updateState({ error: `Failed to start conversation: ${error.message || 'Unknown error'}` });
    }
  }, [agentId, initializeAudioContext, playAudioResponse, setupKeepAlive]);

  const endConversation = useCallback(() => {
    console.log('Ending conversation');
    
    // Clear keep-alive interval
    if (keepAliveIntervalRef.current) {
      clearInterval(keepAliveIntervalRef.current);
      keepAliveIntervalRef.current = null;
    }
    
    // Stop recording
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
    }

    // Stop all media tracks
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => {
        track.stop();
        console.log('Stopped media track:', track.kind);
      });
      streamRef.current = null;
    }

    // Close WebSocket
    if (websocketRef.current && websocketRef.current.readyState === WebSocket.OPEN) {
      websocketRef.current.close(1000, 'User ended conversation');
    }
    websocketRef.current = null;

    // Close AudioContext
    if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
      audioContextRef.current.close();
      audioContextRef.current = null;
    }

    // Reset state
    updateState({
      isConnected: false,
      isListening: false,
      isSpeaking: false,
      transcript: '',
      response: '',
      error: null
    });

    conversationIdRef.current = null;
    console.log('Conversation ended and resources cleaned up');
  }, []);

  const sendMessage = useCallback(async (message: string) => {
    if (!websocketRef.current || websocketRef.current.readyState !== WebSocket.OPEN) {
      updateState({ error: 'Not connected. Please start the conversation first.' });
      return;
    }

    try {
      const textMessage = {
        user_message: message
      };
      
      websocketRef.current.send(JSON.stringify(textMessage));
      updateState({ transcript: message });
      console.log('Text message sent:', message);
    } catch (error) {
      console.error('Failed to send message:', error);
      updateState({ error: 'Failed to send message. Please try again.' });
    }
  }, []);

  return {
    ...state,
    startConversation,
    endConversation,
    sendMessage
  };
};
