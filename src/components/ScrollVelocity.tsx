'use client';

import React, { useRef, useEffect, useState, ReactNode } from 'react';
import './ScrollVelocity.css';

export interface ScrollVelocityProps {
  scrollContainerRef?: React.RefObject<HTMLElement | null>;
  texts?: ReactNode[];
  velocity?: number;
  className?: string;
  damping?: number;
  stiffness?: number;
  numCopies?: number;
  velocityMapping?: { input: number[]; output: number[] };
  parallaxClassName?: string;
  scrollerClassName?: string;
  parallaxStyle?: React.CSSProperties;
  scrollerStyle?: React.CSSProperties;
}

interface VelocityTextItemProps {
  children: ReactNode;
  baseVelocity?: number;
  className?: string;
  numCopies?: number;
  parallaxClassName?: string;
  scrollerClassName?: string;
  parallaxStyle?: React.CSSProperties;
  scrollerStyle?: React.CSSProperties;
}

const VelocityTextItem: React.FC<VelocityTextItemProps> = ({
  children,
  baseVelocity = 100,
  className = '',
  numCopies = 6,
  parallaxClassName = 'parallax',
  scrollerClassName = 'scroller',
  parallaxStyle,
  scrollerStyle,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const scrollerRef = useRef<HTMLDivElement>(null);
  const copyRef = useRef<HTMLSpanElement>(null);

  const [copyWidth, setCopyWidth] = useState(0);
  const xRef = useRef(0);
  const lastScrollY = useRef(0);
  const scrollVelocityRef = useRef(0);
  const directionFactor = useRef(1);

  // Measure single copy width
  useEffect(() => {
    const updateWidth = () => {
      if (copyRef.current) {
        setCopyWidth(copyRef.current.offsetWidth || 0);
      }
    };
    updateWidth();
    window.addEventListener('resize', updateWidth);
    const timer = setTimeout(updateWidth, 100);
    return () => {
      window.removeEventListener('resize', updateWidth);
      clearTimeout(timer);
    };
  }, [children]);

  // Track global scroll velocity
  useEffect(() => {
    let lastTime = performance.now();

    const handleScroll = () => {
      const currentScrollY = window.scrollY || document.documentElement.scrollTop || 0;
      const now = performance.now();
      const dt = Math.max(1, now - lastTime);
      const dy = currentScrollY - lastScrollY.current;

      scrollVelocityRef.current = (dy / dt) * 15;
      lastScrollY.current = currentScrollY;
      lastTime = now;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Continuous animation frame loop
  useEffect(() => {
    let animId: number;
    let lastTime = performance.now();

    const animate = (currentTime: number) => {
      const delta = (currentTime - lastTime) / 1000;
      lastTime = currentTime;

      // Decay scroll velocity smoothly
      scrollVelocityRef.current *= 0.92;

      // Calculate direction and speed
      let speedMultiplier = 1 + Math.abs(scrollVelocityRef.current);
      if (scrollVelocityRef.current < -0.1) {
        directionFactor.current = -1;
      } else if (scrollVelocityRef.current > 0.1) {
        directionFactor.current = 1;
      }

      let moveBy = directionFactor.current * baseVelocity * delta * speedMultiplier;
      xRef.current += moveBy;

      // Wrap x position cleanly based on single copy width
      if (copyWidth > 0) {
        const wrapWidth = copyWidth;
        const modX = ((xRef.current % wrapWidth) - wrapWidth) % wrapWidth;
        if (scrollerRef.current) {
          scrollerRef.current.style.transform = `translate3d(${modX}px, 0, 0)`;
        }
      }

      animId = requestAnimationFrame(animate);
    };

    animId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animId);
  }, [baseVelocity, copyWidth]);

  const spans = [];
  for (let i = 0; i < numCopies; i++) {
    spans.push(
      <span className={className} key={i} ref={i === 0 ? copyRef : null}>
        {children}&nbsp;&nbsp;&nbsp;&nbsp;
      </span>
    );
  }

  return (
    <div className={parallaxClassName} style={parallaxStyle} ref={containerRef}>
      <div
        ref={scrollerRef}
        className={scrollerClassName}
        style={{
          display: 'flex',
          whiteSpace: 'nowrap',
          willChange: 'transform',
          ...scrollerStyle,
        }}
      >
        {spans}
      </div>
    </div>
  );
};

export const ScrollVelocity: React.FC<ScrollVelocityProps> = ({
  texts = [],
  velocity = 100,
  className = '',
  numCopies = 6,
  parallaxClassName = 'parallax',
  scrollerClassName = 'scroller',
  parallaxStyle,
  scrollerStyle,
}) => {
  return (
    <div className="w-full space-y-4">
      {texts.map((text, index) => (
        <VelocityTextItem
          key={index}
          className={className}
          baseVelocity={index % 2 !== 0 ? -velocity : velocity}
          numCopies={numCopies}
          parallaxClassName={parallaxClassName}
          scrollerClassName={scrollerClassName}
          parallaxStyle={parallaxStyle}
          scrollerStyle={scrollerStyle}
        >
          {text}
        </VelocityTextItem>
      ))}
    </div>
  );
};

export default ScrollVelocity;
