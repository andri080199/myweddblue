import { useState, useEffect } from 'react';
import { Ornament, SectionId } from '@/types/ornament';

/**
 * Custom hook for fetching and managing ornaments for a client
 *
 * Usage:
 * ```typescript
 * const { ornaments, loading, getOrnaments, refetch } = useOrnaments(clientSlug);
 * const welcomeOrnaments = getOrnaments('welcome');
 * ```
 */
export function useOrnaments(clientSlug: string) {
  const [ornaments, setOrnaments] = useState<Ornament[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (clientSlug) {
      fetchOrnaments();
    }
  }, [clientSlug]);

  /**
   * Fetch ornaments from API
   */
  async function fetchOrnaments() {
    if (!clientSlug) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      console.log('📡 useOrnaments: Fetching ornaments for', clientSlug);

      const response = await fetch(
        `/api/client-ornaments?clientSlug=${clientSlug}`
      );

      const data = await response.json();

      if (data.success) {
        setOrnaments(data.data.ornaments || []);
        console.log('✅ useOrnaments: Ornaments loaded', {
          count: data.data.ornaments?.length || 0
        });
      } else {
        console.error('❌ useOrnaments: Failed to fetch ornaments', data.error);
        setError(data.error || 'Failed to fetch ornaments');
        setOrnaments([]);
      }
    } catch (err) {
      console.error('❌ useOrnaments: Exception caught', err);
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

  return {
    ornaments,
    loading,
    error,
    getOrnaments,
    getAllOrnaments,
    getOrnamentCount,
    hasOrnaments,
    refetch: fetchOrnaments
  };
}
