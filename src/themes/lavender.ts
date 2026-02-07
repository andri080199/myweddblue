import { ThemeConfig } from '@/types/theme';

export const lavenderTheme: ThemeConfig = {
  id: 'lavender',
  name: 'Lavender Dreams',
  description: 'Tema lavender dengan nuansa ungu dusty yang elegan dan sentuhan champagne gold',
  colors: {
    // Ungu yang lebih soft/pastel untuk background card
    primary: '#F3E8FF', 
    
    // Putih dengan hint ungu sangat tipis (biar tidak flat putih)
    primarylight: '#FAFAFF', 
    
    // Ungu tua yang lebih "deep" (seperti warna terong/eggplant) untuk tombol utama
    darkprimary: '#6D28D9', 
    
    // Teks jangan pakai ungu terang, tapi ungu gelap kehitaman agar mudah dibaca & mahal
    textprimary: '#4C1D95', 
    
    // KUNCI: Emas yang lebih metallic/champagne (bukan oranye)
    gold: '#D4AF37', 
    
    // Warna pendukung untuk variasi background
    lightblue: '#EDE9FE', 
    
    // Warna border/hiasan soft
    secondary: '#C4B5FD', 
    
    // Accent untuk highlight kecil
    accent: '#8B5CF6', 
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
      bride: '/images/bride-lavender.jpg',
      groom: '/images/groom-lavender.jpg',
    },
  },
  typography: {
    primaryFont: 'Poppins, sans-serif',
    secondaryFont: 'Merienda, cursive',
    headingFont: 'Lavishly Yours, cursive',
    scriptFont: 'Dancing Script, cursive',
  },
  customStyles: {
    borderRadius: '1.5rem', // Lebih bulat sedikit biar modern
    // Shadow yang lebih soft dan menyebar (glow effect)
    boxShadow: '0 10px 25px -5px rgba(109, 40, 217, 0.15), 0 8px 10px -6px rgba(109, 40, 217, 0.1)',
    // Gradient yang lebih subtle/halus perubahannya
    gradient: 'linear-gradient(135deg, #F3E8FF 0%, #FFFFFF 100%)',
  },
};