'use client';

import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';

export type SaveStatus = 'idle' | 'saving' | 'saved' | 'error';

interface UnsavedChange {
  contentType: string;
  data: any;
  timestamp: number;
}

interface EditingContextState {
  currentSection: string | null;
  unsavedChanges: Map<string, UnsavedChange>;
  savingStatus: Map<string, SaveStatus>;
  lockEditing: (sectionId: string) => boolean;
  unlockEditing: (sectionId: string) => void;
  saveDraft: (sectionId: string, contentType: string, data: any) => void;
  discardDraft: (sectionId: string) => void;
  getSaveStatus: (sectionId: string) => SaveStatus;
  setSaveStatus: (sectionId: string, status: SaveStatus) => void;
  hasUnsavedChanges: () => boolean;
  clearAllChanges: () => void;
}

const EditingContext = createContext<EditingContextState | undefined>(undefined);

export const EditingProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentSection, setCurrentSection] = useState<string | null>(null);
  const [unsavedChanges, setUnsavedChanges] = useState<Map<string, UnsavedChange>>(new Map());
  const [savingStatus, setSavingStatusState] = useState<Map<string, SaveStatus>>(new Map());

  // Lock editing - only one section can be edited at a time
  const lockEditing = useCallback((sectionId: string): boolean => {
    if (currentSection && currentSection !== sectionId) {
      // Another section is being edited
      return false;
    }
    setCurrentSection(sectionId);
    return true;
  }, [currentSection]);

  // Unlock editing
  const unlockEditing = useCallback((sectionId: string) => {
    if (currentSection === sectionId) {
      setCurrentSection(null);
    }
  }, [currentSection]);

  // Save draft data
  const saveDraft = useCallback((sectionId: string, contentType: string, data: any) => {
    setUnsavedChanges(prev => {
      const updated = new Map(prev);
      updated.set(sectionId, {
        contentType,
        data,
        timestamp: Date.now()
      });
      return updated;
    });
  }, []);

  // Discard draft
  const discardDraft = useCallback((sectionId: string) => {
    setUnsavedChanges(prev => {
      const updated = new Map(prev);
      updated.delete(sectionId);
      return updated;
    });
  }, []);

  // Get save status for a section
  const getSaveStatus = useCallback((sectionId: string): SaveStatus => {
    return savingStatus.get(sectionId) || 'idle';
  }, [savingStatus]);

  // Set save status for a section
  const setSaveStatus = useCallback((sectionId: string, status: SaveStatus) => {
    setSavingStatusState(prev => {
      const updated = new Map(prev);
      updated.set(sectionId, status);
      return updated;
    });

    // Auto-clear 'saved' status after 3 seconds
    if (status === 'saved') {
      setTimeout(() => {
        setSavingStatusState(prev => {
          const updated = new Map(prev);
          if (updated.get(sectionId) === 'saved') {
            updated.set(sectionId, 'idle');
          }
          return updated;
        });
      }, 3000);
    }
  }, []);

  // Check if there are any unsaved changes
  const hasUnsavedChanges = useCallback((): boolean => {
    return unsavedChanges.size > 0;
  }, [unsavedChanges]);

  // Clear all unsaved changes
  const clearAllChanges = useCallback(() => {
    setUnsavedChanges(new Map());
    setSavingStatusState(new Map());
  }, []);

  // Browser beforeunload warning
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (unsavedChanges.size > 0) {
        e.preventDefault();
        e.returnValue = '';
        return '';
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [unsavedChanges]);

  const value: EditingContextState = {
    currentSection,
    unsavedChanges,
    savingStatus,
    lockEditing,
    unlockEditing,
    saveDraft,
    discardDraft,
    getSaveStatus,
    setSaveStatus,
    hasUnsavedChanges,
    clearAllChanges
  };

  return (
    <EditingContext.Provider value={value}>
      {children}
    </EditingContext.Provider>
  );
};

export const useEditing = (): EditingContextState => {
  const context = useContext(EditingContext);
  if (!context) {
    throw new Error('useEditing must be used within EditingProvider');
  }
  return context;
};

export default EditingContext;
