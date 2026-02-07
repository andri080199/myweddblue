'use client';

import { useState, useEffect } from 'react';
import { X, Upload } from 'lucide-react';
import { Ornament, SectionId, SECTION_LABELS, DEFAULT_ORNAMENT_VALUES } from '@/types/ornament';
import { compressImage } from '@/utils/imageCompression';

interface OrnamentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (ornament: Ornament) => void;
  editingOrnament?: Ornament | null;
  currentSection: SectionId;
}

export default function OrnamentModal({
  isOpen,
  onClose,
  onSave,
  editingOrnament,
  currentSection
}: OrnamentModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    section: currentSection,
    positionTop: '10',
    positionLeft: '10',
    scale: 1,
    rotate: 0,
    opacity: 1,
    zIndex: 15,
    width: '150',
  });

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState('');
  const [loading, setLoading] = useState(false);

  // Load editing ornament data
  useEffect(() => {
    if (editingOrnament) {
      setFormData({
        name: editingOrnament.name,
        section: editingOrnament.section,
        positionTop: editingOrnament.position.top?.replace('%', '') || '10',
        positionLeft: editingOrnament.position.left?.replace('%', '') || '10',
        scale: editingOrnament.transform.scale,
        rotate: editingOrnament.transform.rotate,
        opacity: editingOrnament.style.opacity,
        zIndex: editingOrnament.style.zIndex,
        width: editingOrnament.style.width.replace('px', ''),
      });
      setImagePreview(editingOrnament.image);
    } else {
      resetForm();
    }
  }, [editingOrnament, currentSection]);

  function resetForm() {
    setFormData({
      name: '',
      section: currentSection,
      positionTop: '10',
      positionLeft: '10',
      scale: 1,
      rotate: 0,
      opacity: 1,
      zIndex: 15,
      width: '150',
    });
    setImageFile(null);
    setImagePreview('');
  }

  async function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file (PNG, JPG, SVG)');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('Image size must be less than 5MB');
      return;
    }

    setImageFile(file);

    // Show preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    // Validation
    if (!formData.name.trim()) {
      alert('Please enter ornament name');
      return;
    }

    if (!imagePreview) {
      alert('Please select an image');
      return;
    }

    setLoading(true);

    try {
      let finalImage = imagePreview;

      // Compress new image if uploaded
      if (imageFile) {
        console.log('📷 Compressing ornament image...', {
          fileName: imageFile.name,
          fileSize: `${(imageFile.size / 1024).toFixed(2)} KB`,
        });

        finalImage = await compressImage(imageFile, 500, 0.85);

        console.log('✅ Image compressed successfully', {
          originalSize: `${(imageFile.size / 1024).toFixed(2)} KB`,
          compressedSize: `${(finalImage.length / 1024).toFixed(2)} KB`,
        });
      }

      // Build ornament object
      const ornament: Ornament = {
        id: editingOrnament?.id || `orn-${Date.now()}`,
        section: formData.section,
        name: formData.name.trim(),
        image: finalImage,
        position: {
          top: `${formData.positionTop}%`,
          left: `${formData.positionLeft}%`,
          right: null,
          bottom: null,
        },
        transform: {
          scale: formData.scale,
          rotate: formData.rotate,
        },
        style: {
          width: `${formData.width}px`,
          height: 'auto',
          opacity: formData.opacity,
          zIndex: formData.zIndex,
        },
        isVisible: true,
        createdAt: editingOrnament?.createdAt || new Date().toISOString(),
      };

      console.log('💾 Saving ornament:', ornament);

      onSave(ornament);
      resetForm();
      onClose();
    } catch (error) {
      console.error('❌ Error saving ornament:', error);
      alert('Failed to save ornament. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900">
            {editingOrnament ? 'Edit Ornament' : 'Add New Ornament'}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Image Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Ornament Image *
            </label>
            {imagePreview ? (
              <div className="relative w-full h-48 bg-gray-100 rounded-lg overflow-hidden border-2 border-gray-300">
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="w-full h-full object-contain"
                />
                <button
                  type="button"
                  onClick={() => {
                    setImageFile(null);
                    setImagePreview('');
                  }}
                  className="absolute top-2 right-2 bg-red-500 text-white px-3 py-1 rounded-lg text-sm hover:bg-red-600"
                >
                  Remove
                </button>
              </div>
            ) : (
              <label className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-blue-500 transition-colors">
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <Upload className="w-12 h-12 text-gray-400 mb-3" />
                  <p className="mb-2 text-sm text-gray-600">
                    <span className="font-semibold">Click to upload</span>
                  </p>
                  <p className="text-xs text-gray-500">PNG, JPG, SVG up to 5MB</p>
                </div>
                <input
                  type="file"
                  className="hidden"
                  accept="image/*"
                  onChange={handleImageChange}
                />
              </label>
            )}
            <p className="text-sm text-gray-500 mt-2">
              Recommended: Transparent PNG, max 500x500px
            </p>
          </div>

          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Ornament Name *
            </label>
            <input
              type="text"
              required
              maxLength={50}
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="e.g., Flower Top Right"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <p className="text-sm text-gray-500 mt-1">
              {formData.name.length}/50 characters
            </p>
          </div>

          {/* Section */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Section *
            </label>
            <select
              required
              value={formData.section}
              onChange={(e) => setFormData({ ...formData, section: e.target.value as SectionId })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {Object.entries(SECTION_LABELS).map(([id, label]) => (
                <option key={id} value={id}>
                  {label}
                </option>
              ))}
            </select>
          </div>

          {/* Position */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Position Top (%)
              </label>
              <input
                type="number"
                min="0"
                max="100"
                step="1"
                value={formData.positionTop}
                onChange={(e) => setFormData({ ...formData, positionTop: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Position Left (%)
              </label>
              <input
                type="number"
                min="0"
                max="100"
                step="1"
                value={formData.positionLeft}
                onChange={(e) => setFormData({ ...formData, positionLeft: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Width & Scale */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Width (px): {formData.width}
              </label>
              <input
                type="range"
                min="50"
                max="500"
                step="10"
                value={formData.width}
                onChange={(e) => setFormData({ ...formData, width: e.target.value })}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>50px</span>
                <span>500px</span>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Scale: {formData.scale}x
              </label>
              <input
                type="range"
                min="0.5"
                max="3"
                step="0.1"
                value={formData.scale}
                onChange={(e) => setFormData({ ...formData, scale: parseFloat(e.target.value) })}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>0.5x</span>
                <span>3x</span>
              </div>
            </div>
          </div>

          {/* Rotation & Opacity */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Rotation: {formData.rotate}°
              </label>
              <input
                type="range"
                min="-180"
                max="180"
                step="5"
                value={formData.rotate}
                onChange={(e) => setFormData({ ...formData, rotate: parseInt(e.target.value) })}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>-180°</span>
                <span>180°</span>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Opacity: {Math.round(formData.opacity * 100)}%
              </label>
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={formData.opacity}
                onChange={(e) => setFormData({ ...formData, opacity: parseFloat(e.target.value) })}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>0%</span>
                <span>100%</span>
              </div>
            </div>
          </div>

          {/* Z-Index */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Z-Index: {formData.zIndex} {formData.zIndex < 10 ? '(Behind content)' : formData.zIndex < 15 ? '(Mixed)' : '(In front)'}
            </label>
            <input
              type="range"
              min="5"
              max="20"
              step="1"
              value={formData.zIndex}
              onChange={(e) => setFormData({ ...formData, zIndex: parseInt(e.target.value) })}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>5 (Back)</span>
              <span>20 (Front)</span>
            </div>
          </div>

          {/* Preview */}
          {imagePreview && (
            <div className="border-2 border-gray-200 rounded-lg p-4 bg-gray-50">
              <p className="text-sm font-medium text-gray-700 mb-2">Live Preview:</p>
              <div className="relative w-full h-32 bg-white rounded border border-gray-300 overflow-hidden">
                <div
                  style={{
                    position: 'absolute',
                    top: `${formData.positionTop}%`,
                    left: `${formData.positionLeft}%`,
                    width: `${formData.width}px`,
                    height: 'auto',
                    opacity: formData.opacity,
                    transform: `scale(${formData.scale}) rotate(${formData.rotate}deg)`,
                    transformOrigin: 'center',
                  }}
                >
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="w-full h-full object-contain"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Buttons */}
          <div className="flex gap-3 pt-4 border-t border-gray-200">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  Saving...
                </span>
              ) : (
                editingOrnament ? 'Update Ornament' : 'Add Ornament'
              )}
            </button>

            <button
              type="button"
              onClick={() => {
                resetForm();
                onClose();
              }}
              className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
