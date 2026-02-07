"use client";

import React, { useState, useEffect } from "react";

// Individual snowflake component
const SnowFlake = ({ 
  delay, 
  duration, 
  size, 
  left, 
  symbol = "❄",
  opacity = 0.7,
  initialY = 0
}: { 
  delay: number; 
  duration: number; 
  size: number; 
  left: number; 
  symbol?: string;
  opacity?: number;
  initialY?: number;
}) => (
  <div
    className="fixed text-white pointer-events-none select-none z-30"
    style={{
      top: `${initialY}px`,
      left: `${left}%`,
      fontSize: `${size}px`,
      opacity,
      animation: `snowfall ${duration}s ${delay}s linear infinite`,
    }}
  >
    {symbol}
  </div>
);

interface SnowAnimationProps {
  count?: number;
  symbols?: string[];
  className?: string;
  enabled?: boolean;
}

const SnowAnimation: React.FC<SnowAnimationProps> = ({ 
  count = 50, 
  symbols = ["❄", "✨", "⭐"], 
  className = "",
  enabled = true
}) => {
  const [snowFlakes, setSnowFlakes] = useState<any[]>([]);

  useEffect(() => {
    if (!enabled) return;

    const generateSnowFlakes = () => {
      const flakes = [];
      for (let i = 0; i < count; i++) {
        const randomSymbol = symbols[Math.floor(Math.random() * symbols.length)];
        flakes.push({
          id: i,
          delay: i * 0.05, // Sangat minimal delay
          duration: 6 + Math.random() * 8, // 6-14 seconds
          size: 8 + Math.random() * 20, // Size range
          left: Math.random() * 100,
          symbol: randomSymbol,
          opacity: 0.3 + Math.random() * 0.7, // Random opacity
          initialY: Math.random() * -200, // Start di posisi yang berbeda-beda
        });
      }
      setSnowFlakes(flakes);
    };

    generateSnowFlakes();
  }, [count, symbols, enabled]);

  if (!enabled) return null;

  return (
    <>
      {/* CSS Animation Styles */}
      <style jsx>{`
        @keyframes snowfall {
          0% {
            transform: translateY(-20px) rotate(0deg);
            opacity: 1;
          }
          100% {
            transform: translateY(100vh) rotate(360deg);
            opacity: 0;
          }
        }
        
        @keyframes float-gentle {
          0%, 100% { 
            transform: translateX(0px) rotate(0deg); 
          }
          25% { 
            transform: translateX(10px) rotate(90deg); 
          }
          50% { 
            transform: translateX(-5px) rotate(180deg); 
          }
          75% { 
            transform: translateX(-10px) rotate(270deg); 
          }
        }
      `}</style>

      {/* Snow Container */}
      <div className={`fixed inset-0 pointer-events-none overflow-hidden ${className}`}>
        {snowFlakes.map((flake) => (
          <SnowFlake
            key={flake.id}
            delay={flake.delay}
            duration={flake.duration}
            size={flake.size}
            left={flake.left}
            symbol={flake.symbol}
            opacity={flake.opacity}
            initialY={flake.initialY}
          />
        ))}
      </div>
    </>
  );
};

export default SnowAnimation;