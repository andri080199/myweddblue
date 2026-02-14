'use client';

import React from 'react';
import { OrnamentAnimation, LoopAnimationType, EntranceAnimationType, AnimationSpeed, DEFAULT_ANIMATION_VALUES } from '@/types/ornament';
import { Sparkles, Zap, Clock, Play } from 'lucide-react';

interface AnimationControlPanelProps {
  animation: OrnamentAnimation;
  onChange: (animation: OrnamentAnimation) => void;
}

export default function AnimationControlPanel({ animation, onChange }: AnimationControlPanelProps) {
  const loopAnimationTypes: { value: LoopAnimationType; label: string; icon: string }[] = [
    { value: 'none', label: 'Tidak Ada', icon: '⏸️' },
    { value: 'sway', label: 'Goyang (Kiri-Kanan)', icon: '↔️' },
    { value: 'float', label: 'Melayang (Naik-Turun)', icon: '↕️' },
    { value: 'rotate', label: 'Berputar', icon: '🔄' },
    { value: 'pulse', label: 'Berkedip', icon: '💓' },
    { value: 'bounce', label: 'Bouncing', icon: '⬆️' },
    { value: 'sway-float', label: 'Goyang + Melayang', icon: '🌸' },
    { value: 'rotate-float', label: 'Putar + Melayang', icon: '🌀' },
  ];

  const entranceAnimationTypes: { value: EntranceAnimationType; label: string; icon: string }[] = [
    { value: 'none', label: 'Tidak Ada', icon: '⏸️' },
    { value: 'fade-in', label: 'Fade In', icon: '✨' },
    { value: 'slide-left', label: 'Dari Kiri', icon: '→' },
    { value: 'slide-right', label: 'Dari Kanan', icon: '←' },
    { value: 'slide-up', label: 'Dari Bawah', icon: '↑' },
    { value: 'slide-down', label: 'Dari Atas', icon: '↓' },
    { value: 'zoom-in', label: 'Zoom In', icon: '🔍' },
    { value: 'zoom-out', label: 'Zoom Out', icon: '🔎' },
    { value: 'flip-x', label: 'Flip Horizontal', icon: '↔️' },
    { value: 'flip-y', label: 'Flip Vertikal', icon: '↕️' },
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
          {/* Loop Animation Type Grid */}
          <div>
            <label className="text-xs font-medium text-gray-600 mb-2 block">Jenis Animasi Loop (Terus Menerus)</label>
            <div className="grid grid-cols-2 gap-2">
              {loopAnimationTypes.map((type) => (
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

      {/* Entrance Animation Section */}
      <div className="border-t pt-4 mt-4">
        <div className="flex items-center justify-between mb-4">
          <label className="text-sm font-medium flex items-center gap-2">
            <Play className="w-4 h-4 text-green-500" />
            Animasi Masuk (Sekali)
          </label>
          <button
            onClick={() => onChange({ ...animation, entranceEnabled: !animation.entranceEnabled })}
            className={`w-12 h-6 rounded-full transition-colors relative ${
              animation.entranceEnabled ? 'bg-green-500' : 'bg-gray-300'
            }`}
          >
            <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${
              animation.entranceEnabled ? 'translate-x-7' : 'translate-x-1'
            }`} />
          </button>
        </div>

        {animation.entranceEnabled && (
          <>
            {/* Entrance Animation Type Grid */}
            <div>
              <label className="text-xs font-medium text-gray-600 mb-2 block">Jenis Animasi Masuk</label>
              <div className="grid grid-cols-2 gap-2">
                {entranceAnimationTypes.map((type) => (
                  <button
                    key={type.value}
                    onClick={() => onChange({ ...animation, entrance: type.value })}
                    className={`px-3 py-2 rounded border text-left transition-all ${
                      animation.entrance === type.value
                        ? 'border-green-500 bg-green-50 shadow-sm'
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

            {/* Entrance Duration Slider */}
            <div className="mt-4">
              <label className="text-xs font-medium text-gray-600 mb-1 flex items-center gap-1 block">
                <Clock className="w-3 h-3" />
                Durasi: {animation.entranceDuration || 800}ms
              </label>
              <input
                type="range"
                min="300"
                max="2000"
                step="100"
                value={animation.entranceDuration || 800}
                onChange={(e) => onChange({ ...animation, entranceDuration: parseInt(e.target.value) })}
                className="w-full accent-green-500"
              />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>Cepat (300ms)</span>
                <span>Lambat (2s)</span>
              </div>
            </div>

            {/* Info Box for Entrance */}
            <div className="p-3 bg-green-50 border border-green-200 rounded text-xs text-green-800 mt-4">
              <p className="font-medium">🎬 Animasi Masuk</p>
              <p className="mt-1">Animasi akan jalan sekali saat ornament terlihat di layar</p>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
