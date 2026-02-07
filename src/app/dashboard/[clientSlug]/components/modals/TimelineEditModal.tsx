'use client';

import React, { useState, useEffect } from 'react';
import { 
  X, Check, Loader, ChevronDown, 
  Heart, Gem, HeartHandshake, PartyPopper, CalendarHeart, Sparkles
} from 'lucide-react';
import { useEditing } from '@/contexts/EditingContext';

// Story configuration with specific icons
const STORY_CONFIG = [
  { key: 'story1', title: 'Pertemuan Pertama', icon: Heart, color: 'text-rose-500', bg: 'bg-rose-100', placeholder: 'Ceritakan momen manis saat mata kalian pertama kali bertemu...' },
  { key: 'story2', title: 'Menjalin Hubungan', icon: Sparkles, color: 'text-amber-500', bg: 'bg-amber-100', placeholder: 'Bagaimana perjalanan cinta kalian dimulai dan berkembang...' },
  { key: 'story3', title: 'Momen Lamaran', icon: Gem, color: 'text-purple-500', bg: 'bg-purple-100', placeholder: 'Detik-detik mendebarkan saat melamar/dilamar...' },
  { key: 'story4', title: 'Menuju Pelaminan', icon: PartyPopper, color: 'text-pink-600', bg: 'bg-pink-100', placeholder: 'Harapan dan doa untuk pernikahan impian ini...' },
];

interface TimelineEditModalProps {
  clientSlug: string;
  sectionId: string;
  story1: string;
  story1Visible?: boolean;
  story2: string;
  story2Visible?: boolean;
  story3: string;
  story3Visible?: boolean;
  story4?: string;
  story4Visible?: boolean;
  onClose: () => void;
  onSaveSuccess?: () => void;
}

const TimelineEditModal: React.FC<TimelineEditModalProps> = ({
  clientSlug,
  sectionId,
  story1,
  story1Visible = true,
  story2,
  story2Visible = true,
  story3,
  story3Visible = true,
  story4 = 'Pernikahan kami',
  story4Visible = true,
  onClose,
  onSaveSuccess,
}) => {
  const { setSaveStatus, unlockEditing } = useEditing();
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [expandedStory, setExpandedStory] = useState<string | null>('story1');

  const [formData, setFormData] = useState({
    story1,
    story2,
    story3,
    story4,
  });

  const [visibility, setVisibility] = useState({
    story1: story1Visible,
    story2: story2Visible,
    story3: story3Visible,
    story4: story4Visible,
  });

  // Lock body scroll
  useEffect(() => {
    document.body.classList.add('modal-open');
    return () => {
      document.body.classList.remove('modal-open');
    };
  }, []);

  // Close on Escape
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && !isSaving) {
        handleClose();
      }
    };
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [isSaving]);

  const handleClose = () => {
    unlockEditing(sectionId);
    onClose();
  };

  const handleStoryChange = (key: string, value: string) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const handleVisibilityToggle = (storyKey: string) => {
    setVisibility((prev) => ({
      ...prev,
      [storyKey]: !prev[storyKey as keyof typeof prev],
    }));
  };

  const toggleExpand = (storyKey: string) => {
    setExpandedStory(expandedStory === storyKey ? null : storyKey);
  };

  const handleReset = () => {
    setFormData({ story1, story2, story3, story4 });
    setVisibility({
      story1: story1Visible,
      story2: story2Visible,
      story3: story3Visible,
      story4: story4Visible,
    });
    setError(null);
    setSuccessMessage(null);
  };

  const handleSave = async () => {
    try {
      setIsSaving(true);
      setSaveStatus(sectionId, 'saving');
      setError(null);

      const contentData = {
        story1: formData.story1,
        story1Visible: visibility.story1,
        story2: formData.story2,
        story2Visible: visibility.story2,
        story3: formData.story3,
        story3Visible: visibility.story3,
        story4: formData.story4,
        story4Visible: visibility.story4,
      };

      const response = await fetch('/api/client-content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          clientSlug,
          contentType: 'love_story',
          contentData,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to save');
      }

      setSaveStatus(sectionId, 'saved');
      setSuccessMessage('Cerita cinta berhasil disimpan!');

      if (onSaveSuccess) {
        onSaveSuccess();
      }

      setTimeout(() => {
        handleClose();
      }, 800);
    } catch (err) {
      console.error('Save error:', err);
      setSaveStatus(sectionId, 'error');
      setError('Gagal menyimpan. Silakan coba lagi.');
    } finally {
      setIsSaving(false);
    }
  };

  // Modern Toggle Switch
  const ToggleSwitch = ({ checked, onChange, disabled }: { checked: boolean; onChange: () => void; disabled?: boolean }) => (
    <button
      type="button"
      onClick={(e) => { 
        e.stopPropagation(); // Stop click bubbling to card header
        onChange(); 
      }}
      disabled={disabled}
      className={`relative inline-flex h-7 w-12 items-center rounded-full transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-offset-2 ${checked ? 'bg-pink-500' : 'bg-gray-200'} ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
    >
      <span className={`inline-block h-5 w-5 transform rounded-full bg-white shadow-md transition-transform duration-300 ${checked ? 'translate-x-6' : 'translate-x-1'}`} />
    </button>
  );

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 transition-opacity" onClick={!isSaving ? handleClose : undefined} />

      {/* Modal Container */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
        
        {/* Modal Content */}
        <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl flex flex-col max-h-[90vh] pointer-events-auto overflow-hidden animate-in fade-in zoom-in-95 duration-200">
          
          {/* 1. Header with Gradient */}
          <div className="relative bg-gradient-to-r from-rose-400 to-pink-600 p-6 text-white shrink-0">
            {/* Decor */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2" />
            
            <div className="relative z-10 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white/20 backdrop-blur-md rounded-xl flex items-center justify-center border border-white/20 shadow-inner">
                  <HeartHandshake className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-bold tracking-tight">Kisah Cinta</h2>
                  <p className="text-pink-100 text-xs font-medium">Bagikan perjalanan romantis kalian</p>
                </div>
              </div>
              <button
                onClick={handleClose}
                className="w-8 h-8 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center transition-all backdrop-blur-sm"
                disabled={isSaving}
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* 2. Scrollable Body */}
          <div className="flex-1 overflow-y-auto p-6 bg-gray-50/50 space-y-4">
            
            {/* Notifications */}
            {successMessage && (
              <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3 flex items-center gap-3 animate-pulse">
                <Check className="w-5 h-5 text-emerald-600" />
                <span className="text-emerald-700 font-medium text-sm">{successMessage}</span>
              </div>
            )}
            
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-xl p-3 text-red-600 font-medium text-sm">
                {error}
              </div>
            )}

            {/* Story List */}
            <div className="space-y-4">
              {STORY_CONFIG.map((config, index) => {
                const storyKey = config.key as keyof typeof visibility;
                const isVisible = visibility[storyKey];
                const isExpanded = expandedStory === config.key;
                const content = formData[storyKey as keyof typeof formData];
                const Icon = config.icon;

                return (
                  <div 
                    key={config.key} 
                    className={`relative bg-white rounded-2xl border transition-all duration-300 shadow-sm ${
                      isExpanded ? 'border-pink-300 ring-2 ring-pink-100' : 'border-gray-100 hover:border-pink-200'
                    } ${!isVisible ? 'opacity-70 grayscale-[0.5]' : ''}`}
                  >
                    {/* Timeline Connector Line (Visual) */}
                    {index !== STORY_CONFIG.length - 1 && (
                      <div className="absolute left-[2.25rem] top-[4rem] bottom-[-1rem] w-0.5 border-l-2 border-dashed border-gray-200 -z-10 hidden sm:block"></div>
                    )}

                    {/* Card Header */}
                    <div 
                      className="flex items-center p-4 cursor-pointer gap-4"
                      onClick={() => toggleExpand(config.key)}
                    >
                      {/* Icon */}
                      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 shadow-sm transition-colors ${config.bg} ${config.color}`}>
                         <Icon className="w-6 h-6" />
                      </div>

                      {/* Title & Status */}
                      <div className="flex-1 min-w-0">
                        <h4 className={`font-bold text-gray-900 truncate ${isExpanded ? 'text-pink-600' : ''}`}>
                          {config.title}
                        </h4>
                        <div className="flex items-center gap-2 mt-0.5">
                           <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                             isVisible ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'
                           }`}>
                             {isVisible ? 'Ditampilkan' : 'Disembunyikan'}
                           </span>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center gap-3 shrink-0">
                        {/* Toggle Section */}
                        <div className="flex flex-col items-end" onClick={(e) => e.stopPropagation()}>
                           {/* Hidden text on mobile for cleanliness */}
                           <span className="hidden sm:block text-[10px] text-gray-400 font-medium uppercase mb-1 mr-1">Visibility</span>
                           <ToggleSwitch 
                             checked={isVisible} 
                             onChange={() => handleVisibilityToggle(config.key)} 
                             disabled={isSaving}
                           />
                        </div>
                        
                        {/* Expand Button - Explicit Handler */}
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation(); // Mencegah parent onClick (header) terpanggil double
                            toggleExpand(config.key);
                          }}
                          className={`w-8 h-8 rounded-full flex items-center justify-center bg-gray-50 hover:bg-gray-100 text-gray-400 transition-all duration-300 active:scale-95 ${
                            isExpanded ? 'rotate-180 bg-pink-50 text-pink-500 hover:bg-pink-100' : ''
                          }`}
                        >
                          <ChevronDown className="w-5 h-5" />
                        </button>
                      </div>
                    </div>

                    {/* Expandable Content */}
                    <div 
                      className={`overflow-hidden transition-all duration-500 ease-in-out ${
                        isExpanded ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'
                      }`}
                    >
                      <div className="px-4 pb-5 pt-0 ml-0 sm:ml-[4.5rem]">
                        <div className="relative">
                          <textarea
                            value={content}
                            onChange={(e) => handleStoryChange(config.key, e.target.value)}
                            placeholder={config.placeholder}
                            rows={4}
                            maxLength={500}
                            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-pink-500/30 focus:border-pink-500 transition-all resize-none text-sm leading-relaxed"
                            disabled={isSaving}
                          />
                          <div className="flex justify-between items-center mt-2 px-1">
                             <span className="text-xs text-gray-400 italic">Maksimal 500 karakter</span>
                             <span className={`text-xs font-medium ${content.length > 450 ? 'text-red-500' : 'text-gray-500'}`}>
                               {content.length}/500
                             </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Empty State Info */}
            <div className="text-center p-4">
              <p className="text-xs text-gray-400">
                <CalendarHeart className="w-4 h-4 inline mr-1 mb-0.5" />
                Urutan cerita akan ditampilkan secara kronologis di undangan.
              </p>
            </div>
          </div>

          {/* 3. Footer */}
          <div className="p-4 bg-white border-t border-gray-100 shrink-0 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.02)]">
            <div className="flex flex-col-reverse sm:flex-row gap-3 sm:justify-between items-center">
              <button
                onClick={handleReset}
                className="text-sm text-gray-400 hover:text-gray-600 font-medium px-4 py-2 transition-colors w-full sm:w-auto text-center"
                disabled={isSaving}
              >
                Reset Semua
              </button>

              <div className="flex gap-3 w-full sm:w-auto">
                <button
                  onClick={handleClose}
                  className="flex-1 sm:flex-none px-6 py-2.5 bg-white border border-gray-200 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 transition-all"
                  disabled={isSaving}
                >
                  Batal
                </button>
                <button
                  onClick={handleSave}
                  className="flex-1 sm:flex-none px-8 py-2.5 bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-600 hover:to-pink-700 text-white font-semibold rounded-xl shadow-lg shadow-pink-500/30 hover:shadow-pink-500/40 transition-all active:scale-95 flex items-center justify-center gap-2"
                  disabled={isSaving}
                >
                  {isSaving ? (
                    <>
                      <Loader className="w-4 h-4 animate-spin" />
                      Simpan...
                    </>
                  ) : (
                    <>
                      <Check className="w-4 h-4" />
                      Simpan Perubahan
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>

        </div>
      </div>
    </>
  );
};

export default TimelineEditModal;