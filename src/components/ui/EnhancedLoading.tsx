'use client';

import React from 'react';
import { Heart, Sparkles } from 'lucide-react';

interface EnhancedLoadingProps {
  message?: string;
  type?: 'wedding' | 'admin' | 'general';
  size?: 'sm' | 'md' | 'lg';
}

const EnhancedLoading: React.FC<EnhancedLoadingProps> = ({ 
  message = 'Loading...', 
  type = 'wedding',
  size = 'md'
}) => {
  const sizeConfig = {
    sm: { container: 'h-32', spinner: 'w-8 h-8', text: 'text-sm' },
    md: { container: 'h-64', spinner: 'w-12 h-12', text: 'text-base' },
    lg: { container: 'min-h-screen', spinner: 'w-16 h-16', text: 'text-lg' }
  };

  const currentSize = sizeConfig[size];

  if (type === 'wedding') {
    return (
      <div className={`flex items-center justify-center ${currentSize.container}`}>
        <div className="relative">
          {/* Elegant Wedding Loading Animation */}
          <div className="text-center space-y-6">
            {/* Main Spinning Ring */}
            <div className="relative mx-auto" style={{ width: '80px', height: '80px' }}>
              {/* Outer Ring */}
              <div 
                className="absolute inset-0 rounded-full border-4 border-transparent"
                style={{
                  borderTopColor: '#d97706',
                  borderRightColor: '#b45309',
                  animation: 'spin 2s linear infinite'
                }}
              />
              
              {/* Inner Ring */}
              <div 
                className="absolute inset-2 rounded-full border-4 border-transparent"
                style={{
                  borderBottomColor: '#f59e0b',
                  borderLeftColor: '#d97706',
                  animation: 'spin 1.5s linear infinite reverse'
                }}
              />
              
              {/* Center Heart */}
              <div className="absolute inset-0 flex items-center justify-center">
                <Heart 
                  className="w-6 h-6 text-gold animate-pulse" 
                  fill="currentColor"
                />
              </div>
            </div>

            {/* Floating Sparkles */}
            <div className="relative h-8">
              <Sparkles 
                className="absolute left-0 w-4 h-4 text-yellow-500 animate-bounce"
                style={{ animationDelay: '0s', animationDuration: '1.5s' }}
              />
              <Sparkles 
                className="absolute left-8 w-3 h-3 text-gold animate-bounce"
                style={{ animationDelay: '0.3s', animationDuration: '1.8s' }}
              />
              <Sparkles 
                className="absolute right-8 w-3 h-3 text-gold animate-bounce"
                style={{ animationDelay: '0.6s', animationDuration: '1.8s' }}
              />
              <Sparkles 
                className="absolute right-0 w-4 h-4 text-yellow-500 animate-bounce"
                style={{ animationDelay: '0.9s', animationDuration: '1.5s' }}
              />
            </div>

            {/* Loading Text */}
            <div className="space-y-2">
              <p className={`font-lavishly font-bold bg-gradient-to-r from-gold to-accent bg-clip-text text-transparent ${currentSize.text}`}>
                {message}
              </p>
              
              {/* Loading Dots */}
              <div className="flex justify-center space-x-1">
                <div 
                  className="w-2 h-2 bg-gold rounded-full animate-bounce"
                  style={{ animationDelay: '0s' }}
                />
                <div 
                  className="w-2 h-2 bg-gold rounded-full animate-bounce"
                  style={{ animationDelay: '0.2s' }}
                />
                <div 
                  className="w-2 h-2 bg-gold rounded-full animate-bounce"
                  style={{ animationDelay: '0.4s' }}
                />
              </div>
            </div>
          </div>

          {/* Subtle Background Glow */}
          <div 
            className="absolute inset-0 -z-10 rounded-full opacity-20"
            style={{
              background: 'radial-gradient(circle, rgba(217, 119, 6, 0.3) 0%, transparent 70%)',
              filter: 'blur(20px)',
              transform: 'scale(1.5)'
            }}
          />
        </div>
      </div>
    );
  }

  if (type === 'admin') {
    return (
      <div className={`flex items-center justify-center ${currentSize.container}`}>
        <div className="text-center space-y-4">
          {/* Modern Admin Loading */}
          <div className="relative mx-auto" style={{ width: '60px', height: '60px' }}>
            {/* Rotating squares */}
            <div 
              className="absolute inset-0 border-4 border-blue-200 rounded-lg"
              style={{
                borderTopColor: '#3b82f6',
                animation: 'spin 1s linear infinite'
              }}
            />
            <div 
              className="absolute inset-2 border-4 border-blue-300 rounded-lg"
              style={{
                borderBottomColor: '#1d4ed8',
                animation: 'spin 1.5s linear infinite reverse'
              }}
            />
          </div>

          <p className={`text-gray-600 font-medium ${currentSize.text}`}>
            {message}
          </p>

          {/* Progress dots */}
          <div className="flex justify-center space-x-2">
            <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
            <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }} />
            <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }} />
          </div>
        </div>
      </div>
    );
  }

  // General loading
  return (
    <div className={`flex items-center justify-center ${currentSize.container}`}>
      <div className="text-center space-y-4">
        <div 
          className={`mx-auto rounded-full border-4 border-gray-200 border-t-gray-600 animate-spin ${currentSize.spinner}`}
        />
        <p className={`text-gray-600 ${currentSize.text}`}>
          {message}
        </p>
      </div>
    </div>
  );
};

export default EnhancedLoading;