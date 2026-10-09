'use client';

import React, { useState, useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { motion } from 'motion/react';
import './BubbleMenu.css';

export interface BubbleMenuItem {
  id: string;
  num: string;
  label: string;
  href?: string;
  ariaLabel?: string;
  rotation?: number;
}

export interface BubbleMenuProps {
  items: BubbleMenuItem[];
  activeId?: string;
  onItemSelect: (id: string) => void;
  className?: string;
  style?: React.CSSProperties;
  menuAriaLabel?: string;
  menuContentColor?: string;
  navShadow?: string;
  useFixedPosition?: boolean;
  animationEase?: string;
  animationDuration?: number;
  staggerDelay?: number;
}

export const BubbleMenu: React.FC<BubbleMenuProps> = ({
  items,
  activeId,
  onItemSelect,
  className = '',
  style,
  menuAriaLabel = '目录',
  menuContentColor = '#111',
  navShadow = 'none',
  useFixedPosition = false,
  animationEase = 'back.out(1.4)',
  animationDuration = 0.28,
  staggerDelay = 0.025,
}) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showOverlay, setShowOverlay] = useState(false);
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

  const overlayRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const bubblesRef = useRef<(HTMLAnchorElement | null)[]>([]);
  const labelRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const [focusRect, setFocusRect] = useState<{ x: number; y: number; width: number; height: number; opacity: number }>({
    x: 0,
    y: 0,
    width: 0,
    height: 0,
    opacity: 0,
  });

  const handleToggle = () => {
    const nextState = !isMenuOpen;
    if (nextState) setShowOverlay(true);
    setIsMenuOpen(nextState);
  };

  const handleClose = () => {
    setIsMenuOpen(false);
    setHoveredIdx(null);
  };

  // Update TrueFocus tracking box position
  useEffect(() => {
    if (hoveredIdx === null || !listRef.current || !labelRefs.current[hoveredIdx]) {
      setFocusRect((prev) => ({ ...prev, opacity: 0 }));
      return;
    }

    const listParent = listRef.current.getBoundingClientRect();
    const activeLabel = labelRefs.current[hoveredIdx]!.getBoundingClientRect();

    setFocusRect({
      x: activeLabel.left - listParent.left,
      y: activeLabel.top - listParent.top,
      width: activeLabel.width,
      height: activeLabel.height,
      opacity: 1,
    });
  }, [hoveredIdx]);

  useEffect(() => {
    const overlay = overlayRef.current;
    const bubbles = bubblesRef.current.filter(Boolean) as HTMLElement[];
    const labels = labelRefs.current.filter(Boolean) as HTMLElement[];

    if (!overlay || !bubbles.length) return;

    if (isMenuOpen) {
      gsap.set(overlay, { display: 'flex' });
      gsap.killTweensOf([...bubbles, ...labels, overlay]);
      gsap.to(overlay, { opacity: 1, duration: 0.2, ease: 'power2.out' });
      gsap.set(bubbles, { scale: 0, transformOrigin: '50% 50%' });
      gsap.set(labels, { y: 12, autoAlpha: 0 });

      bubbles.forEach((bubble, i) => {
        const delay = i * staggerDelay;
        const tl = gsap.timeline({ delay });

        tl.to(bubble, {
          scale: 1,
          duration: animationDuration,
          ease: animationEase,
        });
        if (labels[i]) {
          tl.to(
            labels[i],
            {
              y: 0,
              autoAlpha: 1,
              duration: animationDuration * 0.9,
              ease: 'power3.out',
            },
            `-=${animationDuration * 0.85}`
          );
        }
      });
    } else if (showOverlay) {
      gsap.killTweensOf([...bubbles, ...labels, overlay]);
      gsap.to(labels, {
        y: 12,
        autoAlpha: 0,
        duration: 0.14,
        ease: 'power3.in',
      });
      gsap.to(bubbles, {
        scale: 0,
        duration: 0.14,
        ease: 'power3.in',
      });
      gsap.to(overlay, {
        opacity: 0,
        duration: 0.16,
        ease: 'power2.in',
        onComplete: () => {
          gsap.set(overlay, { display: 'none' });
          setShowOverlay(false);
        },
      });
    }
  }, [isMenuOpen, showOverlay, animationEase, animationDuration, staggerDelay]);

  return (
    <>
      <div className={`bubble-menu ${useFixedPosition ? 'fixed' : ''} ${className}`} style={style}>
        {/* 纯净两道横杠目录按钮，展开时颜色反向变浅（#FFFFFF），始终可见 */}
        <button
          type="button"
          className={`static-menu-btn ${isMenuOpen ? 'open' : ''}`}
          onClick={handleToggle}
          aria-label={menuAriaLabel}
          aria-pressed={isMenuOpen}
          title={menuAriaLabel}
        >
          <span
            className="nav-line"
            style={{
              backgroundColor: isMenuOpen ? '#FFFFFF' : menuContentColor,
              boxShadow: isMenuOpen ? '0 0 10px rgba(255,255,255,0.8), 0 2px 6px rgba(0,0,0,0.4)' : navShadow,
            }}
          />
          <span
            className="nav-line"
            style={{
              backgroundColor: isMenuOpen ? '#FFFFFF' : menuContentColor,
              boxShadow: isMenuOpen ? '0 0 10px rgba(255,255,255,0.8), 0 2px 6px rgba(0,0,0,0.4)' : navShadow,
            }}
          />
        </button>
      </div>

      {showOverlay && (
        <div
          ref={overlayRef}
          className={`bubble-menu-items fixed ${hoveredIdx !== null ? 'has-hover' : ''}`}
          aria-hidden={!isMenuOpen}
          onClick={(e) => {
            if (e.target === overlayRef.current) handleClose();
          }}
        >
          <ul
            ref={listRef}
            className="pill-list"
            role="menu"
            aria-label="Menu links"
            onMouseLeave={() => setHoveredIdx(null)}
          >
            {items.map((item, idx) => (
              <li key={item.id} role="none" className="pill-col">
                <a
                  role="menuitem"
                  href={`#${item.id}`}
                  onClick={(e) => {
                    e.preventDefault();
                    onItemSelect(item.id);
                    handleClose();
                  }}
                  onMouseEnter={() => setHoveredIdx(idx)}
                  aria-label={item.ariaLabel || item.label}
                  className={`pill-link ${activeId === item.id ? 'active-item' : ''} ${hoveredIdx === idx ? 'hovered' : ''}`}
                  style={
                    {
                      '--item-rot': `${item.rotation ?? (idx % 2 === 0 ? -2 : 2)}deg`,
                    } as React.CSSProperties
                  }
                  ref={(el) => {
                    bubblesRef.current[idx] = el;
                  }}
                >
                  <span
                    className="pill-label"
                    ref={(el) => {
                      labelRefs.current[idx] = el;
                    }}
                  >
                    {item.label}
                  </span>
                </a>
              </li>
            ))}

            {/* TrueFocus 动态发光角标追踪框 */}
            <motion.div
              className="focus-frame"
              animate={{
                x: focusRect.x,
                y: focusRect.y,
                width: focusRect.width,
                height: focusRect.height,
                opacity: focusRect.opacity,
              }}
              transition={{
                duration: 0.22,
                ease: 'easeOut',
              }}
            >
              <span className="corner top-left"></span>
              <span className="corner top-right"></span>
              <span className="corner bottom-left"></span>
              <span className="corner bottom-right"></span>
            </motion.div>
          </ul>
        </div>
      )}
    </>
  );
};

export default BubbleMenu;
