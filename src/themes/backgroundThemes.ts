export interface BackgroundTheme {
  id: string;
  name: string;
  description: string;
  images: {
    hero: string;
    background: string;
    gallery: string[];
    couple: {
      bride: string;
      groom: string;
    };
  };
}

export const backgroundThemes: Record<string, BackgroundTheme> = {
  original: {
    id: 'original',
    name: 'Nature Wedding',
    description: 'Background alam dengan pohon dan pemandangan natural',
    images: {
      hero: '/images/originaltheme/PohonPutih.jpg',
      background: '/images/originaltheme/BangkuSalju.jpg',
      gallery: [
        '/images/Wedding1.jpeg',
        '/images/Wedding2.jpg',
        '/images/Wedding3.jpg',
        '/images/Wedding4.jpeg',
        '/images/Wedding5.jpg',
        '/images/Wedding6.jpg',
        '/images/Wedding7.jpg',
        '/images/Wedding8.jpg',
        '/images/Wedding9.jpeg',
        '/images/Wedding10.jpg',
      ],
      couple: {
        bride: '/images/bride-original.jpg',
        groom: '/images/groom-original.jpg',
      },
    },
  },
  city: {
    id: 'city',
    name: 'Urban City',
    description: 'Background kota metropolitan yang modern',
    images: {
      hero: '/images/citytheme/city1.jpeg',
      background: '/images/citytheme/city2.jpeg',
      gallery: [
        '/images/citytheme/city1.jpeg',
        '/images/citytheme/city2.jpeg',
        '/images/citytheme/city3.jpeg',
        '/images/citytheme/city4.jpeg',
        '/images/citytheme/city5.jpeg',
        '/images/citytheme/city6.jpeg',
        '/images/citytheme/city7.jpeg',
      ],
      couple: {
        bride: '/images/citytheme/city3.jpeg',
        groom: '/images/citytheme/city4.jpeg',
      },
    },
  },
  flora: {
    id: 'flora',
    name: 'Flora Garden',
    description: 'Background taman bunga yang cantik dan romantis',
    images: {
      hero: '/images/flora/flora1.jpeg',
      background: '/images/flora/flora2.jpeg',
      gallery: [
        '/images/flora/flora1.jpeg',
        '/images/flora/flora2.jpeg',
        '/images/flora/flora3.jpeg',
        '/images/flora/flora4.jpeg',
      ],
      couple: {
        bride: '/images/flora/flora1.jpeg',
        groom: '/images/flora/flora2.jpeg',
      },
    },
  },
  tropical: {
    id: 'tropical',
    name: 'Tropical Paradise',
    description: 'Background tropical yang eksotis dengan nuansa pantai dan alam tropis',
    images: {
      hero: '/images/tropicaltheme/tropical1.jpeg',
      background: '/images/tropicaltheme/tropical2.jpeg',
      gallery: [
        '/images/tropicaltheme/tropical1.jpeg',
        '/images/tropicaltheme/tropical2.jpeg',
        '/images/tropicaltheme/tropical3.jpeg',
        '/images/Wedding1.jpeg',
        '/images/Wedding2.jpg',
        '/images/Wedding3.jpg',
        '/images/Wedding4.jpeg',
        '/images/Wedding5.jpg',
      ],
      couple: {
        bride: '/images/tropicaltheme/tropical1.jpeg',
        groom: '/images/tropicaltheme/tropical3.jpeg',
      },
    },
  },
};

export const getBackgroundTheme = (themeId: string): BackgroundTheme => {
  return backgroundThemes[themeId] || backgroundThemes.original;
};

export const getBackgroundThemeList = (): BackgroundTheme[] => {
  return Object.values(backgroundThemes);
};

/**
 * Get all background themes (built-in + custom)
 */
export async function getAllBackgroundThemes(): Promise<BackgroundTheme[]> {
  const builtinThemes = Object.values(backgroundThemes);

  try {
    // Import custom background themes system
    const { fetchCustomBackgroundThemes, convertBackgroundsToImages } = await import('./customBackgroundThemes');
    const customThemes = await fetchCustomBackgroundThemes(false, false); // Don't include backgrounds data for list

    const customBgThemes: BackgroundTheme[] = customThemes.map(ct => ({
      id: ct.id,
      name: ct.name,
      description: ct.description,
      images: convertBackgroundsToImages(ct.backgrounds),
    }));

    return [...builtinThemes, ...customBgThemes];
  } catch (error) {
    console.error('Error loading custom background themes:', error);
    return builtinThemes;
  }
}