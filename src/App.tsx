import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { useSmoothScroll } from './hooks/useSmoothScroll';
import { soundEngine } from './utils/soundEngine';
import { CursorMode, Language } from './types';
import { RESUME_CHAPTERS } from './data/resumeData';
import { ChevronRight, Sparkles } from 'lucide-react';

// Modular Presentation Components
import { HeroSection } from './components/HeroSection';
import { WhoAmISection } from './components/WhoAmISection';
import { ChapterTransitionPortal } from './components/ChapterTransitionPortal';
import { AcademicTrackSection } from './components/AcademicTrackSection';
import { HorizontalExperienceSection } from './components/HorizontalExperienceSection';
import { ProjectsShowcaseSection } from './components/ProjectsShowcaseSection';
import { PortfolioFolderSection } from './components/PortfolioFolderSection';
import { SocialMediaTelemetrySection } from './components/SocialMediaTelemetrySection';
import { CapabilitiesCockpitSection } from './components/CapabilitiesCockpitSection';
import { AwardsPodiumSection } from './components/AwardsPodiumSection';
import { PitStopContactSection } from './components/PitStopContactSection';
import { StaggeredMenu, StaggeredMenuItem } from './components/StaggeredMenu';
import { CircuitTrackScrubber } from './components/CircuitTrackScrubber';
import { ChaptersOverlay } from './components/ChaptersOverlay';
import { CustomCursor } from './components/CustomCursor';
import VariableProximity from './components/VariableProximity';
import { useInertiaSkew } from './hooks/useInertiaSkew';

export default function App() {
  const [language, setLanguage] = useState<Language>('zh');
  const [activeSection, setActiveSection] = useState<string>('hero');
  const [cursorMode, setCursorMode] = useState<CursorMode>('default');
  const [cursorText, setCursorText] = useState<string>('');
  const [isChaptersOpen, setIsChaptersOpen] = useState<boolean>(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);
  const [currentScrollY, setCurrentScrollY] = useState<number>(0);
  const [isEditMode, setIsEditMode] = useState<boolean>(false);

  const isZh = language === 'zh';
  const chapters = RESUME_CHAPTERS[language];

  const handleToggleLanguage = useCallback(() => {
    setLanguage((prev) => (prev === 'zh' ? 'en' : 'zh'));
  }, []);

  // Dynamic Window Sizing
  const [dimensions, setDimensions] = useState({
    width: typeof window !== 'undefined' ? window.innerWidth : 1440,
    height: typeof window !== 'undefined' ? window.innerHeight : 900,
  });

  useEffect(() => {
    const handleResize = () => {
      setDimensions({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };
    window.addEventListener('resize', handleResize, { passive: true });
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Compute Layered Chapter Overlay Stack (Each chapter gradually covers previous page)
  const chapterConfigs = useMemo(() => {
    const H = dimensions.height;
    const W = dimensions.width;

    // Upward slide range = 1.15 full webpage height (~115vh) - 节奏更紧凑轻快
    const coverDist = Math.max(750, Math.round(H * 1.15));

    // Hero shrink & reveal distance: 转化页面紧凑轻快
    const heroDist = Math.max(950, Math.round(H * 1.20));

    const defs = [
      {
        id: 'education',
        num: '01',
        title: isZh ? '教育背景' : 'EDUCATION',
        subtitle: isZh ? '数字媒体硕士 · 视觉传达本科' : 'MA Digital Media · BA Visual Design',
        accentColor: '#0284C7',
        contentDist: Math.max(1400, Math.round(H * 1.75)),
        direction: 'rtl' as const,
        noPortal: true, // 删除第一个板块的标题字过渡，直接进入研究生详情页面
      },
      {
        id: 'experience',
        num: '02',
        title: isZh ? '实习经历' : 'INTERNSHIPS',
        subtitle: isZh ? '品牌项目执行 · 视觉设计实习' : 'Brand Project Execution & Visual Design',
        accentColor: '#E4032E',
        contentDist: Math.max(1200, Math.round(H * 1.5)),
        direction: 'rtl' as const,
      },
      {
        id: 'projects',
        num: '03',
        title: isZh ? '项目经历' : 'PROJECTS',
        subtitle: isZh ? '北京太古坊 · 竹林酒堂品牌活动' : 'Beijing Taikoo Li · Brand Event',
        accentColor: '#0284C7',
        contentDist: Math.max(1800, Math.round(H * 2.2)),
        direction: 'ltr' as const,
      },
      {
        id: 'portfolio',
        num: '04',
        title: isZh ? '设计作品集' : 'DESIGN PORTFOLIO',
        subtitle: isZh ? '6大设计作品 · 视觉全案分类档案' : '6 Selected Design Works · Visual Archive',
        accentColor: '#FF95B4',
        contentDist: Math.max(1300, Math.round(H * 1.6)),
        direction: 'rtl' as const,
      },
      {
        id: 'social-media',
        num: '05',
        title: isZh ? '社交媒体实践' : 'SOCIAL MEDIA',
        subtitle: isZh ? '抖音 1.2万+粉丝 · 单条最高254.7万播放' : 'Douyin & RED · 2.54M+ Peak Views',
        accentColor: '#0284C7',
        contentDist: Math.max(1200, Math.round(H * 1.5)),
        direction: 'rtl' as const,
        noPortal: true, // 删除社交媒体实践的标题页，直接进入详细信息页
      },
      {
        id: 'skills',
        num: '06',
        title: isZh ? '核心能力' : 'CORE SKILLS',
        subtitle: isZh ? '品牌项目执行 · 社媒运营 · 工具 · 语言' : 'Brand Execution · Social Media · Tools · Language',
        accentColor: '#E4032E',
        contentDist: Math.max(1800, Math.round(H * 2.2)),
        direction: 'rtl' as const,
      },
      {
        id: 'awards',
        num: '07',
        title: isZh ? '获奖' : 'AWARDS',
        subtitle: isZh ? '省级与国家级专业竞赛殊荣' : 'Provincial & National Honours',
        accentColor: '#0284C7',
        contentDist: Math.max(1600, Math.round(H * 1.8)),
        direction: 'ltr' as const,
        noPortal: true,
      },
      {
        id: 'contact',
        num: '08',
        title: isZh ? '联系方式' : 'CONTACT',
        subtitle: isZh ? '即刻沟通 · 开启合作对话' : "Let's Connect & Collaborate",
        accentColor: '#E4032E',
        contentDist: Math.max(1000, Math.round(H * 1.3)),
        direction: 'rtl' as const,
        noPortal: true,
      },
    ];

    let currentScroll = heroDist;
    const computed: any[] = [];
    for (let index = 0; index < defs.length; index++) {
      const d = defs[index];
      const prevChap = index > 0 ? computed[index - 1] : null;

      if (d.noPortal) {
        // 第一板块（教育背景）：在 who am i 快要消失的时候 (heroDist * 0.62) 开始出现
        // 社交媒体实践：删除标题页，紧接在作品展示页面出场阶段 (0.78)，无缝向左擦除滑出与自右滑入
        // 获奖板块：紧接在核心能力“语言”这行字消失在屏幕边缘的瞬间 (与 skills 尾部咬合 10%)，确保无缝掉落
        // 联系方式：紧接在获奖板块尾部咬合 25%
        let contentStart = currentScroll;
        if (d.id === 'education') {
          contentStart = Math.round(heroDist * 0.62);
        } else if (d.id === 'social-media' && prevChap) {
          // 紧接在作品集页面滚动渐隐完全结束之后，确保抖音＆小红书原位滚动渐隐结束后作品集页面才渐显
          contentStart = prevChap.contentEnd;
        } else if (d.id === 'awards' && prevChap) {
          contentStart = currentScroll - Math.round(prevChap.contentDist * 0.10);
        } else if (d.id === 'contact' && prevChap) {
          contentStart = currentScroll - Math.round(prevChap.contentDist * 0.25);
        }

        const contentEnd = contentStart + d.contentDist;
        // 如果是 social-media，在其出场阶段 (0.85) 时下一个板块 (skills) 衔接进入
        currentScroll = d.id === 'social-media'
          ? contentStart + Math.round(d.contentDist * 0.85)
          : contentEnd;

        computed.push({
          ...d,
          index: index + 1,
          coverStart: contentStart,
          coverEnd: contentStart,
          coverDist: 0,
          contentStart,
          contentEnd,
          totalStart: contentStart,
          totalEnd: contentEnd,
          zIndex: 20 + index * 10,
        });
        continue;
      }

      const coverStart = currentScroll;
      const coverEnd = coverStart + coverDist;
      const contentStart =
        d.id === 'skills'
          ? coverEnd + Math.round(H * 0.05)
          : coverStart + Math.round(coverDist * 0.85);
      const contentEnd = contentStart + d.contentDist;
      const overlap =
        d.id === 'education'
          ? 0
          : (d.id === 'experience'
              ? Math.round(d.contentDist * 0.06)
              : (d.id === 'projects'
                  ? 0 // 北京太古坊详细内容向上滑出后，下一个板块的标题才开始出现
                  : (d.id === 'portfolio'
                      ? 0 // 作品集内容结束后，社交媒体才开始，无同时重叠
                      : (d.id === 'skills' ? 0 : Math.round(d.contentDist * 0.05)))));
      currentScroll = contentEnd - overlap;
      computed.push({
        ...d,
        index: index + 1,
        coverStart,
        coverEnd,
        coverDist,
        contentStart,
        contentEnd,
        totalStart: coverStart,
        totalEnd: contentEnd,
        zIndex: 20 + index * 10,
      });
    }

    const totalVirtual = currentScroll + H;

    return {
      heroDist,
      chapters: computed,
      totalVirtualHeight: totalVirtual,
    };
  }, [dimensions, isZh]);

  // Checkpoints for momentum gating so fast scrolling never skips critical moments:
  // 1. "WHO AM I": 首页缩小后稳定定格显示，不受滑动速度影响跳过
  // 2. "AWARDS": 核心能力“语言”刚滑出屏幕顶沿的瞬间，两张吊牌掉落自然展示，不受滑动速度影响跳过
  const scrollCheckpoints = useMemo(() => {
    const whoAmIGate = Math.round(chapterConfigs.heroDist * 0.38);
    const awardsChap = chapterConfigs.chapters.find((c) => c.id === 'awards');
    const awardsGate = awardsChap ? awardsChap.contentStart + 160 : 0;
    return [
      { id: 'whoami', gate: whoAmIGate },
      { id: 'awards', gate: awardsGate },
    ];
  }, [chapterConfigs]);

  const { telemetry, scrollTo } = useSmoothScroll(scrollCheckpoints);
  const inertiaSkew = useInertiaSkew();

  // Sync scroll position from window.scrollY
  useEffect(() => {
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          const scrollY = window.scrollY;
          setCurrentScrollY((prev) => (prev !== scrollY ? scrollY : prev));

          // Determine active section
          if (scrollY < chapterConfigs.heroDist * 0.7) {
            setActiveSection((prev) => (prev !== 'hero' ? 'hero' : prev));
          } else {
            const curChap = chapterConfigs.chapters.find(
              (c) => scrollY >= c.coverStart && scrollY < c.contentEnd
            );
            if (curChap) {
              setActiveSection((prev) => (prev !== curChap.id ? curChap.id : prev));
            } else if (
              chapterConfigs.chapters.length > 0 &&
              scrollY >= chapterConfigs.chapters[chapterConfigs.chapters.length - 1].contentEnd
            ) {
              setActiveSection((prev) => (prev !== 'contact' ? 'contact' : prev));
            }
          }
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    const initTimer = setTimeout(handleScroll, 10);
    return () => {
      clearTimeout(initTimer);
      window.removeEventListener('scroll', handleScroll);
    };
  }, [chapterConfigs]);

  // Dynamic cursor helper
  const handleSetCursorMode = useCallback((mode: CursorMode, text: string = '') => {
    setCursorMode(mode);
    setCursorText(text);
  }, []);

  // Direct Navigation to specific section: 精确映射每个跳转按钮的目标画面
  const handleScrollToSection = useCallback(
    (id: string, options?: { immediate?: boolean }) => {
      soundEngine.playClick();
      if (id === 'hero') {
        scrollTo(0, { immediate: options?.immediate ?? true });
        return;
      }
      if (id === 'projects-taikoo') {
        const pChap = chapterConfigs.chapters.find((c) => c.id === 'projects');
        if (pChap) {
          const targetScroll = pChap.contentStart + Math.round(pChap.contentDist * 0.68);
          scrollTo(targetScroll, { immediate: options?.immediate ?? true, duration: 0.85 });
          return;
        }
      }
      const targetId = id === 'internship' ? 'experience' : id;
      const targetChap = chapterConfigs.chapters.find((c) => c.id === targetId);
      if (!targetChap) return;

      // 精准跳转到用户要求的指定瞬间与画面：
      // 1. 实习经历：两段实习经历完整出现在页面中间，这个时候小方块刚好掉落 (progress = 0.24)
      // 2. 项目经历：三个照片依次从中心出现，这个时候第一张照片已经出现了一半大小 (progress = 0.10)
      // 3. 设计作品集：第一个作品在正中间的画面 (progress = 0.24)
      // 4. 社交媒体实践：这个板块详情信息的那一页 (progress = 0.26)
      // 5. 核心能力：核心能力的第一行字刚刚滑动出现在页面中心位置的时候 (progress = 0.34)
      // 6. 获奖：直接转跳的是两个牌子掉落的时候 (progress = 0.012)
      let targetRatio = 0.45;
      if (targetChap.id === 'education') targetRatio = 0.165;
      if (targetChap.id === 'experience') {
        targetRatio = 0.24;
        window.dispatchEvent(new CustomEvent('trigger-experience-drop'));
      }
      if (targetChap.id === 'projects') targetRatio = 0.10;
      if (targetChap.id === 'portfolio') targetRatio = 0.24;
      if (targetChap.id === 'social-media') targetRatio = 0.28;
      if (targetChap.id === 'skills') targetRatio = 0.34;
      if (targetChap.id === 'awards') {
        targetRatio = 0.012;
        window.dispatchEvent(new CustomEvent('trigger-lanyard-drop'));
      }
      if (targetChap.id === 'contact') targetRatio = 0.50;

      const targetScroll = targetChap.contentStart + Math.round(targetChap.contentDist * targetRatio);
      scrollTo(targetScroll, { immediate: options?.immediate ?? true, duration: 0.85 });
    },
    [chapterConfigs.chapters, scrollTo]
  );

  // 设计作品集页面的上一页与下一页直接转跳处理：
  // 1. 上一页按钮：直接转跳到“北京太古坊”文字内容部分 (projects 详情页 progress = 0.68，北京太古坊文字内容居中完整呈现)，不把中间的页面快速过一遍 (immediate: true)
  // 2. 下一页按钮：直接转跳到社交媒体实践的详细信息页 (progress = 0.28)，不把中间的页面快速过一遍 (immediate: true)
  const handlePrevFromPortfolio = useCallback(() => {
    soundEngine.playClick();
    const projectsChap = chapterConfigs.chapters.find((c) => c.id === 'projects');
    if (!projectsChap) return;
    // 直接转跳到北京太古坊文字内容部分 (项目经历详情页中段，北京太古坊文字内容居中完整呈现)
    const targetScroll = projectsChap.contentStart + Math.round(projectsChap.contentDist * 0.68);
    scrollTo(targetScroll, { immediate: true });
  }, [chapterConfigs.chapters, scrollTo]);

  const handleNextFromPortfolio = useCallback(() => {
    soundEngine.playClick();
    const smChap = chapterConfigs.chapters.find((c) => c.id === 'social-media');
    if (!smChap) return;
    const targetScroll = smChap.contentStart + Math.round(smChap.contentDist * 0.28);
    scrollTo(targetScroll, { immediate: true });
  }, [chapterConfigs.chapters, scrollTo]);

  // Listen to cross-component navigation events
  useEffect(() => {
    const handleNavEvent = (e: Event) => {
      const customEvent = e as CustomEvent<string>;
      if (customEvent.detail) {
        handleScrollToSection(customEvent.detail, { immediate: false });
      }
    };
    window.addEventListener('nav-to-section', handleNavEvent);
    return () => window.removeEventListener('nav-to-section', handleNavEvent);
  }, [handleScrollToSection]);

  // Staggered Menu navigation items (8 chapters)
  const staggeredMenuItems: StaggeredMenuItem[] = useMemo(() => {
    return chapters.map((chap) => ({
      id: chap.id,
      label: chap.title,
      ariaLabel: chap.title,
      onClick: () => {
        soundEngine.playClick();
        handleScrollToSection(chap.id);
      },
    }));
  }, [chapters, handleScrollToSection]);

  // Hero Shrink Calculations (转化页面紧凑利落)
  const heroT = Math.min(1, Math.max(0, currentScrollY / chapterConfigs.heroDist));
  // 1. 滚动首页向中心变小，缩小至原本的1/3大小 (scale: 1.0 -> 0.333, heroT: 0.0 -> 0.34)
  const shrinkScale = heroT <= 0.34 ? 1.0 - (1.0 - 0.333) * (heroT / 0.34) : 0.333;
  // 首页缩小到即将消失 (heroT: 0.34 -> 0.44)
  const shrinkOpacity = heroT <= 0.34 ? 1.0 : Math.max(0, 1.0 - (heroT - 0.34) / 0.10);

  // "Who am I" (Fluid Glass & Giant Typography) Transition:
  // 1. 首页缩小阶段即平滑浮现 (0.10 -> 0.24)
  // 2. 首页滚动缩小到即将消失的时候继续滚动，who am i这行字也开始消失 (0.44 -> 0.68)
  let whoAmIOpacity = 0;
  let whoAmIScale = 1;
  if (heroT >= 0.10 && heroT <= 0.70) {
    if (heroT < 0.24) {
      // 快速平滑淡入：从 0.10 到 0.24 达到最大不透明度
      const t = (heroT - 0.10) / (0.24 - 0.10);
      whoAmIOpacity = t * t * (3 - 2 * t);
      whoAmIScale = 0.96 + 0.04 * whoAmIOpacity;
    } else if (heroT <= 0.44) {
      whoAmIOpacity = 1.0;
      whoAmIScale = 1.0;
    } else {
      // 首页滚动缩小到即将消失的时候继续滚动，who am i这行字也开始消失
      const t = (heroT - 0.44) / (0.68 - 0.44);
      whoAmIOpacity = Math.max(0, 1.0 - t * t * (3 - 2 * t));
      whoAmIScale = 1.0 - 0.04 * t;
    }
  }

  // Dynamic background lightness ratio: 0.0 (dark Hex #1E1E20) to 1.0 (light Hex #F1F1F1)
  // 1. Homepage & shrinking hero:
  // "首页背景是浅色底色配深色条纹，不要改变条纹样式，仅作颜色深浅的反转，首页缩小后融入现有深色底色"
  // 2. Chapter 1 (education):
  // "进入第一个板块的详情页后背景整体开始由深到浅渐变变化在第一个板块内容结束后彻底变成浅色"
  const globalLightRatio = (() => {
    // Stage A: Homepage & hero shrink
    if (currentScrollY <= chapterConfigs.heroDist) {
      const hT = Math.min(1, Math.max(0, currentScrollY / chapterConfigs.heroDist));
      // As hero shrinks (scale 1.0 -> 0.333, hT 0.0 -> 0.34), the light base smoothly dissolves into dark #0A0B0E
      if (hT <= 0.34) {
        return 1.0 - (hT / 0.34);
      }
      return 0.0;
    }

    const chap1 = chapterConfigs.chapters[0];
    const chap2 = chapterConfigs.chapters[1];
    const chap3 = chapterConfigs.chapters[2];
    const chap4 = chapterConfigs.chapters[3];

    // Stage B: During "Who am I" and Chapter 1 cover transition portal:
    if (chap1 && currentScrollY < chap1.contentStart) {
      return 0.0;
    }

    // Stage C: Inside Chapter 1 content:
    // "第一板块的详情部分背景颜色从硕士信息进入页面正中间后再开始从最深色渐变，然后当本科信息居于屏幕正中间的时候渐变到最浅色"
    // 硕士信息进入屏幕正中间: p = 0.18 (开始由最深色渐变)
    // 本科信息居于屏幕正中间: p = 0.68 (完成渐变达到最浅色 1.0，并持续保持直到本科信息完全滑出屏幕)
    if (chap1 && currentScrollY >= chap1.contentStart && currentScrollY < chap1.contentEnd) {
      const p = (currentScrollY - chap1.contentStart) / chap1.contentDist;
      if (p <= 0.18) {
        return 0.0;
      }
      return Math.min(1.0, Math.max(0, (p - 0.18) / (0.68 - 0.18)));
    }

    // Transition between Chapter 1 and Chapter 2:
    // "本科信息页内容刚滑出页面的时候，下一个板块的标题字就从侧边进来，背景颜色在字滑进来的过程中变成深色"
    if (chap2 && currentScrollY >= chap2.coverStart && currentScrollY < chap2.contentStart) {
      const coverP = Math.min(1, Math.max(0, (currentScrollY - chap2.coverStart) / chap2.coverDist));
      // 标题字从侧边滑入至正中间的过程中 (coverP 从 0.0 到 0.50)，背景平滑由浅色变深色
      if (coverP <= 0.50) {
        return Math.max(0, 1.0 - (coverP / 0.50));
      }
      return 0.0;
    }

    // Stage D: Chapter 2 (Experience) is dark
    if (chap2 && currentScrollY >= chap2.contentStart && currentScrollY < (chap3 ? chap3.coverStart : Infinity)) {
      return 0.0;
    }

    // During Chapter 3 cover transition portal:
    if (chap3 && currentScrollY >= chap3.coverStart && currentScrollY < chap3.contentStart) {
      return 0.0;
    }

    // Stage E: Chapter 3 (Projects):
    // "进入第三个板块的详情后背景由深到浅逐渐变化，在项目经历文字即将出现，图片即将结束的时候背景颜色到达最浅然后不变，其他按照原本设计过渡到下一个板块"
    if (chap3 && currentScrollY >= chap3.contentStart && (!chap4 || currentScrollY < chap4.coverStart)) {
      const p = (currentScrollY - chap3.contentStart) / chap3.contentDist;
      // Reaches lightest (1.0) at p = 0.52 (when 3 photos conclude and text expands), then stays unchanged
      return Math.min(1.0, Math.max(0, p / 0.52));
    }

    // Transition from Chapter 3 to Chapter 4:
    // While Chapter 4 cover image is wiping in over Chapter 3:
    if (chap4 && currentScrollY >= chap4.coverStart && currentScrollY < chap4.contentStart) {
      const coverP = Math.min(1, Math.max(0, (currentScrollY - chap4.coverStart) / chap4.coverDist));
      if (coverP <= 0.35) {
        return Math.max(0, 1.0 - (coverP / 0.35));
      }
      return 0.0;
    }

    // Stage F: Chapter 7 (Awards) - 当滑入吊牌页面的时候继续滑动背景就开始变浅
    const chap7 = chapterConfigs.chapters[6];
    const chap8 = chapterConfigs.chapters[7];
    if (chap7 && currentScrollY >= chap7.contentStart && currentScrollY < chap7.contentEnd) {
      const p = (currentScrollY - chap7.contentStart) / chap7.contentDist;
      // 当滑入吊牌页面的时候继续滑动背景就开始变浅 (p 从 0.05 开始由深变浅，到 0.55 完全过渡至 #F1F1F1)
      if (p <= 0.05) {
        return 0.0;
      }
      return Math.min(1.0, (p - 0.05) / (0.55 - 0.05));
    }

    if (chap8 && currentScrollY >= chap8.contentStart) {
      return 1.0;
    }

    return 0.0;
  })();

  // Current interpolated background color (#1E1E20 -> #F1F1F1)
  const currentBgR = Math.round(30 + (241 - 30) * globalLightRatio);
  const currentBgG = Math.round(30 + (241 - 30) * globalLightRatio);
  const currentBgB = Math.round(32 + (241 - 32) * globalLightRatio);
  const currentBgColor = `rgb(${currentBgR}, ${currentBgG}, ${currentBgB})`;

  // Current navigation and icons color (#F1F1F1 -> #1E1E20)
  // 背景深色的时候它是浅色，背景由深到浅渐变的时候它是由浅到深渐变，背景浅色的时候它是深色，时刻保证它是清晰可见的
  const navR = Math.round(241 - (241 - 30) * globalLightRatio);
  const navG = Math.round(241 - (241 - 30) * globalLightRatio);
  const navB = Math.round(241 - (241 - 32) * globalLightRatio);
  const navColor = `rgb(${navR}, ${navG}, ${navB})`;

  // High-legibility shadow filter ensuring clear visibility across any dynamic backgrounds or textures
  const navShadow =
    globalLightRatio > 0.5
      ? '0 1px 2px rgba(255, 255, 255, 0.95), 0 0 1px rgba(0, 0, 0, 0.35)'
      : '0 1px 4px rgba(0, 0, 0, 0.9), 0 0 1px rgba(255, 255, 255, 0.3)';

  return (
    <div
      className="relative selection:bg-[#FF95B4] selection:text-[#1E1E20] font-noto min-h-screen transition-colors duration-150"
      style={{ backgroundColor: currentBgColor }}
    >
      {/* 1. Fixed Top-Left: Pure English Wordmark (Static Non-Clickable Logo) */}
      <div className="fixed top-4 left-5 sm:top-6 sm:left-7 z-50 pointer-events-none select-none">
        <div className="flex items-center cursor-default">
          <span
            className="font-condensed font-black tracking-widest text-xl sm:text-2xl leading-none"
            style={{ color: navColor, textShadow: navShadow }}
          >
            LYKKE
          </span>
        </div>
      </div>

      {/* 2. Fixed Top-Right: React Bits Staggered Menu Navigation */}
      <StaggeredMenu
        position="right"
        items={staggeredMenuItems}
        displayItemNumbering={true}
        menuButtonColor={navColor}
        openMenuButtonColor="#F1F1F1"
        buttonShadow={navShadow}
        changeMenuColorOnOpen={true}
        colors={['#F1F1F1', '#1E1E20']}
        accentColor="#FF95B4"
        isFixed={true}
        menuLabelText=""
        closeLabelText=""
        onMenuOpen={() => soundEngine.playClick()}
        onMenuClose={() => soundEngine.playHover()}
      />

      {/* 3. Fixed Bottom-Right: Language Switch (Adapts color with background lightness) */}
      <div className="fixed bottom-2.5 right-4 sm:bottom-3.5 sm:right-6 z-50 pointer-events-auto select-none">
        <button
          onClick={() => {
            soundEngine.playClick();
            handleToggleLanguage();
          }}
          onMouseEnter={() => soundEngine.playHover()}
          className="p-1.5 text-xs sm:text-sm font-mono font-bold tracking-widest bg-transparent border-0 outline-none cursor-pointer transition-colors duration-150 active:scale-95 hover:text-[#FF95B4]"
          style={{ color: navColor, textShadow: navShadow }}
          title={isZh ? 'Switch to English' : '切换至中文'}
        >
          {isZh ? 'EN' : '中'}
        </button>
      </div>

      {/* Layered Spatial Stage: Stacking & Covering Architecture */}
      <div className="fixed inset-0 h-screen w-screen overflow-hidden pointer-events-none select-none z-10">
        {/* ========================================================= */}
        {/* 0. HERO / HOMEPAGE: Center-Shrink Transition */}
        {/* ========================================================= */}
        <div
          className="fixed inset-0 h-screen w-screen flex items-center justify-center will-change-transform z-10 pointer-events-auto"
          style={{
            pointerEvents: shrinkOpacity <= 0.05 ? 'none' : 'auto',
          }}
        >
          <HeroSection
            language={language}
            shrinkScale={shrinkScale}
            shrinkOpacity={shrinkOpacity}
            isEditMode={isEditMode}
          />
        </div>

        {/* ========================================================= */}
        {/* 0.5. "WHO AM I": Fluid Optical Glass Lens & Typography */}
        {/* ========================================================= */}
        <WhoAmISection
          language={language}
          opacity={whoAmIOpacity}
          scale={whoAmIScale}
          progress={heroT}
        />

        {/* ========================================================= */}
        {/* 8 CHAPTERS: Pinned Viewport Staggered Slice / Block Wipe Transition */}
        {/* ========================================================= */}
        {chapterConfigs.chapters.map((chap) => {
          const hasPortal = !chap.noPortal;
          // Transition Portal Progress: 0.0 (slices start entering) -> 1.0 (slices fully wiped out)
          const coverP = hasPortal
            ? Math.min(1, Math.max(0, (currentScrollY - chap.coverStart) / (chap.coverDist || 1)))
            : 1.0;

          const isInside = currentScrollY >= chap.contentStart && currentScrollY <= chap.contentEnd;

          // Chapter container visibility:
          // 对于 education (教育背景)：必须在 who am i 完整展示结束后才开始渲染，绝不提前遮挡 who am i
          // 对于 awards (获奖)：在 skills 板块尾部即在 DOM 中预挂载 WebGL 上下文，但在到达自身起点前保持 opacity: 0，避免启动帧白屏或卡顿
          const isVisible = hasPortal
            ? currentScrollY >= chap.coverStart - dimensions.height * 0.2 && currentScrollY <= chap.contentEnd + dimensions.height * 0.2
            : (chap.id === 'awards'
                ? currentScrollY >= chap.contentStart - dimensions.height * 1.5 && currentScrollY <= chap.contentEnd + dimensions.height * 0.3
                : (chap.id === 'education'
                    ? currentScrollY >= chap.contentStart && currentScrollY <= chap.contentEnd + dimensions.height * 0.2
                    : currentScrollY >= chap.contentStart - dimensions.height * 0.2 && currentScrollY <= chap.contentEnd + dimensions.height * 0.2));
          const isPortalActive = hasPortal && coverP < 1.0;
          const isContentActive = !hasPortal || currentScrollY >= chap.contentStart;

          // 背景底色由根容器统一提供纯净 Hex #1E1E20 到 Hex #F1F1F1 平滑渐变，无任何额外图层与杂色
          return (
            <div
              key={chap.id}
              className="fixed inset-0 w-screen h-screen overflow-hidden will-change-transform bg-transparent"
              style={{
                zIndex: chap.zIndex,
                transform: 'translate3d(0, 0, 0)',
                visibility: isVisible ? 'visible' : 'hidden',
                display: isVisible ? 'block' : 'none',
                pointerEvents: isInside ? 'auto' : 'none',
              }}
            >
              {/* Phase A: Chapter Transition Portal (Scroll-driven Dual-Vector Bottom-to-Top and Right-to-Left Cover) */}
              {hasPortal && (
                <div
                  className="absolute inset-0 w-full h-full pointer-events-none transition-opacity duration-100"
                  style={{
                    opacity: isPortalActive ? 1 : 0,
                    visibility: isPortalActive ? 'visible' : 'hidden',
                  }}
                >
                  <ChapterTransitionPortal
                    chapterNumber={chap.num}
                    title={chap.title}
                    language={language}
                    progress={coverP}
                    inertiaSkew={inertiaSkew}
                    lightRatio={globalLightRatio}
                    variant={chap.id === 'portfolio' ? 'zoom-fade' : 'slide'}
                  />
                </div>
              )}

              {/* Phase B: Comprehensive Chapter Content (Enters while slices wipe out, then browsed) */}
              <div
                className="absolute inset-0 w-full h-full pointer-events-auto"
                style={{
                  opacity: isContentActive ? 1 : 0,
                  visibility: isContentActive ? 'visible' : 'hidden',
                  pointerEvents: isInside ? 'auto' : 'none',
                }}
              >
                {chap.id === 'education' && (
                  <AcademicTrackSection
                    language={language}
                    currentScrollX={currentScrollY}
                    sectionStartX={chap.contentStart}
                    sectionWidth={chap.contentDist}
                    inertiaSkew={inertiaSkew}
                    lightRatio={globalLightRatio}
                    isEditMode={isEditMode}
                  />
                )}
                {chap.id === 'experience' && (
                  <HorizontalExperienceSection
                    sectionWidth={chap.contentDist}
                    language={language}
                    onSetCursorMode={handleSetCursorMode}
                    currentScrollX={currentScrollY}
                    sectionStartX={chap.contentStart}
                    inertiaSkew={inertiaSkew}
                  />
                )}
                {chap.id === 'projects' && (
                  <ProjectsShowcaseSection
                    language={language}
                    currentScrollX={currentScrollY}
                    sectionStartX={chap.contentStart}
                    sectionWidth={chap.contentDist}
                    inertiaSkew={inertiaSkew}
                    lightRatio={globalLightRatio}
                  />
                )}
                {chap.id === 'portfolio' && (
                  <PortfolioFolderSection
                    language={language}
                    currentScrollX={currentScrollY}
                    sectionStartX={chap.contentStart}
                    sectionWidth={chap.contentDist}
                    inertiaSkew={inertiaSkew}
                    onPrevSection={handlePrevFromPortfolio}
                    onNextSection={handleNextFromPortfolio}
                  />
                )}
                {chap.id === 'social-media' && (
                  <SocialMediaTelemetrySection
                    language={language}
                    currentScrollX={currentScrollY}
                    sectionStartX={chap.contentStart}
                    sectionWidth={chap.contentDist}
                    inertiaSkew={inertiaSkew}
                  />
                )}
                {chap.id === 'skills' && (
                  <CapabilitiesCockpitSection
                    language={language}
                    currentScrollX={currentScrollY}
                    sectionStartX={chap.contentStart}
                    sectionWidth={chap.contentDist}
                    inertiaSkew={inertiaSkew}
                  />
                )}
                {chap.id === 'awards' && (
                  <AwardsPodiumSection
                    language={language}
                    currentScrollX={currentScrollY}
                    sectionStartX={chap.contentStart}
                    sectionWidth={chap.contentDist}
                    inertiaSkew={inertiaSkew}
                    lightRatio={globalLightRatio}
                  />
                )}
                {chap.id === 'contact' && (
                  <PitStopContactSection
                    language={language}
                    currentScrollX={currentScrollY}
                    sectionStartX={chap.contentStart}
                    sectionWidth={chap.contentDist}
                    onScrollToTop={() => handleScrollToSection('hero')}
                    inertiaSkew={inertiaSkew}
                    lightRatio={globalLightRatio}
                  />
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Native Scroll Dummy Track (Calculated Virtual Height to Drive Smooth Wheel Progress) */}
      <div
        className="w-full pointer-events-none opacity-0 select-none"
        style={{ height: `${chapterConfigs.totalVirtualHeight}px` }}
        aria-hidden="true"
      />

      {/* Fullscreen Chapters Navigation Modal */}
      <ChaptersOverlay
        isOpen={isChaptersOpen}
        onClose={() => setIsChaptersOpen(false)}
        activeSection={activeSection}
        onSelectSection={handleScrollToSection}
        language={language}
      />

      {/* Custom Interactive Speed Cursor */}
      <CustomCursor mode={cursorMode} text={cursorText} />
    </div>
  );
}
