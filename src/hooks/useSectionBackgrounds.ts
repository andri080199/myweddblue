import { useState, useEffect } from 'react';

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

export type SectionId = keyof SectionBackgrounds;

interface UseSectionBackgroundsResult {
  backgrounds: SectionBackgrounds;
  loading: boolean;
  getBackground: (sectionId: SectionId) => string | undefined;
  refetch: () => void;
}

export function useSectionBackgrounds(clientSlug?: string): UseSectionBackgroundsResult {
  const [backgrounds, setBackgrounds] = useState<SectionBackgrounds>({});
  const [loading, setLoading] = useState(true);

  const fetchBackgrounds = async () => {
    if (!clientSlug) {
      setLoading(false);
      return;
    }

    try {
      // Step 1: Get client theme configuration
      const themeResponse = await fetch(`/api/client-theme?clientSlug=${clientSlug}`);
      if (!themeResponse.ok) {
        setLoading(false);
        return;
      }

      const themeData = await themeResponse.json();

      // Step 2: Determine background theme ID
      // IMPORTANT: For composed themes, use backgroundTheme NOT colorTheme!
      let backgroundThemeId: string;

      if (themeData.isComposed && themeData.backgroundTheme) {
        // New system: Composed (colorTheme + backgroundTheme)
        backgroundThemeId = themeData.backgroundTheme;
      } else if (themeData.backgroundTheme) {
        // Legacy with background theme
        backgroundThemeId = themeData.backgroundTheme;
      } else if (themeData.theme) {
        // Pure legacy theme
        backgroundThemeId = themeData.theme;
      } else {
        // Fallback to original
        backgroundThemeId = 'original';
      }

      console.log('[useSectionBackgrounds] Client:', clientSlug, 'Background Theme:', backgroundThemeId);

      // Step 3: Check if it's a custom background theme (NEW SYSTEM)
      const customBgResponse = await fetch(`/api/custom-background-themes?themeId=${backgroundThemeId}`);

      if (customBgResponse.ok) {
        const customBgData = await customBgResponse.json();

        if (customBgData.success && customBgData.theme && customBgData.theme.backgrounds) {
          // Custom background theme found!
          console.log('[useSectionBackgrounds] Using CUSTOM background theme:', backgroundThemeId, customBgData.theme.backgrounds);
          setBackgrounds(customBgData.theme.backgrounds);
          setLoading(false);
          return;
        }
      }

      // Step 4: Check if it's an OLD custom theme (bundled - for backward compatibility)
      const oldCustomThemeResponse = await fetch(`/api/custom-themes?themeId=${backgroundThemeId}`);

      if (oldCustomThemeResponse.ok) {
        const oldCustomData = await oldCustomThemeResponse.json();

        if (oldCustomData.success && oldCustomData.theme && oldCustomData.theme.backgrounds) {
          // Old bundled custom theme found
          console.log('[useSectionBackgrounds] Using OLD bundled custom theme:', backgroundThemeId);
          setBackgrounds(oldCustomData.theme.backgrounds);
          setLoading(false);
          return;
        }
      }

      // Step 5: Fallback to built-in theme-backgrounds table (for built-in themes)
      const bgResponse = await fetch(`/api/theme-backgrounds?themeId=${backgroundThemeId}&t=${Date.now()}`);

      if (bgResponse.ok) {
        const bgData = await bgResponse.json();

        if (bgData.success && bgData.backgrounds) {
          console.log('[useSectionBackgrounds] Using built-in theme backgrounds:', backgroundThemeId);
          setBackgrounds(bgData.backgrounds);
        } else {
          console.log('[useSectionBackgrounds] No backgrounds found, using empty object');
          setBackgrounds({});
        }
      } else {
        console.log('[useSectionBackgrounds] Failed to fetch theme-backgrounds, using empty object');
        setBackgrounds({});
      }
    } catch (error) {
      console.error('[useSectionBackgrounds] Error fetching section backgrounds:', error);
      setBackgrounds({});
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBackgrounds();
  }, [clientSlug]);

  // Helper function to get background (returns undefined if not set)
  const getBackground = (sectionId: SectionId): string | undefined => {
    return backgrounds[sectionId];
  };

  return {
    backgrounds,
    loading,
    getBackground,
    refetch: fetchBackgrounds
  };
}

// Standalone function to fetch backgrounds (for server components or one-time fetch)
export async function fetchSectionBackgrounds(clientSlug: string): Promise<SectionBackgrounds> {
  try {
    // Step 1: Get client theme
    const themeResponse = await fetch(`/api/client-theme?clientSlug=${clientSlug}`, {
      cache: 'no-store'
    });
    if (!themeResponse.ok) return {};

    const themeData = await themeResponse.json();

    // Step 2: Determine background theme ID
    let backgroundThemeId: string;

    if (themeData.isComposed && themeData.backgroundTheme) {
      backgroundThemeId = themeData.backgroundTheme;
    } else if (themeData.backgroundTheme) {
      backgroundThemeId = themeData.backgroundTheme;
    } else if (themeData.theme) {
      backgroundThemeId = themeData.theme;
    } else {
      backgroundThemeId = 'original';
    }

    // Step 3: Check custom background themes (NEW SYSTEM)
    const customBgResponse = await fetch(`/api/custom-background-themes?themeId=${backgroundThemeId}`, {
      cache: 'no-store'
    });

    if (customBgResponse.ok) {
      const customBgData = await customBgResponse.json();
      if (customBgData.success && customBgData.theme && customBgData.theme.backgrounds) {
        return customBgData.theme.backgrounds;
      }
    }

    // Step 4: Check old custom themes (for backward compatibility)
    const oldCustomThemeResponse = await fetch(`/api/custom-themes?themeId=${backgroundThemeId}`, {
      cache: 'no-store'
    });

    if (oldCustomThemeResponse.ok) {
      const oldCustomData = await oldCustomThemeResponse.json();
      if (oldCustomData.success && oldCustomData.theme && oldCustomData.theme.backgrounds) {
        return oldCustomData.theme.backgrounds;
      }
    }

    // Step 5: Fallback to built-in theme-backgrounds
    const bgResponse = await fetch(`/api/theme-backgrounds?themeId=${backgroundThemeId}`, {
      cache: 'no-store'
    });

    if (bgResponse.ok) {
      const bgData = await bgResponse.json();
      if (bgData.success && bgData.backgrounds) {
        return bgData.backgrounds;
      }
    }
  } catch (error) {
    console.error('Error fetching section backgrounds:', error);
  }

  return {};
}
