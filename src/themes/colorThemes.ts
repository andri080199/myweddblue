export interface ColorTheme {
  primary: any;
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
  customStyles: {
    borderRadius: string;
    boxShadow: string;
    gradient: string;
  };
}

export const colorThemes: Record<string, ColorTheme> = {
  original: {
    id: 'original',
    name: 'Original Blue',
    description: 'Warna biru laut yang elegant',
    colors: {
      primary: '#9fd1ea',
      primarylight: '#e5f1f9',
      darkprimary: '#3295c5',
      textprimary: '#1d6087',
      gold: '#705a23',
      lightblue: '#e5f1f9',
      secondary: '#9fd1ea',
      accent: '#705a23',
    },
    customStyles: {
      borderRadius: '1rem',
      boxShadow: '0 4px 6px -1px rgba(61, 149, 197, 0.1)',
      gradient: 'linear-gradient(135deg, #9fd1ea 0%, #e5f1f9 100%)',
    },
  },
  romantic: {
    id: 'romantic',
    name: 'Romantic Pink',
    description: 'Warna pink romantis untuk momen spesial',
    colors: {
      primary: '#F9A8D4',
      primarylight: '#FDF2F8',
      darkprimary: '#EC4899',
      textprimary: '#BE185D',
      gold: '#D97706',
      lightblue: '#FDF2F8',
      secondary: '#F9A8D4',
      accent: '#D97706',
    },
    customStyles: {
      borderRadius: '1.2rem',
      boxShadow: '0 4px 6px -1px rgba(236, 72, 153, 0.1)',
      gradient: 'linear-gradient(135deg, #F9A8D4 0%, #FDF2F8 100%)',
    },
  },
  sunset: {
    id: 'sunset',
    name: 'Sunset Bliss',
    description: 'Tema sunset dengan gradasi orange dan merah yang hangat',
    colors: {
      primary: '#FED7AA',
      primarylight: '#FFF7ED',
      darkprimary: '#EA580C',
      textprimary: '#C2410C',
      gold: '#F59E0B',
      lightblue: '#FEF3C7',
      secondary: '#FDBA74',
      accent: '#F97316',
    },
    customStyles: {
      borderRadius: '1rem',
      boxShadow: '0 4px 6px -1px rgba(234, 88, 12, 0.1)',
      gradient: 'linear-gradient(135deg, #FED7AA 0%, #FFF7ED 100%)',
    },
  },
  city: {
    id: 'city',
    name: 'Urban City',
    description: 'Warna kota modern dengan nuansa biru segar',
    colors: {
      primary: '#9fd1ea',
      primarylight: '#e5f1f9',
      darkprimary: '#3295c5',
      textprimary: '#1d6087',
      gold: '#705a23',
      lightblue: '#e5f1f9',
      secondary: '#9fd1ea',
      accent: '#705a23',
    },
    customStyles: {
      borderRadius: '1rem',
      boxShadow: '0 4px 6px -1px rgba(50, 149, 197, 0.1)',
      gradient: 'linear-gradient(135deg, #9fd1ea 0%, #e5f1f9 100%)',
    },
  },
  classic: {
    id: 'classic',
    name: 'Classic Elegance',
    description: 'Tema klasik dengan nuansa elegan dan warna-warna lembut',
    colors: {
      primary: '#F5EFE7',
      primarylight: '#FEFCF3',
      darkprimary: '#8B4513',
      textprimary: '#4A4A4A',
      gold: '#D4AF37',
      lightblue: '#E6F3FF',
      secondary: '#F5EFE7',
      accent: '#D4AF37',
    },
    customStyles: {
      borderRadius: '1rem',
      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
      gradient: 'linear-gradient(135deg, #F5EFE7 0%, #FEFCF3 100%)',
    },
  },
  coral: {
    id: 'coral',
    name: 'Coral Reef',
    description: 'Warna karang dengan nuansa merah coral yang segar',
    colors: {
      primary: '#FED7D7',
      primarylight: '#FFFAFA',
      darkprimary: '#DC2626',
      textprimary: '#B91C1C',
      gold: '#F59E0B',
      lightblue: '#FEF2F2',
      secondary: '#FECACA',
      accent: '#EF4444',
    },
    customStyles: {
      borderRadius: '1rem',
      boxShadow: '0 4px 6px -1px rgba(220, 38, 38, 0.1)',
      gradient: 'linear-gradient(135deg, #FED7D7 0%, #FFFAFA 100%)',
    },
  },
  emerald: {
    id: 'emerald',
    name: 'Emerald Garden',
    description: 'Warna zamrud dengan nuansa hijau yang menyegarkan',
    colors: {
      primary: '#A7F3D0',
      primarylight: '#ECFDF5',
      darkprimary: '#047857',
      textprimary: '#065F46',
      gold: '#F59E0B',
      lightblue: '#F0FDF4',
      secondary: '#6EE7B7',
      accent: '#10B981',
    },
    customStyles: {
      borderRadius: '1rem',
      boxShadow: '0 4px 6px -1px rgba(4, 120, 87, 0.1)',
      gradient: 'linear-gradient(135deg, #A7F3D0 0%, #ECFDF5 100%)',
    },
  },
  lavender: {
    id: 'lavender',
    name: 'Lavender Dreams',
    description: 'Warna lavender dengan nuansa ungu yang menenangkan',
    colors: {
      primary: '#E9D5FF',
      primarylight: '#FAF5FF',
      darkprimary: '#7C3AED',
      textprimary: '#6B21A8',
      gold: '#F59E0B',
      lightblue: '#F3E8FF',
      secondary: '#DDD6FE',
      accent: '#8B5CF6',
    },
    customStyles: {
      borderRadius: '1rem',
      boxShadow: '0 4px 6px -1px rgba(124, 58, 237, 0.1)',
      gradient: 'linear-gradient(135deg, #E9D5FF 0%, #FAF5FF 100%)',
    },
  },
  modern: {
    id: 'modern',
    name: 'Modern Minimalist',
    description: 'Desain modern minimalis dengan warna abu-abu elegan',
    colors: {
      primary: '#F8FAFC',
      primarylight: '#FFFFFF',
      darkprimary: '#1E293B',
      textprimary: '#334155',
      gold: '#F59E0B',
      lightblue: '#EFF6FF',
      secondary: '#E2E8F0',
      accent: '#3B82F6',
    },
    customStyles: {
      borderRadius: '1rem',
      boxShadow: '0 4px 6px -1px rgba(30, 41, 59, 0.1)',
      gradient: 'linear-gradient(135deg, #F8FAFC 0%, #FFFFFF 100%)',
    },
  },
  sapphire: {
    id: 'sapphire',
    name: 'Sapphire Nights',
    description: 'Warna safir dengan nuansa biru malam yang elegan',
    colors: {
      primary: '#DBEAFE',
      primarylight: '#F8FAFC',
      darkprimary: '#1E40AF',
      textprimary: '#1E3A8A',
      gold: '#F59E0B',
      lightblue: '#EFF6FF',
      secondary: '#BFDBFE',
      accent: '#3B82F6',
    },
    customStyles: {
      borderRadius: '1rem',
      boxShadow: '0 4px 6px -1px rgba(30, 64, 175, 0.1)',
      gradient: 'linear-gradient(135deg, #DBEAFE 0%, #F8FAFC 100%)',
    },
  },
  vintage: {
    id: 'vintage',
    name: 'Vintage Garden',
    description: 'Nuansa vintage dengan warna coklat tanah yang hangat',
    colors: {
      primary: '#F7F3E9',
      primarylight: '#FAF7F1',
      darkprimary: '#8B4513',
      textprimary: '#5D4037',
      gold: '#B8860B',
      lightblue: '#F0F4F8',
      secondary: '#DDD6C7',
      accent: '#A0753C',
    },
    customStyles: {
      borderRadius: '1rem',
      boxShadow: '0 4px 6px -1px rgba(139, 69, 19, 0.1)',
      gradient: 'linear-gradient(135deg, #F7F3E9 0%, #FAF7F1 100%)',
    },
  },
};

export const getColorTheme = (themeId: string): ColorTheme => {
  return colorThemes[themeId] || colorThemes.original;
};

export const getColorThemeList = (): ColorTheme[] => {
  return Object.values(colorThemes);
};

/**
 * Get color theme with support for custom themes
 * This is an async version that checks both built-in and custom themes
 */
export async function getColorThemeAsync(themeId: string): Promise<ColorTheme> {
  // First check built-in themes
  if (colorThemes[themeId]) {
    return colorThemes[themeId];
  }

  // Then check custom themes
  try {
    const { getCustomTheme } = await import('./customThemes');
    const customTheme = await getCustomTheme(themeId);

    if (customTheme) {
      return {
        id: customTheme.id,
        name: customTheme.name,
        description: customTheme.description,
        colors: customTheme.colors,
        customStyles: customTheme.customStyles,
        primary: customTheme.colors.primary,
      };
    }
  } catch (error) {
    console.error('Error loading custom theme:', error);
  }

  // Fallback to original
  return colorThemes.original;
}

/**
 * Get all color themes including custom themes
 */
export async function getAllColorThemes(): Promise<ColorTheme[]> {
  const builtinThemes = Object.values(colorThemes);

  try {
    // Import new custom color themes system
    const { fetchCustomColorThemes } = await import('./customColorThemes');
    const customThemes = await fetchCustomColorThemes();

    const customColorThemes: ColorTheme[] = customThemes.map(ct => ({
      id: ct.id,
      name: ct.name,
      description: ct.description,
      colors: ct.colors,
      customStyles: ct.customStyles,
      primary: ct.colors.primary,
    }));

    return [...builtinThemes, ...customColorThemes];
  } catch (error) {
    console.error('Error loading custom color themes:', error);
    return builtinThemes;
  }
}