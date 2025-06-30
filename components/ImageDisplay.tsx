
import React from 'react';
import Loader from './Loader';
import ImageComparator from './ImageComparator';

interface ImageDisplayProps {
  imageUrl: string | null;
  referenceImageUrl?: string | null;
  isLoading: boolean;
  prompt: string;
  style: string;
  onDownload: () => void;
  onShare: () => void;
  loadingMessage?: string;
}

const Placeholder = () => (
    <div className="text-center text-gray-500">
        <svg width="64" height="64" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className="mx-auto h-16 w-16 text-gray-600">
            <path d="M8 0H56V8H64V56H56V64H8V56H0V8H8V0ZM56 8V56H8V8H56Z" fill="currentColor" />
            <path fillRule="evenodd" clipRule="evenodd" d="M8 8H56V24H48V16H40V24H32V16H24V32H16V24H8V8ZM8 32H16V40H8V32ZM24 40H16V48H24V40ZM24 48H32V56H24V48ZM40 56H48V48H40V56ZM48 48H56V40H48V48ZM56 32V24H48V32H56ZM40 32H48V40H40V32ZM32 40H40V48H32V40ZM32 32H24V40H32V32Z" fill="#374151" />
            <path d="M40 24H48V16H40V24Z" fill="#38bdf8" />
        </svg>
        <p className="mt-4 text-sm">Your generated pixel art will appear here.</p>
    </div>
);

const ActionButton: React.FC<{ onClick: () => void; ariaLabel: string; title: string; children: React.ReactNode }> = ({ onClick, ariaLabel, title, children }) => (
    <button
        onClick={onClick}
        className="bg-gray-900 bg-opacity-60 hover:bg-opacity-80 text-white p-2 rounded-full transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-cyan-500"
        aria-label={ariaLabel}
        title={title}
    >
        {children}
    </button>
);


const ImageDisplay: React.FC<ImageDisplayProps> = ({ imageUrl, referenceImageUrl, isLoading, prompt, style, onDownload, onShare, loadingMessage }) => {
  return (
    <div className="mt-8 lg:mt-0 w-full aspect-square bg-gray-800 rounded-lg border-2 border-dashed border-gray-700 flex items-center justify-center p-2 relative">
      {isLoading && <Loader message={loadingMessage} />}
      {!isLoading && !imageUrl && <Placeholder />}
      {!isLoading && imageUrl && (
        <div className="w-full h-full relative group">
          {referenceImageUrl ? (
            <ImageComparator beforeImageUrl={referenceImageUrl} afterImageUrl={imageUrl} />
          ) : (
             <img
              src={imageUrl}
              alt={`Pixel art of: ${prompt} in style: ${style}`}
              className="w-full h-full object-contain pixelated rounded-md shadow-lg"
              style={{ viewTransitionName: 'generated-image' }}
            />
          )}
           <div className="absolute top-3 right-3 z-20 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
             <ActionButton onClick={onShare} ariaLabel="Share image" title="Share Image">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M15 8a3 3 0 10-2.977-2.63l-4.94 2.47a3 3 0 100 4.319l4.94 2.47a3 3 0 10.895-1.789l-4.94-2.47a3.027 3.027 0 000-.74l4.94-2.47C13.456 7.68 14.19 8 15 8z" />
                </svg>
             </ActionButton>
             <ActionButton onClick={onDownload} ariaLabel="Download image" title="Download Image">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
             </ActionButton>
           </div>
        </div>
      )}
    </div>
  );
};

export default ImageDisplay;
