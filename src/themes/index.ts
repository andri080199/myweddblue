import { ThemeConfig } from '@/types/theme';
import { originalTheme } from './original';
import { classicTheme } from './classic';
import { romanticTheme } from './romantic';
import { modernTheme } from './modern';
import { vintageTheme } from './vintage';
import { emeraldTheme } from './emerald';
import { sunsetTheme } from './sunset';
import { lavenderTheme } from './lavender';
import { coralTheme } from './coral';
import { sapphireTheme } from './sapphire';
import { cityTheme } from './city';

export const themes: Record<string, ThemeConfig> = {
  original: originalTheme,
  classic: classicTheme,
  romantic: romanticTheme,
  modern: modernTheme,
  vintage: vintageTheme,
  emerald: emeraldTheme,
  sunset: sunsetTheme,
  lavender: lavenderTheme,
  coral: coralTheme,
  sapphire: sapphireTheme,
  city: cityTheme,
};

export const getTheme = (themeId: string): ThemeConfig => {
  return themes[themeId] || themes.original;
};

export const getThemeList = (): ThemeConfig[] => {
  return Object.values(themes);
};

export * from './original';
export * from './classic';
export * from './romantic';
export * from './modern';
export * from './vintage';
export * from './emerald';
export * from './sunset';
export * from './lavender';
export * from './coral';
export * from './sapphire';
export * from './city';