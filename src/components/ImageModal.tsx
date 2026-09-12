import React from 'react';
import { X } from 'lucide-react';

interface ImageModalProps {
  imageUrl: string | null;
  onClose: () => void;
}

export const ImageModal: React.FC<ImageModalProps> = ({ imageUrl, onClose }) => {
  if (!imageUrl) return null;

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0a0a0c]/90 backdrop-blur-md animate-fade-in"
    >
      <div className="relative max-w-5xl max-h-[90vh] overflow-hidden rounded-2xl border border-white/10 bg-[#131318] shadow-2xl">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 p-2 bg-[#0a0a0c]/80 hover:bg-red-500 text-white rounded-xl transition-colors z-10 cursor-pointer border border-white/10"
        >
          <X className="w-5 h-5" />
        </button>
        <img src={imageUrl} alt="Zoomed Chart Screenshot" className="max-w-full max-h-[85vh] object-contain mx-auto" />
      </div>
    </div>
  );
};
