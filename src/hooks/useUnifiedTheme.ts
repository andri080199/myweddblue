'use client';

import { useState, useEffect } from 'react';
import { UnifiedTheme, GalleryPhoto } from '@/types/unified-theme';
import { Ornament, SectionId } from '@/types/ornament';
import { getGalleryTemplate } from '@/data/galleryTemplates';

/**
 * Hook for fetching and managing unified themes
 *
 * @param themeId - The theme ID to fetch
 * @returns Theme data, loading state, and utility functions
 */
export function useUnifiedTheme(themeId: string | null | undefined) {
  const [theme, setTheme] = useState<UnifiedTheme | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (themeId) {
      fetchTheme();
    } else {
      setTheme(null);
      setLoading(false);
    }
  }, [themeId]);

  async function fetchTheme() {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`/api/unified-themes?themeId=${themeId}`);
      const data = await response.json();

      if (data.success) {
        setTheme(data.theme);
      } else {
        setError(data.error || 'Failed to fetch theme');
        setTheme(null);
      }
    } catch (err) {
      console.error('Failed to fetch unified theme:', err);
      setError('Failed to fetch theme');
      setTheme(null);
    } finally {
      setLoading(false);
    }
  }

  /**
   * Get ornaments for a specific section
   */
  function getOrnaments(sectionId: SectionId): Ornament[] {
    if (!theme || !theme.ornaments || !theme.ornaments.ornaments) {
      return [];
    }

    return theme.ornaments.ornaments.filter(
      orn => orn.section === sectionId && orn.isVisible
    );
  }

  /**
   * Get background for a specific section
   * Falls back to fullscreen background if section background not available
   */
  function getBackground(sectionId: keyof UnifiedTheme['backgrounds']): string | undefined {
    if (!theme || !theme.backgrounds) {
      return undefined;
    }

    // Try to get section-specific background
    const sectionBg = theme.backgrounds[sectionId];
    if (sectionBg) {
      return sectionBg;
    }

    // Fallback to fullscreen background
    return theme.backgrounds.fullscreen;
  }

  /**
   * Get all ornaments
   */
  function getAllOrnaments(): Ornament[] {
    if (!theme || !theme.ornaments || !theme.ornaments.ornaments) {
      return [];
    }

    return theme.ornaments.ornaments.filter(orn => orn.isVisible);
  }

  /**
   * Get ornament count for a specific section
   */
  function getOrnamentCount(sectionId: SectionId): number {
    return getOrnaments(sectionId).length;
  }

  /**
   * Check if section has ornaments
   */
  function hasOrnaments(sectionId: SectionId): boolean {
    return getOrnamentCount(sectionId) > 0;
  }

  /**
   * Get sample gallery photos for the theme
   * Returns photos from custom JSONB or template reference
   */
  function getSampleGallery(): GalleryPhoto[] {
    if (!theme) {
      return [];
    }

    // If custom gallery is set, use those photos
    if (theme.sample_gallery_source === 'custom' && theme.sample_gallery_photos?.photos) {
      return theme.sample_gallery_photos.photos;
    }

    // Otherwise, get photos from template
    const templateId = theme.sample_gallery_template || 'wedding-classic';
    return getGalleryTemplate(templateId);
  }

  return {
    theme,
    loading,
    error,
    refetch: fetchTheme,
    // Utility functions
    getOrnaments,
    getBackground,
    getAllOrnaments,
    getOrnamentCount,
    hasOrnaments,
    getSampleGallery,
  };
}
