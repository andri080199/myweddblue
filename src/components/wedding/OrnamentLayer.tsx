'use client';

import { Ornament } from '@/types/ornament';
import Image from 'next/image';

interface OrnamentLayerProps {
  ornaments: Ornament[];
}

/**
 * OrnamentLayer Component
 *
 * Renders decorative ornaments on top of wedding invitation sections
 * - Supports absolute positioning with percentage-based coordinates
 * - Handles scaling, rotation, and opacity transformations
 * - Mobile responsive via percentage positioning
 * - Pointer events disabled to not interfere with user interactions
 *
 * Usage:
 * ```tsx
 * <OrnamentLayer ornaments={getOrnaments('welcome')} />
 * ```
 */
export default function OrnamentLayer({ ornaments }: OrnamentLayerProps) {
  // Don't render if no ornaments
  if (!ornaments || ornaments.length === 0) {
    return null;
  }

  return (
    <>
      {ornaments.map((ornament) => {
        // Build position style object
        const positionStyle: React.CSSProperties = {
          position: 'absolute',
          // Apply position coordinates
          ...(ornament.position.top && { top: ornament.position.top }),
          ...(ornament.position.left && { left: ornament.position.left }),
          ...(ornament.position.right && { right: ornament.position.right }),
          ...(ornament.position.bottom && { bottom: ornament.position.bottom }),
          // Apply dimensions
          width: ornament.style.width,
          height: ornament.style.height,
          // Apply visual styles
          opacity: ornament.style.opacity,
          zIndex: ornament.style.zIndex,
          // Apply transformations (scale + rotate)
          transform: `scale(${ornament.transform.scale}) rotate(${ornament.transform.rotate}deg)`,
          transformOrigin: 'center',
          // Don't block user interactions
          pointerEvents: 'none',
          // Smooth transitions
          transition: 'all 0.3s ease',
        };

        return (
          <div
            key={ornament.id}
            className="ornament-element"
            style={positionStyle}
            title={ornament.name}
          >
            <Image
              src={ornament.image}
              alt={ornament.name}
              width={parseInt(ornament.style.width) || 150}
              height={parseInt(ornament.style.width) || 150}
              className="w-full h-full object-contain"
              unoptimized // Required for base64 images
              draggable={false}
              priority={ornament.style.zIndex > 15} // Prioritize foreground ornaments
            />
          </div>
        );
      })}
    </>
  );
}
