/**
 * Type definitions for Ornament System
 * Ornaments are decorative images that can be positioned anywhere on wedding invitation sections
 */

export interface OrnamentPosition {
  top?: string | null;     // "10%", "50px", null
  left?: string | null;    // "20%", "100px", null
  right?: string | null;   // "15%", "80px", null
  bottom?: string | null;  // "5%", "30px", null
}

export interface OrnamentTransform {
  scale: number;    // 0.5 to 3.0 (scaling factor, 1 = original size)
  rotate: number;   // -180 to 180 degrees
}

export interface OrnamentStyle {
  width: string;      // "100px", "150px", "200px"
  height: string;     // "auto" (maintain aspect ratio) or specific value
  opacity: number;    // 0 to 1
  zIndex: number;     // 5 to 20 (between background and modals)
}

export interface Ornament {
  id: string;                     // Unique identifier (e.g., "orn-1234567890")
  section: SectionId;             // Which section this ornament belongs to
  name: string;                   // Display name (e.g., "Flower Top Right")
  image: string;                  // Base64 data URI (data:image/png;base64,...)
  position: OrnamentPosition;     // Position configuration
  transform: OrnamentTransform;   // Scale and rotation
  style: OrnamentStyle;           // Visual styling
  isVisible: boolean;             // Toggle visibility without deleting
  createdAt: string;              // ISO timestamp
}

/**
 * Available sections where ornaments can be placed
 */
export type SectionId =
  | 'fullscreen'    // Hero/Landing section
  | 'kutipan'       // Kutipan Ayat section
  | 'welcome'       // Welcome section
  | 'timeline'      // Timeline section
  | 'event'         // Wedding Event section
  | 'gift'          // Wedding Gift section
  | 'gallery'       // Gallery section
  | 'rsvp'          // RSVP Form section
  | 'guestbook'     // Guestbook section
  | 'thankyou'      // Thank You section
  | 'footer';       // Footer section

/**
 * Data structure stored in client_content table
 */
export interface OrnamentsData {
  ornaments: Ornament[];
}

/**
 * API Response types
 */
export interface GetOrnamentsResponse {
  success: boolean;
  data: OrnamentsData;
  error?: string;
}

export interface SaveOrnamentsResponse {
  success: boolean;
  message?: string;
  error?: string;
}

/**
 * Form data for adding/editing ornaments
 */
export interface OrnamentFormData {
  name: string;
  image: string;              // Base64
  section: SectionId;
  position: {
    top: string;              // "10%"
    left: string;             // "20%"
  };
  scale: number;              // 0.5 - 3.0
  rotate: number;             // -180 to 180
  opacity: number;            // 0 - 1
  zIndex: number;             // 5 - 20
  width: string;              // "150px"
}

/**
 * Helper type for section labels (display names)
 */
export const SECTION_LABELS: Record<SectionId, string> = {
  fullscreen: 'Hero / Landing',
  kutipan: 'Kutipan Ayat',
  welcome: 'Welcome',
  timeline: 'Timeline',
  event: 'Wedding Event',
  gift: 'Wedding Gift',
  gallery: 'Gallery',
  rsvp: 'RSVP Form',
  guestbook: 'Guestbook',
  thankyou: 'Thank You',
  footer: 'Footer'
};

/**
 * Default values for new ornaments
 */
export const DEFAULT_ORNAMENT_VALUES = {
  position: {
    top: '10%',
    left: '10%',
    right: null,
    bottom: null
  },
  transform: {
    scale: 1,
    rotate: 0
  },
  style: {
    width: '150px',
    height: 'auto',
    opacity: 1,
    zIndex: 15
  },
  isVisible: true
};
