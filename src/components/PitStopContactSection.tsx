import React, { useState } from 'react';
import { RESUME_CONTENT } from '../data/resumeData';
import { Language } from '../types';
import { soundEngine } from '../utils/soundEngine';
import { Phone, Mail, MapPin, Copy, Check, ArrowUp } from 'lucide-react';

interface PitStopContactSectionProps {
  language: Language;
  onScrollToTop: () => void;
  currentScrollX?: number;
  sectionStartX?: number;
  sectionWidth?: number;
  inertiaSkew?: number;
  lightRatio?: number;
}

export const PitStopContactSection: React.FC<PitStopContactSectionProps> = ({
  language,
  onScrollToTop,
  currentScrollX = 0,
  sectionStartX = 0,
  sectionWidth = 900,
  lightRatio = 1,
}) => {
  const content = RESUME_CONTENT[language];
  const isZh = language === 'zh';
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const viewportH = typeof window !== 'undefined' ? window.innerHeight : 900;

  // Relative progress inside Chapter 08 (Contact) content area: 0 to 1
  const relativeScroll = currentScrollX - sectionStartX;
  const progress = Math.min(1.0, Math.max(0, relativeScroll / Math.max(1, sectionWidth)));

  // =========================================================================
  // MOTION CHOREOGRAPHY:
  // "吊牌即将向上滑消失离开屏幕的时候，联系方式卡片才自屏幕最下端边缘露头显现"
  // 1. Entrance (0.00 -> 0.45): Starts peeking at bottom edge (+0.95vh) right as lanyards are about to leave top, and rolls smoothly up to Center (0)
  // 2. Centered & Locked (0.45 -> 1.00): Securely stopped in exact Center (0)
  // =========================================================================
  const enterT = Math.min(1, Math.max(0, progress / 0.45));
  const enterEase = 1 - Math.pow(1 - enterT, 2.6); // Smooth cubic deceleration
  const inY = (1 - enterEase) * (viewportH * 0.95);
  const opacity = Math.min(1, 0.6 + enterT * 0.4);

  // Dynamic light mode theme styles
  const isLight = lightRatio > 0.45;
  const textColor = isLight ? 'text-zinc-900' : 'text-[#F1F1F1]';
  const subtextColor = isLight ? 'text-zinc-500' : 'text-zinc-400';
  const cardBg = isLight
    ? 'bg-white/90 shadow-[0_16px_36px_rgba(0,0,0,0.06)] border border-black/[0.04]'
    : 'bg-[#1E1E20]/90 shadow-xl border border-white/[0.06]';

  const copyToClipboard = (text: string, field: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    soundEngine.playClick();
    setTimeout(() => setCopiedField(null), 1800);
  };

  return (
    <section
      id="contact"
      className="relative w-full h-full flex items-center justify-center bg-transparent overflow-hidden select-none px-4 sm:px-8 lg:px-14"
    >
      {/* Centered Contact Content Container (吊牌即将离开视口顶部时自底端露头并平滑升至中心) */}
      <div
        className="max-w-3xl mx-auto w-full flex flex-col justify-center items-center text-center py-4 z-20 will-change-transform"
        style={{
          transform: `translate3d(0, ${inY}px, 0)`,
          opacity,
          transition: 'transform 0.04s linear, opacity 0.06s linear',
        }}
      >
        {/* Header Label: 字号 1 (大字号: text-lg sm:text-xl) */}
        <div className="w-full flex items-center justify-center mb-6 sm:mb-8">
          <h2 className={`font-noto text-lg sm:text-xl tracking-wider font-semibold ${textColor}`}>
            {isZh ? '开启对话' : 'Contact'}
          </h2>
        </div>

        {/* Contact Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 sm:gap-6 w-full max-w-2xl mb-8">
          {/* Phone Card */}
          <button
            onClick={() => copyToClipboard(content.personal.phone, 'phone')}
            className={`p-6 backdrop-blur-md rounded-2xl flex flex-col items-center justify-center gap-2.5 hover:shadow-2xl transition-all group cursor-pointer ${cardBg} ${textColor}`}
          >
            <div className="w-12 h-12 rounded-full bg-[#FF95B4]/15 flex items-center justify-center text-[#E11D48] group-hover:scale-110 transition-transform">
              <Phone size={20} />
            </div>
            {/* 字号 2 (Level 2: 16px / text-base) */}
            <div className={`text-base font-noto ${subtextColor}`}>
              {content.contact.phoneLabel}
            </div>
            {/* 字号 1 (Level 1: 20px / text-xl) */}
            <div className={`text-xl font-mono font-medium ${textColor}`}>
              {content.personal.phone}
            </div>
            {/* 字号 3 (Level 3: 14px / text-sm) */}
            <div className={`flex items-center gap-1.5 text-sm font-noto ${subtextColor} group-hover:text-[#E11D48] transition-colors`}>
              {copiedField === 'phone' ? (
                <>
                  <Check size={13} className="text-[#E11D48]" />
                  <span className="text-[#E11D48] font-medium">{content.contact.copiedText}</span>
                </>
              ) : (
                <>
                  <Copy size={13} />
                  <span>{content.contact.copyPrompt}</span>
                </>
              )}
            </div>
          </button>

          {/* Email Card */}
          <button
            onClick={() => copyToClipboard(content.personal.email, 'email')}
            className={`p-6 backdrop-blur-md rounded-2xl flex flex-col items-center justify-center gap-2.5 hover:shadow-2xl transition-all group cursor-pointer ${cardBg} ${textColor}`}
          >
            <div className="w-12 h-12 rounded-full bg-[#FF95B4]/15 flex items-center justify-center text-[#E11D48] group-hover:scale-110 transition-transform">
              <Mail size={20} />
            </div>
            {/* 字号 2 (Level 2: 16px / text-base) */}
            <div className={`text-base font-noto ${subtextColor}`}>
              {content.contact.emailLabel}
            </div>
            {/* 字号 1 (Level 1: 20px / text-xl) */}
            <div className={`text-xl font-mono font-medium break-all ${textColor}`}>
              {content.personal.email}
            </div>
            {/* 字号 3 (Level 3: 14px / text-sm) */}
            <div className={`flex items-center gap-1.5 text-sm font-noto ${subtextColor} group-hover:text-[#E11D48] transition-colors`}>
              {copiedField === 'email' ? (
                <>
                  <Check size={13} className="text-[#E11D48]" />
                  <span className="text-[#E11D48] font-medium">{content.contact.copiedText}</span>
                </>
              ) : (
                <>
                  <Copy size={13} />
                  <span>{content.contact.copyPrompt}</span>
                </>
              )}
            </div>
          </button>
        </div>

        {/* Location Notice: (Level 3: 14px / text-sm) */}
        <div className="flex flex-col items-center gap-3 mb-8">
          <div className={`inline-flex items-center gap-1.5 text-sm font-noto ${subtextColor}`}>
            <MapPin size={15} className="text-[#E11D48]" />
            <span>{isZh ? '上海' : (content.personal.location?.split(' ')[0] || 'Shanghai')}</span>
          </div>
        </div>

        {/* Back to Top Trigger: (Level 3: 14px / text-sm) */}
        <button
          onClick={() => {
            soundEngine.playClick();
            onScrollToTop();
          }}
          className="inline-flex items-center gap-1.5 text-sm font-noto tracking-wider transition-colors cursor-pointer bg-transparent border-none outline-none p-2 text-zinc-500 hover:text-[#E11D48] group"
        >
          <ArrowUp size={14} className="group-hover:-translate-y-1 transition-transform" />
          <span>{isZh ? '返回顶部' : 'Back to Top'}</span>
        </button>
      </div>
    </section>
  );
};
