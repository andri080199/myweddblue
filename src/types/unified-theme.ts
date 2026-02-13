import { Ornament } from './ornament';

export interface UnifiedThemeColors {
  primary: string;
  primarylight: string;
  darkprimary: string;
  textprimary: string;
  gold: string;
  lightblue: string;
  secondary: string;
  accent: string;
}

export interface UnifiedThemeCustomStyles {
  borderRadius: string;
  boxShadow: string;
  gradient: string;
}

export interface UnifiedThemeBackgrounds {
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

export interface UnifiedThemeOrnaments {
  ornaments: Ornament[];
}

export interface GalleryPhoto {
  image_url: string;
  order: number;
  caption?: string;
}

export interface SampleGalleryPhotos {
  photos: GalleryPhoto[];
}

export interface UnifiedTheme {
  theme_id: string;
  theme_name: string;
  description: string;
  is_builtin: boolean;
  colors: UnifiedThemeColors;
  custom_styles: UnifiedThemeCustomStyles;
  backgrounds: UnifiedThemeBackgrounds;
  ornaments: UnifiedThemeOrnaments;
  sample_gallery_source?: 'template' | 'custom';
  sample_gallery_template?: string;
  sample_gallery_photos?: SampleGalleryPhotos;
  created_at?: string;
  updated_at?: string;
}

export interface UnifiedThemeStats {
  ornament_count: number;
  background_count: number;
  color_count: number;
}

export interface UnifiedThemeWithStats extends UnifiedTheme {
  stats?: UnifiedThemeStats;
}
