'use client';

import { Ornament, OrnamentAnimation } from '@/types/ornament';
import Image from 'next/image';

interface OrnamentLayerProps {
  ornaments: Ornament[];
}

/**
 * Get animation CSS classes based on ornament animation config
 */
const getAnimationClasses = (animation?: OrnamentAnimation): string => {
  if (!animation || !animation.enabled || animation.type === 'none') {
    return '';
  }

  const typeClass = `ornament-animate-${animation.type}`;
  const speedClass = `ornament-animation-${animation.speed}`;

  return `${typeClass} ${speedClass}`;
};

/**
 * Get animation CSS custom properties for intensity control
 */
const getAnimationStyle = (animation?: OrnamentAnimation): React.CSSProperties => {
  if (!animation || !animation.enabled) {
    return {};
  }

  const intensityMultiplier = animation.intensity || 0.5;

  return {
    '--sway-distance': `${15 * intensityMultiplier}px`,
    '--float-distance': `${20 * intensityMultiplier}px`,
    '--pulse-scale': `${1 + (0.2 * intensityMultiplier)}`,
    animationDelay: `${animation.delay}s`,
  } as React.CSSProperties;
};

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
        // Determine anchor modes (default to top-left)
        const anchorY = ornament.position.anchorY || 'top';
        const anchorX = ornament.position.anchorX || 'left';

        // Layer 1: Positioning only (no transforms)
        const positionStyle: React.CSSProperties = {
          position: 'absolute',
          // Apply position coordinates based on anchor
          ...(anchorY === 'top' && ornament.position.top && { top: ornament.position.top }),
          ...(anchorY === 'bottom' && ornament.position.bottom && { bottom: ornament.position.bottom }),
          ...(anchorX === 'left' && ornament.position.left && { left: ornament.position.left }),
          ...(anchorX === 'right' && ornament.position.right && { right: ornament.position.right }),
          // Don't block user interactions
          pointerEvents: 'none',
          // Apply z-index on outer wrapper
          zIndex: ornament.style.zIndex,
        };

        // Layer 2: Static transforms (scale, rotate) - separate from animations
        const staticTransformStyle: React.CSSProperties = {
          transform: `scale(${ornament.transform.scale}) rotate(${ornament.transform.rotate}deg)`,
          transformOrigin: 'center',
          width: ornament.style.width,
          height: ornament.style.height,
        };

        // Layer 3: Animations only (no static transforms)
        const animationStyle: React.CSSProperties = {
          width: '100%',
          height: '100%',
          opacity: ornament.style.opacity,
          transition: 'all 0.3s ease',
          ...getAnimationStyle(ornament.animation)
        };

        return (
          <div
            key={ornament.id}
            style={positionStyle}
            title={ornament.name}
          >
            <div style={staticTransformStyle}>
              <div
                className={`ornament-element ${getAnimationClasses(ornament.animation)}`}
                style={animationStyle}
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
            </div>
          </div>
        );
      })}
    </>
  );
}
