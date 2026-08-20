import React, { useState, useEffect, useRef } from 'react';
import { Mic, MicOff, Volume2, VolumeX, Loader2 } from 'lucide-react';

interface VoiceAssistantProps {
  onCommand?: (command: string) => void;
}

const VoiceAssistant: React.FC<VoiceAssistantProps> = ({ onCommand }) => {
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [isSupported, setIsSupported] = useState(false);
  const recognitionRef = useRef<any>(null);
  const synthesisRef = useRef<SpeechSynthesis | null>(null);

  useEffect(() => {
    // Check if speech recognition is supported
    const SpeechRecognition = window.SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      setIsSupported(true);
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = true;
      recognitionRef.current.lang = 'en-US';

      recognitionRef.current.onstart = () => {
        setIsListening(true);
        setTranscript('');
      };

      recognitionRef.current.onresult = (event: any) => {
        let finalTranscript = '';
        for (let i = event.resultIndex; i < event.results.length; i++) {
          if (event.results[i].isFinal) {
            finalTranscript += event.results[i][0].transcript;
          }
        }
        if (finalTranscript) {
          setTranscript(finalTranscript);
          handleCommand(finalTranscript);
        }
      };

      recognitionRef.current.onerror = (event: any) => {
        console.error('Speech recognition error:', event.error);
        setIsListening(false);
      };

      recognitionRef.current.onend = () => {
        setIsListening(false);
      };
    }

    // Initialize speech synthesis
    synthesisRef.current = window.speechSynthesis;
  }, []);

  const handleCommand = (command: string) => {
    const lowerCommand = command.toLowerCase();
    
    // Voice commands for navigation
    if (lowerCommand.includes('go to') || lowerCommand.includes('navigate to')) {
      if (lowerCommand.includes('home') || lowerCommand.includes('main')) {
        speak('Navigating to home page');
        window.location.href = '/';
      } else if (lowerCommand.includes('map')) {
        speak('Opening the map page');
        window.location.href = '/map';
      } else if (lowerCommand.includes('trip') || lowerCommand.includes('planner')) {
        speak('Opening trip planner');
        window.location.href = '/trip-planner';
      } else if (lowerCommand.includes('insights')) {
        speak('Opening market insights');
        window.location.href = '/insights';
      }
    }

    // Enhanced Voice commands for EV station interactions
    else if (lowerCommand.includes('find') || lowerCommand.includes('search') || lowerCommand.includes('show')) {
      if (lowerCommand.includes('charging station') || lowerCommand.includes('ev station') || lowerCommand.includes('station')) {
        speak('Searching for charging stations near you');
        onCommand?.('search_stations');
        
        // Navigate to map if not already there
        if (window.location.pathname !== '/map') {
          setTimeout(() => {
            window.location.href = '/map';
          }, 1000);
        }
      }
    }

    // Specific location-based station search
    else if (lowerCommand.includes('near') || lowerCommand.includes('around') || lowerCommand.includes('in')) {
      if (lowerCommand.includes('station') || lowerCommand.includes('charging')) {
        // Extract location from command
        const locationMatch = lowerCommand.match(/(?:near|around|in)\s+([a-zA-Z\s]+)/);
        if (locationMatch) {
          const location = locationMatch[1].trim();
          speak(`Searching for charging stations near ${location}`);
          onCommand?.(`search_stations_location:${location}`);
          
          // Navigate to map
          if (window.location.pathname !== '/map') {
            setTimeout(() => {
              window.location.href = '/map';
            }, 1000);
          }
        }
      }
    }

    // Filter commands for stations
    else if (lowerCommand.includes('filter') || lowerCommand.includes('show only')) {
      if (lowerCommand.includes('available') || lowerCommand.includes('free')) {
        speak('Filtering to show only available charging stations');
        onCommand?.('filter_available');
      } else if (lowerCommand.includes('fast') || lowerCommand.includes('rapid')) {
        speak('Filtering to show only fast charging stations');
        onCommand?.('filter_fast');
      } else if (lowerCommand.includes('renewable') || lowerCommand.includes('solar')) {
        speak('Filtering to show only renewable energy stations');
        onCommand?.('filter_renewable');
      } else if (lowerCommand.includes('cheap') || lowerCommand.includes('low price')) {
        speak('Filtering to show only low-cost charging stations');
        onCommand?.('filter_cheap');
      }
    }

    // Station information commands
    else if (lowerCommand.includes('price') || lowerCommand.includes('cost')) {
      if (lowerCommand.includes('station') || lowerCommand.includes('charging')) {
        speak('Opening price insights and market analysis');
        window.location.href = '/insights';
      } else {
        speak('Opening price insights and market analysis');
        window.location.href = '/insights';
      }
    }

    // Trip planning with stations
    else if (lowerCommand.includes('plan trip') || lowerCommand.includes('route')) {
      if (lowerCommand.includes('with stations') || lowerCommand.includes('charging stops')) {
        speak('Opening trip planner to help you plan your route with charging stops');
        window.location.href = '/trip-planner';
      } else {
        speak('Opening trip planner to help you plan your route');
        window.location.href = '/trip-planner';
      }
    }

    // Clear filters
    else if (lowerCommand.includes('clear filter') || lowerCommand.includes('show all')) {
      speak('Clearing all filters to show all stations');
      onCommand?.('clear_filters');
    }

    // Station count
    else if (lowerCommand.includes('how many') || lowerCommand.includes('count')) {
      if (lowerCommand.includes('station') || lowerCommand.includes('charging')) {
        speak('Let me check how many charging stations are available');
        onCommand?.('count_stations');
      }
    }

    // Voice commands for dark mode
    else if (lowerCommand.includes('dark mode') || lowerCommand.includes('dark theme')) {
      speak('Toggling dark mode');
      const darkModeToggle = document.querySelector('[aria-label="Toggle dark mode"]') as HTMLButtonElement;
      if (darkModeToggle) {
        darkModeToggle.click();
      }
    }

    // Voice commands for help
    else if (lowerCommand.includes('help') || lowerCommand.includes('what can you do')) {
      speak('I can help you find charging stations, filter by type, check prices, plan trips, and navigate the app. Try saying "find charging stations" or "show fast charging near me"');
    }

    // Default response
    else {
      speak(`I heard: ${command}. Try saying "help" to learn what I can do, or "find charging stations" to search for EV stations.`);
    }
  };

  const speak = (text: string) => {
    if (synthesisRef.current) {
      setIsSpeaking(true);
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);
      synthesisRef.current.speak(utterance);
    }
  };

  const toggleListening = () => {
    if (isListening) {
      recognitionRef.current?.stop();
    } else {
      recognitionRef.current?.start();
    }
  };

  const toggleSpeaking = () => {
    if (isSpeaking) {
      synthesisRef.current?.cancel();
      setIsSpeaking(false);
    } else {
      speak('Voice assistant is ready. Say "help" to learn what I can do.');
    }
  };

  if (!isSupported) {
    return (
      <div className="fixed bottom-4 right-4 z-50">
        <div className="bg-red-500 text-white px-4 py-2 rounded-lg shadow-lg">
          <p className="text-sm">Voice assistant not supported in this browser</p>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {/* Voice Assistant Panel */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 p-4 mb-4 min-w-80">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Voice Assistant
          </h3>
          <div className="flex space-x-2">
            <button
              onClick={toggleSpeaking}
              className={`p-2 rounded-full transition-colors ${
                isSpeaking 
                  ? 'bg-red-500 text-white' 
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}
              title={isSpeaking ? 'Stop speaking' : 'Start speaking'}
            >
              {isSpeaking ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
            </button>
          </div>
        </div>

        {/* Transcript */}
        {transcript && (
          <div className="mb-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <p className="text-sm text-gray-600 dark:text-gray-400">You said:</p>
            <p className="text-sm font-medium text-gray-900 dark:text-white">{transcript}</p>
          </div>
        )}

        {/* Status */}
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-600 dark:text-gray-400">
            {isListening ? 'Listening...' : 'Ready'}
          </span>
          {isListening && <Loader2 className="h-4 w-4 animate-spin text-green-500" />}
        </div>

        {/* Voice Commands Help */}
        <div className="mt-3 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
          <p className="text-xs text-blue-800 dark:text-blue-200 font-medium mb-2">
            Try saying:
          </p>
          <ul className="text-xs text-blue-700 dark:text-blue-300 space-y-1">
            <li>• "Find charging stations"</li>
            <li>• "Show stations near Hyderabad"</li>
            <li>• "Filter fast charging"</li>
            <li>• "Show available stations"</li>
            <li>• "Plan trip with charging stops"</li>
            <li>• "Check station prices"</li>
            <li>• "Clear filters"</li>
            <li>• "How many stations"</li>
          </ul>
        </div>
      </div>

      {/* Voice Button */}
      <button
        onClick={toggleListening}
        className={`p-4 rounded-full shadow-lg transition-all duration-200 ${
          isListening
            ? 'bg-red-500 text-white animate-pulse'
            : 'bg-green-500 text-white hover:bg-green-600'
        }`}
        title={isListening ? 'Stop listening' : 'Start voice assistant'}
      >
        {isListening ? <MicOff className="h-6 w-6" /> : <Mic className="h-6 w-6" />}
      </button>
    </div>
  );
};

export default VoiceAssistant; 