'use client';

import { useEffect } from 'react';

interface SimpleAlertProps {
  isOpen: boolean;
  onClose: () => void;
  message?: string;
  type?: 'success' | 'error';
}

const SimpleAlert: React.FC<SimpleAlertProps> = ({
  isOpen,
  onClose,
  message = 'Konten berhasil disimpan!',
  type = 'success'
}) => {
  // Auto close after 2 seconds
  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => {
        onClose();
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const isSuccess = type === 'success';

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/20" />
      
      {/* Alert */}
      <div className="relative animate-in zoom-in-95 fade-in-0 duration-300">
        <div className={`${
          isSuccess 
            ? 'bg-green-500 text-white' 
            : 'bg-red-500 text-white'
        } px-8 py-6 rounded-xl shadow-2xl flex items-center gap-4 max-w-sm mx-4`}>
          <span className="text-2xl">
            {isSuccess ? '✅' : '❌'}
          </span>
          <p className="text-base font-medium">
            {message}
          </p>
        </div>
      </div>
    </div>
  );
};

export default SimpleAlert;