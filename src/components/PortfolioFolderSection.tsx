import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { RESUME_CONTENT } from '../data/resumeData';
import { Language } from '../types';
import { soundEngine } from '../utils/soundEngine';
import FlexCarousel from './FlexCarousel';
import { getAllLocalFileUrls, saveLocalFile } from '../utils/pdfStorage';
import { ChevronDown, ChevronUp, ImagePlus, Video, X, RefreshCw, Upload, Sparkles } from 'lucide-react';

interface PortfolioFolderSectionProps {
  language: Language;
  currentScrollX?: number;
  sectionStartX?: number;
  sectionWidth?: number;
  inertiaSkew?: number;
  onPrevSection?: () => void;
  onNextSection?: () => void;
}

const PDF_INFO_MAP: Record<number, { localPath: string; webPath: string; fileName: string }> = {
  0: { localPath: '/documents/品牌VI.pdf', webPath: '/documents/品牌VI.pdf', fileName: '品牌VI.pdf' },
  1: { localPath: '/documents/包装.pdf', webPath: '/documents/包装.pdf', fileName: '包装.pdf' },
  2: { localPath: '/documents/导视.pdf', webPath: '/documents/导视.pdf', fileName: '导视.pdf' },
  3: { localPath: '/documents/交互.pdf', webPath: '/documents/交互.pdf', fileName: '交互.pdf' },
  4: { localPath: '/documents/交互-3D.pdf', webPath: '/documents/交互-3D.pdf', fileName: '交互-3D.pdf' },
  5: { localPath: '/documents/3D.pdf', webPath: '/documents/3D.pdf', fileName: '3D.pdf' },
};

export const PortfolioFolderSection: React.FC<PortfolioFolderSectionProps> = ({
  language,
  currentScrollX = 0,
  sectionStartX = 0,
  sectionWidth = 2400,
  onPrevSection,
  onNextSection,
}) => {
  const content = RESUME_CONTENT[language];
  const portfolioItems = content.portfolio || [];

  const [activeWorkIndex, setActiveWorkIndex] = useState<number>(0);
  const [isPhotoManagerOpen, setIsPhotoManagerOpen] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [targetUploadIndex, setTargetUploadIndex] = useState<number>(0);

  // Helper to detect if a source URL is video format
  const isVideoSource = (src: string | undefined): boolean => {
    if (!src) return false;
    return (
      src.startsWith('data:video/') ||
      /\.(mp4|webm|mov|ogg)(\?.*)?$/i.test(src)
    );
  };

  // Custom uploaded media types map (persists in localStorage)
  const [customMediaTypes, setCustomMediaTypes] = useState<Record<number, 'image' | 'video'>>(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('portfolio_custom_media_types_v1');
        return saved ? JSON.parse(saved) : {};
      } catch {
        return {};
      }
    }
    return {};
  });

  // Custom uploaded photos map for individual works (persists in localStorage + IndexedDB)
  const [customPhotos, setCustomPhotos] = useState<Record<number, string>>(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('portfolio_custom_photos_v1');
        return saved ? JSON.parse(saved) : {};
      } catch {
        return {};
      }
    }
    return {};
  });

  // Custom uploaded files map (persists in IndexedDB + localStorage)
  const [customFiles, setCustomFiles] = useState<Record<number, string>>(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('portfolio_custom_files_v2');
        return saved ? JSON.parse(saved) : {};
      } catch {
        return {};
      }
    }
    return {};
  });

  // Load persisted files and photos from IndexedDB on mount
  useEffect(() => {
    getAllLocalFileUrls().then((urls) => {
      if (Object.keys(urls).length > 0) {
        setCustomFiles((prev) => {
          let changed = false;
          const next = { ...prev };
          Object.entries(urls).forEach(([k, url]) => {
            const idx = parseInt(k, 10);
            if (!isNaN(idx) && !next[idx]) {
              next[idx] = url;
              changed = true;
            }
          });
          return changed ? next : prev;
        });

        setCustomPhotos((prev) => {
          let changed = false;
          const next = { ...prev };
          Object.entries(urls).forEach(([k, url]) => {
            if (k.startsWith('portfolio_photo_')) {
              const idx = parseInt(k.replace('portfolio_photo_', ''), 10);
              if (!isNaN(idx) && !next[idx]) {
                next[idx] = url;
                changed = true;
              }
            }
          });
          return changed ? next : prev;
        });
      }
    });
  }, []);

  const handleTriggerUpload = (idx: number) => {
    soundEngine.playClick();
    setTargetUploadIndex(idx);
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    soundEngine.playClick();

    const isVideo = file.type.startsWith('video/') || /\.(mp4|webm|mov|ogg)$/i.test(file.name);

    if (isVideo) {
      setCustomMediaTypes((prev) => {
        const next = { ...prev, [targetUploadIndex]: 'video' as const };
        try {
          localStorage.setItem('portfolio_custom_media_types_v1', JSON.stringify(next));
        } catch {}
        return next;
      });
    } else {
      setCustomMediaTypes((prev) => {
        const next = { ...prev, [targetUploadIndex]: 'image' as const };
        try {
          localStorage.setItem('portfolio_custom_media_types_v1', JSON.stringify(next));
        } catch {}
        return next;
      });
    }

    // For videos over 8MB, directly use Object URL and store file in IndexedDB
    if (isVideo && file.size > 8 * 1024 * 1024) {
      const blobUrl = URL.createObjectURL(file);
      setCustomPhotos((prev) => ({ ...prev, [targetUploadIndex]: blobUrl }));
      saveLocalFile(`portfolio_photo_${targetUploadIndex}`, file).catch(console.warn);
      e.target.value = '';
      return;
    }

    const reader = new FileReader();
    reader.onload = (ev) => {
      const dataUrl = ev.target?.result as string;
      if (dataUrl) {
        setCustomPhotos((prev) => {
          const next = { ...prev, [targetUploadIndex]: dataUrl };
          try {
            localStorage.setItem('portfolio_custom_photos_v1', JSON.stringify(next));
          } catch {
            // storage quota fallback
          }
          return next;
        });
        saveLocalFile(`portfolio_photo_${targetUploadIndex}`, file).catch(console.warn);
      }
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  const handleResetPhoto = (idx: number) => {
    soundEngine.playClick();
    setCustomPhotos((prev) => {
      const next = { ...prev };
      delete next[idx];
      try {
        localStorage.setItem('portfolio_custom_photos_v1', JSON.stringify(next));
      } catch {}
      return next;
    });
    setCustomMediaTypes((prev) => {
      const next = { ...prev };
      delete next[idx];
      try {
        localStorage.setItem('portfolio_custom_media_types_v1', JSON.stringify(next));
      } catch {}
      return next;
    });
  };

  const handleOpenWorkDirectly = useCallback((idx: number) => {
    soundEngine.playClick();
    const pdfTarget = PDF_INFO_MAP[idx];
    if (pdfTarget) {
      const customUrl = customFiles[idx];
      const pdfUrl = customUrl || pdfTarget.localPath;

      // Directly open in new window/tab
      const link = document.createElement('a');
      link.href = pdfUrl;
      link.target = '_blank';
      link.rel = 'noopener noreferrer';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  }, [customFiles]);

  const handleCarouselChange = useCallback((idx: number) => {
    setActiveWorkIndex((prev) => (prev !== idx ? idx : prev));
  }, []);

  const handleGoToPrevSection = () => {
    soundEngine.playClick();
    if (onPrevSection) {
      onPrevSection();
      return;
    }
    window.dispatchEvent(new CustomEvent('nav-to-section', { detail: 'projects-taikoo' }));
  };

  const handleGoToNextSection = () => {
    soundEngine.playClick();
    if (onNextSection) {
      onNextSection();
      return;
    }
    window.dispatchEvent(new CustomEvent('nav-to-section', { detail: 'social-media' }));
  };

  const carouselItems = useMemo(() => {
    return portfolioItems.map((item, idx) => {
      // 第一行只写作品名字和作品类型，第二行字删除，第三行照常 (01 / 06)
      const rawTitle = item.title || '';
      const workName = rawTitle.includes(' · ') ? rawTitle.split(' · ')[0].trim() : rawTitle.trim();
      const workType = (item.category || '').trim();
      const firstLine = workName && workType ? `${workName} · ${workType}` : (rawTitle || workType);

      // 优先使用单独自定义替换的照片/视频，其次使用 customFiles，最后默认图片
      const photoSrc = customPhotos[idx] || customFiles[idx] || item.image || '/images/chufeng_vi_page1.svg';
      const isVideo = customMediaTypes[idx] === 'video' || isVideoSource(photoSrc);

      return {
        src: photoSrc,
        alt: firstLine,
        title: firstLine,
        subtitle: '',
        isVideo,
      };
    });
  }, [portfolioItems, customPhotos, customFiles, customMediaTypes]);

  // Scroll entrance progress within Chapter 04
  const scrollDistance = Math.max(1, sectionWidth);
  const relativeScroll = currentScrollX - sectionStartX;

  // Keep full 100% brightness and crisp visibility: never fade or disappear!
  const folderTranslateX = 0;
  const opacity = 1;

  // Staggered & crisscrossed overlapping positions
  // All icons tucked downward into folder and pulled towards center so none exceed page boundaries
  // Folder height is reduced by ~1/5 (from 540px to 432px)
  const staggeredLayout = [
    // 01 品牌VI设计 · 楚风香茗茶礼包装 (左侧微倾斜，向中心收拢)
    { left: '2%', top: '-25px', rotate: -9, zIndex: 12, scale: 1.0, glow: 'rgba(79,106,61,0.5)' },
    // 02 包装设计 · 泰康茶礼普洱茶饼 (向上凸显，与01重叠)
    { left: '14%', top: '-60px', rotate: -3, zIndex: 15, scale: 1.04, glow: 'rgba(58,109,85,0.5)' },
    // 03 导视系统设计 · 艺设走廊指示牌 (向右微倾，与02重叠)
    { left: '27%', top: '-30px', rotate: 4, zIndex: 13, scale: 1.02, glow: 'rgba(236,91,60,0.5)' },
    // 04 网页 / 交互设计 · 环保生物黑胶唱片 (中心高耸，与03重叠)
    { left: '40%', top: '-68px', rotate: -5, zIndex: 16, scale: 1.05, glow: 'rgba(2,132,199,0.5)' },
    // 05 交互网页 / 3D 建模 / 动画 · 数字化生活报错弹窗 (向右倾斜，与04重叠)
    { left: '52%', top: '-32px', rotate: 6, zIndex: 14, scale: 1.02, glow: 'rgba(220,38,38,0.5)' },
    // 06 3D 建模 / TouchDesigner · 遗忘的避风港粒子建筑 (右侧微高，向中心收拢，不超出边界)
    { left: '64%', top: '-55px', rotate: 10, zIndex: 17, scale: 1.04, glow: 'rgba(245,158,11,0.5)' },
  ];

  // Custom high-fidelity 3D-styled SVG Icons (扩大2倍以上，起码大2倍，超大超华丽)
  const renderObjectIcon = (iconType: string) => {
    switch (iconType) {
      // 01 品牌VI设计 · 楚风香茗茶礼包装
      case 'package1':
        return (
          <div className="relative w-48 h-48 sm:w-56 sm:h-56 md:w-68 md:h-68 lg:w-[310px] lg:h-[310px] flex items-center justify-center filter drop-shadow-[0_20px_35px_rgba(79,106,61,0.48)]">
            <svg viewBox="0 0 160 160" className="w-full h-full select-none">
              <defs>
                <linearGradient id="teaBoxTop" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#7DA563" />
                  <stop offset="100%" stopColor="#4F6A3D" />
                </linearGradient>
                <linearGradient id="teaBoxLeft" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#4F6A3D" />
                  <stop offset="100%" stopColor="#25351B" />
                </linearGradient>
                <linearGradient id="teaBoxRight" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#3C532D" />
                  <stop offset="100%" stopColor="#1B2713" />
                </linearGradient>
                <linearGradient id="goldRibbon" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#FFF4D0" />
                  <stop offset="50%" stopColor="#F5B83D" />
                  <stop offset="100%" stopColor="#BA7B11" />
                </linearGradient>
                <linearGradient id="teaLeafGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#86BE9B" />
                  <stop offset="100%" stopColor="#3E6B4E" />
                </linearGradient>
              </defs>
              {/* Isometric 3D Gift Box */}
              <polygon points="80,22 140,52 80,82 20,52" fill="url(#teaBoxTop)" stroke="#8EB873" strokeWidth="1.2" />
              <polygon points="20,52 80,82 80,140 20,110" fill="url(#teaBoxLeft)" />
              <polygon points="80,82 140,52 140,110 80,140" fill="url(#teaBoxRight)" />
              
              {/* Box Top Bevel Highlights */}
              <line x1="80" y1="23" x2="139" y2="52" stroke="#A7D28E" strokeWidth="0.8" opacity="0.8" />
              
              {/* Golden Ribbon Vertical */}
              <polygon points="73,25 87,32 87,140 73,133" fill="url(#goldRibbon)" opacity="0.95" />
              {/* Golden Ribbon Horizontal */}
              <polygon points="20,78 80,106 80,119 20,91" fill="url(#goldRibbon)" opacity="0.88" />
              <polygon points="80,106 140,78 140,91 80,119" fill="url(#goldRibbon)" opacity="0.78" />
              
              {/* Tai Chi Tea Leaf Circular Emblem Badge */}
              <ellipse cx="80" cy="52" rx="18" ry="10" fill="url(#goldRibbon)" stroke="#FFF8E0" strokeWidth="1.2" />
              <ellipse cx="80" cy="52" rx="14" ry="7.5" fill="#3E6B4E" />
              <path d="M 75,52 Q 80,46 85,52 Q 80,58 75,52 Z" fill="url(#teaLeafGrad)" />
              
              {/* Brand Tag Pill hanging */}
              <rect x="66" y="102" width="28" height="14" rx="3.5" fill="#F6E9C5" stroke="#BA7B11" strokeWidth="1.2" />
              <text x="80" y="112" textAnchor="middle" fill="#25351B" fontSize="6.5" fontFamily="sans-serif" fontWeight="bold">01·VI</text>
            </svg>
          </div>
        );

      // 02 包装设计 · 泰康茶礼普洱茶饼与外包装
      case 'package2':
        return (
          <div className="relative w-48 h-48 sm:w-56 sm:h-56 md:w-68 md:h-68 lg:w-[310px] lg:h-[310px] flex items-center justify-center filter drop-shadow-[0_20px_35px_rgba(58,109,85,0.48)]">
            <svg viewBox="0 0 160 160" className="w-full h-full select-none">
              <defs>
                <linearGradient id="teaCakeTexture" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#E9D0D0" />
                  <stop offset="50%" stopColor="#DFD2BA" />
                  <stop offset="100%" stopColor="#C4D2C0" />
                </linearGradient>
                <linearGradient id="teaCaseTop" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#559978" />
                  <stop offset="100%" stopColor="#376751" />
                </linearGradient>
                <linearGradient id="teaCaseSide" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#376751" />
                  <stop offset="100%" stopColor="#1B3D2D" />
                </linearGradient>
              </defs>
              {/* Sliding Outer Drawer Gift Box in background */}
              <polygon points="68,26 148,48 116,128 36,106" fill="url(#teaCaseTop)" stroke="#74BA95" strokeWidth="1.2" opacity="0.92" />
              <polygon points="36,106 116,128 116,146 36,124" fill="url(#teaCaseSide)" />
              {/* Traditional Round Pu-erh Tea Cake in foreground */}
              <circle cx="76" cy="86" r="48" fill="url(#teaCakeTexture)" stroke="#C8B89E" strokeWidth="2.5" />
              {/* Concentric Traditional Wrapping Folds */}
              <circle cx="76" cy="86" r="42" fill="none" stroke="#A8947C" strokeWidth="1.2" strokeDasharray="5 2.5" opacity="0.75" />
              <circle cx="76" cy="86" r="33" fill="none" stroke="#8A7660" strokeWidth="0.9" opacity="0.65" />
              {/* Center Calligraphy Label (茶锦福运) */}
              <circle cx="76" cy="86" r="22" fill="#3A6D55" stroke="#F5B83D" strokeWidth="1.8" />
              <text x="76" y="84" textAnchor="middle" fill="#FFFFFF" fontSize="8.5" fontFamily="serif" fontWeight="bold">茶锦</text>
              <text x="76" y="94" textAnchor="middle" fill="#F5B83D" fontSize="7.5" fontFamily="serif" fontWeight="bold">福运</text>
              {/* Five Blessings Butterfly Stamp */}
              <circle cx="110" cy="56" r="11" fill="#E4032E" stroke="#FFFFFF" strokeWidth="1" opacity="0.95" />
              <text x="110" y="61" textAnchor="middle" fill="#FFFFFF" fontSize="8" fontFamily="sans-serif" fontWeight="bold">福</text>
            </svg>
          </div>
        );

      // 03 导视系统设计 · 艺设走廊指示牌与环境图标
      case 'signage':
        return (
          <div className="relative w-48 h-48 sm:w-56 sm:h-56 md:w-68 md:h-68 lg:w-[310px] lg:h-[310px] flex items-center justify-center filter drop-shadow-[0_20px_35px_rgba(236,91,60,0.48)]">
            <svg viewBox="0 0 160 160" className="w-full h-full select-none">
              <defs>
                <linearGradient id="metalTotem" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#4A4A4A" />
                  <stop offset="40%" stopColor="#969696" />
                  <stop offset="80%" stopColor="#636363" />
                  <stop offset="100%" stopColor="#2E2E2E" />
                </linearGradient>
                <linearGradient id="signageRed" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#FF7256" />
                  <stop offset="100%" stopColor="#EC5B3C" />
                </linearGradient>
                <linearGradient id="signagePink" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#FFA6CC" />
                  <stop offset="100%" stopColor="#F7A8DF" />
                </linearGradient>
              </defs>
              {/* Freestanding Wayfinding Totem Pillar */}
              <rect x="73" y="16" width="14" height="128" rx="4" fill="url(#metalTotem)" stroke="#CCCCCC" strokeWidth="1.2" />
              <ellipse cx="80" cy="144" rx="28" ry="9" fill="#181B1E" stroke="#525252" strokeWidth="1.2" />
              {/* Primary Direction Sign (pointing right: #EC5B3C 红色系) */}
              <path d="M 38,32 L 108,32 L 126,47 L 108,62 L 38,62 Z" fill="url(#signageRed)" stroke="#FFFFFF" strokeWidth="1.8" />
              <text x="70" y="50" textAnchor="middle" fill="#FFFFFF" fontSize="10.5" fontFamily="sans-serif" fontWeight="bold">301-311 ▶</text>
              {/* Classroom Badge Plaque A 301 */}
              <rect x="34" y="70" width="48" height="30" rx="4" fill="#FFFFFF" stroke="#EC5B3C" strokeWidth="2.2" />
              <text x="42" y="87" fill="#EC5B3C" fontSize="14" fontFamily="sans-serif" fontWeight="900">A</text>
              <text x="64" y="87" fill="#181B1E" fontSize="10.5" fontFamily="sans-serif" fontWeight="bold">301</text>
              <text x="58" y="96" textAnchor="middle" fill="#666666" fontSize="5.5" fontFamily="sans-serif">Visual Comm</text>
              {/* Secondary Direction Sign (pointing left: #F7A8DF 粉色系) */}
              <path d="M 124,96 L 54,96 L 36,111 L 54,126 L 124,126 Z" fill="url(#signagePink)" stroke="#FFFFFF" strokeWidth="1.8" />
              <text x="90" y="114" textAnchor="middle" fill="#3D3D3D" fontSize="9.5" fontFamily="sans-serif" fontWeight="bold">◀ 艺设长廊</text>
            </svg>
          </div>
        );

      // 04 网页 / 交互设计 · 环保生物黑胶唱片
      case 'vinyl':
        return (
          <div className="relative w-48 h-48 sm:w-56 sm:h-56 md:w-68 md:h-68 lg:w-[310px] lg:h-[310px] flex items-center justify-center filter drop-shadow-[0_20px_35px_rgba(2,132,199,0.48)]">
            <svg viewBox="0 0 160 160" className="w-full h-full select-none">
              <defs>
                <linearGradient id="lpVinylGrooves" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#22222A" />
                  <stop offset="45%" stopColor="#0B0B0F" />
                  <stop offset="70%" stopColor="#2A2A38" />
                  <stop offset="100%" stopColor="#0E0E14" />
                </linearGradient>
                <linearGradient id="slimeMoldCenter" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#38BDF8" />
                  <stop offset="50%" stopColor="#0284C7" />
                  <stop offset="100%" stopColor="#075985" />
                </linearGradient>
                <linearGradient id="sleeveCover" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#A3E635" />
                  <stop offset="100%" stopColor="#4D7C0F" />
                </linearGradient>
              </defs>
              {/* Eco Vinyl Jacket/Sleeve behind disc */}
              <rect x="22" y="22" width="86" height="86" rx="9" fill="url(#sleeveCover)" opacity="0.85" transform="rotate(-15 65 65)" stroke="#FFFFFF" strokeWidth="1.8" />
              {/* Outer 12-inch Translucent Bio-Plastic Vinyl Disc */}
              <circle cx="88" cy="88" r="60" fill="url(#lpVinylGrooves)" stroke="#64748B" strokeWidth="1.8" />
              {/* Micro-groove Soundwaves (Concentric) */}
              <circle cx="88" cy="88" r="54" fill="none" stroke="#475569" strokeWidth="1.1" opacity="0.85" />
              <circle cx="88" cy="88" r="47" fill="none" stroke="#64748B" strokeWidth="0.9" opacity="0.75" />
              <circle cx="88" cy="88" r="40" fill="none" stroke="#475569" strokeWidth="1.3" opacity="0.85" />
              <circle cx="88" cy="88" r="33" fill="none" stroke="#64748B" strokeWidth="0.9" opacity="0.75" />
              {/* Light Reflection Sheen / Specular highlights */}
              <path d="M 45,45 Q 88,70 131,45 Q 106,88 131,131 Q 88,106 45,131 Q 70,88 45,45 Z" fill="#FFFFFF" opacity="0.14" />
              {/* Center Slime Mold Bio-Audio Label */}
              <circle cx="88" cy="88" r="23" fill="url(#slimeMoldCenter)" stroke="#E0F2FE" strokeWidth="2.2" />
              <text x="88" y="85" textAnchor="middle" fill="#FFFFFF" fontSize="6.5" fontFamily="sans-serif" fontWeight="bold">ECO-VINYL</text>
              <text x="88" y="94" textAnchor="middle" fill="#BAE6FD" fontSize="5" fontFamily="sans-serif">Sound of Silence</text>
              {/* Center Spindle Hole */}
              <circle cx="88" cy="88" r="5" fill="#0A0B0E" stroke="#FFFFFF" strokeWidth="1.2" />
            </svg>
          </div>
        );

      // 05 交互网页 / 3D 建模 / 动画 · 数字化生活层叠报错弹窗Error
      case 'popup':
        return (
          <div className="relative w-48 h-48 sm:w-56 sm:h-56 md:w-68 md:h-68 lg:w-[310px] lg:h-[310px] flex items-center justify-center filter drop-shadow-[0_20px_35px_rgba(239,68,68,0.48)]">
            <svg viewBox="0 0 160 160" className="w-full h-full select-none">
              <defs>
                <linearGradient id="modalHeader1" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#0055EA" />
                  <stop offset="100%" stopColor="#3B82F6" />
                </linearGradient>
                <linearGradient id="modalHeader2" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#DC2626" />
                  <stop offset="100%" stopColor="#EF4444" />
                </linearGradient>
                <linearGradient id="modalBody" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#ECE9D8" />
                  <stop offset="100%" stopColor="#D4D0C8" />
                </linearGradient>
              </defs>
              {/* Cascading Error Window 1 (Background left) */}
              <rect x="16" y="22" width="80" height="56" rx="4" fill="url(#modalBody)" stroke="#0055EA" strokeWidth="2" opacity="0.88" />
              <rect x="18" y="24" width="76" height="13" fill="url(#modalHeader1)" />
              <circle cx="25" cy="30.5" r="2.5" fill="#EF4444" />
              <text x="32" y="33.5" fill="#FFFFFF" fontSize="6.5" fontFamily="sans-serif" fontWeight="bold">Error</text>

              {/* Cascading Error Window 2 (Background right) */}
              <rect x="64" y="40" width="80" height="56" rx="4" fill="url(#modalBody)" stroke="#0055EA" strokeWidth="2" opacity="0.92" />
              <rect x="66" y="42" width="76" height="13" fill="url(#modalHeader1)" />
              <circle cx="73" cy="48.5" r="2.5" fill="#EF4444" />
              <text x="80" y="51.5" fill="#FFFFFF" fontSize="6.5" fontFamily="sans-serif" fontWeight="bold">Error</text>

              {/* Cascading Main Error Window 3 (Foreground center) */}
              <rect x="34" y="66" width="94" height="68" rx="5" fill="url(#modalBody)" stroke="#DC2626" strokeWidth="2.8" />
              <rect x="36.5" y="68.5" width="89" height="15" fill="url(#modalHeader2)" />
              {/* Close Button X */}
              <rect x="114" y="70.5" width="9.5" height="11" rx="1.5" fill="#DC2626" stroke="#FFFFFF" strokeWidth="0.8" />
              <text x="118.5" y="79" textAnchor="middle" fill="#FFFFFF" fontSize="7.5" fontWeight="bold">×</text>
              <text x="42" y="79" fill="#FFFFFF" fontSize="7" fontFamily="sans-serif" fontWeight="bold">Error - Click 'Fix' to fix error.</text>
              
              {/* Red Critical Error Icon (Circle with White X) */}
              <circle cx="56" cy="98" r="9" fill="#DC2626" />
              <text x="56" y="102" textAnchor="middle" fill="#FFFFFF" fontSize="12" fontWeight="bold">×</text>
              {/* Message text */}
              <text x="70" y="97" fill="#1F2937" fontSize="6.5" fontFamily="sans-serif" fontWeight="bold">Click 'Fix' to fix error.</text>
              {/* Interactive Fix Button */}
              <rect x="70" y="105" width="36" height="15" rx="3.5" fill="#FFFFFF" stroke="#9CA3AF" strokeWidth="1.2" />
              <text x="88" y="116" textAnchor="middle" fill="#1F2937" fontSize="7.5" fontFamily="sans-serif" fontWeight="bold">Fix</text>
              {/* 99+ Red Notification Badge */}
              <circle cx="130" cy="64" r="11" fill="#E4032E" stroke="#FFFFFF" strokeWidth="1.8" />
              <text x="130" y="68.5" textAnchor="middle" fill="#FFFFFF" fontSize="8" fontFamily="sans-serif" fontWeight="bold">99+</text>
            </svg>
          </div>
        );

      // 06 3D 建模 / TouchDesigner · 遗忘的避风港三维扫描与动态粒子建筑
      case 'building':
        return (
          <div className="relative w-48 h-48 sm:w-56 sm:h-56 md:w-68 md:h-68 lg:w-[310px] lg:h-[310px] flex items-center justify-center filter drop-shadow-[0_20px_35px_rgba(245,158,11,0.48)]">
            <svg viewBox="0 0 160 160" className="w-full h-full select-none">
              <defs>
                <linearGradient id="roofGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#FDE047" />
                  <stop offset="50%" stopColor="#F59E0B" />
                  <stop offset="100%" stopColor="#B45309" />
                </linearGradient>
                <linearGradient id="glassFacade" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#38BDF8" opacity="0.9" />
                  <stop offset="100%" stopColor="#0284C7" opacity="0.6" />
                </linearGradient>
                <linearGradient id="ruinWall" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#92400E" />
                  <stop offset="100%" stopColor="#451A03" />
                </linearGradient>
              </defs>
              {/* TouchDesigner Glowing Particle Cloud surrounding the structure */}
              <circle cx="38" cy="38" r="1.8" fill="#38BDF8" />
              <circle cx="58" cy="22" r="2.2" fill="#FCD34D" />
              <circle cx="122" cy="32" r="2" fill="#F59E0B" />
              <circle cx="138" cy="62" r="2.4" fill="#38BDF8" />
              <circle cx="28" cy="78" r="1.8" fill="#FCD34D" />
              <circle cx="142" cy="112" r="1.7" fill="#F43F5E" />
              <circle cx="22" cy="122" r="2.2" fill="#38BDF8" />
              
              {/* 3D Cantilever Roof */}
              <polygon points="80,22 142,48 80,70 18,48" fill="url(#roofGrad)" stroke="#FEF08A" strokeWidth="1.6" />
              {/* Architectural Glass Pavilion / Ruin Facade */}
              <polygon points="26,52 80,72 80,128 26,108" fill="url(#glassFacade)" stroke="#BAE6FD" strokeWidth="1.2" />
              <polygon points="80,72 134,52 134,108 80,128" fill="url(#ruinWall)" stroke="#B45309" strokeWidth="1.2" />
              
              {/* 3D Laser Point Cloud Wireframe Lines */}
              <line x1="40" y1="57" x2="40" y2="113" stroke="#FFFFFF" strokeWidth="1.1" opacity="0.75" strokeDasharray="3 2" />
              <line x1="54" y1="62" x2="54" y2="118" stroke="#FFFFFF" strokeWidth="1.1" opacity="0.75" strokeDasharray="3 2" />
              <line x1="68" y1="67" x2="68" y2="123" stroke="#FFFFFF" strokeWidth="1.1" opacity="0.75" strokeDasharray="3 2" />
              <line x1="98" y1="67" x2="98" y2="123" stroke="#FDE047" strokeWidth="1.1" opacity="0.8" strokeDasharray="3 2" />
              <line x1="116" y1="58" x2="116" y2="114" stroke="#FDE047" strokeWidth="1.1" opacity="0.8" strokeDasharray="3 2" />
              
              {/* Base Plinth */}
              <polygon points="14,108 80,134 146,108 80,94" fill="#18181B" opacity="0.9" stroke="#52525B" strokeWidth="1.2" />
              {/* TouchDesigner Tag */}
              <rect x="50" y="128" width="60" height="13" rx="3.5" fill="#0A0B0E" stroke="#F59E0B" strokeWidth="1.2" />
              <text x="80" y="138" textAnchor="middle" fill="#FCD34D" fontSize="6.5" fontFamily="monospace" fontWeight="bold">TouchDesigner</text>
            </svg>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <section
      id="portfolio"
      className="relative w-full h-full flex flex-col items-center justify-center bg-transparent overflow-hidden select-none px-4 sm:px-6"
    >
      {/* REACT BITS FLEXCAROUSEL (Full Screen 3D WebGL Liquid Lens Carousel) */}
      <div
        className="absolute inset-0 w-screen h-screen min-h-screen flex items-center justify-center select-none will-change-transform z-20"
        style={{
          transform: `translate3d(${folderTranslateX}vw, 0, 0)`,
          opacity,
          transition: 'transform 0.04s linear, opacity 0.06s linear',
        }}
      >
        {/* 页面中间上方上一页箭头 (纯净箭头，无底色圆圈框，紧贴顶部不挡字) */}
        <div className="absolute top-2.5 sm:top-3.5 left-1/2 -translate-x-1/2 z-30 pointer-events-auto">
          <button
            type="button"
            onClick={handleGoToPrevSection}
            className="group flex items-center justify-center p-1 bg-transparent border-0 shadow-none transition-all duration-300 cursor-pointer active:scale-90 text-zinc-400 hover:text-white"
            aria-label={language === 'zh' ? '上一页' : 'Prev'}
            title={language === 'zh' ? '上一页' : 'Prev'}
          >
            <ChevronUp
              size={22}
              className="text-zinc-400 group-hover:text-[#FF95B4] group-hover:-translate-y-1 transition-all duration-300 animate-bounce drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)]"
            />
          </button>
        </div>

        <input
          ref={fileInputRef}
          type="file"
          accept={targetUploadIndex >= 4 ? "video/*,image/*,.mp4,.webm,.mov" : "image/*"}
          className="hidden"
          onChange={handleFileChange}
        />

        <FlexCarousel
          items={carouselItems}
          preset="liquid"
          intro="none"
          cardHeight={0.62}
          focusOnClick={true}
          captions={true}
          captureWheel={true}
          resetTrigger={0}
          onChange={handleCarouselChange}
          onSelect={handleOpenWorkDirectly}
        />

        {/* 页面中间下方下一页箭头 (纯净箭头，无底色圆圈框，紧贴底部不挡字) */}
        <div className="absolute bottom-2 sm:bottom-3 left-1/2 -translate-x-1/2 z-30 pointer-events-auto">
          <button
            type="button"
            onClick={handleGoToNextSection}
            className="group flex items-center justify-center p-1 bg-transparent border-0 shadow-none transition-all duration-300 cursor-pointer active:scale-90 text-zinc-400 hover:text-white"
            aria-label={language === 'zh' ? '下一页' : 'Next'}
            title={language === 'zh' ? '下一页' : 'Next'}
          >
            <ChevronDown
              size={22}
              className="text-zinc-400 group-hover:text-[#FF95B4] group-hover:translate-y-1 transition-all duration-300 animate-bounce drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)]"
            />
          </button>
        </div>
      </div>

      {/* 6个作品单独替换照片/视频的管理弹窗 */}
      {isPhotoManagerOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md select-none animate-fadeIn"
          onClick={() => setIsPhotoManagerOpen(false)}
        >
          <div
            className="relative w-full max-w-2xl max-h-[85vh] overflow-y-auto bg-zinc-900/95 border border-white/15 rounded-2xl p-5 sm:p-6 shadow-2xl text-left"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-4 border-b border-white/10">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-lg bg-[#FF95B4]/15 text-[#FF95B4]">
                  <ImagePlus size={18} />
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-semibold text-white tracking-wide">
                    {language === 'zh' ? '单独替换各作品照片 / 视频' : 'Replace Work Photos & Videos Individually'}
                  </h3>
                  <p className="text-xs text-zinc-400 mt-0.5">
                    {language === 'zh' ? '支持上传高清大图，最后两个作品支持直接上传动态视频 (MP4/WebM)，更换后即刻呈现' : 'Upload high-res photos, or upload videos (MP4/WebM) for the last two works'}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsPhotoManagerOpen(false)}
                className="p-1.5 rounded-full hover:bg-white/10 text-zinc-400 hover:text-white transition-colors cursor-pointer"
                aria-label="Close"
              >
                <X size={18} />
              </button>
            </div>

            <div className="mt-4 space-y-3">
              {portfolioItems.map((item, idx) => {
                const rawTitle = item.title || '';
                const workName = rawTitle.includes(' · ') ? rawTitle.split(' · ')[0].trim() : rawTitle.trim();
                const workType = (item.category || '').trim();
                const currentSrc = customPhotos[idx] || customFiles[idx] || item.image || '/images/chufeng_vi_page1.svg';
                const isCustomized = !!customPhotos[idx];
                const itemIsVideo = customMediaTypes[idx] === 'video' || isVideoSource(currentSrc);

                return (
                  <div
                    key={item.id || idx}
                    className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 rounded-xl bg-white/[0.03] border border-white/[0.08] hover:border-white/20 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="relative w-16 h-12 rounded-lg overflow-hidden bg-black/50 border border-white/10 flex-shrink-0 flex items-center justify-center">
                        {itemIsVideo ? (
                          <>
                            <video
                              src={currentSrc}
                              autoPlay
                              loop
                              muted
                              playsInline
                              className="w-full h-full object-cover"
                            />
                            <span className="absolute bottom-1 right-1 px-1 py-0.5 rounded bg-black/80 text-[8px] font-mono text-emerald-400 font-bold border border-emerald-500/40">
                              VIDEO
                            </span>
                          </>
                        ) : (
                          <img
                            src={currentSrc}
                            alt={workName}
                            className="w-full h-full object-cover opacity-0 transition-opacity duration-500"
                            loading="lazy"
                            onLoad={(e) => e.currentTarget.classList.remove('opacity-0')}
                          />
                        )}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-mono px-1.5 py-0.5 rounded bg-white/10 text-[#FF95B4]">
                            {String(idx + 1).padStart(2, '0')}
                          </span>
                          <span className="text-base font-medium text-white line-clamp-1">
                            {workName}
                          </span>
                          {idx >= 4 && (
                            <span className="text-sm font-medium px-1.5 py-0.5 rounded bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                              {language === 'zh' ? '支持视频' : 'Video Supported'}
                            </span>
                          )}
                        </div>
                        <span className="text-sm text-zinc-400 mt-0.5 block">
                          {workType}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 sm:self-center self-end">
                      {isCustomized && (
                        <button
                          type="button"
                          onClick={() => handleResetPhoto(idx)}
                          className="flex items-center gap-1 px-2.5 py-1.5 text-xs text-zinc-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors cursor-pointer"
                          title={language === 'zh' ? '恢复默认' : 'Reset to default'}
                        >
                          <RefreshCw size={12} />
                          <span>{language === 'zh' ? '恢复默认' : 'Reset'}</span>
                        </button>
                      )}
                      <button
                        type="button"
                        onClick={() => handleTriggerUpload(idx)}
                        className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-[#FF95B4]/20 hover:bg-[#FF95B4]/30 border border-[#FF95B4]/40 text-[#FF95B4] hover:text-white rounded-lg transition-all cursor-pointer shadow-sm active:scale-95"
                      >
                        {idx >= 4 ? <Video size={12} /> : <Upload size={12} />}
                        <span>
                          {language === 'zh'
                            ? (isCustomized
                                ? (idx >= 4 ? '重新上传视频/图' : '重新上传照片')
                                : (idx >= 4 ? '上传视频/照片' : '更换照片'))
                            : (idx >= 4 ? 'Upload Video/Photo' : 'Upload Photo')}
                        </span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="mt-5 pt-3 border-t border-white/10 flex justify-end">
              <button
                type="button"
                onClick={() => setIsPhotoManagerOpen(false)}
                className="px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 text-sm font-medium text-white transition-colors cursor-pointer"
              >
                {language === 'zh' ? '完成' : 'Done'}
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
