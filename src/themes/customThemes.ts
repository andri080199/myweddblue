// Custom theme management utilities

export interface CustomTheme {
  id: string;
  name: string;
  description: string;
  colors: {
    primary: string;
    primarylight: string;
    darkprimary: string;
    textprimary: string;
    gold: string;
    lightblue: string;
    secondary: string;
    accent: string;
  };
  backgrounds: {
    fullscreen?: string;
    kutipan?: string;
    welcome?: string;
    timeline?: string;
    event?: string;
    gift?: string;
    gallery?: string;
    rsvp?: string;
    guestbook?: string;
  };
  customStyles: {
    borderRadius: string;
    boxShadow: string;
    gradient: string;
  };
}

// Cache for custom themes to avoid repeated API calls
let customThemesCache: CustomTheme[] | null = null;
let cacheTimestamp = 0;
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

/**
 * Fetch all custom themes from the API
 */
export async function fetchCustomThemes(forceRefresh = false): Promise<CustomTheme[]> {
  const now = Date.now();

  // Return cached data if still valid
  if (!forceRefresh && customThemesCache && now - cacheTimestamp < CACHE_DURATION) {
    return customThemesCache;
  }

  try {
    const response = await fetch('/api/custom-themes');

    if (!response.ok) {
      console.warn('Failed to fetch custom themes, status:', response.status);
      return customThemesCache || [];
    }

    const data = await response.json();

    if (data.success) {
      const themes = data.themes.map((t: any) => ({
        id: t.themeId,
        name: t.themeName,
        description: t.description || 'Custom theme',
        colors: t.colors,
        backgrounds: t.backgrounds || {},
        customStyles: {
          borderRadius: '1rem',
          boxShadow: `0 4px 6px -1px rgba(${hexToRgb(t.colors.primary)}, 0.1)`,
          gradient: `linear-gradient(135deg, ${t.colors.primary} 0%, ${t.colors.primarylight} 100%)`,
        },
      }));

      customThemesCache = themes;
      cacheTimestamp = now;
      return themes;
    }
  } catch (error) {
    console.warn('Error fetching custom themes:', error);
    // Return cached data if available, otherwise empty array
    return customThemesCache || [];
  }

  return customThemesCache || [];
}

/**
 * Get a specific custom theme by ID
 */
export async function getCustomTheme(themeId: string): Promise<CustomTheme | null> {
  const themes = await fetchCustomThemes();
  return themes.find(t => t.id === themeId) || null;
}

/**
 * Check if a theme ID is a custom theme
 */
export async function isCustomTheme(themeId: string): Promise<boolean> {
  const themes = await fetchCustomThemes();
  return themes.some(t => t.id === themeId);
}

/**
 * Clear the custom themes cache
 */
export function clearCustomThemesCache() {
  customThemesCache = null;
  cacheTimestamp = 0;
}

/**
 * Helper to convert hex to RGB
 */
function hexToRgb(hex: string): string {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  if (result) {
    const r = parseInt(result[1], 16);
    const g = parseInt(result[2], 16);
    const b = parseInt(result[3], 16);
    return `${r}, ${g}, ${b}`;
  }
  return '0, 0, 0';
}
