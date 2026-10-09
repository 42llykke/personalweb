import React, { useEffect, useState } from 'react';
import { RESUME_CONTENT } from '../data/resumeData';
import { Language } from '../types';
import { CheckCircle2, Calendar } from 'lucide-react';

// =========================================================================
// 3 DEFAULT PROJECT IMAGES (直接使用 public/images/ 绝对路径)
// =========================================================================
export const PROJECT_IMAGES = [
  '/images/xiangmu1.jpg',
  '/images/xiangmu2.jpg',
  '/images/xiangmu3.jpg',
];

interface ProjectsShowcaseSectionProps {
  language: Language;
  currentScrollX?: number;
  sectionStartX?: number;
  sectionWidth?: number;
  inertiaSkew?: number;
  lightRatio?: number;
}

export const ProjectsShowcaseSection: React.FC<ProjectsShowcaseSectionProps> = ({
  language,
  currentScrollX = 0,
  sectionStartX = 0,
  sectionWidth = 3800,
  lightRatio,
}) => {
  const content = RESUME_CONTENT[language];
  const projects = content.projects || [];

  const [viewportW, setViewportW] = useState(1440);

  useEffect(() => {
    const handleResize = () => {
      setViewportW(window.innerWidth);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Overall scroll progress within Chapter 3 [0, 1]
  const scrollDistance = Math.max(1, sectionWidth);
  const relativeScroll = currentScrollX - sectionStartX;
  const progress = Math.min(1.05, Math.max(0, relativeScroll / scrollDistance));

  const projLight = lightRatio !== undefined ? lightRatio : Math.min(1.0, Math.max(0, progress / 0.52));

  // Dynamic Typography Palette: Dark Mode -> Light Mode
  const textHeading = `rgb(${Math.round(255 - (255 - 17) * projLight)}, ${Math.round(255 - (255 - 19) * projLight)}, ${Math.round(255 - (255 - 28) * projLight)})`;
  const textBody = `rgba(${Math.round(255 - (255 - 17) * projLight)}, ${Math.round(255 - (255 - 19) * projLight)}, ${Math.round(255 - (255 - 28) * projLight)}, 0.82)`;
  const textMuted = `rgba(${Math.round(255 - (255 - 17) * projLight)}, ${Math.round(255 - (255 - 19) * projLight)}, ${Math.round(255 - (255 - 28) * projLight)}, 0.60)`;

  // =========================================================================
  // 3 PRE-RESERVED PHOTO SLOTS (纯展示无转跳、无钩边)
  // =========================================================================
  const photoSlots = [
    {
      id: 'photo-1',
      index: 0,
      side: 'left' as const,
      img: PROJECT_IMAGES[0],
      startP: 0.00,
      endP: 0.22,
    },
    {
      id: 'photo-2',
      index: 1,
      side: 'right' as const,
      img: PROJECT_IMAGES[1],
      startP: 0.15,
      endP: 0.38,
    },
    {
      id: 'photo-3',
      index: 2,
      side: 'left' as const,
      img: PROJECT_IMAGES[2],
      startP: 0.30,
      endP: 0.54,
    },
  ];

  // =========================================================================
  // TEXT PRESENTATION TIMING
  // =========================================================================
  const textZoomStartP = 0.50;
  const textZoomEndP = 0.64;

  const textZoomT = Math.min(1, Math.max(0, (progress - textZoomStartP) / (textZoomEndP - textZoomStartP)));
  const textZoomEase = 1 - Math.pow(1 - textZoomT, 2.5);

  const textScale = 0.85 + textZoomEase * 0.15;
  const textOpacity = Math.min(1, textZoomT * 2.2);

  const cardExitT = Math.min(1, Math.max(0, (progress - 0.85) / 0.15));
  const cardExitEase = cardExitT * cardExitT;
  const cardExitY = -cardExitEase * 980;
  const cardEffectiveOpacity = textOpacity * Math.max(0, 1 - cardExitEase * 1.5);

  return (
    <section
      id="projects"
      className="relative w-full h-full flex items-center justify-center bg-transparent overflow-hidden select-none"
    >

      {/* PHASE 1: 3 ALTERNATING EXPANDING PHOTOS (纯展示、无钩边、无上传按钮) */}
      <div className="absolute inset-0 w-full h-full flex items-center justify-center pointer-events-auto overflow-hidden z-10">
        {photoSlots.map((slot) => {
          const { startP, endP, side, img, index } = slot;
          const isSlotActive = progress >= startP && progress <= endP;
          if (!isSlotActive) return null;

          const localT = (progress - startP) / (endP - startP);

          const startScale = 0.21;
          const maxScale = 1.92;
          const currentScale = startScale + Math.pow(localT, 1.45) * (maxScale - startScale);

          const targetOffset = side === 'left' ? -viewportW * 0.26 : viewportW * 0.26;
          const currentX = localT * targetOffset;

          let opacity = 1;
          if (localT < 0.15) {
            opacity = localT / 0.15;
          } else if (localT > 0.85) {
            opacity = Math.max(0, 1 - (localT - 0.85) / 0.15);
          }

          const zIndex = 15 + index * 5;

          return (
            <div
              key={slot.id}
              className="absolute flex flex-col items-center justify-center will-change-transform pointer-events-auto"
              style={{
                transform: `translate3d(${currentX}px, 0, 0) scale(${currentScale})`,
                opacity,
                zIndex,
                transformOrigin: '50% 50%',
              }}
            >
              {/* Photo Card Frame (纯展示无转跳，无钩边，无上传遮罩) */}
              <div
                className="group relative w-[30vw] min-w-[280px] max-w-[520px] aspect-[3/4] rounded-2xl overflow-hidden shadow-[0_25px_60px_rgba(0,0,0,0.85)] bg-zinc-950 pointer-events-auto block transition-all duration-300"
              >
                <img
                  src={img}
                  alt={`Project Showcase ${index + 1}`}
                  className="w-full h-full object-cover select-none transition-all duration-500 group-hover:scale-105 opacity-0"
                  loading="lazy"
                  onLoad={(e) => e.currentTarget.classList.remove('opacity-0')}
                />
              </div>
            </div>
          );
        })}
      </div>

      {/* PHASE 2 & 3: FULL PROJECT TEXTUAL INTRODUCTION (固定在屏幕中央，无需上下滚动，双字阶排版) */}
      {progress >= textZoomStartP && (
        <div
          className="absolute inset-0 w-full h-full flex items-center justify-center pointer-events-auto px-6 md:px-[16.67vw] will-change-transform z-40"
          style={{
            transform: `translate3d(0, ${cardExitY}px, 0) scale(${textScale})`,
            opacity: cardEffectiveOpacity,
            transformOrigin: '50% 50%',
            transition: 'opacity 0.06s linear',
          }}
        >
          {/* Main Content Wrapper: Statically centered on light background */}
          <div className="w-full max-w-5xl mx-auto flex flex-col justify-center items-stretch bg-transparent py-4">
            {projects.slice(0, 1).map((proj, idx) => (
              <div
                key={proj.id || idx}
                className="space-y-6 transition-colors duration-100"
              >
                {/* Top Row: Title & Period (Level 1: 20px / text-xl | Level 3: 14px / text-sm) */}
                <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-3 pb-1">
                  <h3
                    className="text-xl font-noto font-semibold tracking-tight transition-colors duration-100"
                    style={{ color: textHeading }}
                  >
                    {proj.title}
                  </h3>

                  <div
                    className="flex items-center gap-1.5 text-sm font-mono transition-colors duration-100 flex-shrink-0"
                    style={{ color: textMuted }}
                  >
                    <Calendar size={14} className="text-[#FF95B4]" />
                    <span>{proj.period}</span>
                  </div>
                </div>

                {/* Role (Level 2: 16px / text-base) */}
                <div
                  className="flex items-center text-base font-noto leading-relaxed transition-colors duration-100"
                  style={{ color: textBody }}
                >
                  <span>{proj.role}</span>
                </div>

                {/* Execution Action Bullets (Level 2: 16px / text-base) */}
                <div className="space-y-3.5 pt-2">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
                    {proj.bullets.map((bullet, bIdx) => (
                      <div
                        key={bIdx}
                        className="flex items-start gap-3 text-base font-noto leading-relaxed transition-colors duration-100"
                        style={{ color: textBody }}
                      >
                        <CheckCircle2
                          size={16}
                          className="text-[#FF95B4] flex-shrink-0 mt-0.5"
                        />
                        <span>{bullet}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </section>
  );
};
