/**
 * Custom Color Themes Utilities
 * Client-side utilities for fetching and caching custom color themes
 */

export interface ThemeColors {
  primary: string;
  primarylight: string;
  darkprimary: string;
  textprimary: string;
  gold: string;
  lightblue: string;
  secondary: string;
  accent: string;
}

export interface CustomColorTheme {
  id: string;
  name: string;
  description: string;
  colors: ThemeColors;
  customStyles: {
    borderRadius: string;
    boxShadow: string;
    gradient: string;
  };
}

// Client-side cache with 5-minute TTL
let customColorThemesCache: CustomColorTheme[] | null = null;
let cacheTimestamp = 0;
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

/**
 * Fetch all custom color themes from the API
 * @param forceRefresh - Force refresh from server (bypass cache)
 * @returns Array of custom color themes
 */
export async function fetchCustomColorThemes(forceRefresh = false): Promise<CustomColorTheme[]> {
  const now = Date.now();

  // Return cached data if still valid
  if (!forceRefresh && customColorThemesCache && now - cacheTimestamp < CACHE_DURATION) {
    return customColorThemesCache;
  }

  try {
    const response = await fetch('/api/custom-color-themes');

    if (!response.ok) {
      console.warn('Failed to fetch custom color themes, status:', response.status);
      return customColorThemesCache || [];
    }

    const data = await response.json();

    if (data.success) {
      const themes: CustomColorTheme[] = data.themes.map((t: any) => ({
        id: t.themeId,
        name: t.themeName,
        description: t.description || 'Custom color theme',
        colors: t.colors,
        customStyles: t.customStyles || {
          borderRadius: '1rem',
          boxShadow: '',
          gradient: ''
        },
      }));

      customColorThemesCache = themes;
      cacheTimestamp = now;
      return themes;
    }
  } catch (error) {
    console.warn('Error fetching custom color themes:', error);
    // Return cached data if available, otherwise empty array
    return customColorThemesCache || [];
  }

  return customColorThemesCache || [];
}

/**
 * Get a specific custom color theme by ID
 * @param themeId - The theme ID to fetch
 * @returns The custom color theme or null if not found
 */
export async function getCustomColorTheme(themeId: string): Promise<CustomColorTheme | null> {
  // First try to find in cache
  const themes = await fetchCustomColorThemes();
  const cachedTheme = themes.find(t => t.id === themeId);

  if (cachedTheme) {
    return cachedTheme;
  }

  // If not in cache, fetch directly from API
  try {
    const response = await fetch(`/api/custom-color-themes?themeId=${themeId}`);

    if (!response.ok) {
      return null;
    }

    const data = await response.json();

    if (data.success && data.theme) {
      return {
        id: data.theme.themeId,
        name: data.theme.themeName,
        description: data.theme.description || 'Custom color theme',
        colors: data.theme.colors,
        customStyles: data.theme.customStyles || {
          borderRadius: '1rem',
          boxShadow: '',
          gradient: ''
        },
      };
    }
  } catch (error) {
    console.warn(`Error fetching custom color theme ${themeId}:`, error);
  }

  return null;
}

/**
 * Check if a theme ID belongs to a custom color theme
 * @param themeId - The theme ID to check
 * @returns True if it's a custom color theme
 */
export async function isCustomColorTheme(themeId: string): Promise<boolean> {
  const themes = await fetchCustomColorThemes();
  return themes.some(t => t.id === themeId);
}

/**
 * Clear the custom color themes cache
 */
export function clearCustomColorThemesCache(): void {
  customColorThemesCache = null;
  cacheTimestamp = 0;
}
