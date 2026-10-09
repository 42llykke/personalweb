import React, { useState } from 'react';
import { Language } from '../types';
import { soundEngine } from '../utils/soundEngine';
import { BubbleMenuOverlay } from './BubbleMenuOverlay';

interface NavigationProps {
  activeSection: string;
  onSelectSection: (id: string) => void;
  language: Language;
  onToggleLanguage: () => void;
}

export const Navigation: React.FC<NavigationProps> = ({
  activeSection,
  onSelectSection,
  language,
  onToggleLanguage,
}) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleToggleMenu = () => {
    soundEngine.playClick();
    setIsMenuOpen((prev) => !prev);
  };

  return (
    <>
      <header className="sticky top-0 z-50 w-full bg-[#1E1E20]/85 backdrop-blur-xl transition-all select-none no-print">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-end gap-5">
          {/* Top-Right: LYKKE Logo Button (Click to trigger BubbleMenu) */}
          <div className="relative inline-block">
            <button
              onClick={handleToggleMenu}
              onMouseEnter={() => soundEngine.playHover()}
              className={`group flex items-center gap-2 px-3 py-1.5 rounded-lg transition-all shadow-sm cursor-pointer border-none ${
                isMenuOpen ? 'bg-white/[0.18]' : 'bg-white/[0.06] hover:bg-white/[0.12]'
              }`}
              aria-label="Toggle navigation menu"
              aria-expanded={isMenuOpen}
            >
              {/* Geometric F1-Inspired Emblem Accent */}
              <div
                className={`w-2 h-4 bg-[#E4032E] skew-x-[-18deg] rounded-[1px] transition-transform ${
                  isMenuOpen ? 'scale-y-125' : 'group-hover:scale-y-110'
                }`}
              />

              {/* Wordmark Logo */}
              <span className="font-condensed font-black italic text-xl tracking-wider text-[#F1F1F1] group-hover:text-[#FF95B4] transition-colors leading-none">
                LYKKE
              </span>
            </button>
          </div>

          {/* Top-Right: Language Switcher (中 / EN) - Borderless */}
          <button
            onClick={() => {
              soundEngine.playClick();
              onToggleLanguage();
            }}
            className="flex items-center rounded-lg bg-white/[0.06] p-0.5 shadow-sm transition-all cursor-pointer border-none"
            title={language === 'zh' ? 'Switch to English' : '切换到中文'}
            aria-label="Language Switcher"
          >
            <span
              className={`px-2.5 py-1 rounded-md text-xs font-noto font-medium transition-all ${
                language === 'zh'
                  ? 'bg-[#E4032E] text-white shadow-xs'
                  : 'text-zinc-400 hover:text-[#FF95B4]'
              }`}
            >
              中
            </span>
            <span
              className={`px-2.5 py-1 rounded-md text-xs font-condensed font-bold transition-all ${
                language === 'en'
                  ? 'bg-[#E4032E] text-white shadow-xs'
                  : 'text-zinc-400 hover:text-[#FF95B4]'
              }`}
            >
              EN
            </span>
          </button>
        </div>
      </header>

      {/* Bubble Menu Fullscreen Stagger Scale-In Expansion Overlay */}
      <BubbleMenuOverlay
        isOpen={isMenuOpen}
        onClose={() => setIsMenuOpen(false)}
        onSelectSection={onSelectSection}
        language={language}
        activeSection={activeSection}
      />
    </>
  );
};
