import React from 'react';
import { Language } from '../types';

interface ChapterTransitionPortalProps {
  chapterNumber: string;
  title: string;
  subtitle?: string;
  language: Language;
  currentScrollX?: number;
  portalStartX?: number;
  portalWidth?: number;
  progress?: number; // 0 to 1
  exitProgress?: number;
  direction?: 'rtl' | 'ltr';
  accentColor?: string;
  imageSrc?: string;
  inertiaSkew?: number;
  lightRatio?: number;
  variant?: 'slide' | 'zoom-fade';
}

export const ChapterTransitionPortal: React.FC<ChapterTransitionPortalProps> = ({
  title,
  language,
  progress = 0,
  inertiaSkew = 0,
  lightRatio = 0,
  variant = 'slide',
}) => {
  const isZh = language === 'zh';
  const p = Math.min(1, Math.max(0, progress));

  let titleOffsetX = 0;
  let titleOpacity = 1;
  let titleScale = 1;

  if (variant === 'zoom-fade') {
    // =========================================================================
    // 居中放大出现与逐渐消失动效 (Zoom-in from center & Fade out)
    // 1. 由中间放大出现 (0.0 -> 0.40):
    //    文字保持屏幕正中间，Scale 从 0.45 放大至 1.0，透明度 0 -> 1.0
    // 2. 继续滚动字逐渐消失 (0.40 -> 0.85):
    //    文字继续滚动时平滑淡出消失 (1.0 -> 0.0)
    // =========================================================================
    titleOffsetX = 0;

    // 进场放大阶段 (0.0 -> 0.40)
    const inT = Math.min(1, Math.max(0, p / 0.40));
    const inEase = 1 - Math.pow(1 - inT, 2.5);
    const enterScale = 0.45 + inEase * 0.55;
    const enterOpacity = Math.min(1, inT * 2.2);

    // 出场渐隐阶段 (0.40 -> 0.85)
    const outT = Math.min(1, Math.max(0, (p - 0.40) / 0.45));
    const outEase = outT * outT;
    const exitOpacity = Math.max(0, 1 - outEase);
    const exitScaleDrift = outEase * 0.08;

    titleScale = enterScale + (p > 0.40 ? exitScaleDrift : 0);
    titleOpacity = enterOpacity * exitOpacity;
  } else {
    // =========================================================================
    // 纯净文字切换页面动效 (大标题文字平滑横向穿梭过渡)
    // 当上一板块内容刚滑出页面时 (p = 0.0)，大标题立即从右侧边缘 (+90vw) 线性滑入
    // =========================================================================
    const textStart = 0.0;
    const textEnd = 1.0;
    const textT = Math.min(1, Math.max(0, (p - textStart) / (textEnd - textStart)));

    // 纯线性匀速水平偏移 (ease: "none"): Right (+75vw) -> Center (0vw) -> Left (-75vw)
    titleOffsetX = (1 - 2 * textT) * 75;

    // 线性透明度控制 (淡入 -> 居中实色 -> 淡出)
    titleOpacity =
      textT < 0.12
        ? textT / 0.12
        : textT > 0.86
        ? Math.max(0, (1 - textT) / 0.12)
        : 1;
    titleScale = 1;
  }

  // 标题字体颜色与投影：跟随背景深浅自适应，保证由浅到深全过程时刻清晰
  const isLight = lightRatio > 0.5;
  const textColor = `rgb(
    ${Math.round(241 - (241 - 20) * lightRatio)},
    ${Math.round(241 - (241 - 20) * lightRatio)},
    ${Math.round(241 - (241 - 25) * lightRatio)}
  )`;
  const textShadow = isLight
    ? '0 14px 32px rgba(255,255,255,0.95), 0 2px 6px rgba(0,0,0,0.3)'
    : '0 14px 32px rgba(0,0,0,0.88), 0 2px 6px rgba(0,0,0,0.95)';

  return (
    <div className="relative w-full h-full overflow-hidden select-none pointer-events-none">
      <div
        className="absolute inset-0 flex items-center justify-center z-30 px-6 will-change-transform pointer-events-none"
        style={{
          transform: `translate3d(${titleOffsetX}vw, 0, 0) scale(${titleScale})`,
          opacity: titleOpacity,
        }}
      >
        <div
          className="flex items-baseline justify-center whitespace-nowrap overflow-visible will-change-transform bg-transparent"
          style={{
            transform: `skewX(${variant === 'zoom-fade' ? 0 : inertiaSkew}deg)`,
            transformOrigin: '50% 50%',
          }}
        >
          {/* 章节大标题文字 (无前置序号，自适应对比度) */}
          <h2
            className={`font-black text-[13vw] sm:text-[10vw] leading-none tracking-tight select-none transition-colors duration-100 ${
              isZh ? 'font-noto tracking-wider' : 'font-condensed uppercase tracking-tight'
            }`}
            style={{
              color: textColor,
              textShadow,
            }}
          >
            {title}
          </h2>
        </div>
      </div>
    </div>
  );
};
