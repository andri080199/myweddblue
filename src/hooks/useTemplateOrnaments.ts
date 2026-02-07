import { useState, useEffect } from 'react';
import { Ornament, SectionId } from '@/types/ornament';

/**
 * Custom hook for fetching and managing template-level ornaments
 *
 * Template ornaments are shared by all clients using the same catalog template.
 * This hook fetches ornaments from the template_ornaments table via the API.
 *
 * Usage:
 * ```typescript
 * const { ornaments, loading, getOrnaments, saveOrnaments } = useTemplateOrnaments(templateId);
 * const fullscreenOrnaments = getOrnaments('fullscreen');
 * ```
 */
export function useTemplateOrnaments(templateId: number | null | undefined) {
  const [ornaments, setOrnaments] = useState<Ornament[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (templateId) {
      fetchOrnaments();
    } else {
      // No template ID, set empty ornaments
      setOrnaments([]);
      setLoading(false);
    }
  }, [templateId]);

  /**
   * Fetch ornaments from API for the current template
   */
  async function fetchOrnaments() {
    if (!templateId) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      console.log('📡 useTemplateOrnaments: Fetching ornaments for template', templateId);

      const response = await fetch(
        `/api/template-ornaments?templateId=${templateId}`
      );

      const data = await response.json();

      if (data.success) {
        setOrnaments(data.data.ornaments || []);
        console.log('✅ useTemplateOrnaments: Ornaments loaded', {
          count: data.data.ornaments?.length || 0,
          templateId
        });
      } else {
        console.error('❌ useTemplateOrnaments: Failed to fetch ornaments', data.error);
        setError(data.error || 'Failed to fetch ornaments');
        setOrnaments([]);
      }
    } catch (err) {
      console.error('❌ useTemplateOrnaments: Exception caught', err);
      setError(err instanceof Error ? err.message : 'Unknown error');
      setOrnaments([]);
    } finally {
      setLoading(false);
    }
  }

  /**
   * Get ornaments for a specific section
   * Filters by section ID and visibility
   */
  function getOrnaments(sectionId: SectionId): Ornament[] {
    return ornaments.filter(
      orn => orn.section === sectionId && orn.isVisible
    );
  }

  /**
   * Get all ornaments regardless of section
   */
  function getAllOrnaments(): Ornament[] {
    return ornaments;
  }

  /**
   * Get count of ornaments for a section
   */
  function getOrnamentCount(sectionId: SectionId): number {
    return getOrnaments(sectionId).length;
  }

  /**
   * Check if section has any ornaments
   */
  function hasOrnaments(sectionId: SectionId): boolean {
    return getOrnamentCount(sectionId) > 0;
  }

  /**
   * Save ornaments to API (for admin editor)
   * Returns success/error response
   */
  async function saveOrnaments(updatedOrnaments: Ornament[]) {
    if (!templateId) {
      throw new Error('No template ID provided');
    }

    const response = await fetch('/api/template-ornaments', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        templateId,
        ornaments: updatedOrnaments
      })
    });

    const data = await response.json();

    if (data.success) {
      // Update local state to reflect saved ornaments
      setOrnaments(updatedOrnaments);
      console.log('✅ useTemplateOrnaments: Ornaments saved successfully');
    } else {
      console.error('❌ useTemplateOrnaments: Failed to save ornaments', data.error);
      throw new Error(data.error || 'Failed to save ornaments');
    }

    return data;
  }

  return {
    ornaments,
    loading,
    error,
    getOrnaments,
    getAllOrnaments,
    getOrnamentCount,
    hasOrnaments,
    saveOrnaments,
    refetch: fetchOrnaments
  };
}
