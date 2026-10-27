import React, { useEffect, useState } from 'react';
import { X, ZoomIn, ZoomOut, RotateCcw } from 'lucide-react';

interface LightboxProps {
  src: string;
  alt: string;
  caption?: string;
  isOpen: boolean;
  onClose: () => void;
}

export const Lightbox: React.FC<LightboxProps> = ({
  src,
  alt,
  caption,
  isOpen,
  onClose,
}) => {
  const [scale, setScale] = useState(1);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    } else {
      document.body.style.overflow = '';
      setScale(1);
    }
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const zoomIn = () => setScale((s) => Math.min(3, s + 0.5));
  const zoomOut = () => setScale((s) => Math.max(1, s - 0.5));
  const resetZoom = () => setScale(1);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Image preview"
      className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex flex-col justify-between p-4 no-print animate-fade-in"
    >
      {/* Top action bar */}
      <div className="flex items-center justify-between text-white max-w-5xl mx-auto w-full z-10">
        <div className="text-xs font-sans text-gray-300 truncate max-w-[60%]">
          {caption || alt}
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={zoomIn}
            className="p-2 rounded bg-white/10 hover:bg-white/20 text-white transition-colors"
            title="Zoom in"
            aria-label="Zoom in"
          >
            <ZoomIn size={18} />
          </button>
          <button
            onClick={zoomOut}
            className="p-2 rounded bg-white/10 hover:bg-white/20 text-white transition-colors"
            title="Zoom out"
            aria-label="Zoom out"
          >
            <ZoomOut size={18} />
          </button>
          <button
            onClick={resetZoom}
            className="p-2 rounded bg-white/10 hover:bg-white/20 text-white transition-colors"
            title="Reset zoom"
            aria-label="Reset zoom"
          >
            <RotateCcw size={18} />
          </button>
          <button
            onClick={onClose}
            className="p-2 rounded bg-white/10 hover:bg-red-500/80 text-white transition-colors ml-2"
            title="Close lightbox (Esc)"
            aria-label="Close"
          >
            <X size={20} />
          </button>
        </div>
      </div>

      {/* Main Image Viewport with pan & zoom */}
      <div
        className="flex-1 flex items-center justify-center overflow-auto p-2"
        onClick={(e) => {
          if (e.target === e.currentTarget) onClose();
        }}
      >
        <img
          src={src}
          alt={alt}
          style={{ transform: `scale(${scale})`, transition: 'transform 0.2s ease-out' }}
          className="max-h-[80vh] max-w-full object-contain cursor-zoom-in rounded shadow-2xl"
          onClick={() => {
            if (scale === 1) setScale(1.8);
            else setScale(1);
          }}
        />
      </div>

      {/* Footer caption */}
      {caption && (
        <div className="text-center text-xs text-gray-400 font-sans py-2 max-w-3xl mx-auto">
          {caption} <span className="opacity-60">(Tap image or use buttons to zoom. Esc to close)</span>
        </div>
      )}
    </div>
  );
};
