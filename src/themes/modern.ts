import { ThemeConfig } from '@/types/theme';

export const modernTheme: ThemeConfig = {
  id: 'modern',
  name: 'Modern Minimalist',
  description: 'Tema modern dengan desain minimalis dan clean',
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
  images: {
    hero: '/images/modern-hero.jpg',
    background: '/images/modern-bg.jpg',
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
      bride: '/images/bride-modern.jpg',
      groom: '/images/groom-modern.jpg',
    },
  },
  typography: {
    primaryFont: 'system-ui, sans-serif',
    secondaryFont: 'Georgia, serif',
    headingFont: 'Inter, sans-serif',
    scriptFont: 'Satisfy, cursive',
  },
  customStyles: {
    borderRadius: '0.5rem',
    boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
    gradient: 'linear-gradient(135deg, #F8FAFC 0%, #FFFFFF 100%)',
  },
};