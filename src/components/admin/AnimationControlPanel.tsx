'use client';

import React from 'react';
import { OrnamentAnimation, AnimationType, AnimationSpeed, DEFAULT_ANIMATION_VALUES } from '@/types/ornament';
import { Sparkles, Zap, Clock } from 'lucide-react';

interface AnimationControlPanelProps {
  animation: OrnamentAnimation;
  onChange: (animation: OrnamentAnimation) => void;
}

export default function AnimationControlPanel({ animation, onChange }: AnimationControlPanelProps) {
  const animationTypes: { value: AnimationType; label: string; icon: string }[] = [
    { value: 'none', label: 'Tidak Ada', icon: '⏸️' },
    { value: 'sway', label: 'Goyang (Kiri-Kanan)', icon: '↔️' },
    { value: 'float', label: 'Melayang (Naik-Turun)', icon: '↕️' },
    { value: 'rotate', label: 'Berputar', icon: '🔄' },
    { value: 'pulse', label: 'Berkedip', icon: '💓' },
    { value: 'bounce', label: 'Bouncing', icon: '⬆️' },
    { value: 'sway-float', label: 'Goyang + Melayang', icon: '🌸' },
    { value: 'rotate-float', label: 'Putar + Melayang', icon: '🌀' },
  ];

  return (
    <div className="space-y-4 p-4 bg-white rounded-lg border border-gray-200">
      {/* Enable Toggle */}
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-purple-500" />
          Aktifkan Animasi
        </label>
        <button
          onClick={() => onChange({ ...animation, enabled: !animation.enabled })}
          className={`w-12 h-6 rounded-full transition-colors relative ${
            animation.enabled ? 'bg-green-500' : 'bg-gray-300'
          }`}
        >
          <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${
            animation.enabled ? 'translate-x-7' : 'translate-x-1'
          }`} />
        </button>
      </div>

      {animation.enabled && (
        <>
          {/* Animation Type Grid */}
          <div>
            <label className="text-xs font-medium text-gray-600 mb-2 block">Jenis Animasi</label>
            <div className="grid grid-cols-2 gap-2">
              {animationTypes.map((type) => (
                <button
                  key={type.value}
                  onClick={() => onChange({ ...animation, type: type.value })}
                  className={`px-3 py-2 rounded border text-left transition-all ${
                    animation.type === type.value
                      ? 'border-purple-500 bg-purple-50 shadow-sm'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className="text-lg">{type.icon}</span>
                    <span className="text-sm font-medium">{type.label}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Speed Selector */}
          <div>
            <label className="text-xs font-medium text-gray-600 mb-2 flex items-center gap-1 block">
              <Zap className="w-3 h-3" />
              Kecepatan
            </label>
            <div className="grid grid-cols-3 gap-2">
              {(['slow', 'normal', 'fast'] as AnimationSpeed[]).map((speed) => (
                <button
                  key={speed}
                  onClick={() => onChange({ ...animation, speed })}
                  className={`px-3 py-2 rounded text-sm font-medium transition-all ${
                    animation.speed === speed
                      ? 'bg-purple-500 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {speed === 'slow' ? 'Lambat' : speed === 'normal' ? 'Normal' : 'Cepat'}
                </button>
              ))}
            </div>
            <p className="mt-1 text-xs text-gray-500 text-center">
              {animation.speed === 'slow' && '8 detik per siklus'}
              {animation.speed === 'normal' && '5 detik per siklus'}
              {animation.speed === 'fast' && '3 detik per siklus'}
            </p>
          </div>

          {/* Intensity Slider */}
          <div>
            <label className="text-xs font-medium text-gray-600 mb-1 block">
              Intensitas: {Math.round(animation.intensity * 100)}%
            </label>
            <input
              type="range"
              min="0.1"
              max="1"
              step="0.1"
              value={animation.intensity}
              onChange={(e) => onChange({ ...animation, intensity: parseFloat(e.target.value) })}
              className="w-full accent-purple-500"
            />
            <p className="mt-1 text-xs text-gray-500">Mengontrol jarak gerakan</p>
          </div>

          {/* Delay Slider */}
          <div>
            <label className="text-xs font-medium text-gray-600 mb-1 flex items-center gap-1 block">
              <Clock className="w-3 h-3" />
              Delay: {animation.delay} detik
            </label>
            <input
              type="range"
              min="0"
              max="5"
              step="0.5"
              value={animation.delay}
              onChange={(e) => onChange({ ...animation, delay: parseFloat(e.target.value) })}
              className="w-full accent-purple-500"
            />
            <p className="mt-1 text-xs text-gray-500">Berguna untuk stagger animasi</p>
          </div>

          {/* Info Box */}
          <div className="p-3 bg-blue-50 border border-blue-200 rounded text-xs text-blue-800">
            <p className="font-medium">💡 Preview</p>
            <p className="mt-1">Ornament di canvas akan animate secara real-time</p>
          </div>
        </>
      )}
    </div>
  );
}
