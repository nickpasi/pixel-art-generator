
import React, { useState, useCallback } from 'react';

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  shareUrl: string;
  imageUrl: string | null;
}

const ShareModal: React.FC<ShareModalProps> = ({ isOpen, onClose, shareUrl, imageUrl }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(shareUrl).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }, [shareUrl]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <div
        className="bg-gray-800 border-2 border-cyan-500 rounded-lg shadow-2xl p-6 w-full max-w-md relative font-mono text-white flex flex-col gap-4"
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
        <h2 className="text-2xl font-bold text-cyan-400 text-center">Share Your Creation</h2>
        {imageUrl && (
          <div className="aspect-square w-full max-w-[200px] mx-auto bg-gray-900 p-1 rounded-md border border-gray-700">
             <img src={imageUrl} alt="Shared pixel art" className="w-full h-full object-contain pixelated" />
          </div>
        )}
        <p className="text-center text-gray-400 text-sm">Anyone with this link can regenerate your art.</p>
        <div className="flex items-center space-x-2 bg-gray-900 border border-gray-700 rounded-md p-2">
            <input
                type="text"
                value={shareUrl}
                readOnly
                className="bg-transparent text-cyan-300 w-full focus:outline-none text-sm"
            />
            <button
                onClick={handleCopy}
                className="bg-cyan-500 hover:bg-cyan-600 text-white font-bold py-2 px-4 rounded-md transition duration-200 text-sm flex-shrink-0"
            >
                {copied ? 'Copied!' : 'Copy'}
            </button>
        </div>
      </div>
    </div>
  );
};

export default ShareModal;
