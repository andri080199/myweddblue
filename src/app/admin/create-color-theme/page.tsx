'use client';

import React, { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { ArrowLeft, Palette, Save, RefreshCw } from 'lucide-react';

// Color presets
const COLOR_PRESETS = [
  {
    id: 'blue',
    name: 'Ocean Blue',
    colors: {
      primary: '#3295c5',
      primarylight: '#5db3d9',
      darkprimary: '#2a7ca8',
      textprimary: '#1a4d6b',
      gold: '#f59e0b',
      lightblue: '#dbeafe',
      secondary: '#06b6d4',
      accent: '#0284c7',
    },
  },
  {
    id: 'pink',
    name: 'Romantic Pink',
    colors: {
      primary: '#f472b6',
      primarylight: '#f9a8d4',
      darkprimary: '#ec4899',
      textprimary: '#831843',
      gold: '#fbbf24',
      lightblue: '#fce7f3',
      secondary: '#db2777',
      accent: '#be185d',
    },
  },
  {
    id: 'purple',
    name: 'Royal Purple',
    colors: {
      primary: '#a855f7',
      primarylight: '#c084fc',
      darkprimary: '#9333ea',
      textprimary: '#581c87',
      gold: '#f59e0b',
      lightblue: '#f3e8ff',
      secondary: '#7c3aed',
      accent: '#6b21a8',
    },
  },
  {
    id: 'green',
    name: 'Emerald Green',
    colors: {
      primary: '#10b981',
      primarylight: '#34d399',
      darkprimary: '#059669',
      textprimary: '#064e3b',
      gold: '#fbbf24',
      lightblue: '#d1fae5',
      secondary: '#14b8a6',
      accent: '#0d9488',
    },
  },
  {
    id: 'orange',
    name: 'Sunset Orange',
    colors: {
      primary: '#f97316',
      primarylight: '#fb923c',
      darkprimary: '#ea580c',
      textprimary: '#7c2d12',
      gold: '#fbbf24',
      lightblue: '#fed7aa',
      secondary: '#f59e0b',
      accent: '#d97706',
    },
  },
];

export default function CreateColorThemePage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const editThemeId = searchParams.get('edit');

  const [isEditMode, setIsEditMode] = useState(false);
  const [loading, setLoading] = useState(false);
  const [themeName, setThemeName] = useState('');
  const [themeId, setThemeId] = useState('');
  const [description, setDescription] = useState('');
  const [selectedPreset, setSelectedPreset] = useState('custom');

  // Color states
  const [colors, setColors] = useState({
    primary: '#3295c5',
    primarylight: '#5db3d9',
    darkprimary: '#2a7ca8',
    textprimary: '#1a4d6b',
    gold: '#f59e0b',
    lightblue: '#dbeafe',
    secondary: '#06b6d4',
    accent: '#0284c7',
  });

  // Load theme data if edit mode
  useEffect(() => {
    const loadThemeData = async () => {
      if (!editThemeId) return;

      setLoading(true);
      try {
        const response = await fetch(`/api/custom-color-themes?themeId=${editThemeId}`);
        if (response.ok) {
          const data = await response.json();
          if (data.success && data.theme) {
            setIsEditMode(true);
            setThemeName(data.theme.themeName);
            setThemeId(data.theme.themeId);
            setDescription(data.theme.description || '');
            setColors(data.theme.colors);
            setSelectedPreset('custom');
          }
        }
      } catch (error) {
        console.error('Error loading theme:', error);
        alert('Gagal load tema');
      } finally {
        setLoading(false);
      }
    };

    loadThemeData();
  }, [editThemeId]);

  // Auto-generate theme ID from name
  const handleThemeNameChange = (name: string) => {
    setThemeName(name);
    if (!isEditMode) {
      const slug = name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-|-$/g, '');
      setThemeId(slug);
    }
  };

  // Apply color preset
  const handlePresetChange = (presetId: string) => {
    setSelectedPreset(presetId);
    if (presetId !== 'custom') {
      const preset = COLOR_PRESETS.find(p => p.id === presetId);
      if (preset) {
        setColors(preset.colors);
      }
    }
  };

  // Update individual color
  const handleColorChange = (colorKey: string, value: string) => {
    setColors(prev => ({ ...prev, [colorKey]: value }));
    setSelectedPreset('custom');
  };

  // Save theme
  const handleSave = async () => {
    if (!themeName.trim() || !themeId.trim()) {
      alert('Nama tema dan ID tema harus diisi!');
      return;
    }

    setLoading(true);
    try {
      const url = '/api/custom-color-themes';
      const method = isEditMode ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          themeId,
          themeName,
          description,
          colors,
        }),
      });

      const data = await response.json();

      if (data.success) {
        alert(isEditMode ? 'Tema berhasil diupdate!' : 'Tema berhasil dibuat!');
        router.push('/admin/theme-backgrounds');
      } else {
        alert(`Gagal: ${data.message}`);
      }
    } catch (error) {
      console.error('Error saving theme:', error);
      alert('Terjadi error saat menyimpan tema');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <button
            onClick={() => router.back()}
            className="p-2 hover:bg-white/50 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-6 h-6 text-gray-700" />
          </button>
          <div>
            <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-3">
              <Palette className="w-8 h-8 text-blue-600" />
              {isEditMode ? 'Edit Color Theme' : 'Create Color Theme'}
            </h1>
            <p className="text-gray-600 mt-1">
              {isEditMode ? 'Update tema warna custom' : 'Buat tema warna custom untuk undangan'}
            </p>
          </div>
        </div>

        {loading && !isEditMode ? (
          <div className="text-center py-12">
            <RefreshCw className="w-8 h-8 animate-spin mx-auto text-blue-600" />
            <p className="mt-4 text-gray-600">Loading...</p>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Theme Info Card */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Theme Information</h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nama Tema *
                  </label>
                  <input
                    type="text"
                    value={themeName}
                    onChange={(e) => handleThemeNameChange(e.target.value)}
                    placeholder="Contoh: Ocean Blue Paradise"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Theme ID *
                  </label>
                  <input
                    type="text"
                    value={themeId}
                    onChange={(e) => setThemeId(e.target.value)}
                    placeholder="ocean-blue-paradise"
                    disabled={isEditMode}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    {isEditMode ? 'ID tidak bisa diubah' : 'Auto-generated dari nama tema'}
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Deskripsi (Optional)
                  </label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Tema warna biru laut yang menenangkan..."
                    rows={3}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>

            {/* Color Presets */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Color Presets</h2>

              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {COLOR_PRESETS.map((preset) => (
                  <button
                    key={preset.id}
                    onClick={() => handlePresetChange(preset.id)}
                    className={`p-4 rounded-lg border-2 transition-all ${
                      selectedPreset === preset.id
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-center gap-3 mb-2">
                      <div
                        className="w-8 h-8 rounded-full"
                        style={{ background: `linear-gradient(135deg, ${preset.colors.primary}, ${preset.colors.primarylight})` }}
                      />
                      <span className="font-medium text-gray-800">{preset.name}</span>
                    </div>
                    <div className="flex gap-1">
                      {Object.values(preset.colors).slice(0, 6).map((color, i) => (
                        <div
                          key={i}
                          className="w-4 h-4 rounded"
                          style={{ backgroundColor: color }}
                        />
                      ))}
                    </div>
                  </button>
                ))}

                <button
                  onClick={() => setSelectedPreset('custom')}
                  className={`p-4 rounded-lg border-2 transition-all ${
                    selectedPreset === 'custom'
                      ? 'border-purple-500 bg-purple-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center gap-3 mb-2">
                    <Palette className="w-8 h-8 text-purple-600" />
                    <span className="font-medium text-gray-800">Custom</span>
                  </div>
                  <p className="text-xs text-gray-500">Pilih warna manual</p>
                </button>
              </div>
            </div>

            {/* Color Pickers */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Color Configuration</h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {Object.entries(colors).map(([key, value]) => (
                  <div key={key} className="flex items-center gap-4">
                    <div className="flex-1">
                      <label className="block text-sm font-medium text-gray-700 mb-2 capitalize">
                        {key.replace(/([A-Z])/g, ' $1').trim()}
                      </label>
                      <div className="flex gap-2">
                        <input
                          type="color"
                          value={value}
                          onChange={(e) => handleColorChange(key, e.target.value)}
                          className="w-16 h-10 rounded cursor-pointer border border-gray-300"
                        />
                        <input
                          type="text"
                          value={value}
                          onChange={(e) => handleColorChange(key, e.target.value)}
                          className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono text-sm"
                        />
                      </div>
                    </div>
                    <div
                      className="w-12 h-12 rounded-lg border-2 border-gray-200 shadow-sm"
                      style={{ backgroundColor: value }}
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Color Preview */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Preview</h2>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {Object.entries(colors).map(([key, value]) => (
                  <div key={key} className="text-center">
                    <div
                      className="w-full h-24 rounded-lg mb-2 shadow-md transition-transform hover:scale-105"
                      style={{ backgroundColor: value }}
                    />
                    <p className="text-xs font-medium text-gray-600 capitalize">
                      {key.replace(/([A-Z])/g, ' $1').trim()}
                    </p>
                    <p className="text-xs text-gray-400 font-mono">{value}</p>
                  </div>
                ))}
              </div>

              {/* Gradient Preview */}
              <div className="mt-6">
                <p className="text-sm font-medium text-gray-700 mb-2">Gradient Preview</p>
                <div
                  className="h-24 rounded-lg shadow-md"
                  style={{
                    background: `linear-gradient(135deg, ${colors.primary} 0%, ${colors.primarylight} 100%)`,
                  }}
                />
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4 justify-end sticky bottom-4">
              <button
                onClick={() => router.back()}
                className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-medium"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={loading}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
              >
                {loading ? (
                  <RefreshCw className="w-5 h-5 animate-spin" />
                ) : (
                  <Save className="w-5 h-5" />
                )}
                {isEditMode ? 'Update Theme' : 'Create Theme'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
