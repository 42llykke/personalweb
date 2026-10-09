import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { RESUME_CHAPTERS } from '../data/resumeData';
import { Language } from '../types';
import { soundEngine } from '../utils/soundEngine';
import './BubbleMenu.css';

interface BubbleMenuOverlayProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectSection: (id: string) => void;
  language: Language;
  activeSection: string;
}

const ROTATIONS = [-8, 8, -6, 7, -8, 6];
const HOVER_STYLES = [
  { bgColor: '#FF95B4', textColor: '#111111' },
  { bgColor: '#E4032E', textColor: '#FFFFFF' },
  { bgColor: '#0284C7', textColor: '#FFFFFF' },
  { bgColor: '#10B981', textColor: '#FFFFFF' },
  { bgColor: '#F59E0B', textColor: '#111111' },
  { bgColor: '#8B5CF6', textColor: '#FFFFFF' },
];

export const BubbleMenuOverlay: React.FC<BubbleMenuOverlayProps> = ({
  isOpen,
  onClose,
  onSelectSection,
  language,
  activeSection,
}) => {
  const overlayRef = useRef<HTMLDivElement>(null);
  const bubblesRef = useRef<(HTMLAnchorElement | null)[]>([]);
  const labelRefs = useRef<(HTMLSpanElement | null)[]>([]);

  const chapters = RESUME_CHAPTERS[language];

  useEffect(() => {
    const overlay = overlayRef.current;
    const bubbles = bubblesRef.current.filter(Boolean);
    const labels = labelRefs.current.filter(Boolean);

    if (!overlay || !bubbles.length) return;

    if (isOpen) {
      gsap.set(overlay, { display: 'flex', autoAlpha: 1 });
      gsap.killTweensOf([...bubbles, ...labels]);
      gsap.set(bubbles, { scale: 0, transformOrigin: '50% 50%' });
      gsap.set(labels, { y: 24, autoAlpha: 0 });

      const isDesktop = window.innerWidth >= 900;

      bubbles.forEach((bubble, i) => {
        const rotation = isDesktop ? ROTATIONS[i % ROTATIONS.length] : 0;
        gsap.set(bubble, { rotation });

        const delay = i * 0.09 + gsap.utils.random(-0.03, 0.03);
        const tl = gsap.timeline({ delay });

        tl.to(bubble, {
          scale: 1,
          duration: 0.5,
          ease: 'back.out(1.5)',
        });

        if (labels[i]) {
          tl.to(
            labels[i],
            {
              y: 0,
              autoAlpha: 1,
              duration: 0.5,
              ease: 'power3.out',
            },
            `-=${0.5 * 0.9}`
          );
        }
      });
    } else {
      gsap.killTweensOf([...bubbles, ...labels]);
      gsap.to(labels, {
        y: 24,
        autoAlpha: 0,
        duration: 0.2,
        ease: 'power3.in',
      });
      gsap.to(bubbles, {
        scale: 0,
        duration: 0.2,
        ease: 'power3.in',
        onComplete: () => {
          gsap.set(overlay, { display: 'none', autoAlpha: 0 });
        },
      });
    }
  }, [isOpen]);

  useEffect(() => {
    const handleResize = () => {
      if (isOpen) {
        const bubbles = bubblesRef.current.filter(Boolean);
        const isDesktop = window.innerWidth >= 900;

        bubbles.forEach((bubble, i) => {
          if (bubble) {
            const rotation = isDesktop ? ROTATIONS[i % ROTATIONS.length] : 0;
            gsap.set(bubble, { rotation });
          }
        });
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [isOpen]);

  // Close when pressing Escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  return (
    <div
      ref={overlayRef}
      className="bubble-menu-items fixed"
      style={{ display: 'none', opacity: 0 }}
      aria-hidden={!isOpen}
      onClick={(e) => {
        // If clicked on backdrop, close
        if (e.target === overlayRef.current) {
          soundEngine.playClick();
          onClose();
        }
      }}
    >
      <ul className="pill-list" role="menu" aria-label="Resume navigation chapters">
        {chapters.map((chap, idx) => {
          const isActive = activeSection === chap.id;
          const hoverStyle = HOVER_STYLES[idx % HOVER_STYLES.length];
          const rotation = ROTATIONS[idx % ROTATIONS.length];

          return (
            <li key={chap.id} role="none" className="pill-col">
              <a
                role="menuitem"
                href={`#${chap.id}`}
                aria-label={`Chapter ${chap.number}: ${chap.title}`}
                className="pill-link"
                style={
                  {
                    '--item-rot': `${rotation}deg`,
                    '--pill-bg': isActive ? '#E4032E' : '#27272A',
                    '--pill-color': isActive ? '#FFFFFF' : '#F5F5F5',
                    '--hover-bg': hoverStyle.bgColor,
                    '--hover-color': hoverStyle.textColor,
                  } as React.CSSProperties
                }
                ref={(el) => {
                  if (el) bubblesRef.current[idx] = el;
                }}
                onClick={(e) => {
                  e.preventDefault();
                  soundEngine.playClick();
                  onSelectSection(chap.id);
                  onClose();
                }}
                onMouseEnter={() => soundEngine.playHover()}
              >
                <span
                  className="pill-label"
                  ref={(el) => {
                    if (el) labelRefs.current[idx] = el;
                  }}
                >
                  <span className="font-condensed font-black text-xl md:text-2xl text-[#FF95B4] group-hover:text-current">
                    0{chap.number}
                  </span>
                  <span className="font-noto font-medium text-lg md:text-2xl tracking-tight">
                    {chap.title}
                  </span>
                </span>
              </a>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default BubbleMenuOverlay;
