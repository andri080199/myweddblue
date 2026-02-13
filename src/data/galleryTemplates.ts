/**
 * Gallery Templates System
 *
 * Provides reusable gallery photo collections for unified themes.
 * Multiple themes can reference the same template without duplicating storage.
 *
 * Storage Efficiency:
 * - Template-based: 0 MB storage (hardcoded in code)
 * - Custom: Stored in database JSONB
 *
 * Example: 100 themes using "wedding-classic" = 0 MB
 *          100 themes with custom galleries = ~500 MB
 */

import { GalleryPhoto } from '@/types/unified-theme';

export interface GalleryTemplate {
  id: string;
  name: string;
  description: string;
  photos: GalleryPhoto[];
  thumbnail?: string; // Preview image for admin UI
}

/**
 * Built-in Gallery Templates
 * These are hardcoded and don't consume database storage
 */
export const GALLERY_TEMPLATES: Record<string, GalleryTemplate> = {
  'wedding-classic': {
    id: 'wedding-classic',
    name: 'Wedding Classic',
    description: 'Classic wedding photos collection (10 photos)',
    thumbnail: '/images/Wedding1.png',
    photos: [
      { image_url: '/images/Wedding1.png', order: 1, caption: 'Wedding Photo 1' },
      { image_url: '/images/Wedding2.png', order: 2, caption: 'Wedding Photo 2' },
      { image_url: '/images/Wedding3.png', order: 3, caption: 'Wedding Photo 3' },
      { image_url: '/images/Wedding4.png', order: 4, caption: 'Wedding Photo 4' },
      { image_url: '/images/Wedding5.png', order: 5, caption: 'Wedding Photo 5' },
      { image_url: '/images/Wedding6.png', order: 6, caption: 'Wedding Photo 6' },
      { image_url: '/images/Wedding7.png', order: 7, caption: 'Wedding Photo 7' },
      { image_url: '/images/Wedding8.png', order: 8, caption: 'Wedding Photo 8' },
      { image_url: '/images/Wedding9.png', order: 9, caption: 'Wedding Photo 9' },
      { image_url: '/images/Wedding10.png', order: 10, caption: 'Wedding Photo 10' },
    ]
  },

  'city-modern': {
    id: 'city-modern',
    name: 'City Modern',
    description: 'Modern urban wedding photos (6 photos)',
    thumbnail: '/images/citytheme/City1.jpg',
    photos: [
      { image_url: '/images/citytheme/City1.jpg', order: 1, caption: 'City Photo 1' },
      { image_url: '/images/citytheme/City2.jpg', order: 2, caption: 'City Photo 2' },
      { image_url: '/images/citytheme/City3.jpg', order: 3, caption: 'City Photo 3' },
      { image_url: '/images/Wedding1.png', order: 4, caption: 'Wedding Photo 1' },
      { image_url: '/images/Wedding2.png', order: 5, caption: 'Wedding Photo 2' },
      { image_url: '/images/Wedding3.png', order: 6, caption: 'Wedding Photo 3' },
    ]
  },

  'flora-garden': {
    id: 'flora-garden',
    name: 'Flora Garden',
    description: 'Romantic floral wedding photos (8 photos)',
    thumbnail: '/images/flora/Flora1.jpg',
    photos: [
      { image_url: '/images/flora/Flora1.jpg', order: 1, caption: 'Flora Photo 1' },
      { image_url: '/images/flora/Flora2.jpg', order: 2, caption: 'Flora Photo 2' },
      { image_url: '/images/flora/Flora3.jpg', order: 3, caption: 'Flora Photo 3' },
      { image_url: '/images/flora/Flora4.jpg', order: 4, caption: 'Flora Photo 4' },
      { image_url: '/images/Wedding1.png', order: 5, caption: 'Wedding Photo 1' },
      { image_url: '/images/Wedding2.png', order: 6, caption: 'Wedding Photo 2' },
      { image_url: '/images/Wedding3.png', order: 7, caption: 'Wedding Photo 3' },
      { image_url: '/images/Wedding4.png', order: 8, caption: 'Wedding Photo 4' },
    ]
  },

  'tropical-beach': {
    id: 'tropical-beach',
    name: 'Tropical Beach',
    description: 'Beach wedding photos collection (6 photos)',
    thumbnail: '/images/tropicaltheme/Tropical1.jpg',
    photos: [
      { image_url: '/images/tropicaltheme/Tropical1.jpg', order: 1, caption: 'Tropical Photo 1' },
      { image_url: '/images/tropicaltheme/Tropical2.jpg', order: 2, caption: 'Tropical Photo 2' },
      { image_url: '/images/tropicaltheme/Tropical3.jpg', order: 3, caption: 'Tropical Photo 3' },
      { image_url: '/images/Wedding1.png', order: 4, caption: 'Wedding Photo 1' },
      { image_url: '/images/Wedding2.png', order: 5, caption: 'Wedding Photo 2' },
      { image_url: '/images/Wedding3.png', order: 6, caption: 'Wedding Photo 3' },
    ]
  },
};

/**
 * Get gallery template by ID
 * @param templateId - Template ID (e.g., 'wedding-classic')
 * @returns GalleryPhoto[] or empty array if not found
 */
export function getGalleryTemplate(templateId: string): GalleryPhoto[] {
  const template = GALLERY_TEMPLATES[templateId];
  return template ? template.photos : [];
}

/**
 * Get all available templates (for admin UI dropdown)
 * @returns Array of GalleryTemplate
 */
export function getAllGalleryTemplates(): GalleryTemplate[] {
  return Object.values(GALLERY_TEMPLATES);
}

/**
 * Check if template exists
 * @param templateId - Template ID to check
 * @returns boolean
 */
export function templateExists(templateId: string): boolean {
  return templateId in GALLERY_TEMPLATES;
}

/**
 * Get template info (name, description) without photos
 * @param templateId - Template ID
 * @returns Template metadata or null
 */
export function getTemplateInfo(templateId: string): Omit<GalleryTemplate, 'photos'> | null {
  const template = GALLERY_TEMPLATES[templateId];
  if (!template) return null;

  const { photos, ...info } = template;
  return info;
}
