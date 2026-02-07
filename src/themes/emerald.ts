import { ThemeConfig } from '@/types/theme';

export const emeraldTheme: ThemeConfig = {
  id: 'emerald',
  name: 'Emerald Garden',
  description: 'Tema hijau zamrud dengan nuansa taman yang segar dan alami',
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
      bride: '/images/bride-emerald.jpg',
      groom: '/images/groom-emerald.jpg',
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
    boxShadow: '0 4px 6px -1px rgba(4, 120, 87, 0.1)',
    gradient: 'linear-gradient(135deg, #A7F3D0 0%, #ECFDF5 100%)',
  },
};