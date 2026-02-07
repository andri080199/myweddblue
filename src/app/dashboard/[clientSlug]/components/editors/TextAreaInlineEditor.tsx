'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useEditing } from '@/contexts/EditingContext';
import { X, Check, AlertCircle } from 'lucide-react';

interface TextAreaInlineEditorProps {
  sectionId: string;
  contentType: string;
  fieldName: string;
  initialValue: string;
  placeholder?: string;
  maxLength?: number;
  clientSlug: string;
  onSaveSuccess?: () => void;
  onCancel: () => void;
  minRows?: number;
  maxRows?: number;
}

const TextAreaInlineEditor: React.FC<TextAreaInlineEditorProps> = ({
  sectionId,
  contentType,
  fieldName,
  initialValue,
  placeholder = 'Masukkan teks...',
  maxLength = 500,
  clientSlug,
  onSaveSuccess,
  onCancel,
  minRows = 3,
  maxRows = 10,
}) => {
  const { setSaveStatus, unlockEditing } = useEditing();
  const [value, setValue] = useState(initialValue);
  const [error, setError] = useState<string | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const saveTimeoutRef = useRef<NodeJS.Timeout>();

  // Auto-focus on mount
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.focus();
      // Move cursor to end
      const length = textareaRef.current.value.length;
      textareaRef.current.setSelectionRange(length, length);
    }
  }, []);

  // Auto-grow textarea
  const adjustTextareaHeight = useCallback(() => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    textarea.style.height = 'auto';
    const scrollHeight = textarea.scrollHeight;
    const lineHeight = parseInt(getComputedStyle(textarea).lineHeight);
    const minHeight = lineHeight * minRows;
    const maxHeight = lineHeight * maxRows;

    textarea.style.height = `${Math.min(Math.max(scrollHeight, minHeight), maxHeight)}px`;
  }, [minRows, maxRows]);

  useEffect(() => {
    adjustTextareaHeight();
  }, [value, adjustTextareaHeight]);

  // Debounced auto-save
  const saveContent = useCallback(async (newValue: string, skipRefresh = false) => {
    try {
      setSaveStatus(sectionId, 'saving');

      // For love_story, we need to fetch existing data first and merge
      let contentData = { [fieldName]: newValue };

      if (contentType === 'love_story') {
        // Fetch existing love_story data
        const fetchResponse = await fetch(`/api/client-content?clientSlug=${clientSlug}&contentType=love_story`);
        if (fetchResponse.ok) {
          const existingData = await fetchResponse.json();
          if (existingData.length > 0 && existingData[0].content_data) {
            // Merge with existing data
            contentData = {
              ...existingData[0].content_data,
              [fieldName]: newValue,
            };
          }
        }
      }

      const response = await fetch('/api/client-content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          clientSlug,
          contentType,
          contentData,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to save');
      }

      setSaveStatus(sectionId, 'saved');
      // Only trigger refetch on manual save, not auto-save
      if (!skipRefresh && onSaveSuccess) {
        onSaveSuccess();
      }
    } catch (err) {
      console.error('Save error:', err);
      setSaveStatus(sectionId, 'error');
      setError('Gagal menyimpan. Silakan coba lagi.');
    }
  }, [clientSlug, contentType, fieldName, sectionId, setSaveStatus, onSaveSuccess]);

  // Debounce save on change
  useEffect(() => {
    if (value === initialValue) return;

    // Clear previous timeout
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }

    // Set new timeout - skip refresh on auto-save
    saveTimeoutRef.current = setTimeout(() => {
      saveContent(value, true); // true = skip refresh
    }, 500);

    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
    };
  }, [value, initialValue, saveContent]);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newValue = e.target.value;
    if (maxLength && newValue.length > maxLength) {
      setError(`Maksimal ${maxLength} karakter`);
      return;
    }
    setError(null);
    setValue(newValue);
  };

  const handleCancel = () => {
    // Refresh content before closing to show auto-saved changes
    if (onSaveSuccess) {
      onSaveSuccess();
    }
    unlockEditing(sectionId);
    onCancel();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    // Escape to cancel
    if (e.key === 'Escape') {
      handleCancel();
    }
    // Cmd/Ctrl + S to force save
    if ((e.metaKey || e.ctrlKey) && e.key === 's') {
      e.preventDefault();
      saveContent(value);
    }
  };

  const charCount = value.length;
  const charCountClass = charCount > maxLength * 0.9 ? 'text-red-500' : charCount > maxLength * 0.7 ? 'text-yellow-500' : 'text-gray-500';

  return (
    <div className="relative">
      <textarea
        ref={textareaRef}
        value={value}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        className="inline-textarea-editor w-full"
        style={{
          overflow: 'auto',
        }}
      />

      {/* Character counter */}
      {maxLength && (
        <div className={`character-counter ${charCountClass}`}>
          {charCount} / {maxLength}
        </div>
      )}

      {/* Error message */}
      {error && (
        <div className="validation-error">
          <AlertCircle className="w-4 h-4" />
          <span>{error}</span>
        </div>
      )}

      {/* Action buttons */}
      <div className="flex items-center justify-end gap-2 mt-3">
        <button
          onClick={handleCancel}
          className="btn-secondary text-sm flex items-center gap-2"
        >
          <X className="w-4 h-4" />
          Batal
        </button>
        <button
          onClick={() => saveContent(value)}
          className="btn-primary text-sm flex items-center gap-2"
          disabled={!!error}
        >
          <Check className="w-4 h-4" />
          Simpan Sekarang
        </button>
      </div>

      {/* Keyboard shortcut hint */}
      <div className="text-xs text-gray-400 mt-2 text-right">
        Tekan <kbd className="px-1 py-0.5 bg-gray-100 rounded border">Esc</kbd> untuk batal,{' '}
        <kbd className="px-1 py-0.5 bg-gray-100 rounded border">Cmd+S</kbd> untuk simpan
      </div>
    </div>
  );
};

export default TextAreaInlineEditor;
