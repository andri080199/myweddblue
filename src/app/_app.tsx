// src/pages/_app.tsx
import '../styles/globals.css'; // Path ke file globals.css Anda
import '../styles/animations.css';
import type { AppProps } from 'next/app';

function MyApp({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />;
}

export default MyApp;
