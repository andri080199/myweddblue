/**
 * Type definitions for Ornament System
 * Ornaments are decorative images that can be positioned anywhere on wedding invitation sections
 */

export interface OrnamentPosition {
  top?: string | null;     // "10%", "50px", null
  left?: string | null;    // "20%", "100px", null
  right?: string | null;   // "15%", "80px", null
  bottom?: string | null;  // "5%", "30px", null
  anchorY?: 'top' | 'bottom'; // Anchor to top or bottom of section (default: 'top')
  anchorX?: 'left' | 'right'; // Anchor to left or right of section (default: 'left')
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

/**
 * Loop animation types - continuous animations
 */
export type LoopAnimationType =
  | 'none'           // No animation
  | 'sway'           // Horizontal sway (left-right)
  | 'float'          // Vertical float (up-down)
  | 'rotate'         // Continuous rotation
  | 'pulse'          // Scale pulse (in-out)
  | 'bounce'         // Bounce effect
  | 'sway-float'     // Combined horizontal sway + vertical float
  | 'rotate-float';  // Combined rotation + vertical float

/**
 * Entrance animation types - play once on scroll into view
 */
export type EntranceAnimationType =
  | 'none'           // No entrance animation
  | 'fade-in'        // Fade in from transparent
  | 'slide-left'     // Slide from left to position
  | 'slide-right'    // Slide from right to position
  | 'slide-up'       // Slide from bottom to position
  | 'slide-down'     // Slide from top to position
  | 'zoom-in'        // Zoom in from small
  | 'zoom-out'       // Zoom in from large
  | 'flip-x'         // Flip horizontally while fading in
  | 'flip-y';        // Flip vertically while fading in

/**
 * Animation speed presets
 */
export type AnimationSpeed = 'slow' | 'normal' | 'fast';

/**
 * Animation configuration for ornaments
 */
export interface OrnamentAnimation {
  // Loop animation (continuous)
  type: LoopAnimationType;          // Loop animation type
  enabled: boolean;                 // Enable/disable loop animation
  speed: AnimationSpeed;            // Speed of loop animation
  intensity: number;                // Amplitude/range (0.1 to 1.0)
  delay: number;                    // Loop animation delay in seconds (0-5)

  // Entrance animation (play once on scroll)
  entrance?: EntranceAnimationType; // Entrance animation type
  entranceEnabled?: boolean;        // Enable/disable entrance animation
  entranceDuration?: number;        // Entrance duration in ms (300-2000)
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
  animation?: OrnamentAnimation;  // Optional animation configuration
}

/**
 * Available sections where ornaments can be placed
 */
export type SectionId =
  | 'fullscreen-image'  // Hero/Landing section
  | 'kutipan-ayat'      // Kutipan Ayat section
  | 'welcome'           // Welcome section
  | 'love-story'        // Love Story / Timeline section
  | 'wedding-event'     // Wedding Event section
  | 'wedding-gift'      // Wedding Gift section
  | 'gallery'           // Gallery section
  | 'rsvp'              // RSVP Form section
  | 'guestbook'         // Guestbook section
  | 'thankyou'          // Thank You section
  | 'footer';           // Footer section

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
  'fullscreen-image': 'Gambar Pembuka',
  'kutipan-ayat': 'Kutipan Ayat',
  'welcome': 'Info Mempelai',
  'love-story': 'Cerita Cinta',
  'wedding-event': 'Detail Acara',
  'wedding-gift': 'Hadiah Pernikahan',
  'gallery': 'Galeri',
  'rsvp': 'RSVP',
  'guestbook': 'Buku Tamu',
  'thankyou': 'Terima Kasih',
  'footer': 'Footer'
};

/**
 * Default values for new ornaments
 */
export const DEFAULT_ORNAMENT_VALUES = {
  position: {
    top: '10%',
    left: '10%',
    right: null,
    bottom: null,
    anchorY: 'top' as 'top' | 'bottom',
    anchorX: 'left' as 'left' | 'right'
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

/**
 * Default animation values
 */
export const DEFAULT_ANIMATION_VALUES: OrnamentAnimation = {
  type: 'none',
  enabled: false,
  speed: 'normal',
  intensity: 0.5,
  delay: 0,
  entrance: 'none',
  entranceEnabled: false,
  entranceDuration: 800
};
