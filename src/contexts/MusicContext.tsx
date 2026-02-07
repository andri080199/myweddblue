'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';

interface MusicContextType {
  shouldAutoPlay: boolean;
  triggerAutoPlay: () => void;
  resetAutoPlay: () => void;
}

const MusicContext = createContext<MusicContextType | undefined>(undefined);

interface MusicProviderProps {
  children: ReactNode;
}

export const MusicProvider: React.FC<MusicProviderProps> = ({ children }) => {
  const [shouldAutoPlay, setShouldAutoPlay] = useState(false);

  const triggerAutoPlay = () => {
    setShouldAutoPlay(true);
  };

  const resetAutoPlay = () => {
    setShouldAutoPlay(false);
  };

  return (
    <MusicContext.Provider value={{ shouldAutoPlay, triggerAutoPlay, resetAutoPlay }}>
      {children}
    </MusicContext.Provider>
  );
};

export const useMusicContext = () => {
  const context = useContext(MusicContext);
  if (context === undefined) {
    throw new Error('useMusicContext must be used within a MusicProvider');
  }
  return context;
};