
import React, { useState } from 'react';

interface ImageComparatorProps {
  beforeImageUrl: string;
  afterImageUrl: string;
}

const ImageComparator: React.FC<ImageComparatorProps> = ({ beforeImageUrl, afterImageUrl }) => {
  const [sliderPosition, setSliderPosition] = useState(50);

  const handleSliderChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSliderPosition(Number(event.target.value));
  };

  return (
    <div className="relative w-full h-full select-none group/comparator rounded-md overflow-hidden">
      {/* Before Image */}
      <img
        src={beforeImageUrl}
        alt="Original reference image"
        className="w-full h-full object-contain absolute inset-0"
        draggable={false}
      />
      
      {/* After Image (Clipped) */}
      <div
        className="absolute inset-0 w-full h-full"
        style={{ clipPath: `inset(0 ${100 - sliderPosition}% 0 0)` }}
      >
        <img
          src={afterImageUrl}
          alt="Generated pixel art"
          className="w-full h-full object-contain pixelated absolute inset-0"
          draggable={false}
        />
      </div>

      {/* Slider Input */}
      <input
        type="range"
        min="0"
        max="100"
        value={sliderPosition}
        onChange={handleSliderChange}
        className="absolute inset-0 w-full h-full cursor-ew-resize opacity-0 z-10"
        aria-label="Drag to compare original and generated image"
      />

      {/* Divider */}
      <div
        className="absolute top-0 bottom-0 w-1 bg-cyan-400 pointer-events-none transition-opacity duration-300 opacity-0 group-hover/comparator:opacity-100"
        style={{ left: `${sliderPosition}%`, transform: 'translateX(-50%)' }}
      >
        <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 bg-gray-900 border-2 border-cyan-400 text-white rounded-full h-10 w-10 flex items-center justify-center pointer-events-none">
           <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
             <path strokeLinecap="round" strokeLinejoin="round" d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
           </svg>
        </div>
      </div>
       
      <div className="absolute top-2 left-2 bg-black/60 text-white text-xs px-2 py-1 rounded pointer-events-none">Original</div>
      <div 
        className="absolute top-2 right-2 bg-black/60 text-white text-xs px-2 py-1 rounded pointer-events-none transition-opacity duration-200"
        style={{ opacity: sliderPosition > 85 ? 1 : 0 }}
       >
        Pixel Art
       </div>
    </div>
  );
};

export default ImageComparator;
