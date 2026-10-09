import React, { useState, useCallback, useRef } from 'react';
import FlipCard from './FlipCard';
import { Sparkles } from 'lucide-react';

interface ThreeWayFlipCardProps {
  images: string[];
  alt?: string;
  width?: number;
  height?: number;
  radius?: number;
  isEditMode?: boolean;
  onImageUpload?: (index: number, newSrc: string) => void;
}

export const ThreeWayFlipCard: React.FC<ThreeWayFlipCardProps> = ({
  images,
  alt = 'Editorial Photo',
  width = 210,
  height = 280,
  radius = 18,
  isEditMode = false,
  onImageUpload,
}) => {
  const [frontIndex, setFrontIndex] = useState(0);
  const [backIndex, setBackIndex] = useState(1);
  const [isFlipped, setIsFlipped] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Determine currently active visible index for the pagination dots
  const activeIndex = isFlipped ? backIndex : frontIndex;

  const handleFlipChange = useCallback((flipped: boolean) => {
    setIsFlipped(flipped);
    if (flipped) {
      // Just flipped to BACK: update the hidden FRONT face to next image (backIndex + 1) % images.length
      setFrontIndex((prev) => (backIndex + 1) % images.length);
    } else {
      // Just flipped to FRONT: update the hidden BACK face to next image (frontIndex + 1) % images.length
      setBackIndex((prev) => (frontIndex + 1) % images.length);
    }
  }, [backIndex, frontIndex, images.length]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && onImageUpload) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const src = event.target?.result as string;
        if (src) {
          onImageUpload(activeIndex % images.length, src);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="flex flex-col items-center select-none" style={{ width }}>
      <input
        type="file"
        ref={fileInputRef}
        accept="image/*"
        className="hidden"
        onChange={handleFileChange}
      />

      {/* 3D Flip Card Container with Natural Aspect Ratio */}
      <div className="relative group/card" style={{ width, height }}>
        <FlipCard
          width={width}
          height={height}
          radius={radius}
          axis="y"
          flipOnClick={!isEditMode}
          draggable={!isEditMode}
          dragDistance={0}
          tilt={true}
          tiltMax={12}
          glare={true}
          glareOpacity={0.22}
          hoverScale={1.03}
          perspective={1100}
          stiffness={180}
          damping={22}
          background="#18181B"
          shadow={true}
          shadowColor="#000000"
          shadowOpacity={0.45}
          onFlipChange={handleFlipChange}
          front={
            <div className="relative w-full h-full overflow-hidden bg-zinc-900">
              <img
                src={images[frontIndex % images.length]}
                alt={`${alt} ${frontIndex + 1}`}
                width={width}
                height={height}
                className="w-full h-full object-cover select-none pointer-events-none opacity-0 transition-opacity duration-300"
                loading="eager"
                onLoad={(e) => e.currentTarget.classList.remove('opacity-0')}
                onError={(e) => {
                  const target = e.currentTarget;
                  if (!target.dataset.retried) {
                    target.dataset.retried = 'true';
                    const src = images[frontIndex % images.length];
                    if (src.startsWith('/')) {
                      target.src = '.' + src;
                    }
                  }
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/35 via-transparent to-transparent pointer-events-none" />
            </div>
          }
          back={
            <div className="relative w-full h-full overflow-hidden bg-zinc-900">
              <img
                src={images[backIndex % images.length]}
                alt={`${alt} ${backIndex + 1}`}
                width={width}
                height={height}
                className="w-full h-full object-cover select-none pointer-events-none opacity-0 transition-opacity duration-300"
                loading="eager"
                onLoad={(e) => e.currentTarget.classList.remove('opacity-0')}
                onError={(e) => {
                  const target = e.currentTarget;
                  if (!target.dataset.retried) {
                    target.dataset.retried = 'true';
                    const src = images[backIndex % images.length];
                    if (src.startsWith('/')) {
                      target.src = '.' + src;
                    }
                  }
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/35 via-transparent to-transparent pointer-events-none" />
            </div>
          }
        />

        {/* Edit Mode Regenerate Image Overlay */}
        {isEditMode && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/60 backdrop-blur-xs rounded-2xl z-30 p-2 text-center pointer-events-auto">
            <button
              onClick={() => fileInputRef.current?.click()}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[#FF95B4] text-zinc-950 font-noto font-bold text-xs shadow-xl hover:scale-105 active:scale-95 transition-all cursor-pointer border border-white/30"
            >
              <Sparkles size={14} className="text-zinc-950 animate-spin" />
              <span>✨ Regenerate image</span>
            </button>
            <span className="text-[10px] text-white/70 font-mono mt-1.5">
              Card #{ (activeIndex % images.length) + 1 } / { images.length }
            </span>
          </div>
        )}
      </div>

      {/* 3-Image Pagination Dots: Centered slightly outside beneath the card */}
      <div className="mt-3 flex items-center justify-center">
        <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/40 backdrop-blur-md border border-white/10 shadow-sm">
          {images.map((_, idx) => (
            <span
              key={idx}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                activeIndex === idx
                  ? 'w-4 bg-[#FF95B4] shadow-[0_0_8px_rgba(255,149,180,0.8)]'
                  : 'w-1.5 bg-white/40'
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default ThreeWayFlipCard;
