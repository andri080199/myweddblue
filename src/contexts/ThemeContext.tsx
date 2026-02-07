'use client';

import React, { createContext, useContext, ReactNode } from 'react';
import { ThemeConfig, CoupleInfo } from '@/types/theme';

interface ThemeContextType {
  theme: ThemeConfig;
  coupleInfo: CoupleInfo;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

interface ThemeProviderProps {
  children: ReactNode;
  theme: ThemeConfig;
  coupleInfo: CoupleInfo;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({
  children,
  theme,
  coupleInfo,
}) => {
  return (
    <ThemeContext.Provider value={{ theme, coupleInfo }}>
      <div
        style={{
          '--color-primary': theme.colors.primary,
          '--color-primarylight': theme.colors.primarylight,
          '--color-darkprimary': theme.colors.darkprimary,
          '--color-textprimary': theme.colors.textprimary,
          '--color-gold': theme.colors.gold,
          '--color-lightblue': theme.colors.lightblue,
          '--color-secondary': theme.colors.secondary || theme.colors.primary,
          '--color-accent': theme.colors.accent || theme.colors.gold,
          '--font-primary': theme.typography.primaryFont,
          '--font-secondary': theme.typography.secondaryFont,
          '--font-heading': theme.typography.headingFont,
          '--font-script': theme.typography.scriptFont,
        } as React.CSSProperties}
      >
        {children}
      </div>
    </ThemeContext.Provider>
  );
};

export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

// Alias untuk konsistensi nama
export const useThemeContext = useTheme;