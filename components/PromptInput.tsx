import React from 'react';
import ImageUploader from './ImageUploader';

interface PromptInputProps {
  prompt: string;
  setPrompt: (prompt: string) => void;
  negativePrompt: string;
  setNegativePrompt: (prompt: string) => void;
  style: string;
  setStyle: (style: string) => void;
  styles: string[];
  onGenerate: () => void;
  isLoading: boolean;
  uploadedImage: { data: string; mimeType: string } | null;
  onImageUpload: (file: File) => void;
  onImageRemove: () => void;
  onSurpriseMe: () => void;
  onOpenAIHelper: () => void;
}

const PromptInput: React.FC<PromptInputProps> = ({ 
  prompt, setPrompt, 
  negativePrompt, setNegativePrompt, 
  style, setStyle, styles, 
  onGenerate, isLoading,
  uploadedImage, onImageUpload, onImageRemove,
  onSurpriseMe, onOpenAIHelper
}) => {
  const handleKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === 'Enter' && !event.shiftKey && !event.nativeEvent.isComposing) {
      event.preventDefault();
      onGenerate();
    }
  };

  return (
    <div className="bg-gray-800 p-4 rounded-lg border border-gray-700 shadow-lg flex flex-col gap-6">
      <ImageUploader 
        uploadedImage={uploadedImage}
        onImageUpload={onImageUpload}
        onImageRemove={onImageRemove}
        isLoading={isLoading}
      />
      
      <div>
        <label htmlFor="style-select" className="block text-sm font-medium text-gray-300 mb-2">
          Art Style
        </label>
        <select
          id="style-select"
          value={style}
          onChange={(e) => setStyle(e.target.value)}
          disabled={isLoading}
          className="w-full p-3 bg-gray-900 border border-gray-600 rounded-md focus:ring-2 focus:ring-cyan-500 focus:outline-none transition duration-200 text-gray-200"
        >
          {styles.map(s => <option key={s} value={s}>{s.replace('Pixel art, ', '').replace(' style', '').replace('pixel art', '')}</option>)}
        </select>
      </div>

      <div>
        <div className="flex justify-between items-center mb-2">
            <label htmlFor="prompt-input" className="block text-sm font-medium text-gray-300">
              {uploadedImage ? "Modifications (e.g., 'make it night time')" : "Prompt"}
            </label>
             <div className="flex items-center gap-4">
                <button 
                    onClick={onOpenAIHelper}
                    disabled={isLoading}
                    className="text-xs text-cyan-400 hover:text-cyan-300 font-semibold transition-colors duration-200 flex items-center gap-1 disabled:text-gray-500 disabled:cursor-not-allowed"
                    title="Get creative prompt ideas from AI"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                    </svg>
                    AI Helper
                </button>
                {!uploadedImage && (
                    <button 
                        onClick={onSurpriseMe}
                        disabled={isLoading}
                        className="text-xs text-cyan-400 hover:text-cyan-300 font-semibold transition-colors duration-200 flex items-center gap-1 disabled:text-gray-500 disabled:cursor-not-allowed"
                        title="Get a random creative prompt"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M5 2a1 1 0 011 1v1h1.146a1 1 0 01.97.73L8.385 6H11.615l.269-1.27A1 1 0 0112.854 4H14V3a1 1 0 112 0v1h1a1 1 0 110 2h-1v1.146a1 1 0 01-.73.97l-1.27.268v2.23l1.27.268a1 1 0 01.73.97V14h1a1 1 0 110 2h-1v1a1 1 0 11-2 0v-1h-1.146a1 1 0 01-.97-.73L11.615 14H8.385l-.269 1.27a1 1 0 01-.97.73H6v1a1 1 0 11-2 0v-1H3a1 1 0 110-2h1v-1.146a1 1 0 01.73-.97l1.27-.268V8.385l-1.27-.268A1 1 0 013 7.146V6H2a1 1 0 110-2h1V3a1 1 0 011-1zm4.885 6.115a.5.5 0 00-.433.25l-1.5 2.5a.5.5 0 10.866.5L10 9.732V10a.5.5 0 001 0v-.268l1.067 1.778a.5.5 0 10.866-.5l-1.5-2.5a.5.5 0 00-.433-.25H9.885z" clipRule="evenodd" />
                        </svg>
                        Surprise Me
                    </button>
                )}
            </div>
        </div>
        <textarea
          id="prompt-input"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={uploadedImage ? "Describe changes for the AI..." : "e.g., A futuristic city skyline at sunset"}
          className="w-full h-24 p-3 bg-gray-900 border border-gray-600 rounded-md focus:ring-2 focus:ring-cyan-500 focus:outline-none transition duration-200 resize-none text-gray-200 placeholder-gray-500"
          disabled={isLoading}
        />
      </div>

       <div>
        <label htmlFor="negative-prompt-input" className="block text-sm font-medium text-gray-300 mb-2">
          Negative Prompt (what to avoid)
        </label>
        <textarea
          id="negative-prompt-input"
          value={negativePrompt}
          onChange={(e) => setNegativePrompt(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="e.g., text, watermark, blurry, 3d"
          className="w-full h-20 p-3 bg-gray-900 border border-gray-600 rounded-md focus:ring-2 focus:ring-cyan-500 focus:outline-none transition duration-200 resize-none text-gray-200 placeholder-gray-500"
          disabled={isLoading}
        />
      </div>

      <button
        onClick={onGenerate}
        disabled={isLoading || (!prompt.trim() && !uploadedImage)}
        className="w-full bg-cyan-500 hover:bg-cyan-600 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-bold py-3 px-4 rounded-md transition duration-300 ease-in-out flex items-center justify-center text-lg"
      >
        {isLoading ? (
          <>
            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Generating...
          </>
        ) : (
          'Generate Pixel Art'
        )}
      </button>
    </div>
  );
};

export default PromptInput;