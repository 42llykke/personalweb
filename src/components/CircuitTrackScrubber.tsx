import React from 'react';
import { RESUME_CHAPTERS } from '../data/resumeData';
import { Language } from '../types';
import { soundEngine } from '../utils/soundEngine';

interface CircuitTrackScrubberProps {
  activeSection: string;
  progress: number;
  language: Language;
  onSelectSection: (id: string) => void;
}

export const CircuitTrackScrubber: React.FC<CircuitTrackScrubberProps> = ({
  activeSection,
  progress,
  language,
  onSelectSection,
}) => {
  const chapters = RESUME_CHAPTERS[language];
  const isZh = language === 'zh';

  // Do not show scrubber on hero to keep the viewport ultra-minimalist
  if (activeSection === 'hero') {
    return null;
  }

  return (
    <aside
      aria-label={isZh ? '章节导航' : 'Chapter Navigation'}
      className="fixed right-6 top-1/2 -translate-y-1/2 z-40 hidden xl:flex flex-col items-center select-none pointer-events-none no-print transition-opacity duration-300"
    >
      <div className="pointer-events-auto bg-[#12141D]/80 backdrop-blur-xl border border-white/10 rounded-full py-4 px-2 flex flex-col items-center gap-3 shadow-2xl">
        {/* Vertical Track Spine */}
        <div className="relative w-1 h-48 bg-white/15 rounded-full flex flex-col justify-between items-center py-1">
          {/* Active Dot Indicator */}
          <div
            className="absolute left-1/2 -translate-x-1/2 w-2.5 h-2.5 rounded-full bg-[#E4032E] shadow-md transition-all duration-300 pointer-events-none"
            style={{ top: `${Math.min(94, Math.max(2, progress))}%` }}
          />

          {chapters.map((chap) => {
            const isActive = activeSection === chap.id;
            return (
              <button
                key={chap.id}
                onClick={() => {
                  soundEngine.playClick();
                  onSelectSection(chap.id);
                }}
                onMouseEnter={() => soundEngine.playHover()}
                className="group relative flex items-center justify-center cursor-pointer p-0.5"
                title={chap.title}
              >
                {/* Sector Dot */}
                <span
                  className={`w-2 h-2 rounded-full transition-all duration-200 ${
                    isActive
                      ? 'bg-[#E4032E] scale-125'
                      : 'bg-white/30 group-hover:bg-white'
                  }`}
                />

                {/* Hover Tooltip Label */}
                <span className="absolute right-7 px-2.5 py-1 rounded-md bg-[#161824] border border-white/15 text-white text-[11px] font-noto whitespace-nowrap opacity-0 pointer-events-none group-hover:opacity-100 group-hover:-translate-x-1 transition-all shadow-xl z-50">
                  {chap.title}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </aside>
  );
};
