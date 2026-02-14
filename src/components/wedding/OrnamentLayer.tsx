'use client';

import { Ornament, OrnamentAnimation } from '@/types/ornament';
import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';

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
 * Individual Ornament Component with Entrance Animation
 */
function OrnamentItem({ ornament }: { ornament: Ornament }) {
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [animationKey, setAnimationKey] = useState(0);
  const previousVisibilityRef = useRef(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    // Only set up observer if entrance animation is enabled
    if (!ornament.animation?.entranceEnabled || ornament.animation?.entrance === 'none') {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const wasVisible = previousVisibilityRef.current;
          const nowVisible = entry.isIntersecting;

          // Only trigger animation when transitioning from not-visible to visible
          if (!wasVisible && nowVisible) {
            setIsVisible(true);
            setAnimationKey(prev => prev + 1);
            previousVisibilityRef.current = true;
          } else if (wasVisible && !nowVisible) {
            // Keluar viewport - reset
            setIsVisible(false);
            previousVisibilityRef.current = false;
          }
        });
      },
      {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
      }
    );

    observer.observe(element);

    return () => {
      observer.disconnect();
    };
  }, [ornament.animation]);

  // Determine anchor modes (default to top-left)
  const anchorY = ornament.position.anchorY || 'top';
  const anchorX = ornament.position.anchorX || 'left';

  // Layer 1: Positioning only (no transforms)
  const positionStyle: React.CSSProperties = {
    position: 'absolute',
    ...(anchorY === 'top' && ornament.position.top && { top: ornament.position.top }),
    ...(anchorY === 'bottom' && ornament.position.bottom && { bottom: ornament.position.bottom }),
    ...(anchorX === 'left' && ornament.position.left && { left: ornament.position.left }),
    ...(anchorX === 'right' && ornament.position.right && { right: ornament.position.right }),
    pointerEvents: 'none',
    zIndex: ornament.style.zIndex,
  };

  // Layer 2: Static transforms (scale, rotate)
  const staticTransformStyle: React.CSSProperties = {
    transform: `scale(${ornament.transform.scale}) rotate(${ornament.transform.rotate}deg)`,
    transformOrigin: 'center',
    width: ornament.style.width,
    height: ornament.style.height,
  };

  // Layer 3: Loop animations + entrance animation
  const loopAnimationClasses = getAnimationClasses(ornament.animation);

  // Entrance animation class - hanya apply ketika visible
  const entranceClass = isVisible && ornament.animation?.entranceEnabled && ornament.animation?.entrance !== 'none'
    ? `ornament-entrance-${ornament.animation.entrance}`
    : '';

  const animationStyle: React.CSSProperties = {
    width: '100%',
    height: '100%',
    opacity: ornament.style.opacity,
    transition: 'all 0.3s ease',
    ...getAnimationStyle(ornament.animation),
    // Set entrance animation duration
    ...(entranceClass && {
      animationDuration: `${ornament.animation?.entranceDuration || 800}ms`
    })
  };

  return (
    <div
      ref={ref}
      style={positionStyle}
      title={ornament.name}
    >
      <div style={staticTransformStyle}>
        {/* Key berubah setiap kali masuk viewport untuk force animation replay */}
        <div
          key={animationKey}
          className={`ornament-element ${loopAnimationClasses} ${entranceClass}`.trim()}
          style={animationStyle}
        >
          <Image
            src={ornament.image}
            alt={ornament.name}
            width={parseInt(ornament.style.width) || 150}
            height={parseInt(ornament.style.width) || 150}
            className="w-full h-full object-contain"
            unoptimized
            draggable={false}
            priority={ornament.style.zIndex > 15}
          />
        </div>
      </div>
    </div>
  );
}

/**
 * OrnamentLayer Component
 *
 * Renders decorative ornaments on top of wedding invitation sections
 * - Supports absolute positioning with percentage-based coordinates
 * - Handles scaling, rotation, and opacity transformations
 * - Supports loop animations (continuous)
 * - Supports entrance animations (play once on scroll into view)
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
      {ornaments.map((ornament) => (
        <OrnamentItem key={ornament.id} ornament={ornament} />
      ))}
    </>
  );
}
