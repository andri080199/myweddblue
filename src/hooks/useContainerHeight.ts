'use client';

import { useEffect, useRef, useState, RefObject } from 'react';

interface UseContainerDimensionsReturn {
  ref: RefObject<HTMLDivElement>;
  width: number | null;
  height: number | null;
}

/**
 * Custom hook to measure and track the actual rendered dimensions (width & height) of a container element.
 *
 * Uses ResizeObserver to automatically update dimensions when:
 * - The container's content changes
 * - The window is resized
 * - Responsive CSS classes apply different styles
 *
 * @returns An object containing:
 *   - ref: A ref to attach to the container element
 *   - width: The measured width in pixels (null during SSR or before first measurement)
 *   - height: The measured height in pixels (null during SSR or before first measurement)
 *
 * @example
 * ```tsx
 * const { ref: welcomeRef, width: welcomeWidth, height: welcomeHeight } = useContainerDimensions();
 *
 * <div ref={welcomeRef} className="relative overflow-hidden">
 *   <Welcome />
 *   {ornaments.map(ornament => (
 *     <EditableOrnament
 *       containerWidth={welcomeWidth || 480}
 *       containerHeight={welcomeHeight || 800}
 *     />
 *   ))}
 * </div>
 * ```
 */
export function useContainerDimensions(): UseContainerDimensionsReturn {
  const ref = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState<number | null>(null);
  const [height, setHeight] = useState<number | null>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    // Measure initial dimensions immediately
    setWidth(element.offsetWidth);
    setHeight(element.offsetHeight);

    // Create ResizeObserver to track dimension changes
    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        // Use offsetWidth/offsetHeight for consistency with initial measurement
        if (entry.target instanceof HTMLElement) {
          setWidth(entry.target.offsetWidth);
          setHeight(entry.target.offsetHeight);
        }
      }
    });

    // Start observing the element
    resizeObserver.observe(element);

    // Cleanup on unmount
    return () => {
      resizeObserver.disconnect();
    };
  }, []);

  return { ref, width, height };
}

// Backward compatibility alias
export const useContainerHeight = useContainerDimensions;
