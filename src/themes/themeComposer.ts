import { ThemeConfig } from '@/types/theme';
import { getColorTheme } from './colorThemes';
import { getBackgroundTheme } from './backgroundThemes';

export interface ComposedThemeConfig {
  colorThemeId: string;
  backgroundThemeId: string;
}

export const composeTheme = (colorThemeId: string, backgroundThemeId: string): ThemeConfig => {
  const colorTheme = getColorTheme(colorThemeId);
  const backgroundTheme = getBackgroundTheme(backgroundThemeId);

  return {
    id: `${colorThemeId}-${backgroundThemeId}`,
    name: `${colorTheme.name} + ${backgroundTheme.name}`,
    description: `${colorTheme.description} dengan ${backgroundTheme.description}`,
    colors: colorTheme.colors,
    images: backgroundTheme.images,
    typography: {
      primaryFont: 'Poppins, sans-serif',
      secondaryFont: 'Merienda, cursive',
      headingFont: 'Lavishly Yours, cursive',
      scriptFont: 'Dancing Script, cursive',
    },
    customStyles: colorTheme.customStyles,
  };
};

/**
 * Async version of composeTheme that supports custom color and background themes
 * Supports all 4 combinations:
 * 1. Built-in color + built-in background
 * 2. Custom color + built-in background
 * 3. Built-in color + custom background
 * 4. Custom color + custom background
 */
export async function composeThemeAsync(
  colorThemeId: string,
  backgroundThemeId: string
): Promise<ThemeConfig> {
  try {
    // Import custom theme utilities
    const { getCustomColorTheme } = await import('./customColorThemes');
    const { getCustomBackgroundTheme, convertBackgroundsToImages } = await import('./customBackgroundThemes');

    // 1. Find color theme (built-in OR custom color theme)
    const builtInColorTheme = getColorTheme(colorThemeId);
    let customColorTheme = null;

    // Only fetch custom if not found in built-in
    if (!builtInColorTheme || builtInColorTheme.id === 'original') {
      customColorTheme = await getCustomColorTheme(colorThemeId);
    }

    const finalColorTheme = customColorTheme || builtInColorTheme;

    if (!finalColorTheme) {
      console.warn(`Color theme not found: ${colorThemeId}, falling back to original`);
      return composeTheme('original', backgroundThemeId);
    }

    // 2. Find background theme (built-in OR custom background theme)
    const builtInBgTheme = getBackgroundTheme(backgroundThemeId);
    let customBgTheme = null;

    // Only fetch custom if not found in built-in
    if (!builtInBgTheme || builtInBgTheme.id === 'original') {
      customBgTheme = await getCustomBackgroundTheme(backgroundThemeId);
    }

    const finalBgTheme = customBgTheme || builtInBgTheme;

    if (!finalBgTheme) {
      console.warn(`Background theme not found: ${backgroundThemeId}, falling back to original`);
      return composeTheme(colorThemeId, 'original');
    }

    // 3. Compose theme
    const images = customBgTheme
      ? convertBackgroundsToImages(customBgTheme.backgrounds)
      : finalBgTheme.images;

    return {
      id: `${colorThemeId}-${backgroundThemeId}`,
      name: `${finalColorTheme.name}${customBgTheme ? ' + ' + customBgTheme.name : finalBgTheme ? ' + ' + finalBgTheme.name : ''}`,
      description: `${finalColorTheme.description} dengan ${customBgTheme ? customBgTheme.description : finalBgTheme ? finalBgTheme.description : 'background default'}`,
      colors: finalColorTheme.colors,
      images: images,
      typography: {
        primaryFont: 'Poppins, sans-serif',
        secondaryFont: 'Merienda, cursive',
        headingFont: 'Lavishly Yours, cursive',
        scriptFont: 'Dancing Script, cursive',
      },
      customStyles: finalColorTheme.customStyles,
    };
  } catch (error) {
    console.error('Error loading custom themes:', error);
    // Fall back to regular compose on error
    return composeTheme(colorThemeId, backgroundThemeId);
  }
}

export const getComposedTheme = (config: ComposedThemeConfig): ThemeConfig => {
  return composeTheme(config.colorThemeId, config.backgroundThemeId);
};

// Untuk backward compatibility dengan theme lama
export const getLegacyTheme = (themeId: string): ThemeConfig => {
  // Map legacy theme IDs ke composed themes
  const legacyMapping: Record<string, ComposedThemeConfig> = {
    original: { colorThemeId: 'original', backgroundThemeId: 'original' },
    city: { colorThemeId: 'city', backgroundThemeId: 'city' },
    romantic: { colorThemeId: 'romantic', backgroundThemeId: 'original' },
    sunset: { colorThemeId: 'sunset', backgroundThemeId: 'original' },
    classic: { colorThemeId: 'classic', backgroundThemeId: 'original' },
    coral: { colorThemeId: 'coral', backgroundThemeId: 'original' },
    emerald: { colorThemeId: 'emerald', backgroundThemeId: 'original' },
    lavender: { colorThemeId: 'lavender', backgroundThemeId: 'original' },
    modern: { colorThemeId: 'modern', backgroundThemeId: 'original' },
    sapphire: { colorThemeId: 'sapphire', backgroundThemeId: 'original' },
    vintage: { colorThemeId: 'vintage', backgroundThemeId: 'original' },
    // Flora background combinations
    'romantic-flora': { colorThemeId: 'romantic', backgroundThemeId: 'flora' },
    'emerald-flora': { colorThemeId: 'emerald', backgroundThemeId: 'flora' },
    'lavender-flora': { colorThemeId: 'lavender', backgroundThemeId: 'flora' },
  };

  const config = legacyMapping[themeId] || { colorThemeId: 'original', backgroundThemeId: 'original' };
  return getComposedTheme(config);
};