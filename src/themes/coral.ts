import { ThemeConfig } from '@/types/theme';

export const coralTheme: ThemeConfig = {
  id: 'coral',
  name: 'Coral Reef',
  description: 'Tema coral dengan perpaduan pink dan orange yang ceria dan vibrant',
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
  images: {
    hero: '/images/PohonPutih.jpg',
    background: '/images/BangkuSalju.jpg',
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
      bride: '/images/bride-coral.jpg',
      groom: '/images/groom-coral.jpg',
    },
  },
  typography: {
    primaryFont: 'Poppins, sans-serif',
    secondaryFont: 'Merienda, cursive',
    headingFont: 'Lavishly Yours, cursive',
    scriptFont: 'Dancing Script, cursive',
  },
  customStyles: {
    borderRadius: '1rem',
    boxShadow: '0 4px 6px -1px rgba(220, 38, 38, 0.1)',
    gradient: 'linear-gradient(135deg, #FED7D7 0%, #FFFAFA 100%)',
  },
};