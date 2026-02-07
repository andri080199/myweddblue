export interface ThemeColors {
  primary: string;
  primarylight: string;
  darkprimary: string;
  textprimary: string;
  gold: string;
  lightblue: string;
  secondary?: string;
  accent?: string;
}

export interface ThemeImages {
  hero: string;
  background: string;
  gallery: string[];
  couple: {
    bride: string;
    groom: string;
  };
  decorative?: string[];
}

export interface ThemeTypography {
  primaryFont: string;
  secondaryFont: string;
  headingFont: string;
  scriptFont: string;
}

export interface ThemeConfig {
  id: string;
  name: string;
  description: string;
  colors: ThemeColors;
  images: ThemeImages;
  typography: ThemeTypography;
  customStyles?: {
    borderRadius?: string;
    boxShadow?: string;
    gradient?: string;
  };
}

export interface CoupleInfo {
  bride: {
    name: string;
    fullName: string;
    parent: string;
    image: string;
  };
  groom: {
    name: string;
    fullName: string;
    parent: string;
    image: string;
  };
  wedding: {
    date: string;
    venue: string;
    address: string;
  };
}