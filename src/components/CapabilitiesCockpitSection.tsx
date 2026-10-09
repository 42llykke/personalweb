import React from 'react';
import { RESUME_CONTENT } from '../data/resumeData';
import { Language } from '../types';

interface CapabilitiesCockpitSectionProps {
  language: Language;
  currentScrollX?: number;
  sectionStartX?: number;
  sectionWidth?: number;
  inertiaSkew?: number;
}

export const CapabilitiesCockpitSection: React.FC<CapabilitiesCockpitSectionProps> = ({
  language,
  currentScrollX = 0,
  sectionStartX = 0,
  sectionWidth = 2400,
  inertiaSkew = 0,
}) => {
  const content = RESUME_CONTENT[language];
  const skills = content.skills || [];

  const viewportH = typeof window !== 'undefined' ? window.innerHeight : 900;

  // Relative progress inside Chapter 06 content area: 0 to 1
  const relativeScroll = currentScrollX - sectionStartX;
  const progress = Math.min(1.05, Math.max(0, relativeScroll / Math.max(1, sectionWidth)));

  // 整组 6 大核心能力采用统一严密的等间距（以紧凑的小间距为基准：gap-4 sm:gap-5，约 20px）
  // 确保整组列表行程充足，最后一行“语言”能完全滑出屏幕顶部
  const maxTravel = viewportH * 0.54 + 290;

  // 整组内容沿纵向统一平滑运镜：
  // progress = 0.0 时首行刚好探出屏幕下边缘
  // 运镜进度映射：最后一行“语言”平滑向上滑移并彻底滑出屏幕顶部边界
  const motionProgress = Math.min(1.0, progress / 0.90);
  const containerY = (0.50 - motionProgress) * (maxTravel * 2.0);

  // 6大模块在统一等距列表中的相对垂直中心偏移 (基准间距一致)
  const itemOffsets = [-190, -135, -78, +28, +135, +190];

  return (
    <section
      id="skills"
      className="relative w-full h-screen min-h-screen flex items-center justify-center bg-transparent overflow-hidden select-none px-6 md:px-[12vw] lg:px-[16vw]"
    >
      {/* 核心能力内容展示主容器：统一垂直等间距流式容器 */}
      <div className="relative max-w-5xl mx-auto w-full h-full flex items-center justify-center pointer-events-none">
        {/* 全屏展示容器与流式等间距列表：移除所有 skewX 惯性左右歪斜效果 */}
        <div
          className="w-full flex flex-col gap-4 sm:gap-5 will-change-transform pointer-events-auto select-text"
          style={{
            transform: `translate3d(0, ${containerY.toFixed(1)}px, 0)`,
            transition: 'transform 0.04s linear',
          }}
        >
          {skills.map((item, idx) => {
            const itemOffset = itemOffsets[idx] ?? (-190 + idx * 76);
            const itemY = containerY + itemOffset;

            // 严格采用 React Bits <ScrollReveal /> 的倾斜度 (3°)、模糊度 (4px)、起始不透明度 (0.1) 与滑入节奏
            const baseRotation = 3;
            const blurStrength = 4;
            const baseOpacity = 0.1;

            let rot = 0;
            let blur = 0;
            let opacity = 1.0;

            if (itemY > 0) {
              // 进场阶段：由屏幕下方平滑滑向正中心
              const revealT = Math.min(1.0, Math.max(0.0, (viewportH * 0.45 - itemY) / (viewportH * 0.40)));
              rot = (1 - revealT) * baseRotation;
              blur = (1 - revealT) * blurStrength;
              opacity = baseOpacity + revealT * (1 - baseOpacity);
            } else if (itemY < -viewportH * 0.36) {
              // 离场阶段：自屏幕上方平滑淡出
              const exitT = Math.min(1.0, (-itemY - viewportH * 0.36) / (viewportH * 0.18));
              rot = -exitT * 1.5;
              blur = exitT * 2.0;
              opacity = Math.max(0, 1.0 - exitT * 0.85);
            } else {
              // 屏幕中央主阅读区域：0° 水平绝对端正，0px 极致清晰，100% 实色纯白
              rot = 0;
              blur = 0;
              opacity = 1.0;
            }

            const absY = Math.abs(itemY);
            const isFocused = absY < 120;
            const textColor = isFocused ? '#FFFFFF' : 'rgb(241, 241, 241)';

            return (
              <div
                key={idx}
                className="w-full text-left transition-all duration-75"
                style={{
                  transform: `rotate(${rot.toFixed(2)}deg)`,
                  transformOrigin: '0% 50%',
                  opacity: opacity.toFixed(3),
                  filter: blur > 0.08 ? `blur(${blur.toFixed(1)}px)` : 'none',
                }}
              >
                <div className="flex flex-col md:flex-row md:items-baseline gap-2 md:gap-3 py-1 px-2">
                  {/* 分类标题 (Level 1: 20px / text-xl) */}
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <span
                      className="font-semibold text-xl tracking-tight transition-colors duration-150"
                      style={{
                        color: '#FF95B4',
                        textShadow: isFocused
                          ? '0 0 18px rgba(255,149,180,0.6), 0 2px 6px rgba(0,0,0,0.9)'
                          : '0 1px 4px rgba(0,0,0,0.8)',
                      }}
                    >
                      {item.category}
                    </span>
                    <span className="text-zinc-500 font-light select-none text-xl">｜</span>
                  </div>

                  {/* 技能详情内容 (Level 2: 16px / text-base) */}
                  <p
                    className="font-noto font-normal text-base leading-relaxed text-left transition-colors duration-150"
                    style={{
                      color: textColor,
                      textShadow: isFocused ? '0 2px 10px rgba(0,0,0,0.85)' : 'none',
                      fontWeight: isFocused ? 400 : 350,
                    }}
                  >
                    {item.items}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
