'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Rnd } from 'react-rnd';
import Image from 'next/image';
import { Ornament, OrnamentAnimation } from '@/types/ornament';
import { Trash2, RotateCw } from 'lucide-react';

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

interface EditableOrnamentProps {
  ornament: Ornament;
  isEditMode: boolean;
  isSelected: boolean;
  containerWidth: number;
  containerHeight: number;
  onSelect: () => void;
  onUpdate: (updated: Ornament) => void;
  onDelete: () => void;
}

export default function EditableOrnament({
  ornament,
  isEditMode,
  isSelected,
  containerWidth,
  containerHeight,
  onSelect,
  onUpdate,
  onDelete
}: EditableOrnamentProps) {
  const [rotation, setRotation] = useState(ornament.transform.rotate);
  const [isRotating, setIsRotating] = useState(false);
  const rotationStartAngle = useRef(0);
  const rotationCenter = useRef({ x: 0, y: 0 });

  // Convert percentage to pixels
  const percentToPixels = (percent: string | null | undefined, dimension: number): number => {
    if (!percent) return 0;
    const value = parseFloat(percent.replace('%', ''));
    return (value / 100) * dimension;
  };

  // Convert pixels to percentage
  const pixelsToPercent = (pixels: number, dimension: number): string => {
    const percent = (pixels / dimension) * 100;
    return `${Math.round(percent * 100) / 100}%`;
  };

  const width = parseInt(ornament.style.width) || 100;
  const height = ornament.style.height === 'auto' ? width : parseInt(ornament.style.height) || 100;

  // Calculate position based on anchor mode
  const anchorY = ornament.position.anchorY || 'top';
  const anchorX = ornament.position.anchorX || 'left';

  let xPos: number;
  let yPos: number;

  // X positioning
  if (anchorX === 'right' && ornament.position.right) {
    xPos = containerWidth - percentToPixels(ornament.position.right, containerWidth) - width;
  } else {
    xPos = percentToPixels(ornament.position.left, containerWidth);
  }

  // Y positioning
  if (anchorY === 'bottom' && ornament.position.bottom) {
    yPos = containerHeight - percentToPixels(ornament.position.bottom, containerHeight) - height;
  } else {
    yPos = percentToPixels(ornament.position.top, containerHeight);
  }

  // Handle rotation
  const handleRotationStart = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsRotating(true);

    const rect = e.currentTarget.getBoundingClientRect();
    rotationCenter.current = {
      x: rect.left + rect.width / 2,
      y: rect.top + rect.height / 2
    };

    const angle = Math.atan2(
      e.clientY - rotationCenter.current.y,
      e.clientX - rotationCenter.current.x
    );
    rotationStartAngle.current = angle - (rotation * Math.PI / 180);
  };

  useEffect(() => {
    if (!isRotating) return;

    const handleRotationMove = (e: MouseEvent) => {
      const angle = Math.atan2(
        e.clientY - rotationCenter.current.y,
        e.clientX - rotationCenter.current.x
      );
      const degrees = ((angle - rotationStartAngle.current) * 180 / Math.PI);
      setRotation(Math.round(degrees));
    };

    const handleRotationEnd = () => {
      setIsRotating(false);
      onUpdate({
        ...ornament,
        transform: {
          ...ornament.transform,
          rotate: rotation
        }
      });
    };

    document.addEventListener('mousemove', handleRotationMove);
    document.addEventListener('mouseup', handleRotationEnd);

    return () => {
      document.removeEventListener('mousemove', handleRotationMove);
      document.removeEventListener('mouseup', handleRotationEnd);
    };
  }, [isRotating, rotation, ornament, onUpdate]);

  // If not in edit mode, render read-only ornament
  if (!isEditMode) {
    // Layer 1: positioning only
    const positionStyle: React.CSSProperties = {
      position: 'absolute',
      pointerEvents: 'none',
      zIndex: ornament.style.zIndex,
    };

    // Apply anchored positioning
    if (anchorY === 'bottom') {
      positionStyle.bottom = ornament.position.bottom;
    } else {
      positionStyle.top = ornament.position.top;
    }

    if (anchorX === 'right') {
      positionStyle.right = ornament.position.right;
    } else {
      positionStyle.left = ornament.position.left;
    }

    // Layer 2: static transforms (scale, rotate)
    const staticTransformStyle: React.CSSProperties = {
      width: ornament.style.width,
      height: ornament.style.height,
      transform: `scale(${ornament.transform.scale}) rotate(${ornament.transform.rotate}deg)`,
      transformOrigin: 'center',
    };

    // Layer 3: animations only
    const animationStyle: React.CSSProperties = {
      width: '100%',
      height: '100%',
      opacity: ornament.style.opacity,
      ...getAnimationStyle(ornament.animation)
    };

    return (
      <div style={positionStyle}>
        <div style={staticTransformStyle}>
          <div
            className={getAnimationClasses(ornament.animation)}
            style={animationStyle}
          >
            <Image
              src={ornament.image}
              alt={ornament.name}
              width={width}
              height={height}
              className="w-full h-full object-contain"
              unoptimized
              draggable={false}
            />
          </div>
        </div>
      </div>
    );
  }

  // Edit mode: render with drag/resize handles
  return (
    <Rnd
      size={{ width, height }}
      position={{ x: xPos, y: yPos }}
      onDragStop={(e, d) => {
        const newPosition = { ...ornament.position };

        // Update position based on anchor mode
        if (anchorY === 'bottom') {
          newPosition.bottom = pixelsToPercent(containerHeight - d.y - height, containerHeight);
          newPosition.top = null;
        } else {
          newPosition.top = pixelsToPercent(d.y, containerHeight);
          newPosition.bottom = null;
        }

        if (anchorX === 'right') {
          newPosition.right = pixelsToPercent(containerWidth - d.x - width, containerWidth);
          newPosition.left = null;
        } else {
          newPosition.left = pixelsToPercent(d.x, containerWidth);
          newPosition.right = null;
        }

        onUpdate({
          ...ornament,
          position: newPosition
        });
      }}
      onResizeStop={(e, direction, ref, delta, position) => {
        const newWidth = parseInt(ref.style.width);
        const newHeight = parseInt(ref.style.height);
        const newPosition = { ...ornament.position };

        // Update position based on anchor mode
        if (anchorY === 'bottom') {
          newPosition.bottom = pixelsToPercent(containerHeight - position.y - newHeight, containerHeight);
          newPosition.top = null;
        } else {
          newPosition.top = pixelsToPercent(position.y, containerHeight);
          newPosition.bottom = null;
        }

        if (anchorX === 'right') {
          newPosition.right = pixelsToPercent(containerWidth - position.x - newWidth, containerWidth);
          newPosition.left = null;
        } else {
          newPosition.left = pixelsToPercent(position.x, containerWidth);
          newPosition.right = null;
        }

        onUpdate({
          ...ornament,
          style: {
            ...ornament.style,
            width: ref.style.width
          },
          position: newPosition
        });
      }}
      enableResizing={isSelected}
      disableDragging={!isSelected}
      className={`${isSelected ? 'ring-2 ring-blue-500' : ''} cursor-move`}
      style={{
        opacity: ornament.style.opacity,
        zIndex: isSelected ? 35 : ornament.style.zIndex
      }}
    >
      {/* Layer 1: Static transform (scale, rotate) */}
      <div
        style={{
          width: '100%',
          height: '100%',
          transform: `scale(${ornament.transform.scale}) rotate(${rotation}deg)`,
          transformOrigin: 'center'
        }}
      >
        {/* Layer 2: Animation only */}
        <div
          onClick={(e) => {
            e.stopPropagation();
            onSelect();
          }}
          className={`relative w-full h-full ${getAnimationClasses(ornament.animation)}`}
          style={getAnimationStyle(ornament.animation)}
        >
          <Image
            src={ornament.image}
            alt={ornament.name}
            width={width}
            height={height}
            className="w-full h-full object-contain"
            unoptimized
            draggable={false}
          />

          {isSelected && (
            <>
              {/* Rotation Handle */}
              <div
                className="absolute -top-10 left-1/2 transform -translate-x-1/2 cursor-grab active:cursor-grabbing"
                onMouseDown={handleRotationStart}
              >
                <div className="bg-blue-500 text-white rounded-full p-2 shadow-lg hover:bg-blue-600 transition-colors">
                  <RotateCw className="w-4 h-4" />
                </div>
              </div>

              {/* Delete Button */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  if (confirm(`Delete ornament "${ornament.name}"?`)) {
                    onDelete();
                  }
                }}
                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1.5 shadow-lg hover:bg-red-600 transition-colors"
              >
                <Trash2 className="w-3 h-3" />
              </button>

              {/* Info Badge */}
              <div className="absolute -bottom-8 left-0 bg-black/75 text-white text-xs px-2 py-1 rounded whitespace-nowrap">
                {ornament.name} ({Math.round(rotation)}°)
              </div>
            </>
          )}
        </div>
      </div>
    </Rnd>
  );
}
