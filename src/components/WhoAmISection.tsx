'use client';

import React from 'react';
import FluidGlass from './FluidGlass';
import Noise from './Noise';

interface WhoAmISectionProps {
  language?: any;
  opacity: number;
  scale?: number;
  progress?: number;
}

export const WhoAmISection: React.FC<WhoAmISectionProps> = ({
  opacity,
  scale = 1,
}) => {
  const isVisible = opacity > 0.005;

  return (
    <section
      className="fixed inset-0 w-screen h-screen flex items-center justify-center select-none overflow-hidden will-change-transform"
      style={{
        opacity,
        transform: scale === 1 ? 'none' : `scale(${scale})`,
        pointerEvents: opacity > 0.35 ? 'auto' : 'none',
        visibility: isVisible ? 'visible' : 'hidden',
        zIndex: 25,
      }}
    >
      {/* 动态背景噪点图层 */}
      <Noise patternAlpha={18} patternRefreshInterval={2} />

      {/* 纯净 React Bits FluidGlass 3D 流体玻璃透镜（仅包含 WHO AM I 大写英文字与 Barlow Condensed 字体） */}
      <div className="absolute inset-0 w-full h-full">
        <FluidGlass
          mode="lens"
          titleText="WHO AM I"
          textColor="#ffffff"
        />
      </div>
    </section>
  );
};

export default WhoAmISection;
