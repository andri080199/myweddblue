import { ThemeConfig } from '@/types/theme';

export const classicTheme: ThemeConfig = {
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
      bride: '/images/bride-classic.jpg',
      groom: '/images/groom-classic.jpg',
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
    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
    gradient: 'linear-gradient(135deg, #F5EFE7 0%, #FEFCF3 100%)',
  },
};