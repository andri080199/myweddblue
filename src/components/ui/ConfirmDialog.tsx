'use client';

import React, { useEffect } from 'react';
import { X, AlertTriangle, Trash2, RotateCcw, HelpCircle } from 'lucide-react';

type ConfirmType = 'delete' | 'reset' | 'warning' | 'info';

interface ConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  type?: ConfirmType;
  isLoading?: boolean;
}

const typeConfig = {
  delete: {
    icon: Trash2,
    gradient: 'from-red-500 to-rose-600',
    iconBg: 'bg-red-100',
    iconColor: 'text-red-600',
    buttonGradient: 'from-red-500 to-rose-600 hover:from-red-600 hover:to-rose-700',
    ringColor: 'ring-red-500/20',
  },
  reset: {
    icon: RotateCcw,
    gradient: 'from-amber-500 to-orange-600',
    iconBg: 'bg-amber-100',
    iconColor: 'text-amber-600',
    buttonGradient: 'from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700',
    ringColor: 'ring-amber-500/20',
  },
  warning: {
    icon: AlertTriangle,
    gradient: 'from-yellow-500 to-amber-600',
    iconBg: 'bg-yellow-100',
    iconColor: 'text-yellow-600',
    buttonGradient: 'from-yellow-500 to-amber-600 hover:from-yellow-600 hover:to-amber-700',
    ringColor: 'ring-yellow-500/20',
  },
  info: {
    icon: HelpCircle,
    gradient: 'from-blue-500 to-indigo-600',
    iconBg: 'bg-blue-100',
    iconColor: 'text-blue-600',
    buttonGradient: 'from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700',
    ringColor: 'ring-blue-500/20',
  },
};

const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = 'Ya, Lanjutkan',
  cancelText = 'Batal',
  type = 'warning',
  isLoading = false,
}) => {
  const config = typeConfig[type];
  const Icon = config.icon;

  // Close on Escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && !isLoading) {
        onClose();
      }
    };

    if (isOpen) {
      window.addEventListener('keydown', handleEscape);
    }

    return () => window.removeEventListener('keydown', handleEscape);
  }, [isOpen, isLoading, onClose]);

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop with blur */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[10000] animate-fadeIn"
        onClick={!isLoading ? onClose : undefined}
      />

      {/* Dialog */}
      <div className="fixed inset-0 flex items-center justify-center z-[10001] p-4 animate-scaleIn">
        <div
          className="bg-white rounded-3xl shadow-2xl max-w-sm w-full overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header with gradient */}
          <div className={`relative bg-gradient-to-r ${config.gradient} p-6 text-white`}>
            {/* Decorative circles */}
            <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
            <div className="absolute bottom-0 left-0 w-16 h-16 bg-white/10 rounded-full translate-y-1/2 -translate-x-1/2" />

            {/* Close button */}
            <button
              onClick={onClose}
              disabled={isLoading}
              className="absolute top-4 right-4 w-8 h-8 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center hover:bg-white/30 transition-all disabled:opacity-50"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Icon and title */}
            <div className="relative flex flex-col items-center text-center">
              <div className={`w-16 h-16 ${config.iconBg} rounded-2xl flex items-center justify-center mb-4 shadow-lg ring-4 ${config.ringColor}`}>
                <Icon className={`w-8 h-8 ${config.iconColor}`} />
              </div>
              <h3 className="text-xl font-bold">{title}</h3>
            </div>
          </div>

          {/* Content */}
          <div className="p-6">
            <p className="text-gray-600 text-center leading-relaxed">
              {message}
            </p>
          </div>

          {/* Actions */}
          <div className="px-6 pb-6 flex gap-3">
            <button
              onClick={onClose}
              disabled={isLoading}
              className="flex-1 px-5 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold rounded-xl transition-all disabled:opacity-50"
            >
              {cancelText}
            </button>
            <button
              onClick={onConfirm}
              disabled={isLoading}
              className={`flex-1 px-5 py-3 bg-gradient-to-r ${config.buttonGradient} text-white font-semibold rounded-xl shadow-lg transition-all disabled:opacity-50 flex items-center justify-center gap-2`}
            >
              {isLoading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Loading...
                </>
              ) : (
                confirmText
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Animations */}
      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes scaleIn {
          from {
            opacity: 0;
            transform: scale(0.9);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.2s ease-out;
        }
        .animate-scaleIn {
          animation: scaleIn 0.3s ease-out;
        }
      `}</style>
    </>
  );
};

export default ConfirmDialog;
