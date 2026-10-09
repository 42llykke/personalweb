import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { RESUME_CHAPTERS } from '../data/resumeData';
import { Language } from '../types';
import { soundEngine } from '../utils/soundEngine';
import { X, ArrowRight } from 'lucide-react';

interface ChaptersOverlayProps {
  isOpen: boolean;
  onClose: () => void;
  activeSection: string;
  onSelectSection: (id: string) => void;
  language: Language;
}

export const ChaptersOverlay: React.FC<ChaptersOverlayProps> = ({
  isOpen,
  onClose,
  activeSection,
  onSelectSection,
  language,
}) => {
  const chapters = RESUME_CHAPTERS[language];
  const isZh = language === 'zh';

  const handleSelect = (id: string) => {
    soundEngine.playClick();
    onSelectSection(id);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          className="fixed inset-0 z-50 bg-[#0A0B0E]/96 backdrop-blur-2xl flex flex-col justify-between p-6 sm:p-12 overflow-y-auto no-print select-none text-white"
        >
          {/* Header (Borderless) */}
          <div className="flex items-center justify-between pb-6">
            <div className="flex items-center gap-3">
              <span className="w-2.5 h-2.5 rounded-full bg-[#E4032E]" />
              <span className="font-condensed font-black italic text-2xl tracking-wider text-white">
                LYKKE
              </span>
            </div>

            <button
              onClick={() => {
                soundEngine.playClick();
                onClose();
              }}
              className="p-3 rounded-full bg-white/[0.08] hover:bg-white/[0.15] text-zinc-300 transition-colors shadow-sm cursor-pointer"
              title={isZh ? '关闭' : 'Close'}
            >
              <X size={20} />
            </button>
          </div>

          {/* Large Chapters List (Borderless, No numbers) */}
          <div className="max-w-4xl mx-auto w-full py-8 space-y-3">
            {chapters.map((chap) => {
              const isActive = activeSection === chap.id;
              return (
                <button
                  key={chap.id}
                  onClick={() => handleSelect(chap.id)}
                  onMouseEnter={() => soundEngine.playHover()}
                  className={`w-full group flex items-center justify-between p-5 sm:p-6 rounded-2xl transition-all text-left cursor-pointer ${
                    isActive
                      ? 'bg-[#E4032E]/25 shadow-xl'
                      : 'bg-white/[0.035] hover:bg-white/[0.08] hover:shadow-sm'
                  }`}
                >
                  <div className="flex items-center">
                    <span
                      className={`text-2xl sm:text-3xl font-noto ${
                        isActive ? 'text-white font-medium' : 'text-zinc-300 group-hover:text-white font-light'
                      }`}
                    >
                      {chap.title}
                    </span>
                  </div>

                  <ArrowRight
                    size={22}
                    className={`transition-transform duration-200 ${
                      isActive
                        ? 'text-[#E4032E] translate-x-1'
                        : 'text-zinc-600 group-hover:text-white group-hover:translate-x-1'
                    }`}
                  />
                </button>
              );
            })}
          </div>

          {/* Footer Navigation Hints */}
          <div className="flex items-center justify-between pt-6 border-t border-white/10 text-xs text-zinc-400 font-noto">
            <span>{isZh ? '点击任意板块即可快速直达' : 'Click any section to jump'}</span>
            <span className="font-mono">LYKKE PORTFOLIO</span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
