'use client';

import React, { useState } from 'react';
import { Eye, EyeOff, ChevronDown, ChevronUp, Check, Loader } from 'lucide-react';
import TextAreaInlineEditor from './TextAreaInlineEditor';

interface TimelineInlineEditorProps {
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
  onSaveSuccess?: () => void;
}

// Story configuration
const STORY_CONFIG = [
  { key: 'story1', title: 'Cerita 1 - Pertemuan', placeholder: 'Ceritakan bagaimana kalian pertama kali bertemu...' },
  { key: 'story2', title: 'Cerita 2 - Tunangan', placeholder: 'Ceritakan perjalanan hubungan kalian...' },
  { key: 'story3', title: 'Cerita 3 - Lamaran', placeholder: 'Ceritakan momen lamaran yang spesial...' },
  { key: 'story4', title: 'Cerita 4 - Menikah', placeholder: 'Ceritakan harapan untuk pernikahan kalian...' },
];

const TimelineInlineEditor: React.FC<TimelineInlineEditorProps> = ({
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
  onSaveSuccess,
}) => {
  const [editingStory, setEditingStory] = useState<string | null>(null);
  const [expandedStory, setExpandedStory] = useState<string | null>('story1');
  const [visibility, setVisibility] = useState({
    story1: story1Visible,
    story2: story2Visible,
    story3: story3Visible,
    story4: story4Visible,
  });
  const [savingVisibility, setSavingVisibility] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Get story content by key
  const getStoryContent = (key: string) => {
    switch (key) {
      case 'story1': return story1;
      case 'story2': return story2;
      case 'story3': return story3;
      case 'story4': return story4;
      default: return '';
    }
  };

  const handleVisibilityToggle = async (storyKey: string) => {
    setSavingVisibility(storyKey);
    const newVisibility = { ...visibility, [storyKey]: !visibility[storyKey as keyof typeof visibility] };
    setVisibility(newVisibility);

    try {
      const fetchResponse = await fetch(`/api/client-content?clientSlug=${clientSlug}&contentType=love_story`);
      let contentData = {
        story1,
        story1Visible: newVisibility.story1,
        story2,
        story2Visible: newVisibility.story2,
        story3,
        story3Visible: newVisibility.story3,
        story4,
        story4Visible: newVisibility.story4,
      };

      if (fetchResponse.ok) {
        const existingData = await fetchResponse.json();
        if (existingData.length > 0 && existingData[0].content_data) {
          contentData = { ...existingData[0].content_data, ...contentData };
        }
      }

      await fetch('/api/client-content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          clientSlug,
          contentType: 'love_story',
          contentData,
        }),
      });

      setSuccessMessage(newVisibility[storyKey as keyof typeof newVisibility] ? 'Ditampilkan' : 'Disembunyikan');
      setTimeout(() => setSuccessMessage(null), 1500);

      // Trigger refresh to apply changes immediately
      onSaveSuccess?.();
    } catch (error) {
      console.error('Error saving visibility:', error);
      setVisibility(visibility);
    } finally {
      setSavingVisibility(null);
    }
  };

  const toggleExpand = (storyKey: string) => {
    setExpandedStory(expandedStory === storyKey ? null : storyKey);
    if (editingStory === storyKey) {
      setEditingStory(null);
    }
  };

  // Toggle Switch Component
  const ToggleSwitch = ({
    checked,
    onChange,
    disabled,
    label
  }: {
    checked: boolean;
    onChange: () => void;
    disabled?: boolean;
    label: string;
  }) => (
    <button
      type="button"
      onClick={(e) => {
        e.stopPropagation();
        onChange();
      }}
      disabled={disabled}
      className={`
        relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 ease-in-out
        ${checked ? 'bg-blue-500' : 'bg-gray-300'}
        ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
      `}
      title={label}
    >
      <span
        className={`
          inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-200 ease-in-out shadow-sm
          ${checked ? 'translate-x-6' : 'translate-x-1'}
        `}
      />
    </button>
  );

  return (
    <div className="space-y-4 bg-white bg-opacity-95 backdrop-blur-sm rounded-xl p-4 md:p-6 shadow-xl border-2 border-blue-400 pointer-events-auto mx-4 md:mx-0 max-h-[80vh] overflow-y-auto">
      <div className="mb-6">
        <h3 className="text-xl font-bold text-gray-900 mb-2">Edit Cerita Cinta</h3>
        <p className="text-sm text-gray-500">Klik untuk expand/collapse, toggle untuk show/hide di undangan</p>
      </div>

      {/* Success Message */}
      {successMessage && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-3 text-green-700 text-sm flex items-center gap-2">
          <Check className="w-4 h-4" />
          {successMessage}
        </div>
      )}

      {STORY_CONFIG.map((config) => {
        const storyKey = config.key as keyof typeof visibility;
        const isVisible = visibility[storyKey];
        const isExpanded = expandedStory === config.key;
        const isEditing = editingStory === config.key;
        const content = getStoryContent(config.key);

        return (
          <div
            key={config.key}
            className={`border rounded-lg transition-all duration-300 ${
              isVisible ? 'border-blue-200 bg-blue-50/30' : 'border-gray-200 bg-gray-100 opacity-75'
            }`}
          >
            {/* Header */}
            <div
              className="flex items-center justify-between p-4 cursor-pointer hover:bg-blue-50/50 transition-colors rounded-t-lg"
              onClick={() => toggleExpand(config.key)}
            >
              <div className="flex items-center gap-3 flex-1">
                <button
                  type="button"
                  className="text-blue-600 hover:text-blue-700 transition-transform"
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleExpand(config.key);
                  }}
                >
                  {isExpanded ? (
                    <ChevronUp className="w-5 h-5" />
                  ) : (
                    <ChevronDown className="w-5 h-5" />
                  )}
                </button>
                <h4 className="font-semibold text-gray-900">{config.title}</h4>
              </div>

              <div className="flex items-center gap-3">
                <span className="text-xs text-gray-500">
                  {isVisible ? (
                    <span className="flex items-center gap-1 text-green-600">
                      <Eye className="w-3 h-3" /> Tampil
                    </span>
                  ) : (
                    <span className="flex items-center gap-1 text-gray-400">
                      <EyeOff className="w-3 h-3" /> Sembunyi
                    </span>
                  )}
                </span>
                <ToggleSwitch
                  checked={isVisible}
                  onChange={() => handleVisibilityToggle(config.key)}
                  disabled={savingVisibility === config.key}
                  label={`Toggle ${config.title}`}
                />
              </div>
            </div>

            {/* Content */}
            <div className={`overflow-hidden transition-all duration-300 ${
              isExpanded ? 'max-h-[600px] opacity-100' : 'max-h-0 opacity-0'
            }`}>
              <div className="p-4 pt-0 space-y-3">
                {isEditing ? (
                  <TextAreaInlineEditor
                    sectionId={sectionId}
                    contentType="love_story"
                    fieldName={config.key}
                    initialValue={content}
                    placeholder={config.placeholder}
                    maxLength={500}
                    clientSlug={clientSlug}
                    onSaveSuccess={() => {
                      setEditingStory(null);
                      onSaveSuccess?.();
                    }}
                    onCancel={() => setEditingStory(null)}
                    minRows={4}
                    maxRows={8}
                  />
                ) : (
                  <>
                    <div className="p-4 bg-white rounded-lg border border-gray-200 min-h-[100px]">
                      <p className="text-gray-700 whitespace-pre-wrap text-sm leading-relaxed">
                        {content || 'Belum ada cerita... Klik "Edit" untuk menambahkan.'}
                      </p>
                    </div>
                    <button
                      onClick={() => setEditingStory(config.key)}
                      className="w-full py-2 text-sm text-blue-600 hover:text-blue-700 font-medium hover:bg-blue-50 rounded-md transition-colors"
                    >
                      ✏️ Edit Cerita
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default TimelineInlineEditor;
