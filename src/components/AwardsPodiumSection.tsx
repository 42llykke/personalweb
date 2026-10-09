import React from 'react';
import { RESUME_CONTENT } from '../data/resumeData';
import { Language } from '../types';
import { DoubleLanyard } from './Lanyard';

interface AwardLanyardData {
  id: string;
  year: string;
  title: string;
  level: string;
  isFirst?: boolean;
}

interface AwardsPodiumSectionProps {
  language: Language;
  currentScrollX?: number;
  sectionStartX?: number;
  sectionWidth?: number;
  inertiaSkew?: number;
  lightRatio?: number;
}

export const AwardsPodiumSection: React.FC<AwardsPodiumSectionProps> = ({
  language,
  currentScrollX = 0,
  sectionStartX = 0,
  sectionWidth = 1000,
  lightRatio,
}) => {
  const content = RESUME_CONTENT[language];

  const viewportH = typeof window !== 'undefined' ? window.innerHeight : 900;

  // Relative progress inside Chapter 07 (Awards) content area: 0 to 1
  const relativeScroll = currentScrollX - sectionStartX;

  // 严格隔离：仅在滚动到达本板块（核心能力“语言”这行字消失在屏幕边缘之后）才可见并激活，绝不覆盖其他任何页面
  const isSectionActive = relativeScroll >= 0 && relativeScroll <= sectionWidth + 100;
  const isDroppedActive = relativeScroll >= 0;

  const progress = Math.min(1.05, Math.max(0, relativeScroll / Math.max(1, sectionWidth)));

  // =========================================================================
  // MOTION CHOREOGRAPHY:
  // 1. Entrance & Centered Reading (0.00 -> 0.32):
  //    两张吊牌在视口中央自然垂落摆动并稳定驻留
  // 2. "吊牌页面渐变一半的时候，吊牌就准备向上滑出了" (0.32 -> 0.85):
  //    当页面背景渐变进行至一半 (progress ≈ 0.32) 时，吊牌准备并平滑匀速向上移出屏幕顶部边界（-135vh）
  // =========================================================================
  const exitStart = 0.32;
  let translateY = 0;
  if (progress > exitStart) {
    const exitT = Math.min(1, Math.max(0, (progress - exitStart) / (0.85 - exitStart)));
    const exitEase = Math.pow(exitT, 1.4);
    translateY = -exitEase * (viewportH * 1.35);
  }

  // "当滑入吊牌页面的时候继续滑动背景就开始变浅":
  // 滑入吊牌页面后继续滑动 (progress >= 0.05)，背景即开始平滑由深色渐变为浅色底色
  const effectiveLight =
    lightRatio !== undefined
      ? lightRatio
      : Math.min(1, Math.max(0, (progress - 0.05) / 0.55));

  const awardList: AwardLanyardData[] = (content.awards || []).map((award, idx) => ({
    id: award.id,
    year: award.year,
    title: award.title,
    level: award.level,
    isFirst: idx === 0,
  }));

  return (
    <section
      id="awards"
      className="relative w-full h-full min-h-screen flex items-center justify-center bg-transparent overflow-hidden select-none will-change-transform"
      style={{
        opacity: isSectionActive ? 1 : 0,
        visibility: isSectionActive ? 'visible' : 'hidden',
        pointerEvents: isSectionActive ? 'auto' : 'none',
      }}
    >
      {/* Dynamic Bottom-to-Top Lightening Background Overlay */}
      <div
        className="absolute inset-0 pointer-events-none transition-all duration-75 ease-out z-0"
        style={{
          background: `linear-gradient(to top, rgba(241, 241, 241, ${effectiveLight * 0.98}) 0%, rgba(241, 241, 241, ${effectiveLight * 0.70}) ${Math.round(effectiveLight * 80)}%, transparent 100%)`,
          opacity: effectiveLight > 0.01 ? 1 : 0,
        }}
      />

      {/* Full-Page Interactive Lanyard Badge Stage */}
      <div
        className="absolute inset-0 w-full h-full flex items-center justify-center pointer-events-auto z-20 will-change-transform"
        style={{
          transform: `translate3d(0, ${translateY}px, 0)`,
          transition: 'transform 0.04s linear',
        }}
      >
        <DoubleLanyard
          awards={awardList}
          position={[0, 0, 19]}
          gravity={[0, -40, 0]}
          fov={25}
          isDroppedActive={isDroppedActive}
        />
      </div>
    </section>
  );
};
