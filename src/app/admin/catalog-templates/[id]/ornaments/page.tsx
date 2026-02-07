'use client';

import { useState, useEffect, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import EditableOrnament from '@/components/admin/EditableOrnament';
import { useTemplateOrnaments } from '@/hooks/useTemplateOrnaments';
import { Ornament, SectionId } from '@/types/ornament';
import { compressImage } from '@/utils/imageCompression';
import { ArrowLeft, Save, Upload, Eye, EyeOff } from 'lucide-react';

export default function TemplateOrnamentEditorPage() {
  const params = useParams();
  const router = useRouter();
  const templateId = parseInt(params.id as string);

  const [isEditMode, setIsEditMode] = useState(true);
  const [selectedOrnamentId, setSelectedOrnamentId] = useState<string | null>(null);
  const [selectedSection, setSelectedSection] = useState<SectionId>('fullscreen');
  const [saving, setSaving] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);

  const { ornaments, getAllOrnaments, saveOrnaments, refetch } = useTemplateOrnaments(templateId);
  const [localOrnaments, setLocalOrnaments] = useState<Ornament[]>([]);

  const canvasRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Sync ornaments from hook to local state
  useEffect(() => {
    setLocalOrnaments(getAllOrnaments());
  }, [ornaments, getAllOrnaments]);

  // Get ornaments for selected section
  const sectionOrnaments = localOrnaments.filter(o => o.section === selectedSection);

  // Handle ornament update
  const handleOrnamentUpdate = (updated: Ornament) => {
    setLocalOrnaments(prev => prev.map(o => o.id === updated.id ? updated : o));
  };

  // Handle ornament delete
  const handleOrnamentDelete = (id: string) => {
    setLocalOrnaments(prev => prev.filter(o => o.id !== id));
    if (selectedOrnamentId === id) {
      setSelectedOrnamentId(null);
    }
  };

  // Handle save
  const handleSave = async () => {
    try {
      setSaving(true);
      await saveOrnaments(localOrnaments);
      alert('Ornaments saved successfully!');
      refetch();
    } catch (error) {
      console.error('Failed to save ornaments:', error);
      alert('Failed to save ornaments. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  // Handle image upload
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setUploadingImage(true);

      // Compress image
      const compressed = await compressImage(file, {
        maxWidthOrHeight: 500,
        quality: 0.85
      });

      // Create new ornament
      const newOrnament: Ornament = {
        id: `orn-${Date.now()}`,
        section: selectedSection,
        name: file.name.replace(/\.[^/.]+$/, ''),
        image: compressed,
        position: { top: '10%', left: '10%', right: null, bottom: null },
        transform: { scale: 1, rotate: 0 },
        style: { width: '150px', height: 'auto', opacity: 1, zIndex: 15 },
        isVisible: true,
        createdAt: new Date().toISOString()
      };

      setLocalOrnaments(prev => [...prev, newOrnament]);
      setSelectedOrnamentId(newOrnament.id);

    } catch (error) {
      console.error('Failed to upload image:', error);
      alert('Failed to upload image. Please try again.');
    } finally {
      setUploadingImage(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const selectedOrnament = localOrnaments.find(o => o.id === selectedOrnamentId);

  const sections: { id: SectionId; label: string }[] = [
    { id: 'fullscreen', label: 'Fullscreen' },
    { id: 'kutipan', label: 'Kutipan Ayat' },
    { id: 'welcome', label: 'Welcome' },
    { id: 'timeline', label: 'Timeline' },
    { id: 'event', label: 'Event' },
    { id: 'gift', label: 'Gift' },
    { id: 'gallery', label: 'Gallery' },
    { id: 'rsvp', label: 'RSVP' },
    { id: 'guestbook', label: 'Guestbook' },
    { id: 'thankyou', label: 'Thank You' },
    { id: 'footer', label: 'Footer' }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <div className="flex items-center gap-4">
            <button
              onClick={() => router.push('/admin/catalog-templates')}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Back to Templates</span>
            </button>
            <div className="h-6 w-px bg-gray-300" />
            <h1 className="text-xl font-semibold">Template #{templateId} - Ornament Editor</h1>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsEditMode(!isEditMode)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                isEditMode
                  ? 'bg-blue-500 text-white hover:bg-blue-600'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              {isEditMode ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
              <span>{isEditMode ? 'Edit Mode' : 'Preview Mode'}</span>
            </button>

            <button
              onClick={handleSave}
              disabled={saving}
              className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 disabled:opacity-50 transition-colors"
            >
              <Save className="w-4 h-4" />
              <span>{saving ? 'Saving...' : 'Save Changes'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex h-[calc(100vh-73px)]">
        {/* Left Sidebar - Controls */}
        <div className="w-80 bg-white border-r border-gray-200 p-6 overflow-y-auto">
          <div className="space-y-6">
            {/* Section Selector */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Section
              </label>
              <select
                value={selectedSection}
                onChange={(e) => {
                  setSelectedSection(e.target.value as SectionId);
                  setSelectedOrnamentId(null);
                }}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                {sections.map(section => (
                  <option key={section.id} value={section.id}>
                    {section.label} ({localOrnaments.filter(o => o.section === section.id).length})
                  </option>
                ))}
              </select>
            </div>

            {/* Upload Button */}
            <div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
              <button
                onClick={() => fileInputRef.current?.click()}
                disabled={uploadingImage}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 transition-colors"
              >
                <Upload className="w-5 h-5" />
                <span>{uploadingImage ? 'Uploading...' : 'Upload Ornament'}</span>
              </button>
            </div>

            {/* Ornament List */}
            <div>
              <h3 className="text-sm font-medium text-gray-700 mb-3">
                Ornaments in this section ({sectionOrnaments.length})
              </h3>
              <div className="space-y-2">
                {sectionOrnaments.map(ornament => (
                  <div
                    key={ornament.id}
                    onClick={() => setSelectedOrnamentId(ornament.id)}
                    className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                      selectedOrnamentId === ornament.id
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-gray-100 rounded flex items-center justify-center overflow-hidden">
                        <Image
                          src={ornament.image}
                          alt={ornament.name}
                          width={48}
                          height={48}
                          className="object-contain"
                          unoptimized
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {ornament.name}
                        </p>
                        <p className="text-xs text-gray-500">
                          Rotate: {ornament.transform.rotate}° | Scale: {ornament.transform.scale}x
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
                {sectionOrnaments.length === 0 && (
                  <p className="text-sm text-gray-500 text-center py-4">
                    No ornaments yet. Upload one to get started!
                  </p>
                )}
              </div>
            </div>

            {/* Selected Ornament Properties */}
            {selectedOrnament && (
              <div className="border-t pt-6">
                <h3 className="text-sm font-medium text-gray-700 mb-3">
                  Properties
                </h3>
                <div className="space-y-3">
                  <div>
                    <label className="block text-xs text-gray-600 mb-1">Name</label>
                    <input
                      type="text"
                      value={selectedOrnament.name}
                      onChange={(e) => handleOrnamentUpdate({
                        ...selectedOrnament,
                        name: e.target.value
                      })}
                      className="w-full px-2 py-1 text-sm border border-gray-300 rounded"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-600 mb-1">
                      Scale: {selectedOrnament.transform.scale}x
                    </label>
                    <input
                      type="range"
                      min="0.5"
                      max="3"
                      step="0.1"
                      value={selectedOrnament.transform.scale}
                      onChange={(e) => handleOrnamentUpdate({
                        ...selectedOrnament,
                        transform: { ...selectedOrnament.transform, scale: parseFloat(e.target.value) }
                      })}
                      className="w-full"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-600 mb-1">
                      Opacity: {Math.round(selectedOrnament.style.opacity * 100)}%
                    </label>
                    <input
                      type="range"
                      min="0"
                      max="1"
                      step="0.1"
                      value={selectedOrnament.style.opacity}
                      onChange={(e) => handleOrnamentUpdate({
                        ...selectedOrnament,
                        style: { ...selectedOrnament.style, opacity: parseFloat(e.target.value) }
                      })}
                      className="w-full"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-600 mb-1">Z-Index</label>
                    <input
                      type="number"
                      min="5"
                      max="20"
                      value={selectedOrnament.style.zIndex}
                      onChange={(e) => handleOrnamentUpdate({
                        ...selectedOrnament,
                        style: { ...selectedOrnament.style, zIndex: parseInt(e.target.value) }
                      })}
                      className="w-full px-2 py-1 text-sm border border-gray-300 rounded"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Main Canvas Area */}
        <div className="flex-1 bg-gray-100 p-6 overflow-auto">
          <div className="max-w-4xl mx-auto">
            <div
              ref={canvasRef}
              onClick={() => setSelectedOrnamentId(null)}
              className="relative bg-white rounded-lg shadow-lg overflow-hidden"
              style={{
                width: '100%',
                minHeight: '600px',
                backgroundImage: 'linear-gradient(45deg, #f0f0f0 25%, transparent 25%), linear-gradient(-45deg, #f0f0f0 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #f0f0f0 75%), linear-gradient(-45deg, transparent 75%, #f0f0f0 75%)',
                backgroundSize: '20px 20px',
                backgroundPosition: '0 0, 0 10px, 10px -10px, -10px 0px'
              }}
            >
              {/* Section Preview Text */}
              <div className="absolute top-4 left-4 bg-black/50 text-white px-3 py-1 rounded text-sm">
                {sections.find(s => s.id === selectedSection)?.label}
              </div>

              {/* Render Editable Ornaments */}
              {sectionOrnaments.map(ornament => (
                <EditableOrnament
                  key={ornament.id}
                  ornament={ornament}
                  isEditMode={isEditMode}
                  isSelected={selectedOrnamentId === ornament.id}
                  containerWidth={canvasRef.current?.clientWidth || 800}
                  containerHeight={canvasRef.current?.clientHeight || 600}
                  onSelect={() => setSelectedOrnamentId(ornament.id)}
                  onUpdate={handleOrnamentUpdate}
                  onDelete={() => handleOrnamentDelete(ornament.id)}
                />
              ))}
            </div>

            {/* Help Text */}
            {isEditMode && (
              <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-sm text-blue-800">
                  <strong>Tip:</strong> Click on an ornament to select it, then drag to move, use corner handles to resize, and use the rotation button to rotate. Click outside to deselect.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
