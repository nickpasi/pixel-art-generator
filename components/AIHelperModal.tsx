import React, { useState, useCallback, useEffect } from 'react';
import { getPromptSuggestions } from '../services/geminiService';

interface AIHelperModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectSuggestion: (suggestion: string) => void;
  initialPrompt: string;
}

const AIHelperModal: React.FC<AIHelperModalProps> = ({ isOpen, onClose, onSelectSuggestion, initialPrompt }) => {
  const [idea, setIdea] = useState('');
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    if (isOpen) {
      // Prefill with current prompt if it's not a placeholder
      const isSurprisePrompt = SURPRISE_ME_PROMPTS.includes(initialPrompt);
      if (initialPrompt && !isSurprisePrompt) {
        setIdea(initialPrompt);
      }
    } else {
       // Reset state when modal is closed
       setIdea('');
       setSuggestions([]);
       setError(null);
       setIsLoading(false);
    }
  }, [isOpen, initialPrompt]);


  const handleGetSuggestions = useCallback(async () => {
    if (!idea.trim()) {
      setError("Please enter an idea.");
      return;
    }
    setIsLoading(true);
    setError(null);
    setSuggestions([]);
    try {
      const result = await getPromptSuggestions(idea);
      setSuggestions(result);
    } catch (e: any) {
      setError(e.message || "Failed to get suggestions.");
    } finally {
      setIsLoading(false);
    }
  }, [idea]);

  const handleSelect = (suggestion: string) => {
    onSelectSuggestion(suggestion);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <div
        className="bg-gray-800 border-2 border-cyan-500 rounded-lg shadow-2xl p-6 w-full max-w-lg relative font-mono text-white flex flex-col gap-4"
        onClick={(e) => e.stopPropagation()}
        style={{ textShadow: '0 0 8px rgba(0, 255, 255, 0.3)' }}
      >
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-400 hover:text-white transition-colors"
          aria-label="Close modal"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        <h2 className="text-2xl font-bold text-cyan-400 text-center">AI Prompt Helper</h2>
        <p className="text-center text-gray-400 text-sm -mt-2">Enter a simple idea, and the AI will create detailed prompts for you.</p>

        <div className="flex items-center space-x-2">
          <input
            type="text"
            value={idea}
            onChange={(e) => setIdea(e.target.value)}
            onKeyDown={(e) => { if(e.key === 'Enter' && !e.nativeEvent.isComposing) { e.preventDefault(); handleGetSuggestions();} }}
            placeholder="e.g., dragon, space ship, haunted house"
            className="flex-grow p-3 bg-gray-900 border border-gray-600 rounded-md focus:ring-2 focus:ring-cyan-500 focus:outline-none transition duration-200 text-gray-200 placeholder-gray-500"
            disabled={isLoading}
          />
          <button
            onClick={handleGetSuggestions}
            disabled={isLoading || !idea.trim()}
            className="bg-cyan-500 hover:bg-cyan-600 disabled:bg-gray-600 text-white font-bold py-3 px-4 rounded-md transition duration-200 flex-shrink-0"
          >
            {isLoading ? '...' : 'Get Ideas'}
          </button>
        </div>

        {error && <div className="text-red-400 bg-red-900/50 border border-red-700 p-3 rounded-md text-sm">{error}</div>}

        <div className="flex flex-col gap-3 h-48 overflow-y-auto pr-2">
          {isLoading && (
              <div className="flex items-center justify-center h-full text-gray-500">Generating creative prompts...</div>
          )}
          {suggestions.map((suggestion, index) => (
            <button
              key={index}
              onClick={() => handleSelect(suggestion)}
              className="text-left p-3 bg-gray-900 hover:bg-gray-700 border border-gray-700 rounded-md transition-colors duration-200 cursor-pointer w-full"
            >
              <p className="text-gray-300">{suggestion}</p>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

// This is needed for the check inside the component.
const SURPRISE_ME_PROMPTS = [
  'A tiny house on the back of a giant, mossy snail.',
  'A cyberpunk street market at night, bustling with androids.',
  'An enchanted forest with glowing mushrooms and a hidden waterfall.',
  'A lone astronaut discovering an ancient alien artifact on a red planet.',
  'A retro-futuristic flying car dealership.',
  'A cozy witch\'s cottage filled with potions and a sleeping cat.',
  'An underwater city with bioluminescent buildings.',
  'A steampunk airship soaring through a cloudy sky.',
  'A peaceful Japanese garden with a koi pond and cherry blossoms.',
  'A knight facing a giant, pixelated dragon in a volcano lair.',
  'A vending machine dispensing magical potions in a subway station.',
  'A library inside a giant, ancient tree.',
  'A robot tending to a rooftop garden in a futuristic city.',
  'A ghost ship sailing on a sea of stars.',
  'A farmer\'s market on a floating island.',
];

export default AIHelperModal;
