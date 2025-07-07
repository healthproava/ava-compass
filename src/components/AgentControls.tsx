import React from 'react';

interface AgentControlsProps {
    isConnected: boolean;
    isListening: boolean;
    isSpeaking: boolean;
    startConversation: () => void;
    endConversation: () => void;
}

export const AgentControls: React.FC<AgentControlsProps> = ({ 
    isConnected, 
    isListening, 
    isSpeaking, 
    startConversation, 
    endConversation 
}) => {
    return (
        <div className="space-y-4">
            <div className="flex justify-center gap-4">
                <button
                    onClick={startConversation}
                    disabled={isConnected}
                    className="px-6 py-2 bg-green-600 text-white font-semibold rounded-lg shadow-md hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
                >
                    Start Conversation
                </button>
                <button
                    onClick={endConversation}
                    disabled={!isConnected}
                    className="px-6 py-2 bg-red-600 text-white font-semibold rounded-lg shadow-md hover:bg-red-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
                >
                    End Conversation
                </button>
            </div>
            <div className="flex justify-around p-3 bg-gray-100 rounded-lg text-center text-sm">
                <div>
                    <p className="font-semibold">Status</p>
                    <p className={isConnected ? 'text-green-500' : 'text-red-500'}>
                        {isConnected ? 'Connected' : 'Disconnected'}
                    </p>
                </div>
                <div>
                    <p className="font-semibold">Listening</p>
                    <p className="text-gray-600">{isListening ? 'Yes' : 'No'}</p>
                </div>
                <div>
                    <p className="font-semibold">Speaking</p>
                    <p className="text-gray-600">{isSpeaking ? 'Yes' : 'No'}</p>
                </div>
            </div>
        </div>
    );
};
