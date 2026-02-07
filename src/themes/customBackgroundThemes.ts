/**
 * Custom Background Themes Utilities
 * Client-side utilities for fetching and caching custom background themes
 */

export interface SectionBackgrounds {
  fullscreen?: string;
  kutipan?: string;
  welcome?: string;
  timeline?: string;
  event?: string;
  gift?: string;
  gallery?: string;
  rsvp?: string;
  guestbook?: string;
  thankyou?: string;
  footer?: string;
}

export interface CustomBackgroundTheme {
  id: string;
  name: string;
  description: string;
  backgrounds: SectionBackgrounds;
}

// Client-side cache with 5-minute TTL
let customBackgroundThemesCache: CustomBackgroundTheme[] | null = null;
let cacheTimestamp = 0;
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

/**
 * Fetch all custom background themes from the API
 * @param forceRefresh - Force refresh from server (bypass cache)
 * @param includeBackgrounds - Include background image data (default: false for performance)
 * @returns Array of custom background themes
 */
export async function fetchCustomBackgroundThemes(
  forceRefresh = false,
  includeBackgrounds = false
): Promise<CustomBackgroundTheme[]> {
  const now = Date.now();

  // Return cached data if still valid
  if (!forceRefresh && customBackgroundThemesCache && now - cacheTimestamp < CACHE_DURATION) {
    return customBackgroundThemesCache;
  }

  try {
    const url = `/api/custom-background-themes${includeBackgrounds ? '?includeBackgrounds=true' : ''}`;
    const response = await fetch(url);

    if (!response.ok) {
      console.warn('Failed to fetch custom background themes, status:', response.status);
      return customBackgroundThemesCache || [];
    }

    const data = await response.json();

    if (data.success) {
      const themes: CustomBackgroundTheme[] = data.themes.map((t: any) => ({
        id: t.themeId,
        name: t.themeName,
        description: t.description || 'Custom background theme',
        backgrounds: t.backgrounds || {},
      }));

      customBackgroundThemesCache = themes;
      cacheTimestamp = now;
      return themes;
    }
  } catch (error) {
    console.warn('Error fetching custom background themes:', error);
    // Return cached data if available, otherwise empty array
    return customBackgroundThemesCache || [];
  }

  return customBackgroundThemesCache || [];
}

/**
 * Get a specific custom background theme by ID
 * @param themeId - The theme ID to fetch
 * @returns The custom background theme or null if not found
 */
export async function getCustomBackgroundTheme(themeId: string): Promise<CustomBackgroundTheme | null> {
  // First try to find in cache
  const themes = await fetchCustomBackgroundThemes(false, true); // Include backgrounds when fetching all
  const cachedTheme = themes.find(t => t.id === themeId);

  if (cachedTheme && cachedTheme.backgrounds && Object.keys(cachedTheme.backgrounds).length > 0) {
    return cachedTheme;
  }

  // If not in cache or no backgrounds, fetch directly from API
  try {
    const response = await fetch(`/api/custom-background-themes?themeId=${themeId}`);

    if (!response.ok) {
      return null;
    }

    const data = await response.json();

    if (data.success && data.theme) {
      return {
        id: data.theme.themeId,
        name: data.theme.themeName,
        description: data.theme.description || 'Custom background theme',
        backgrounds: data.theme.backgrounds || {},
      };
    }
  } catch (error) {
    console.warn(`Error fetching custom background theme ${themeId}:`, error);
  }

  return null;
}

/**
 * Check if a theme ID belongs to a custom background theme
 * @param themeId - The theme ID to check
 * @returns True if it's a custom background theme
 */
export async function isCustomBackgroundTheme(themeId: string): Promise<boolean> {
  const themes = await fetchCustomBackgroundThemes();
  return themes.some(t => t.id === themeId);
}

/**
 * Clear the custom background themes cache
 */
export function clearCustomBackgroundThemesCache(): void {
  customBackgroundThemesCache = null;
  cacheTimestamp = 0;
}

/**
 * Convert custom background theme format to built-in image format
 * Used for compatibility with existing theme system
 */
export function convertBackgroundsToImages(backgrounds: SectionBackgrounds): any {
  return {
    hero: backgrounds.fullscreen || '/images/Wedding1.png',
    background: backgrounds.timeline || '/images/Wedding1.png',
    gallery: [],
    couple: {
      bride: backgrounds.welcome || '/images/Wedding1.png',
      groom: backgrounds.welcome || '/images/Wedding1.png',
    },
  };
}
