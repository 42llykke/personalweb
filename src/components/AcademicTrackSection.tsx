import React, { useState } from 'react';
import { RESUME_CONTENT } from '../data/resumeData';
import { Language } from '../types';
import { Sparkles, MapPin, BookOpen } from 'lucide-react';
import { ThreeWayFlipCard } from './ThreeWayFlipCard';

const DEFAULT_MASTER_IMAGES = [
  '/images/nanan1.jpg',
  '/images/nanan2.jpg',
  '/images/nanan3.jpg',
];

const DEFAULT_BACHELOR_IMAGE = '/images/hugong.jpg';

interface AcademicTrackSectionProps {
  language: Language;
  currentScrollX?: number;
  sectionStartX?: number;
  sectionWidth?: number;
  inertiaSkew?: number;
  lightRatio?: number;
  isEditMode?: boolean;
}

export const AcademicTrackSection: React.FC<AcademicTrackSectionProps> = ({
  language,
  currentScrollX = 0,
  sectionStartX = 0,
  sectionWidth = 2600,
  inertiaSkew = 0,
  lightRatio,
  isEditMode = false,
}) => {
  const content = RESUME_CONTENT[language];
  const isZh = language === 'zh';

  const masterEdu = content.education[0];
  const bachelorEdu = content.education[1];

  const defaultMasterImages = masterEdu?.images || DEFAULT_MASTER_IMAGES;
  const defaultBachelorImage = bachelorEdu?.image || DEFAULT_BACHELOR_IMAGE;

  // Images for Master (3-way interactive flip images with localStorage persistence)
  const [masterImages, setMasterImages] = useState<string[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('lykke_master_images');
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          if (
            Array.isArray(parsed) &&
            parsed.length >= 3 &&
            parsed.every((p) => p.startsWith('/images/'))
          ) {
            return parsed;
          }
        } catch {}
      }
    }
    return defaultMasterImages;
  });

  const handleImageUpload = (index: number, newSrc: string) => {
    setMasterImages((prev) => {
      const next = [...prev];
      next[index] = newSrc;
      if (typeof window !== 'undefined') {
        localStorage.setItem('lykke_master_images', JSON.stringify(next));
      }
      return next;
    });
  };

  const bachelorImg = defaultBachelorImage;

  // Relative scroll progress within education section [0, 1]
  const scrollDistance = Math.max(1, sectionWidth);
  const relativeScroll = currentScrollX - sectionStartX;
  const progress = Math.min(1.05, Math.max(0, relativeScroll / scrollDistance));

  // =========================================================================
  // LIGHT RATIO CALCULATION (0 = Dark, 1 = Light)
  // =========================================================================
  const eduLight =
    lightRatio !== undefined
      ? lightRatio
      : progress <= 0.18
      ? 0
      : Math.min(1, Math.max(0, (progress - 0.18) / (0.68 - 0.18)));

  // Dynamic Typography Palette: Dark Mode -> Light Mode (时刻保证字在背景上清晰可辨，杜绝中间态灰度重叠)
  // Contrast transfer function that prevents middle-gray collision with dynamic background:
  const contrastT = 1 / (1 + Math.exp(-(eduLight - 0.48) * 18));

  const textHeading = `rgb(${Math.round(255 - (255 - 15) * contrastT)}, ${Math.round(255 - (255 - 15) * contrastT)}, ${Math.round(255 - (255 - 20) * contrastT)})`;
  const textSub = `rgb(${Math.round(235 - (235 - 50) * contrastT)}, ${Math.round(235 - (235 - 50) * contrastT)}, ${Math.round(240 - (240 - 60) * contrastT)})`;
  const textContrastShadow =
    eduLight < 0.48
      ? '0 1px 3px rgba(0, 0, 0, 0.9), 0 0 1px rgba(0, 0, 0, 0.8)'
      : '0 1px 2px rgba(255, 255, 255, 0.95), 0 0 1px rgba(255, 255, 255, 0.8)';
  const chipBg = `rgba(${Math.round(255 - (255 - 17) * contrastT)}, ${Math.round(255 - (255 - 19) * contrastT)}, ${Math.round(255 - (255 - 28) * contrastT)}, ${0.05 + 0.03 * contrastT})`;

  // =========================================================================
  // 1. MASTER TIMING CHOREOGRAPHY (内容文字与图片自下而上滑入)
  // =========================================================================
  const masterEnterT = Math.min(1, Math.max(0, progress / 0.16));
  const masterEnterEase = 1 - Math.pow(1 - masterEnterT, 2.5);

  const masterExitT = Math.min(1, Math.max(0, (progress - 0.42) / 0.20));
  const masterExitEase = masterExitT * masterExitT * (3 - 2 * masterExitT); // smoothstep

  const masterX = 0;
  const masterY = (1 - masterEnterEase) * 260 - masterExitEase * 320;
  const masterOpacity =
    Math.min(1, masterEnterT * 2.2) *
    (progress < 0.42 ? 1.0 : Math.max(0, 1 - masterExitEase * 1.35));
  const masterVisible = masterOpacity > 0.005;

  // =========================================================================
  // 2. BACHELOR TIMING CHOREOGRAPHY (本科阶段：自下而上滑入，向上滑出屏幕)
  // =========================================================================
  const bachelorEnterT = Math.min(1, Math.max(0, (progress - 0.50) / 0.18));
  const bachelorEnterEase = 1 - Math.pow(1 - bachelorEnterT, 3); // cubic ease-out

  const bachelorExitT = Math.min(1, Math.max(0, (progress - 0.84) / 0.16));
  const bachelorExitEase = bachelorExitT * bachelorExitT * (3 - 2 * bachelorExitT); // smoothstep

  // Bachelor translation coordinates (垂直向上滑出屏幕，无水平横移)
  const bachelorX = 0;
  const bachelorY = (1 - bachelorEnterEase) * 450 - bachelorExitEase * 480;
  const bachelorOpacity =
    progress < 0.84
      ? Math.min(1, bachelorEnterT * 2.5)
      : Math.max(0, 1 - bachelorExitEase * 1.5);
  const bachelorVisible = bachelorOpacity > 0.005;

  return (
    <section
      id="education"
      className="relative w-full h-full flex items-center justify-center bg-transparent overflow-hidden select-none px-6 md:px-12 lg:px-16"
    >
      {/* STAGE 1: MASTER DEGREE */}
      <div
        className="absolute inset-0 flex items-center justify-center pointer-events-auto px-6 md:px-[12vw] lg:px-[16.67vw] will-change-transform z-20"
        style={{
          transform: `translate3d(${masterX}px, ${masterY}px, 0)`,
          opacity: masterOpacity,
          visibility: masterVisible ? 'visible' : 'hidden',
          transition: 'transform 0.04s linear, opacity 0.06s linear',
        }}
      >
        <div className="w-full max-w-5xl mx-auto flex flex-col justify-center py-2">
          {/* Row 1: Left Tag (硕士在读) + Right Line (南安普顿大学 数字媒体 2025.09 – 2026.12) */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-8 lg:gap-10 items-baseline mb-6 sm:mb-8">
            {/* Left Header Tag: 字号 text-sm */}
            <div className="md:col-span-3 flex items-center gap-2.5">
              <span className="w-4 flex items-center justify-start flex-shrink-0">
                <span
                  className="w-2 h-2 rounded-full shadow-sm"
                  style={{ backgroundColor: '#FF95B4' }}
                />
              </span>
              <span
                className="font-noto text-sm font-medium tracking-wider uppercase transition-colors duration-150 text-left"
                style={{ color: textHeading, textShadow: textContrastShadow }}
              >
                {masterEdu.degree}
              </span>
            </div>

            {/* Right Header Line: 学校、专业、时间 (Level 1: 20px / text-xl) */}
            <div className="md:col-span-9 flex flex-col sm:flex-row sm:items-baseline justify-between gap-y-2 gap-x-6 transition-colors duration-150">
              <div className="flex flex-wrap items-baseline gap-x-4 gap-y-1">
                <h2
                  className="font-noto text-xl font-medium tracking-wide transition-colors duration-150 text-left"
                  style={{ color: textHeading, textShadow: textContrastShadow }}
                >
                  {masterEdu.school}
                </h2>
                <span
                  className="font-noto text-xl font-normal tracking-wide transition-colors duration-150"
                  style={{ color: textHeading, textShadow: textContrastShadow }}
                >
                  {masterEdu.major}
                </span>
              </div>
              <span
                className="font-mono text-xl font-normal tracking-wider transition-colors duration-150 sm:text-right flex-shrink-0"
                style={{ color: textHeading, textShadow: textContrastShadow }}
              >
                {masterEdu.period}
              </span>
            </div>
          </div>

          {/* Row 2: Left Location + Right (210px x 280px Card + Core Info) */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-8 lg:gap-10 items-start">
            {/* Left Column: Location Tag (字号 text-sm, 图标专用 Hex #FF95B4) */}
            <div className="md:col-span-3 flex items-center gap-2 text-sm font-noto">
              <MapPin size={15} className="text-[#FF95B4] flex-shrink-0" />
              <span style={{ color: textSub, textShadow: textContrastShadow }}>
                {isZh ? '英国' : 'UK'}
              </span>
            </div>

            {/* Right Column: Photo + Details (md:col-span-9, 垂直居中对齐照片中线) */}
            <div className="md:col-span-9 flex flex-col sm:flex-row items-center sm:items-center gap-6 lg:gap-8">
              {/* Photo Card (宽 210px × 高 280px 3-Way 3D Flip Interactive Card) */}
              <div className="w-[210px] flex-shrink-0">
                <ThreeWayFlipCard
                  images={masterImages}
                  width={210}
                  height={280}
                  isEditMode={isEditMode}
                  onImageUpload={handleImageUpload}
                />
              </div>

              {/* Core Information Details (统一字号 text-sm) */}
              <div className="flex-1 flex flex-col justify-center py-1 text-left space-y-4">
                {/* Courses Header & List (字号 text-sm，适当往上移一点) */}
                <div className="space-y-2.5 transform -translate-y-3 sm:-translate-y-5">
                  <div className="flex items-center gap-2 text-sm font-noto font-normal" style={{ color: textHeading, textShadow: textContrastShadow }}>
                    <BookOpen size={14} className="text-[#FF95B4]" />
                    <span>{masterEdu.coursesLabel}</span>
                  </div>
                  <ul className="space-y-2 list-none p-0 m-0 text-sm font-noto leading-relaxed" style={{ color: textSub, textShadow: textContrastShadow }}>
                    {masterEdu.courses?.map((course, idx) => (
                      <li key={idx} style={{ color: textSub, textShadow: textContrastShadow }}>{course}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* STAGE 2: BACHELOR DEGREE (本科阶段：统一大字号与动态背景高对比度适应) */}
      <div
        className="absolute inset-0 flex items-center justify-center pointer-events-auto px-6 md:px-[12vw] lg:px-[16.67vw] will-change-transform z-20"
        style={{
          transform: `translate3d(${bachelorX}px, ${bachelorY}px, 0)`,
          opacity: bachelorOpacity,
          visibility: bachelorVisible ? 'visible' : 'hidden',
          transition: 'transform 0.04s linear, opacity 0.06s linear',
        }}
      >
        <div className="w-full max-w-5xl mx-auto flex flex-col justify-center py-2">
          {/* Row 1: Left Tag (本科) + Right Line (湖北工业大学 视觉传达设计 2021.09 – 2025.06) */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-8 lg:gap-10 items-baseline mb-6 sm:mb-8">
            {/* Left Header Tag: 字号 text-sm */}
            <div className="md:col-span-3 flex items-center gap-2.5">
              <span className="w-4 flex items-center justify-start flex-shrink-0">
                <span
                  className="w-2 h-2 rounded-full shadow-sm"
                  style={{ backgroundColor: '#FF95B4' }}
                />
              </span>
              <span
                className="font-noto text-sm font-medium tracking-wider uppercase transition-colors duration-150 text-left"
                style={{ color: textHeading, textShadow: textContrastShadow }}
              >
                {bachelorEdu.degree}
              </span>
            </div>

            {/* Right Header Line: 学校、专业、时间 (Level 1: 20px / text-xl) */}
            <div className="md:col-span-9 flex flex-col sm:flex-row sm:items-baseline justify-between gap-y-2 gap-x-6 transition-colors duration-150">
              <div className="flex flex-wrap items-baseline gap-x-4 gap-y-1">
                <h2
                  className="font-noto text-xl font-medium tracking-wide transition-colors duration-150 text-left"
                  style={{ color: textHeading, textShadow: textContrastShadow }}
                >
                  {bachelorEdu.school}
                </h2>
                <span
                  className="font-noto text-xl font-normal tracking-wide transition-colors duration-150"
                  style={{ color: textHeading, textShadow: textContrastShadow }}
                >
                  {bachelorEdu.major}
                </span>
              </div>
              <span
                className="font-mono text-xl font-normal tracking-wider transition-colors duration-150 sm:text-right flex-shrink-0"
                style={{ color: textHeading, textShadow: textContrastShadow }}
              >
                {bachelorEdu.period}
              </span>
            </div>
          </div>

          {/* Row 2: Left Location + Right (210px x 280px Card + Core Info) */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-8 lg:gap-10 items-start">
            {/* Left Column: Location Tag (字号 text-sm, 图标专用 Hex #FF95B4) */}
            <div className="md:col-span-3 flex items-center gap-2 text-sm font-noto">
              <MapPin size={15} className="text-[#FF95B4] flex-shrink-0" />
              <span style={{ color: textSub, textShadow: textContrastShadow }}>
                {isZh ? '中国' : 'China'}
              </span>
            </div>

            {/* Right Column: Photo + Details (md:col-span-9, 垂直居中对齐照片中线) */}
            <div className="md:col-span-9 flex flex-col sm:flex-row items-center sm:items-center gap-6 lg:gap-8">
              {/* Photo Card (宽 210px × 高 280px) */}
              <div className="w-[210px] h-[280px] flex-shrink-0 rounded-2xl overflow-hidden shadow-xl border border-white/10 group">
                <img
                  src={bachelorImg}
                  alt={bachelorEdu.school}
                  className="w-full h-full object-cover group-hover:scale-105 transition-all duration-500 filter brightness-95 contrast-105 opacity-0"
                  loading="lazy"
                  onLoad={(e) => e.currentTarget.classList.remove('opacity-0')}
                  referrerPolicy="no-referrer"
                />
              </div>

              {/* Core Information Details (统一字号 text-sm, 先GPA后主修课程) */}
              <div className="flex-1 flex flex-col justify-center py-1 text-left space-y-4">
                <div className="space-y-3 transform -translate-y-3 sm:-translate-y-5">
                  {/* 1. GPA 成绩 (单行显示) */}
                  {bachelorEdu.gpa && (
                    <div
                      className="text-sm font-noto font-normal transition-colors duration-150"
                      style={{ color: textHeading, textShadow: textContrastShadow }}
                    >
                      <span>GPA {bachelorEdu.gpa}</span>
                    </div>
                  )}

                  {/* 2. 主修课程 Header & List */}
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm font-noto font-normal" style={{ color: textHeading, textShadow: textContrastShadow }}>
                      <BookOpen size={14} className="text-[#FF95B4]" />
                      <span>{bachelorEdu.coursesLabel}</span>
                    </div>
                    <ul className="space-y-2 list-none p-0 m-0 text-sm font-noto leading-relaxed" style={{ color: textSub, textShadow: textContrastShadow }}>
                      {bachelorEdu.courses?.map((course, idx) => (
                        <li key={idx} style={{ color: textSub, textShadow: textContrastShadow }}>{course}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
