import { ThemeConfig } from '@/types/theme';

export const cityTheme: ThemeConfig = {
  id: 'city',
  name: 'Urban City',
  description: 'Tema modern dengan nuansa kota metropolitan yang elegan',
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
  typography: {
    primaryFont: 'Inter, sans-serif',
    secondaryFont: 'Playfair Display, serif',
    headingFont: 'Montserrat, sans-serif',
    scriptFont: 'Great Vibes, cursive',
  },
  customStyles: {
    borderRadius: '0.5rem',
    boxShadow: '0 10px 15px -3px rgba(37, 99, 235, 0.1)',
    gradient: 'linear-gradient(135deg, #3b82f6 0%, #dbeafe 100%)',
  },
};