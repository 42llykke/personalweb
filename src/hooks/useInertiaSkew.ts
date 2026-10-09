import { useEffect, useState, useRef } from 'react';

/**
 * useInertiaSkew
 * Simulates vehicular passenger inertia:
 * - When moving forward / page travels right (scrolling down), text tilts left (-deg)
 * - When moving backward / page travels left (scrolling up), text tilts right (+deg)
 * - Decays with organic spring damping when scrolling stops
 */
export function useInertiaSkew() {
  const [skew, setSkew] = useState<number>(0);
  const currentSkewRef = useRef<number>(0);
  const lastScrollYRef = useRef<number>(typeof window !== 'undefined' ? window.scrollY : 0);
  const velocityRef = useRef<number>(0);
  const animFrameRef = useRef<number>(0);

  useEffect(() => {
    let lastTime = performance.now();

    const handleWheel = (e: WheelEvent) => {
      // Capture wheel delta directly for instant tactile response
      // e.deltaY > 0 = scrolling forward (page moves right) -> tilts left (-skew)
      // e.deltaY < 0 = scrolling backward (page moves left) -> tilts right (+skew)
      const delta = e.deltaY;
      velocityRef.current = Math.min(80, Math.max(-80, velocityRef.current + delta * 0.28));
    };

    const handleScroll = () => {
      const now = performance.now();
      const dt = Math.max(1, now - lastTime);
      const scrollY = window.scrollY;
      const dScroll = scrollY - lastScrollYRef.current;
      lastScrollYRef.current = scrollY;
      lastTime = now;

      // dScroll > 0 = scrolling forward -> tilts left
      // dScroll < 0 = scrolling backward -> tilts right
      const rawVel = (dScroll / dt) * 32;
      velocityRef.current = Math.min(90, Math.max(-90, rawVel));
    };

    window.addEventListener('wheel', handleWheel, { passive: true });
    window.addEventListener('scroll', handleScroll, { passive: true });

    // Physics loop with spring lerp & friction damping
    const updatePhysics = () => {
      // Target skew angle: max tilt +/- 30 degrees ("倾斜角度大概在30度")
      // Forward scroll (velocity > 0) -> targetSkew is negative (tilts left)
      // Backward scroll (velocity < 0) -> targetSkew is positive (tilts right)
      const targetSkew = -Math.min(30, Math.max(-30, velocityRef.current * 0.52));

      // Organic spring interpolation
      currentSkewRef.current += (targetSkew - currentSkewRef.current) * 0.16;

      // Friction decay on velocity
      velocityRef.current *= 0.88;
      if (Math.abs(velocityRef.current) < 0.04) {
        velocityRef.current = 0;
      }

      // Rest snap
      if (Math.abs(currentSkewRef.current) < 0.02 && velocityRef.current === 0) {
        currentSkewRef.current = 0;
      }

      const nextSkew = Number(currentSkewRef.current.toFixed(1));
      setSkew((prev) => (Math.abs(prev - nextSkew) >= 0.1 ? nextSkew : prev));

      animFrameRef.current = requestAnimationFrame(updatePhysics);
    };

    animFrameRef.current = requestAnimationFrame(updatePhysics);

    return () => {
      window.removeEventListener('wheel', handleWheel);
      window.removeEventListener('scroll', handleScroll);
      cancelAnimationFrame(animFrameRef.current);
    };
  }, []);

  return skew;
}
