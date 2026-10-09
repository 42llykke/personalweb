import { useEffect, useRef, useState, useCallback } from 'react';
import Lenis from 'lenis';

export interface ScrollTelemetry {
  velocity: number; // raw velocity
  speedKmh: number; // mapped 0 - 340 KM/H for F1 aesthetic
  gear: string; // N, 1-8
  progress: number; // 0 - 100
  direction: 'up' | 'down' | 'idle';
  multiplier: number; // 1.0x or 2.0x
}

export interface ScrollCheckpoint {
  id: string;
  gate: number;
}

export function useSmoothScroll(checkpoints: ScrollCheckpoint[] = []) {
  const lenisRef = useRef<Lenis | null>(null);
  const isNavigatingRef = useRef<boolean>(false);
  const checkpointsRef = useRef<ScrollCheckpoint[]>(checkpoints);
  checkpointsRef.current = checkpoints;

  const [multiplier, setMultiplierState] = useState<number>(1.0);
  const [telemetry, setTelemetry] = useState<ScrollTelemetry>({
    velocity: 0,
    speedKmh: 0,
    gear: 'N',
    progress: 0,
    direction: 'idle',
    multiplier: 1.0,
  });

  const setMultiplier = useCallback((newMult: number) => {
    setMultiplierState(newMult);
    if (lenisRef.current) {
      lenisRef.current.options.wheelMultiplier = newMult;
    }
  }, []);

  const scrollTo = useCallback((target: string | number | HTMLElement, options?: { offset?: number; duration?: number; immediate?: boolean }) => {
    isNavigatingRef.current = true;
    setTimeout(() => {
      isNavigatingRef.current = false;
    }, (options?.duration ? options.duration * 1000 : 800) + 120);

    if (options?.immediate) {
      if (lenisRef.current) {
        lenisRef.current.scrollTo(target, {
          offset: options?.offset ?? 0,
          immediate: true,
        });
      } else {
        if (typeof target === 'number') {
          window.scrollTo({ top: target, behavior: 'instant' });
        }
      }
      return;
    }

    if (lenisRef.current) {
      lenisRef.current.scrollTo(target, {
        offset: options?.offset ?? 0,
        duration: options?.duration ?? 0.85,
        immediate: false,
      });
    } else {
      if (typeof target === 'string') {
        const el = document.querySelector(target);
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      } else if (typeof target === 'number') {
        window.scrollTo({ top: target, behavior: 'smooth' });
      } else if (target instanceof HTMLElement) {
        target.scrollIntoView({ behavior: 'smooth' });
      }
    }
  }, []);

  useEffect(() => {
    // Initialize Lenis smooth scroll engine with super tight, grounded inertia
    const lenis = new Lenis({
      duration: 0.16,
      easing: (t) => t,
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: multiplier * 0.40,
      touchMultiplier: 0.45,
      infinite: false,
    });

    lenisRef.current = lenis;

    let animationFrameId: number;

    const raf = (time: number) => {
      // Checkpoint momentum clamping:
      // When the user swipes or scrolls quickly towards a critical beat (WHO AM I or Awards drop),
      // catch the runaway velocity so the user lands solidly on the gate and the animation displays stably!
      if (lenis && checkpointsRef.current.length > 0 && !isNavigatingRef.current) {
        const cur = lenis.scroll;
        const target = lenis.targetScroll;

        for (const cp of checkpointsRef.current) {
          // If scrolling down fast from before gate, clamp target to gate
          if (cur < cp.gate - 40 && target > cp.gate + 25) {
            lenis.targetScroll = cp.gate;
            break;
          }
          // If scrolling up fast from after gate, clamp target to gate
          else if (cur > cp.gate + 40 && target < cp.gate - 25) {
            lenis.targetScroll = cp.gate;
            break;
          }
        }
      }

      lenis.raf(time);
      animationFrameId = requestAnimationFrame(raf);
    };

    animationFrameId = requestAnimationFrame(raf);

    // Track scroll events and telemetry
    let telemetryTicking = false;
    lenis.on('scroll', (e: { scroll: number; limit: number; velocity: number; direction: number; progress: number }) => {
      if (telemetryTicking) return;
      telemetryTicking = true;

      requestAnimationFrame(() => {
        telemetryTicking = false;
        const vel = Math.abs(e.velocity || 0);
        const rawSpeed = Math.min(345, Math.round(vel * 18));
        
        let gear = 'N';
        if (rawSpeed === 0) gear = 'N';
        else if (rawSpeed < 50) gear = '1';
        else if (rawSpeed < 100) gear = '2';
        else if (rawSpeed < 150) gear = '3';
        else if (rawSpeed < 200) gear = '4';
        else if (rawSpeed < 250) gear = '5';
        else if (rawSpeed < 290) gear = '6';
        else if (rawSpeed < 320) gear = '7';
        else gear = '8';

        const dir = e.direction === 1 ? 'down' : e.direction === -1 ? 'up' : 'idle';
        const progressPercent = Math.min(100, Math.max(0, (e.progress || 0) * 100));

        setTelemetry((prev) => {
          if (
            prev.velocity === vel &&
            prev.speedKmh === rawSpeed &&
            prev.gear === gear &&
            Math.abs(prev.progress - progressPercent) < 0.2 &&
            prev.direction === dir
          ) {
            return prev;
          }
          return {
            velocity: vel,
            speedKmh: rawSpeed,
            gear,
            progress: progressPercent,
            direction: dir,
            multiplier: prev.multiplier,
          };
        });
      });
    });

    return () => {
      cancelAnimationFrame(animationFrameId);
      lenis.destroy();
      lenisRef.current = null;
    };
  }, [multiplier]);

  return {
    telemetry,
    multiplier,
    setMultiplier,
    scrollTo,
  };
}
