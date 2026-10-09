'use client';

import React, { useEffect, useRef, useMemo, ReactNode } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import './ScrollReveal.css';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

export interface ScrollRevealProps {
  children: ReactNode;
  scrollContainerRef?: React.RefObject<HTMLElement | null>;
  enableBlur?: boolean;
  baseOpacity?: number;
  baseRotation?: number;
  blurStrength?: number;
  containerClassName?: string;
  textClassName?: string;
  rotationEnd?: string;
  wordAnimationEnd?: string;
  progress?: number; // Reactive progress [0, 1] for scroll orchestration
  direction?: 'top' | 'bottom' | 'left' | 'right';
  as?: 'div' | 'h2' | 'p' | 'span';
}

export const ScrollReveal: React.FC<ScrollRevealProps> = ({
  children,
  scrollContainerRef,
  enableBlur = true,
  baseOpacity = 0.1,
  baseRotation = 3,
  blurStrength = 4,
  containerClassName = '',
  textClassName = '',
  rotationEnd = 'bottom bottom',
  wordAnimationEnd = 'bottom bottom',
  progress,
  direction = 'top',
  as: Component = 'div',
}) => {
  const containerRef = useRef<HTMLDivElement>(null);

  // Split text into animated word spans if string
  const splitText = useMemo(() => {
    if (typeof children === 'string') {
      return children.split(/(\s+|[,，、|｜:：\/\\])/).map((word, index) => {
        if (word.match(/^\s+$/)) return word;
        return (
          <span className="word inline-block will-change-[transform,opacity,filter]" key={index}>
            {word}
          </span>
        );
      });
    }
    return children;
  }, [children]);

  // Reactive animation calculation when progress is driven by applet virtual scroll
  useEffect(() => {
    if (progress === undefined) return;
    const el = containerRef.current;
    if (!el) return;

    // Localized smooth reveal progression [0, 1]
    const revealT = Math.min(1, Math.max(0, progress));

    // Container rotation from baseRotation (3deg) -> 0deg with transformOrigin '0% 50%'
    const rot = (1 - revealT) * baseRotation;
    const opacity = baseOpacity + revealT * (1 - baseOpacity);
    const blur = enableBlur ? (1 - revealT) * blurStrength : 0;

    el.style.transform = `rotate(${rot.toFixed(2)}deg)`;
    el.style.transformOrigin = '0% 50%';
    el.style.opacity = `${opacity.toFixed(3)}`;
    el.style.filter = enableBlur && blur > 0.05 ? `blur(${blur.toFixed(1)}px)` : 'none';

    // Stagger word elements if present
    const words = el.querySelectorAll<HTMLElement>('.word');
    if (words.length > 0) {
      words.forEach((word, idx) => {
        const staggerRatio = idx / Math.max(1, words.length - 1);
        const wordStart = staggerRatio * 0.35;
        const wordT = Math.min(1, Math.max(0, (revealT - wordStart) / (1 - wordStart + 0.001)));

        const wordOpacity = baseOpacity + wordT * (1 - baseOpacity);
        const wordBlur = enableBlur ? (1 - wordT) * blurStrength : 0;
        word.style.opacity = `${wordOpacity.toFixed(3)}`;
        word.style.filter = enableBlur && wordBlur > 0.05 ? `blur(${wordBlur.toFixed(1)}px)` : 'none';
      });
    }
  }, [progress, baseRotation, baseOpacity, enableBlur, blurStrength]);

  // GSAP ScrollTrigger fallback if standard native scroll is used
  useEffect(() => {
    if (progress !== undefined) return;
    const el = containerRef.current;
    if (!el) return;

    const scroller =
      scrollContainerRef && scrollContainerRef.current ? scrollContainerRef.current : window;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        el,
        { transformOrigin: '0% 50%', rotate: baseRotation },
        {
          ease: 'none',
          rotate: 0,
          scrollTrigger: {
            trigger: el,
            scroller,
            start: 'top bottom',
            end: rotationEnd,
            scrub: true,
          },
        }
      );

      const wordElements = el.querySelectorAll('.word');
      if (wordElements.length > 0) {
        gsap.fromTo(
          wordElements,
          { opacity: baseOpacity, willChange: 'opacity' },
          {
            ease: 'none',
            opacity: 1,
            stagger: 0.05,
            scrollTrigger: {
              trigger: el,
              scroller,
              start: 'top bottom-=20%',
              end: wordAnimationEnd,
              scrub: true,
            },
          }
        );

        if (enableBlur) {
          gsap.fromTo(
            wordElements,
            { filter: `blur(${blurStrength}px)` },
            {
              ease: 'none',
              filter: 'blur(0px)',
              stagger: 0.05,
              scrollTrigger: {
                trigger: el,
                scroller,
                start: 'top bottom-=20%',
                end: wordAnimationEnd,
                scrub: true,
              },
            }
          );
        }
      }
    }, el);

    return () => ctx.revert();
  }, [scrollContainerRef, enableBlur, baseRotation, baseOpacity, rotationEnd, wordAnimationEnd, blurStrength, progress]);

  return (
    <div ref={containerRef} className={`scroll-reveal ${containerClassName}`}>
      <div className={`scroll-reveal-text ${textClassName}`}>{splitText}</div>
    </div>
  );
};

export default ScrollReveal;
