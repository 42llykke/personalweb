import React from 'react';
import { RESUME_CONTENT } from '../data/resumeData';
import { Language } from '../types';
import { Calendar, Sparkles, TrendingUp, Flame, Eye, Heart, Share2 } from 'lucide-react';
import ScrollVelocity from './ScrollVelocity';

interface SocialMediaTelemetrySectionProps {
  language: Language;
  currentScrollX?: number;
  sectionStartX?: number;
  sectionWidth?: number;
  inertiaSkew?: number;
}

export const SocialMediaTelemetrySection: React.FC<SocialMediaTelemetrySectionProps> = ({
  language,
  currentScrollX = 0,
  sectionStartX = 0,
  sectionWidth = 1600,
  inertiaSkew = 0,
}) => {
  const content = RESUME_CONTENT[language];
  const sm = content.socialMedia;
  const isZh = language === 'zh';

  const viewportW = typeof window !== 'undefined' ? window.innerWidth : 1440;
  const viewportH = typeof window !== 'undefined' ? window.innerHeight : 900;

  // Relative progress inside Chapter 05 content area: 0 to 1
  const relativeScroll = currentScrollX - sectionStartX;
  const progress = Math.min(1.05, Math.max(0, relativeScroll / Math.max(1, sectionWidth)));

  // =========================================================================
  // MOTION CHOREOGRAPHY:
  // 1. Entrance / Return to Previous Page (0.00 -> 0.22):
  //    - 居中纯净渐显与滚动渐隐：向上滑回上一页作品集页面时，本页面在原位平滑淡出渐隐，
  //      上一页作品集页面在底层原位同步纯净淡入渐显，实现无位移的静雅十字淡入淡出（Crossfade）。
  //    - inX = 0, inY = 0, inOpacity: 0 -> 1 (进场居中渐显，向上滚动平滑渐隐)
  // 2. Focused Reading (0.22 -> 0.78): Centered (0, 0), opacity: 1.0
  // 3. Exit (0.78 -> 1.00): 向下滑动进入下一页，当前页面平滑向左滑出 (-X) 进入核心能力板块
  // =========================================================================
  const enterT = Math.min(1, Math.max(0, progress / 0.22));
  const enterEase = enterT * enterT * (3 - 2 * enterT);
  const inX = 0;
  const inY = 0;
  const inOpacity = enterEase;

  const exitT = Math.min(1, Math.max(0, (progress - 0.78) / 0.22));
  const exitEase = Math.pow(exitT, 2.0);
  const outX = -exitEase * (viewportW * 1.15 + 100);
  const outY = 0;
  const outOpacity = Math.max(0, 1 - exitT * 1.4);

  const translateX = inX + outX;
  const translateY = inY + outY;
  const opacity = Math.min(inOpacity, outOpacity);

  // Velocity Scrolling Dynamic Ribbon Data (严格仅使用两个字阶：26px 大号 + 14px 正文)
  const track1Nodes = isZh
    ? [
        <div key="t1-1" className="inline-flex items-center gap-2.5 px-4 py-2 rounded-xl bg-white/[0.045] backdrop-blur-md">
          <Flame size={18} className="text-[#FF95B4]" />
          <span className="font-mono text-xl font-semibold text-white tracking-tight">254.7万</span>
          <span className="text-base font-noto text-zinc-300 font-normal">抖音单条最高播放</span>
        </div>,
        <div key="t1-2" className="inline-flex items-center gap-2.5 px-4 py-2 rounded-xl bg-white/[0.045] backdrop-blur-md">
          <Heart size={18} className="text-[#FF95B4]" />
          <span className="font-mono text-xl font-semibold text-white tracking-tight">12万+</span>
          <span className="text-base font-noto text-zinc-300 font-normal">抖音单条最高点赞</span>
        </div>,
        <div key="t1-3" className="inline-flex items-center gap-2.5 px-4 py-2 rounded-xl bg-white/[0.045] backdrop-blur-md">
          <Share2 size={18} className="text-[#FF95B4]" />
          <span className="font-mono text-xl font-semibold text-white tracking-tight">5.8万+</span>
          <span className="text-base font-noto text-zinc-300 font-normal">单条最高转发分享</span>
        </div>,
        <div key="t1-4" className="inline-flex items-center gap-2.5 px-4 py-2 rounded-xl bg-white/[0.045] backdrop-blur-md">
          <TrendingUp size={18} className="text-emerald-400" />
          <span className="font-mono text-xl font-semibold text-white tracking-tight">2条</span>
          <span className="text-base font-noto text-zinc-300 font-normal">播放量破 200 万爆款</span>
        </div>,
      ]
    : [
        <div key="t1-1" className="inline-flex items-center gap-2.5 px-4 py-2 rounded-xl bg-white/[0.045] backdrop-blur-md">
          <Flame size={18} className="text-[#FF95B4]" />
          <span className="font-mono text-xl font-semibold text-white tracking-tight">2.54M+</span>
          <span className="text-base font-noto text-zinc-300 font-normal">Peak Douyin Views</span>
        </div>,
        <div key="t1-2" className="inline-flex items-center gap-2.5 px-4 py-2 rounded-xl bg-white/[0.045] backdrop-blur-md">
          <Heart size={18} className="text-[#FF95B4]" />
          <span className="font-mono text-xl font-semibold text-white tracking-tight">120K+</span>
          <span className="text-base font-noto text-zinc-300 font-normal">Peak Douyin Likes</span>
        </div>,
        <div key="t1-3" className="inline-flex items-center gap-2.5 px-4 py-2 rounded-xl bg-white/[0.045] backdrop-blur-md">
          <Share2 size={18} className="text-[#FF95B4]" />
          <span className="font-mono text-xl font-semibold text-white tracking-tight">58K+</span>
          <span className="text-base font-noto text-zinc-300 font-normal">Peak Shares</span>
        </div>,
        <div key="t1-4" className="inline-flex items-center gap-2.5 px-4 py-2 rounded-xl bg-white/[0.045] backdrop-blur-md">
          <TrendingUp size={18} className="text-emerald-400" />
          <span className="font-mono text-xl font-semibold text-white tracking-tight">2</span>
          <span className="text-base font-noto text-zinc-300 font-normal">Videos &gt; 2M+ Views</span>
        </div>,
      ];

  const track2Nodes = isZh
    ? [
        <div key="t2-1" className="inline-flex items-center gap-2.5 px-4 py-2 rounded-xl bg-white/[0.045] backdrop-blur-md">
          <Eye size={18} className="text-[#FF95B4]" />
          <span className="font-mono text-xl font-semibold text-white tracking-tight">3万+</span>
          <span className="text-base font-noto text-zinc-300 font-normal">小红书单篇最高浏览</span>
        </div>,
        <div key="t2-2" className="inline-flex items-center gap-2.5 px-4 py-2 rounded-xl bg-white/[0.045] backdrop-blur-md">
          <Heart size={18} className="text-[#FF95B4]" />
          <span className="font-mono text-xl font-semibold text-white tracking-tight">800+</span>
          <span className="text-base font-noto text-zinc-300 font-normal">小红书分享点赞</span>
        </div>,
        <div key="t2-3" className="inline-flex items-center gap-2.5 px-4 py-2 rounded-xl bg-white/[0.045] backdrop-blur-md">
          <Sparkles size={18} className="text-[#FF95B4]" />
          <span className="font-mono text-xl font-semibold text-white tracking-tight">1.2万+</span>
          <span className="text-base font-noto text-zinc-300 font-normal">真实自然沉淀粉丝</span>
        </div>,
        <div key="t2-4" className="inline-flex items-center gap-2.5 px-4 py-2 rounded-xl bg-white/[0.045] backdrop-blur-md">
          <span className="text-sm font-noto text-zinc-200 font-normal tracking-wide">
            内容策划 · 拍摄剪辑 · 平台发布 · 数据复盘
          </span>
        </div>,
      ]
    : [
        <div key="t2-1" className="inline-flex items-center gap-2.5 px-4 py-2 rounded-xl bg-white/[0.045] backdrop-blur-md">
          <Eye size={18} className="text-[#FF95B4]" />
          <span className="font-mono text-xl font-semibold text-white tracking-tight">30K+</span>
          <span className="text-base font-noto text-zinc-300 font-normal">Peak RED Post Views</span>
        </div>,
        <div key="t2-2" className="inline-flex items-center gap-2.5 px-4 py-2 rounded-xl bg-white/[0.045] backdrop-blur-md">
          <Heart size={18} className="text-[#FF95B4]" />
          <span className="font-mono text-xl font-semibold text-white tracking-tight">800+</span>
          <span className="text-base font-noto text-zinc-300 font-normal">RED Outfit Likes</span>
        </div>,
        <div key="t2-3" className="inline-flex items-center gap-2.5 px-4 py-2 rounded-xl bg-white/[0.045] backdrop-blur-md">
          <Sparkles size={18} className="text-[#FF95B4]" />
          <span className="font-mono text-xl font-semibold text-white tracking-tight">12K+</span>
          <span className="text-base font-noto text-zinc-300 font-normal">Organic Followers</span>
        </div>,
        <div key="t2-4" className="inline-flex items-center gap-2.5 px-4 py-2 rounded-xl bg-white/[0.045] backdrop-blur-md">
          <span className="text-sm font-noto text-zinc-200 font-normal tracking-wide">
            Strategy · Filming · Publishing · Analytics
          </span>
        </div>,
      ];

  return (
    <section
      id="social-media"
      className="relative w-full h-full flex items-center justify-center bg-transparent overflow-hidden select-none px-0"
    >
      {/* Main Content Container (全板块严格仅出现两个字号) */}
      <div
        className="w-full flex flex-col justify-center space-y-8 z-20 will-change-transform text-[#F1F1F1]"
        style={{
          transform: `translate3d(${translateX}px, ${translateY}px, 0)`,
          opacity,
          transition: 'transform 0.04s linear, opacity 0.06s linear',
        }}
      >
        {/* Top Header Section */}
        <div className="w-full max-w-5xl mx-auto px-6 md:px-[16.67vw] space-y-3 pb-1 text-left">
          {/* 字阶 3: 14px (text-sm) */}
          <div className="flex items-center gap-1.5 text-sm font-mono text-zinc-400">
            <Calendar size={14} className="text-[#FF95B4]" />
            <span>{sm.period}</span>
          </div>

          {/* 字阶 1: 20px (text-xl) */}
          <h2 className="text-xl font-noto font-medium text-[#F1F1F1] tracking-tight leading-snug">
            {isZh ? '抖音 & 小红书' : 'Douyin & RED'}
          </h2>

          {/* 字阶 2: 16px (text-base) */}
          <p className="text-base font-noto font-normal text-zinc-300 leading-relaxed max-w-2xl">
            {isZh
              ? '独立运营账号，负责内容策划、拍摄、发布与数据复盘。'
              : 'Independently managed channels, leading content ideation, shooting, publishing, and data retrospectives.'}
          </p>
        </div>

        {/* ScrollVelocity Kinetic Ribbon Integration (字阶 1: 26px 大数据 + 字阶 2: 14px 标签文本) */}
        <div className="w-screen max-w-[100vw] py-2 space-y-3.5 overflow-hidden">
          <ScrollVelocity
            texts={[
              <div key="r1" className="flex items-center gap-6 py-1">
                {track1Nodes}
              </div>,
              <div key="r2" className="flex items-center gap-6 py-1">
                {track2Nodes}
              </div>,
            ]}
            velocity={35}
            damping={40}
            stiffness={300}
            numCopies={5}
            className="inline-block"
          />
        </div>
      </div>
    </section>
  );
};
