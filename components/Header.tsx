
import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="text-center my-8">
      <h1 className="text-4xl sm:text-5xl font-bold text-cyan-400 tracking-wider" style={{ textShadow: '0 0 8px rgba(0, 255, 255, 0.5)' }}>
        Pixel Art Generator
      </h1>
      <p className="text-gray-400 mt-2">Turn your ideas into retro art with AI</p>
    </header>
  );
};

export default Header;
