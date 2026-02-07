'use client';

import React, { useCallback } from 'react';
import { Edit2, Check, Loader2, AlertCircle, X } from 'lucide-react';
import { useEditing } from '@/contexts/EditingContext';

interface EditableSectionProps {
  sectionId: string;
  sectionName: string;
  children: React.ReactNode;
  onEdit?: () => void;
  onClose?: () => void;
  className?: string;
}

const EditableSection: React.FC<EditableSectionProps> = ({
  sectionId,
  sectionName,
  children,
  onEdit,
  onClose,
  className = ''
}) => {
  const {
    lockEditing,
    unlockEditing,
    getSaveStatus,
    currentSection
  } = useEditing();

  const isEditing = currentSection === sectionId;
  const saveStatus = getSaveStatus(sectionId);

  const handleEditClick = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    const locked = lockEditing(sectionId);
    if (locked && onEdit) {
      onEdit();
    }
  }, [sectionId, lockEditing, onEdit]);

  const handleCancelEdit = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    unlockEditing(sectionId);
    if (onClose) {
      onClose();
    }
  }, [sectionId, unlockEditing, onClose]);

  const renderStatus = () => {
    if (saveStatus === 'saving') {
      return (
        <div className="flex items-center gap-2 text-blue-600">
          <Loader2 className="w-3.5 h-3.5 animate-spin" />
          <span className="text-xs font-semibold">Menyimpan...</span>
        </div>
      );
    }
    if (saveStatus === 'saved') {
      return (
        <div className="flex items-center gap-2 text-emerald-600">
          <Check className="w-3.5 h-3.5" />
          <span className="text-xs font-semibold">Tersimpan</span>
        </div>
      );
    }
    if (saveStatus === 'error') {
      return (
        <div className="flex items-center gap-2 text-rose-600">
          <AlertCircle className="w-3.5 h-3.5" />
          <span className="text-xs font-semibold">Gagal</span>
          <button 
            onClick={handleEditClick}
            className="ml-1 text-xs underline hover:text-rose-700 font-bold"
          >
            Retry
          </button>
        </div>
      );
    }
    
    // Default: Tombol Edit
    return (
      <button
        onClick={handleEditClick}
        className="flex items-center gap-1.5 text-gray-600 md:text-gray-500 md:hover:text-blue-600 transition-colors group/btn"
      >
        {/* Icon Container */}
        <span className="bg-gray-100 md:bg-white md:border md:border-gray-200 md:group-hover/btn:bg-blue-50 md:group-hover/btn:border-blue-100 p-1.5 rounded-full transition-colors">
            <Edit2 className="w-3.5 h-3.5" />
        </span>
        {/* Text Label - Hidden on very small screens if needed, strictly visible on mobile now */}
        <span className="text-xs font-semibold tracking-wide">
          Edit <span className="hidden sm:inline">{sectionName}</span>
        </span>
      </button>
    );
  };

  return (
    <div
      className={`
        relative group rounded-2xl transition-all duration-300 border
        ${isEditing 
          ? 'border-blue-500/30 bg-blue-50/20 ring-2 ring-blue-500/10' 
          : 'border-transparent md:hover:border-gray-200 md:hover:bg-gray-50/50 md:hover:shadow-sm'
        }
        ${className}
      `}
    >
      {/* --- Action Bar (Adaptive Visibility) --- */}
      <div 
        className={`
          absolute top-3 right-3 z-40 
          transition-all duration-300 ease-out transform origin-top-right
          
          /* LOGIKA VISIBILITY: */
          /* 1. Jika sedang edit atau loading: SELALU MUNCUL */
          /* 2. Di Mobile (default): SELALU MUNCUL (opacity-100) */
          /* 3. Di Desktop (md:): HANYA MUNCUL SAAT HOVER (opacity-0 -> hover:100) */
          
          ${(isEditing || saveStatus !== 'idle') 
            ? 'opacity-100 scale-100 translate-y-0' 
            : 'opacity-100 scale-100 translate-y-0 md:opacity-0 md:scale-95 md:-translate-y-2 md:group-hover:opacity-100 md:group-hover:scale-100 md:group-hover:translate-y-0'
          }
        `}
      >
        {/* Container Tombol */}
        <div className="flex items-center gap-2 bg-white/95 backdrop-blur-md shadow-sm border border-gray-100 px-3 py-1.5 rounded-full">
          
          {renderStatus()}

          {/* Tombol Cancel */}
          {isEditing && saveStatus === 'idle' && (
            <div className="pl-2 ml-2 border-l border-gray-200">
                <button
                  onClick={handleCancelEdit}
                  className="p-1 hover:bg-gray-100 rounded-full text-gray-400 hover:text-gray-600 transition-colors"
                  title="Batalkan edit"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
            </div>
          )}
        </div>
      </div>

      {/* --- Mobile Indicator Border (Optional) --- */}
      {/* Border putus-putus tipis di mobile supaya user tau area ini terpisah/bisa diedit */}
      {!isEditing && (
        <div className="absolute inset-0 border border-dashed border-gray-200 rounded-2xl pointer-events-none md:hidden opacity-50"></div>
      )}

      {/* --- Content Area --- */}
      <div className={`transition-all duration-300 ${isEditing ? 'opacity-40 grayscale-[0.3] pointer-events-none blur-[1px]' : ''}`}>
        {children}
      </div>

      {/* --- Active Overlay Indicator --- */}
      {isEditing && (
        <div className="absolute inset-0 rounded-2xl bg-blue-500/5 pointer-events-none animate-in fade-in duration-300" />
      )}
    </div>
  );
};

export default EditableSection;