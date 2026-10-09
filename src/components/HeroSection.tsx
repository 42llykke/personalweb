import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Language } from '../types';
import { soundEngine } from '../utils/soundEngine';
import { Sparkles, Camera, ImagePlus } from 'lucide-react';
import { getLocalFileUrl, saveLocalFile } from '../utils/pdfStorage';
import { RESUME_CONTENT } from '../data/resumeData';

// ============================================================================
// DESIGNER CONFIGURATION (网页设计者可配置区域)
// 设计者可以直接在此修改视频 URL 和人物照片路径
// ============================================================================
export const HERO_VIDEO_CONFIG = {
  // 1. 本地视频背景路径 (纯英文无空格文件名)
  src: '/videos/shouye.mp4',
  fallbackSrc: '/videos/shouye.mp4',
  autoPlay: true,
  loop: true,
  muted: true,
  opacity: 0.45,
};

export const HERO_PORTRAIT_CONFIG = {
  // 2. 顶层中间人物照片路径（标准路径：/images/I.png）
  src: '/images/I.png',
  alt: 'Lykke Portrait',
};

interface HeroSectionProps {
  language?: Language;
  onLanguageToggle?: () => void;
  onSelectChapter?: (id: string) => void;
  onScrollDown?: () => void;
  shrinkScale?: number;
  shrinkOpacity?: number;
  isEditMode?: boolean;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  language = 'zh',
  shrinkScale = 1,
  shrinkOpacity = 1,
  isEditMode = false,
}) => {
  const isZh = language === 'zh';
  const heroMedia = RESUME_CONTENT[language]?.personal?.heroMedia;
  const defaultVideo = heroMedia?.videoUrl || HERO_VIDEO_CONFIG.src;
  const defaultAvatar = heroMedia?.avatarUrl || HERO_PORTRAIT_CONFIG.src;

  // Video background & Portrait photo states (Defaults initialized from Designer Config or localStorage)
  const [videoSrc, setVideoSrc] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('lykke_homepage_video');
      if (saved && !saved.startsWith('http')) return saved;
    }
    return defaultVideo;
  });
  const [portraitSrc, setPortraitSrc] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('lykke_homepage_portrait');
      if (saved && !saved.startsWith('http') && !saved.includes('/images/I.png')) return saved;
    }
    return defaultAvatar;
  });

  // Load persistent uploaded video & portrait from IndexedDB
  useEffect(() => {
    getLocalFileUrl('lykke_homepage_video').then((url) => {
      if (url) setVideoSrc(url);
    }).catch(() => {});

    getLocalFileUrl('lykke_homepage_portrait').then((url) => {
      if (url) setPortraitSrc(url);
    }).catch(() => {});
  }, []);
  const [isHovering, setIsHovering] = useState(false);
  const [hasVideoError, setHasVideoError] = useState(false);
  const [isProcessingPhoto, setIsProcessingPhoto] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const videoFileInputRef = useRef<HTMLInputElement>(null);
  const imageFileInputRef = useRef<HTMLInputElement>(null);

  /**
   * Automatic Client-Side Canvas Cutout Background Removal
   * Samples background light threshold and converts studio/white backgrounds into clean transparent PNG.
   * Auto-downscales large images to 800px max dimension to optimize memory & performance.
   */
  const processImageCutout = (file: File): Promise<string> => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const src = e.target?.result as string;
        if (!src) return resolve(URL.createObjectURL(file));

        const img = new Image();
        img.crossOrigin = 'anonymous';
        img.onload = () => {
          const maxDim = 800;
          let scale = 1;
          if (img.width > maxDim || img.height > maxDim) {
            scale = maxDim / Math.max(img.width, img.height);
          }

          const canvas = document.createElement('canvas');
          canvas.width = Math.round(img.width * scale);
          canvas.height = Math.round(img.height * scale);
          const ctx = canvas.getContext('2d');
          if (!ctx) return resolve(src);

          ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
          const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
          const data = imageData.data;

          const corners = [
            [0, 0],
            [canvas.width - 1, 0],
            [0, canvas.height - 1],
            [canvas.width - 1, canvas.height - 1]
          ];

          let totalR = 0, totalG = 0, totalB = 0;
          corners.forEach(([x, y]) => {
            const idx = (y * canvas.width + x) * 4;
            totalR += data[idx];
            totalG += data[idx + 1];
            totalB += data[idx + 2];
          });

          const bgR = totalR / 4;
          const bgG = totalG / 4;
          const bgB = totalB / 4;

          const isLightBg = bgR > 170 && bgG > 170 && bgB > 170;

          if (isLightBg) {
            for (let i = 0; i < data.length; i += 4) {
              const r = data[i];
              const g = data[i + 1];
              const b = data[i + 2];
              const a = data[i + 3];

              if (a === 0) continue;

              const dist = Math.hypot(r - bgR, g - bgG, b - bgB);
              if (dist < 55) {
                data[i + 3] = 0;
              } else if (dist < 95) {
                const alphaFactor = (dist - 55) / 40;
                data[i + 3] = Math.round(a * alphaFactor);
              }
            }
            ctx.putImageData(imageData, 0, 0);
            resolve(canvas.toDataURL('image/png'));
          } else {
            resolve(src);
          }
        };
        img.onerror = () => resolve(src);
        img.src = src;
      };
      reader.onerror = () => resolve(URL.createObjectURL(file));
      reader.readAsDataURL(file);
    });
  };

  const [syncToast, setSyncToast] = useState<string | null>(null);

  const notifySync = (msg: string) => {
    setSyncToast(msg);
    setTimeout(() => setSyncToast(null), 4500);
  };

  const uploadFileToServer = async (file: File | Blob, originalFileName: string) => {
    try {
      const res = await fetch('/api/upload-media', {
        method: 'POST',
        headers: {
          'x-file-name': encodeURIComponent(originalFileName),
        },
        body: file,
      });
      if (res.ok) {
        const data = await res.json();
        console.log('[UploadSync] Successfully saved to public directory:', data);
        notifySync(`✅ 文件已全站永久保存！任意电脑或手机访问本网页即可看到此文件。`);
      }
    } catch (err) {
      console.warn('[UploadSync] Server upload failed:', err);
    }
  };

  const handleVideoFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const localUrl = URL.createObjectURL(file);
      setVideoSrc(localUrl);
      setHasVideoError(false);
      try {
        await saveLocalFile('lykke_homepage_video', file);
      } catch (err) {
        console.warn('Failed to save video to IndexedDB:', err);
      }
      notifySync(`⏳ 正在将视频 ${file.name} 永久上传并保存到全站服务器...`);
      await uploadFileToServer(file, file.name);
      e.target.value = '';
    }
  };

  const handleImageFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setIsProcessingPhoto(true);
      notifySync(`✨ 正在完成抠图并保存全站首页人物照片...`);
      const cutoutDataUrl = await processImageCutout(file);
      setPortraitSrc(cutoutDataUrl);
      try {
        localStorage.setItem('lykke_homepage_portrait', cutoutDataUrl);
      } catch (err) {
        console.warn('localStorage quota exceeded:', err);
      }
      setIsProcessingPhoto(false);

      try {
        const response = await fetch(cutoutDataUrl);
        const blob = await response.blob();
        await saveLocalFile('lykke_homepage_portrait', blob);
        await uploadFileToServer(blob, 'lykke_portrait_nobg.png');
      } catch (err) {
        try {
          await saveLocalFile('lykke_homepage_portrait', file);
        } catch {}
        await uploadFileToServer(file, file.name);
      }
      e.target.value = '';
    }
  };

  // Sync ref for hover state in 60fps animation loop
  const isHoveringRef = useRef(false);
  useEffect(() => {
    isHoveringRef.current = isHovering;
  }, [isHovering]);

  // Irregular center stage container dimensions & mouse tracking
  const centerStageRef = useRef<HTMLDivElement>(null);
  const watermarkLayerRef = useRef<HTMLDivElement>(null);
  const clipPathRef = useRef<SVGPathElement>(null);
  const greyPathRef = useRef<SVGPathElement>(null);

  // Mouse physics: position, velocity, and fluid motion angle
  const targetPos = useRef({ x: 450, y: 280 });
  const currentPos = useRef({ x: 450, y: 280 });
  const prevPos = useRef({ x: 450, y: 280 });
  const smoothedSpeed = useRef(0);
  const motionAngle = useRef(0);
  const lastMoveTime = useRef(0);

  // Advanced fluid mechanics: Vorticity swirl, shear strain, and surface tension auto-coalescence
  const vorticity = useRef(0);
  const shearStrain = useRef(0);
  const cohesionProgress = useRef(1); // 1 = fully merged/coalesced, 0 = fully dispersed

  // Gravity-Vector physics: Downward fluid sagging and droplet dripping at trajectory end / rest ("缓慢下坠并聚集")
  const gravityDripY = useRef(0);
  const gravityVelocityY = useRef(0);

  // Gravity / Momentum Fling physics vectors ("像受到力一样甩出去一点距离")
  const flingOffset = useRef({ x: 0, y: 0 });
  const flingVelocity = useRef({ x: 0, y: 0 });

  const [stageDimensions, setStageDimensions] = useState({
    width: typeof window !== 'undefined' ? window.innerWidth - 16 : 1200,
    height: typeof window !== 'undefined' ? window.innerHeight - 16 : 750,
  });

  // Update center stage dimensions for responsive SVG viewport
  const updateStageDimensions = useCallback(() => {
    if (centerStageRef.current) {
      setStageDimensions({
        width: centerStageRef.current.clientWidth,
        height: centerStageRef.current.clientHeight,
      });
    }
  }, []);

  useEffect(() => {
    updateStageDimensions();
    window.addEventListener('resize', updateStageDimensions);
    return () => window.removeEventListener('resize', updateStageDimensions);
  }, [updateStageDimensions]);

  // Generate smooth rounded irregular outline path with rounded fillets at EVERY corner (outer corners and inner notches)
  const getRoundedIrregularPath = useCallback((W: number, H: number): string => {
    if (W <= 0 || H <= 0) return '';
    const isMobile = W < 768;
    const R = isMobile ? 18 : 24; // Main outer corners radius
    const r = isMobile ? 14 : 18; // Notch inner & outer fillets radius

    // Top-left notch dimensions
    const nw = isMobile ? 116 : 140;
    const nh = isMobile ? 42 : 46;

    // Bottom-right notch dimensions
    const bw = isMobile ? 106 : 122;
    const bh = isMobile ? 38 : 42;

    return `
      M 0 ${nh + r}
      Q 0 ${nh} ${r} ${nh}
      L ${nw - r} ${nh}
      Q ${nw} ${nh} ${nw} ${nh - r}
      L ${nw} ${r}
      Q ${nw} 0 ${nw + r} 0
      L ${W - R} 0
      Q ${W} 0 ${W} ${R}
      L ${W} ${H - bh - r}
      Q ${W} ${H - bh} ${W - r} ${H - bh}
      L ${W - bw + r} ${H - bh}
      Q ${W - bw} ${H - bh} ${W - bw} ${H - bh + r}
      L ${W - bw} ${H - r}
      Q ${W - bw} ${H} ${W - bw - r} ${H}
      L ${R} ${H}
      Q 0 ${H} 0 ${H - R}
      Z
    `.replace(/\s+/g, ' ').trim();
  }, []);

  /**
   * Helper: Generate an authentic, irregular, organic liquid water ripple contour ("像水纹一样不规则形状自然变化")
   * - Emulates real fluid surface tension with multi-octave harmonic wave interference
   * - Produces natural fluid lobes, asymmetric liquid bulges, and wavy ripples (NEVER a circle or ellipse)
   * - Continuous real-time harmonic morphing across time `t`
   */
  /**
   * Helper: Generate an authentic, full, organic liquid water ripple contour ("饱满自然的水纹")
   * - Eliminates slender/stiff strips: retains full, rounded girth and soft liquid tension
   * - Multi-octave continuous harmonic fluid waves create gentle undulating liquid contours
   * - Meniscus teardrop sag when stationary or decelerating
   */
  const generateOrganicWaterRipple = (
    cx: number,
    cy: number,
    rx: number,
    ry: number,
    angle: number,
    t: number,
    seed: number,
    shear: number,
    vort: number,
    gravitySag: number = 0
  ): string => {
    const N = 24; // High vertex count for silky fluid splines
    const pts: { x: number; y: number }[] = [];
    const cosA = Math.cos(angle);
    const sinA = Math.sin(angle);

    for (let i = 0; i < N; i++) {
      const phi = (i * 2 * Math.PI) / N;

      // 1. Soft, undulating organic liquid ripple harmonics (natural fluid surface tension)
      const wave1 = 0.15 * Math.sin(2 * phi + t * 2.0 + seed);
      const wave2 = 0.10 * Math.cos(3 * phi - t * 1.5 + seed * 1.3);
      const wave3 = 0.06 * Math.sin(4 * phi + t * 2.4 + seed * 0.7);

      // 2. Gentle natural meniscus variation (keeps shape full, rounded and organic)
      const rDeform = 1.0 + wave1 + wave2 + wave3;

      // 3. Subtle fluid twist during quick turns
      const twist = vort * 0.18 * Math.sin(phi);
      const effectivePhi = phi + twist;

      // 4. Full, rounded local coordinates (generous width & height)
      let localX = rx * Math.cos(effectivePhi) * rDeform;
      let localY = ry * Math.sin(effectivePhi) * rDeform;

      // 5. Soft fluid shear along motion (gentle curve instead of rigid skew)
      localX += shear * localY * 0.22;

      // Rotate into trajectory orientation
      let px = cx + cosA * localX - sinA * localY;
      let py = cy + sinA * localX + cosA * localY;

      // 6. Hydrostatic Gravity Sag: Lower half sags gently downward like a full liquid teardrop
      const relY = py - cy;
      if (gravitySag > 0.02 && relY > 0) {
        py += Math.pow(relY / Math.max(1, ry), 1.25) * (gravitySag * 14);
      }

      pts.push({
        x: Math.round(px * 10) / 10,
        y: Math.round(py * 10) / 10,
      });
    }

    // Smooth closed quadratic Bézier spline connecting midpoints for silky fluid contours
    const mids = pts.map((p, i) => {
      const next = pts[(i + 1) % N];
      return {
        x: (p.x + next.x) / 2,
        y: (p.y + next.y) / 2,
      };
    });

    let d = `M ${mids[0].x} ${mids[0].y} `;
    for (let i = 0; i < N; i++) {
      const nextIdx = (i + 1) % N;
      d += `Q ${pts[nextIdx].x} ${pts[nextIdx].y} ${mids[nextIdx].x} ${mids[nextIdx].y} `;
    }
    d += 'Z';
    return d;
  };

  /**
   * Fluid Dynamics Wake Generator:
   * - Single cohesive liquid water ripple contour (eliminates ugly middle overlapping cuts)
   * - Natural, full water puddle proportions (not slender or stiff, ~1.2:1 aspect ratio)
   * - Silky multi-octave surface tension waves with hydrostatic gravity sag
   * - Looks 100% like authentic spilled water on a smooth vertical surface
   */
  const generateWaterWakePath = (
    t: number,
    speed: number,
    angle: number,
    shear: number,
    vort: number,
    _cohesion: number,
    gravitySag: number
  ): string => {
    if (speed < 0.1) return 'M 0 0 Z';

    // Base radius scales with velocity (generous, full water puddle)
    const baseR = Math.max(38, Math.min(185, 42 + speed * 4.6));

    // Full rounded water puddle with gentle directional elongation along movement
    const rx = baseR * (1.06 + Math.min(0.25, speed * 0.012));
    const ry = baseR * (0.94 + Math.min(0.16, speed * 0.008));
    const leadDist = Math.min(22, speed * 0.52);
    const cx = Math.cos(angle) * leadDist;
    const cy = Math.sin(angle) * leadDist;

    // Return single, unified, authentic organic fluid contour
    return generateOrganicWaterRipple(cx, cy, rx, ry, angle, t, 1.2, shear, vort, gravitySag);
  };

  // High-performance 60fps physics simulation loop with momentum, non-linear drag & auto-coalescence
  useEffect(() => {
    let animId: number;
    const lerpFactor = 0.16;

    const animate = (timestamp: number) => {
      // 1. Smooth position tracking
      currentPos.current.x += (targetPos.current.x - currentPos.current.x) * lerpFactor;
      currentPos.current.y += (targetPos.current.y - currentPos.current.y) * lerpFactor;

      // 2. Velocity calculation
      const vx = currentPos.current.x - prevPos.current.x;
      const vy = currentPos.current.y - prevPos.current.y;
      prevPos.current.x = currentPos.current.x;
      prevPos.current.y = currentPos.current.y;

      const instantSpeed = Math.hypot(vx, vy);

      // Check if mouse stopped moving recently
      const now = performance.now();
      const timeSinceMove = now - lastMoveTime.current;
      const effectiveInstantSpeed = timeSinceMove > 75 ? 0 : instantSpeed;

      // 3. Complex Non-linear Viscous Attenuation Algorithm (物理衰减算法)
      // Combines laminar drag (linear) and turbulent fluid resistance (quadratic)
      const dragFactor = 0.12 + Math.min(0.25, smoothedSpeed.current * 0.008);
      if (effectiveInstantSpeed > smoothedSpeed.current) {
        smoothedSpeed.current += (effectiveInstantSpeed - smoothedSpeed.current) * 0.42; // Fast energetic attack
      } else {
        smoothedSpeed.current += (effectiveInstantSpeed - smoothedSpeed.current) * dragFactor; // Viscous attenuation decay
      }

      if (smoothedSpeed.current < 0.10) {
        smoothedSpeed.current = 0;
      }

      // 4. Dynamic shear strain calculation based on velocity vector ("根据速度矢量产生动态的扭曲形变")
      const targetShear = Math.min(0.65, instantSpeed * 0.028);
      shearStrain.current += (targetShear - shearStrain.current) * 0.22;
      shearStrain.current *= 0.92; // Viscous shear dissipation

      // 5. Vorticity & Angular acceleration (twist deformation during turns and flicks)
      if (instantSpeed > 0.4) {
        const targetAngle = Math.atan2(vy, vx);
        let dAngle = targetAngle - motionAngle.current;
        while (dAngle > Math.PI) dAngle -= 2 * Math.PI;
        while (dAngle < -Math.PI) dAngle += 2 * Math.PI;

        // Fluid vortex torque imparted by turn acceleration
        vorticity.current = vorticity.current * 0.82 + dAngle * Math.min(1.5, instantSpeed * 0.08);
        vorticity.current = Math.max(-0.75, Math.min(0.75, vorticity.current));

        motionAngle.current += dAngle * 0.28;
      } else {
        vorticity.current *= 0.85; // Viscous vorticity dissipation
      }

      // 6. Surface tension auto-coalescence tracker ("速度减慢时自动聚合")
      // When speed is high, cohesion drops (dispersing fragments)
      // When speed slows down, cohesion rises to 1 (pulling fragments together into mother body)
      const curSpeed = smoothedSpeed.current;
      const targetCohesion = curSpeed < 0.3 ? 1.0 : Math.max(0, 1.0 - (curSpeed - 0.3) / 4.5);
      cohesionProgress.current += (targetCohesion - cohesionProgress.current) * 0.15;

      // 7. Gravity-Vector Dynamics: Downward fluid sagging and droplet dripping at trajectory end / rest ("缓慢下坠并聚集")
      const isResting = curSpeed < 2.0 || timeSinceMove > 45;
      if (isResting) {
        // Gravitational downward acceleration with terminal fluid velocity
        if (gravityVelocityY.current < 0.62) {
          gravityVelocityY.current += 0.048;
        }
        gravityDripY.current += gravityVelocityY.current;
        // Subtle natural sag limit (16px to 22px max)
        const maxSag = 20;
        if (gravityDripY.current > maxSag) {
          gravityDripY.current = maxSag;
          gravityVelocityY.current *= 0.88;
        }
      } else {
        // When actively moving, kinetic momentum overcomes gravity drip quickly
        gravityDripY.current *= 0.86;
        gravityVelocityY.current *= 0.82;
      }

      // Gravitational sag ratio (0 to 1) for meniscus teardrop shaping
      const gravitySagRatio = Math.min(1.0, gravityDripY.current / 15.0);

      // 8. Gravity / Momentum Fling Physics with non-linear restitution and quadratic fluid damping
      flingVelocity.current.x += vx * 0.72;
      flingVelocity.current.y += vy * 0.72;

      // Non-linear fluid drag on fling
      const curFlingSpeed = Math.hypot(flingVelocity.current.x, flingVelocity.current.y);
      const nonLinearFlingDrag = 0.24 + Math.min(0.2, curFlingSpeed * 0.005);
      flingVelocity.current.x *= (1 - nonLinearFlingDrag);
      flingVelocity.current.y *= (1 - nonLinearFlingDrag);

      // Elastic surface tension restoring force (non-linear hardening spring)
      const flingDist = Math.hypot(flingOffset.current.x, flingOffset.current.y);
      const springK = 0.18 + Math.min(0.12, flingDist * 0.002);
      flingOffset.current.x += flingVelocity.current.x - flingOffset.current.x * springK;
      flingOffset.current.y += flingVelocity.current.y - flingOffset.current.y * springK;

      // Effective rendered center with momentum fling offset + gravity downward drip ("缓慢下坠并聚集")
      const renderX = Math.round(currentPos.current.x + flingOffset.current.x);
      const renderY = Math.round(currentPos.current.y + flingOffset.current.y + gravityDripY.current);

      // 9. Visibility: "鼠标不动的时候水印不显示，动了它才显示"
      const curSpeedVal = smoothedSpeed.current;
      const opacity = !isHoveringRef.current || curSpeedVal < 0.20
        ? 0
        : Math.min(1, (curSpeedVal - 0.20) / 1.6);

      if (watermarkLayerRef.current) {
        watermarkLayerRef.current.style.opacity = opacity.toFixed(3);
        watermarkLayerRef.current.style.pointerEvents = 'none';
        watermarkLayerRef.current.style.visibility = opacity <= 0.005 ? 'hidden' : 'visible';
      }

      // 10. Generate fluid wake path only when visible with shear, vorticity, cohesion & gravity sag
      if (opacity > 0.005) {
        const path = generateWaterWakePath(
          timestamp * 0.0012,
          curSpeedVal,
          motionAngle.current,
          shearStrain.current,
          vorticity.current,
          cohesionProgress.current,
          gravitySagRatio
        );
        const transformStr = `translate(${renderX}, ${renderY})`;

        if (clipPathRef.current) {
          clipPathRef.current.setAttribute('d', path);
          clipPathRef.current.setAttribute('transform', transformStr);
        }
        if (greyPathRef.current) {
          greyPathRef.current.setAttribute('d', path);
          greyPathRef.current.setAttribute('transform', transformStr);
        }
      }

      animId = requestAnimationFrame(animate);
    };

    animId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animId);
  }, []);

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const handleDrop = async (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file) {
      if (file.type.startsWith('video/') || file.name.toLowerCase().endsWith('.mov') || file.name.toLowerCase().endsWith('.mp4')) {
        const localUrl = URL.createObjectURL(file);
        setVideoSrc(localUrl);
        setHasVideoError(false);
        try {
          await saveLocalFile('lykke_homepage_video', file);
        } catch {}
        notifySync(`⏳ 正在将视频 ${file.name} 永久保存到全站...`);
        await uploadFileToServer(file, 'public/videos/shouye.mp4');
      } else if (file.type.startsWith('image/')) {
        setIsProcessingPhoto(true);
        notifySync(`✨ 正在处理并上传人物照片...`);
        const cutoutDataUrl = await processImageCutout(file);
        setPortraitSrc(cutoutDataUrl);
        try {
          localStorage.setItem('lykke_homepage_portrait', cutoutDataUrl);
        } catch {}
        setIsProcessingPhoto(false);
        try {
          const response = await fetch(cutoutDataUrl);
          const blob = await response.blob();
          await saveLocalFile('lykke_homepage_portrait', blob);
          await uploadFileToServer(blob, 'lykke_portrait_nobg.png');
        } catch (err) {
          try {
            await saveLocalFile('lykke_homepage_portrait', file);
          } catch {}
          await uploadFileToServer(file, file.name);
        }
      }
    }
  };

  // Handle mouse movements throughout the ENTIRE irregular central container
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!centerStageRef.current) return;
    const rect = centerStageRef.current.getBoundingClientRect();
    targetPos.current = {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    };
    lastMoveTime.current = performance.now();
  };

  return (
    <section
      id="hero"
      className="relative h-screen w-screen flex-shrink-0 flex items-center justify-center bg-transparent p-0 overflow-hidden select-none will-change-transform"
      style={{
        transform: `scale(${shrinkScale})`,
        transformOrigin: 'center center',
        opacity: shrinkOpacity,
        pointerEvents: shrinkOpacity <= 0.05 ? 'none' : 'auto',
      }}
    >
      {/* Dynamic SVG Defs for Center Container Smooth Rounded Fillets at all corners and notches */}
      <svg className="absolute w-0 h-0 pointer-events-none" aria-hidden="true">
        <defs>
          <clipPath id="irregularRoundedCenterClip" clipPathUnits="userSpaceOnUse">
            <path d={getRoundedIrregularPath(stageDimensions.width, stageDimensions.height)} />
          </clipPath>
        </defs>
      </svg>

      {/* ========================================================= */}
      {/* CENTER IRREGULAR-SHAPED CONTAINER: */}
      {/* Maximized area with minimal gap to corners and edges */}
      {/* Ultra-minimalist presentation */}
      {/* ========================================================= */}
      <div
        ref={centerStageRef}
        onMouseEnter={() => {
          setIsHovering(true);
          soundEngine.playHover();
        }}
        onMouseLeave={() => setIsHovering(false)}
        onMouseMove={handleMouseMove}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        className="absolute inset-1.5 sm:inset-2 md:inset-2.5 z-20 overflow-hidden cursor-default rounded-2xl"
        style={{
          clipPath: 'url(#irregularRoundedCenterClip)',
          WebkitClipPath: 'url(#irregularRoundedCenterClip)',
        }}
      >
        {/* 视频背景图层：始终在首页显示并循环播放 */}
        {/* ========================================================= */}
        {/* 图层 1 (底层)：不规则圆角形状内部的视频背景图层 */}
        {/* 直接播放 /实验影像.MOV */}
        {/* ========================================================= */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
          <video
            ref={videoRef}
            autoPlay
            loop
            muted
            playsInline
            preload="auto"
            className="w-full h-full object-cover absolute inset-0 z-0"
            style={{ opacity: HERO_VIDEO_CONFIG.opacity }}
          >
            <source src={videoSrc} type="video/mp4" />
            您的浏览器不支持视频播放。
          </video>
        </div>

        {/* Hidden File Input for selecting local cutout portrait photo directly */}
        <input
          type="file"
          ref={imageFileInputRef}
          accept="image/*"
          className="hidden"
          onChange={handleImageFileSelect}
        />

        {/* Sync Toast Notification */}
        {syncToast && (
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-50 pointer-events-none bg-black/90 backdrop-blur-md border border-emerald-500/50 px-4 py-2 rounded-full text-xs text-emerald-200 font-noto shadow-2xl flex items-center gap-2">
            <span>{syncToast}</span>
          </div>
        )}

        {/* ========================================================= */}
        {/* 图层 2 (顶层)：中间人物照片图层 (底部紧贴不规则框下边缘) */}
        {/* 鼠标未移入时为极浅隐形/融入视频，鼠标移入后在游走水印内 1:1 等比清晰显现 */}
        {/* ========================================================= */}
        <div className="absolute inset-0 w-full h-full flex items-end justify-center pointer-events-none p-0 z-10">
          <div className="relative w-full max-w-5xl h-full flex items-end justify-center pb-0">
            {/* Person Cutout Portrait Image Layer: Bottom edge sticks to the irregular frame */}
            <img
              src={portraitSrc}
              alt={HERO_PORTRAIT_CONFIG.alt}
              loading="lazy"
              className={`h-[92%] sm:h-[95%] md:h-[98%] w-auto object-contain object-bottom transition-opacity duration-700 ease-out ${
                isHovering
                  ? 'opacity-[0.16] filter contrast-105 brightness-105 mix-blend-soft-light'
                  : 'opacity-[0.03] filter grayscale contrast-125 mix-blend-overlay'
              }`}
              referrerPolicy="no-referrer"
            />

            {/* 编辑模式下的 Regenerate Image 悬浮操作按钮 */}
            {isEditMode && (
              <div className="absolute inset-0 flex items-center justify-center pointer-events-auto bg-black/40 backdrop-blur-xs rounded-2xl transition-all z-40">
                <button
                  onClick={() => imageFileInputRef.current?.click()}
                  disabled={isProcessingPhoto}
                  className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-gradient-to-r from-[#E4032E] via-[#FF95B4] to-[#0284C7] text-white font-noto font-bold text-xs sm:text-sm shadow-2xl hover:scale-105 active:scale-95 transition-all cursor-pointer border border-white/40 ring-2 ring-white/20"
                  title="点击替换并重新生成首页人物照片（自动抠图并保存）"
                >
                  <Sparkles size={16} className="text-amber-200 animate-spin" />
                  <span>
                    {isProcessingPhoto
                      ? (isZh ? '正在抠图处理中...' : 'Processing...')
                      : (isZh ? '✨ Regenerate image (重新生成/上传照片)' : '✨ Regenerate image')}
                  </span>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* ========================================================= */}
        {/* 图层 3：交互水纹抠图高亮浮层 (Interactive Liquid Watermark Reveal) */}
        {/* 鼠标在页面游走时，在游走的水印内 1:1 等比原大小显现清晰透明底人像 */}
        {/* ========================================================= */}
        <div
          ref={watermarkLayerRef}
          style={{ opacity: 0, visibility: 'hidden' }}
          className="absolute inset-0 z-20 pointer-events-none transition-opacity duration-150"
        >
          <svg
            className="w-full h-full"
            viewBox={`0 0 ${stageDimensions.width} ${stageDimensions.height}`}
          >
            <defs>
              {/* Dynamic Hydrodynamic Water Wake ClipPath */}
              <clipPath id="irregularWatermarkClip">
                <path
                  ref={clipPathRef}
                  d="M 0 0 Z"
                  transform="translate(450, 280)"
                />
              </clipPath>
            </defs>

            {/* LIQUID SURFACE WATERMARK SHEEN BASE (NO STROKE OUTLINE) */}
            <path
              ref={greyPathRef}
              d="M 0 0 Z"
              transform="translate(450, 280)"
              fill="rgba(255, 255, 255, 0.15)"
              stroke="none"
              strokeWidth="0"
              className="mix-blend-overlay"
            />

            {/* REVEALED 1:1 EXACT-SCALE TRANSPARENT CUTOUT PORTRAIT INSIDE WATERMARK */}
            <g clipPath="url(#irregularWatermarkClip)">
              <foreignObject
                x="0"
                y="0"
                width="100%"
                height="100%"
              >
                <div className="absolute inset-0 w-full h-full flex items-end justify-center p-0">
                  <div className="relative w-full max-w-5xl h-full flex items-end justify-center pb-0">
                    <img
                      src={portraitSrc}
                      alt={HERO_PORTRAIT_CONFIG.alt}
                      loading="lazy"
                      className="h-[92%] sm:h-[95%] md:h-[98%] w-auto object-contain object-bottom filter contrast-[1.14] brightness-[1.08] drop-shadow-[0_20px_45px_rgba(0,0,0,0.65)]"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                </div>
              </foreignObject>
            </g>
          </svg>
        </div>

      </div>
    </section>
  );
};
