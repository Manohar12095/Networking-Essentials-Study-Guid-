import React, { useState } from 'react';
import { Maximize2, AlertTriangle, ChevronDown, ChevronUp } from 'lucide-react';
import { Lightbox } from './Lightbox';

interface ImageFigureProps {
  src: string;
  alt: string;
  caption: string;
  note?: string;
  isCorrectionPanel?: boolean;
}

export const ImageFigure: React.FC<ImageFigureProps> = ({
  src,
  alt,
  caption,
  note,
  isCorrectionPanel = false,
}) => {
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(isCorrectionPanel);
  const resolvedSrc = src.startsWith('/images/') ? '.' + src : src;

  if (isCorrectionPanel) {
    return (
      <div className="my-4 rounded-lg border border-[var(--alert)]/40 bg-[var(--alert)]/5 overflow-hidden">
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="w-full px-4 py-2.5 flex items-center justify-between text-left text-xs font-sans font-bold text-[var(--alert)] hover:bg-[var(--alert)]/10 transition-colors"
        >
          <div className="flex items-center gap-2">
            <AlertTriangle size={15} />
            <span>{note || 'Original illustration (see correction)'}</span>
          </div>
          {isCollapsed ? <ChevronDown size={16} /> : <ChevronUp size={16} />}
        </button>

        {!isCollapsed && (
          <div className="p-4 border-t border-[var(--alert)]/20 bg-[var(--surface)]">
            <figure className="relative group cursor-pointer" onClick={() => setIsLightboxOpen(true)}>
              <div className="relative overflow-hidden rounded border border-[var(--rule)]">
                <img
                  src={resolvedSrc}
                  alt={alt}
                  loading="lazy"
                  decoding="async"
                  className="w-full h-auto object-contain max-h-[480px] bg-white"
                />
                <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-xs font-sans gap-1.5">
                  <Maximize2 size={16} />
                  <span>Tap to expand full screen</span>
                </div>
              </div>
              <figcaption className="mt-2 text-xs text-[var(--muted)] text-center font-sans">
                {caption}
              </figcaption>
            </figure>
          </div>
        )}

        <Lightbox
          src={resolvedSrc}
          alt={alt}
          caption={caption}
          isOpen={isLightboxOpen}
          onClose={() => setIsLightboxOpen(false)}
        />
      </div>
    );
  }

  return (
    <figure className="my-5">
      <div
        className="relative group cursor-pointer overflow-hidden rounded-lg border border-[var(--rule)] bg-white p-2 shadow-sm"
        onClick={() => setIsLightboxOpen(true)}
      >
        <img
          src={resolvedSrc}
          alt={alt}
          loading="lazy"
          decoding="async"
          className="w-full h-auto object-contain max-h-[500px] mx-auto"
        />
        <div className="absolute bottom-4 right-4 bg-black/70 backdrop-blur-sm text-white px-2.5 py-1 rounded text-xs flex items-center gap-1.5 opacity-90 group-hover:opacity-100 transition-opacity">
          <Maximize2 size={13} />
          <span className="hidden sm:inline">Tap to expand</span>
        </div>
      </div>
      <figcaption className="mt-2 text-xs sm:text-sm text-[var(--muted)] text-center font-sans">
        {caption}
      </figcaption>

      <Lightbox
        src={resolvedSrc}
        alt={alt}
        caption={caption}
        isOpen={isLightboxOpen}
        onClose={() => setIsLightboxOpen(false)}
      />
    </figure>
  );
};
