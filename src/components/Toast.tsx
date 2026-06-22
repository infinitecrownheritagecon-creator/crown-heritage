import React, { useEffect } from 'react';

export interface ToastProps {
  message: string;
  type: 'success' | 'error' | 'info' | 'warning';
  onClose: () => void;
}

export default function Toast({ message, type, onClose }: ToastProps) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 4000);
    return () => clearTimeout(timer);
  }, [onClose]);

  const bgClasses = {
    success: 'bg-green-600 border-green-800 text-white',
    error: 'bg-red-600 border-red-800 text-white',
    info: 'bg-[#0A1F44] border-[#1A2E54] text-white',
    warning: 'bg-[#D4A017] border-yellow-700 text-black'
  };

  const icons = {
    success: '✅',
    error: '❌',
    info: 'ℹ️',
    warning: '⚠️'
  };

  return (
    <div className={`fixed bottom-5 right-5 z-50 flex items-center gap-3 px-5 py-3 rounded-xl shadow-2xl border text-sm font-medium animate-bounce ${bgClasses[type]}`}>
      <span className="text-base">{icons[type]}</span>
      <span>{message}</span>
      <button 
        onClick={onClose} 
        className="ml-4 opacity-70 hover:opacity-100 font-bold text-lg leading-none cursor-pointer"
        aria-label="Close notification"
      >
        &times;
      </button>
    </div>
  );
}
