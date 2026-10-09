import React from 'react';
import { RESUME_CONTENT } from '../data/resumeData';
import { Language, CursorMode } from '../types';
import { Calendar, CheckCircle2 } from 'lucide-react';
import { FallingBadges } from './FallingBadges';

interface HorizontalExperienceSectionProps {
  sectionWidth?: number;
  language: Language;
  onSetCursorMode?: (mode: CursorMode, text?: string) => void;
  currentScrollX?: number;
  sectionStartX?: number;
  inertiaSkew?: number;
}

export const HorizontalExperienceSection: React.FC<HorizontalExperienceSectionProps> = ({
  language,
  currentScrollX = 0,
  sectionStartX = 0,
  sectionWidth = 1800,
}) => {
  const content = RESUME_CONTENT[language];
  const internships = content.internships;

  const viewportW = typeof window !== 'undefined' ? window.innerWidth : 1440;
  const viewportH = typeof window !== 'undefined' ? window.innerHeight : 900;
  // Exactly 1/3 of half the page width (页面一半的 1/3 距离):
  const halfPageWidth = viewportW * 0.5;
  const convergenceDistance = halfPageWidth / 3;

  // Scroll distance & relative progress inside Chapter 2
  const scrollDistance = Math.max(1, sectionWidth);
  const relativeScroll = currentScrollX - sectionStartX;
  const progress = Math.min(1.05, Math.max(0, relativeScroll / scrollDistance));

  // =========================================================================
  // ENTRANCE & CONVERGENCE CHOREOGRAPHY (Continuous uniform pace)
  // 1. 由下向上滑动进入页面中心 (0.00 -> 0.24)
  // 2. 居中沉浸式完整阅读窗口 (0.24 -> 0.78)
  // 3. 随滚动向顶端平滑滑出屏幕 (0.78 -> 1.00，完全离开屏幕顶端)
  // =========================================================================
  const enterT = Math.min(1, Math.max(0, progress / 0.24));
  const enterEase = 1 - Math.pow(1 - enterT, 2.5); // smooth ease-out

  const exitT = Math.min(1, Math.max(0, (progress - 0.78) / 0.20));
  const exitEase = exitT * exitT * (3 - 2 * exitT); // smoothstep 确保卡片流畅、紧凑地加速滑出屏幕顶端

  // 确保在任何屏幕分辨率下卡片都能 100% 完整向上滑离视口
  const exitDistance = Math.max(1200, viewportH * 1.35);
  const translateY = (1 - enterEase) * 450 - exitEase * exitDistance;
  const leftCardX = - (1 - enterEase) * convergenceDistance;
  const rightCardX = + (1 - enterEase) * convergenceDistance;
  const cardOpacity =
    progress >= 0.98
      ? 0
      : Math.min(1, enterT * 2.2) * Math.max(0, 1 - exitEase * 1.6);
  const isCardInView = enterT >= 0.85 && exitT < 0.3 && cardOpacity > 0.4;

  return (
    <section
      id="experience"
      className="relative w-full h-full flex items-center justify-center bg-transparent overflow-hidden select-none px-4 sm:px-8 lg:px-12"
    >
      {/* Symmetric 2-Card Layout (Each experience occupies exactly half the page, borderless) */}
      <div className="w-full max-w-7xl mx-auto h-[82vh] lg:h-[84vh] grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8 items-stretch z-10">
        
        {/* Left Experience Card (左边经历：无边框) */}
        {internships[0] && (
          <div
            className="w-full h-full flex flex-col justify-between rounded-2xl bg-[#1E1E20]/90 backdrop-blur-xl p-6 sm:p-8 lg:p-9 shadow-2xl transition-all text-[#F1F1F1] overflow-hidden will-change-transform group border-none"
            style={{
              transform: `translate3d(${leftCardX}px, ${translateY}px, 0)`,
              opacity: cardOpacity,
              transition: 'transform 0.04s linear, opacity 0.06s linear',
            }}
          >
            {/* Header: Period, Company, Role */}
            <div className="pb-5">
              <div className="flex items-center justify-start gap-3">
                <div className="flex items-center gap-1.5 text-sm font-mono text-zinc-400">
                  <Calendar size={14} className="text-[#FF95B4]" />
                  <span>{internships[0].period}</span>
                </div>
              </div>

              <h3 className="text-xl font-noto font-semibold text-[#F1F1F1] mt-3 group-hover:text-[#FF95B4] transition-colors tracking-tight text-left">
                {internships[0].company}
              </h3>
              <div className="flex items-center text-base font-noto text-zinc-300 mt-2">
                <span>{internships[0].role}</span>
              </div>
            </div>

            {/* Bullets List */}
            <div className="space-y-3.5 my-auto py-4 overflow-y-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
              {internships[0].bullets.map((bullet, bIdx) => (
                <div key={bIdx} className="flex items-start gap-3">
                  <CheckCircle2
                    size={16}
                    className="text-[#FF95B4] flex-shrink-0 mt-0.5"
                  />
                  <p className="text-base font-noto font-normal text-zinc-300 leading-relaxed">
                    {bullet}
                  </p>
                </div>
              ))}
            </div>

            {/* Skills Footer with Falling Physics Badges */}
            <div className="pt-3">
              <FallingBadges
                items={internships[0].skills}
                triggerOnEnter={isCardInView}
              />
            </div>
          </div>
        )}

        {/* Right Experience Card (右边经历：无边框) */}
        {internships[1] && (
          <div
            className="w-full h-full flex flex-col justify-between rounded-2xl bg-[#1E1E20]/90 backdrop-blur-xl p-6 sm:p-8 lg:p-9 shadow-2xl transition-all text-[#F1F1F1] overflow-hidden will-change-transform group border-none"
            style={{
              transform: `translate3d(${rightCardX}px, ${translateY}px, 0)`,
              opacity: cardOpacity,
              transition: 'transform 0.04s linear, opacity 0.06s linear',
            }}
          >
            {/* Header: Period, Company, Role */}
            <div className="pb-5">
              <div className="flex items-center justify-start gap-3">
                <div className="flex items-center gap-1.5 text-sm font-mono text-zinc-400">
                  <Calendar size={14} className="text-[#FF95B4]" />
                  <span>{internships[1].period}</span>
                </div>
              </div>

              <h3 className="text-xl font-noto font-semibold text-[#F1F1F1] mt-3 group-hover:text-[#FF95B4] transition-colors tracking-tight text-left">
                {internships[1].company}
              </h3>
              <div className="flex items-center text-base font-noto text-zinc-300 mt-2">
                <span>{internships[1].role}</span>
              </div>
            </div>

            {/* Bullets List */}
            <div className="space-y-3.5 my-auto py-4 overflow-y-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
              {internships[1].bullets.map((bullet, bIdx) => (
                <div key={bIdx} className="flex items-start gap-3">
                  <CheckCircle2
                    size={16}
                    className="text-[#FF95B4] flex-shrink-0 mt-0.5"
                  />
                  <p className="text-base font-noto font-normal text-zinc-300 leading-relaxed">
                    {bullet}
                  </p>
                </div>
              ))}
            </div>

            {/* Skills Footer with Falling Physics Badges */}
            <div className="pt-3">
              <FallingBadges
                items={internships[1].skills}
                triggerOnEnter={isCardInView}
              />
            </div>
          </div>
        )}

      </div>
    </section>
  );
};
