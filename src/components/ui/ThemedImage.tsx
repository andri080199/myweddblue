'use client';

import React from 'react';
import Image from 'next/image';
import { useTheme } from '@/contexts/ThemeContext';

interface ThemedImageProps {
  type: 'hero' | 'background' | 'bride' | 'groom';
  alt: string;
  className?: string;
  width?: number;
  height?: number;
  fill?: boolean;
  objectFit?: 'cover' | 'contain' | 'fill';
  quality?: number;
}

const ThemedImage: React.FC<ThemedImageProps> = ({
  type,
  alt,
  className,
  width,
  height,
  fill,
  objectFit = 'cover',
  quality = 100,
}) => {
  const { theme } = useTheme();
  
  let src = '';
  
  switch (type) {
    case 'hero':
      src = theme.images.hero;
      break;
    case 'background':
      src = theme.images.background;
      break;
    case 'bride':
      src = theme.images.couple.bride;
      break;
    case 'groom':
      src = theme.images.couple.groom;
      break;
    default:
      src = theme.images.hero;
  }

  const imageProps = {
    src,
    alt,
    className,
    quality,
    ...(fill ? { fill: true } : { width, height }),
    ...(fill && { style: { objectFit } }),
  };

  return <Image {...imageProps} />;
};

export default ThemedImage;