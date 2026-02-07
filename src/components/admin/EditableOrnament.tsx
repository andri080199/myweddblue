'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Rnd } from 'react-rnd';
import Image from 'next/image';
import { Ornament } from '@/types/ornament';
import { Trash2, RotateCw } from 'lucide-react';

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

  const xPos = percentToPixels(ornament.position.left, containerWidth);
  const yPos = percentToPixels(ornament.position.top, containerHeight);
  const width = parseInt(ornament.style.width) || 100;
  const height = ornament.style.height === 'auto' ? width : parseInt(ornament.style.height) || 100;

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
    return (
      <div
        style={{
          position: 'absolute',
          top: ornament.position.top,
          left: ornament.position.left,
          width: ornament.style.width,
          height: ornament.style.height,
          opacity: ornament.style.opacity,
          zIndex: ornament.style.zIndex,
          transform: `scale(${ornament.transform.scale}) rotate(${ornament.transform.rotate}deg)`,
          transformOrigin: 'center',
          pointerEvents: 'none'
        }}
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
    );
  }

  // Edit mode: render with drag/resize handles
  return (
    <Rnd
      size={{ width, height }}
      position={{ x: xPos, y: yPos }}
      onDragStop={(e, d) => {
        onUpdate({
          ...ornament,
          position: {
            ...ornament.position,
            top: pixelsToPercent(d.y, containerHeight),
            left: pixelsToPercent(d.x, containerWidth)
          }
        });
      }}
      onResizeStop={(e, direction, ref, delta, position) => {
        onUpdate({
          ...ornament,
          style: {
            ...ornament.style,
            width: ref.style.width
          },
          position: {
            ...ornament.position,
            top: pixelsToPercent(position.y, containerHeight),
            left: pixelsToPercent(position.x, containerWidth)
          }
        });
      }}
      bounds="parent"
      enableResizing={isSelected}
      disableDragging={!isSelected}
      className={`${isSelected ? 'ring-2 ring-blue-500' : ''} cursor-move`}
      style={{
        opacity: ornament.style.opacity,
        zIndex: isSelected ? 9999 : ornament.style.zIndex
      }}
    >
      <div
        onClick={(e) => {
          e.stopPropagation();
          onSelect();
        }}
        className="relative w-full h-full"
        style={{
          transform: `scale(${ornament.transform.scale}) rotate(${rotation}deg)`,
          transformOrigin: 'center'
        }}
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
    </Rnd>
  );
}
