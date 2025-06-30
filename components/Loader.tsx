
import React from 'react';

interface LoaderProps {
  message?: string;
}

const Loader: React.FC<LoaderProps> = ({ message }) => {
  return (
    <div className="flex flex-col items-center justify-center space-y-4">
        <div className="flex items-center justify-center space-x-2">
            <div className="w-4 h-4 bg-cyan-400 rounded-full animate-bounce" style={{animationDelay: '0s'}}></div>
            <div className="w-4 h-4 bg-cyan-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
            <div className="w-4 h-4 bg-cyan-400 rounded-full animate-bounce" style={{animationDelay: '0.4s'}}></div>
        </div>
        <p className="text-gray-400 text-sm">{message || 'Generating your masterpiece...'}</p>
    </div>
  );
};

export default Loader;
