'use client';

import React, { useRef, useState, useEffect } from 'react';
import Matter from 'matter-js';

interface FallingBadgesProps {
  items: string[];
  className?: string;
  triggerOnEnter?: boolean; // When true, starts falling; when false, resets
  gravity?: number;
  mouseConstraintStiffness?: number;
}

export const FallingBadges: React.FC<FallingBadgesProps> = ({
  items,
  className = '',
  triggerOnEnter = false,
  gravity = 0.8,
  mouseConstraintStiffness = 0.2,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const elementsRef = useRef<(HTMLSpanElement | null)[]>([]);
  const [effectStarted, setEffectStarted] = useState(false);

  // Helper to reset all badge elements to original layout
  const resetElementsLayout = () => {
    elementsRef.current.forEach((elem) => {
      if (elem) {
        elem.style.position = '';
        elem.style.left = '';
        elem.style.top = '';
        elem.style.transform = '';
        elem.style.margin = '';
        elem.style.zIndex = '';
        elem.style.cursor = '';
      }
    });
  };

  // Trigger when parent signals that the details entered the screen; reset when left
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (triggerOnEnter) {
      if (!effectStarted) {
        // Short delay for smooth slide-in completion before dropping
        timer = setTimeout(() => {
          setEffectStarted(true);
        }, 150);
      }
    } else {
      // Out of view: reset immediately if currently started
      if (effectStarted) {
        setEffectStarted(false);
        resetElementsLayout();
      }
    }
    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [triggerOnEnter, effectStarted]);

  // Listen to navigation jump to experience: reset and drop cubes freshly
  useEffect(() => {
    const handleJumpDrop = () => {
      setEffectStarted(false);
      resetElementsLayout();
      setTimeout(() => {
        setEffectStarted(true);
      }, 50);
    };
    window.addEventListener('trigger-experience-drop', handleJumpDrop);
    return () => window.removeEventListener('trigger-experience-drop', handleJumpDrop);
  }, []);

  useEffect(() => {
    if (!effectStarted || !containerRef.current) {
      resetElementsLayout();
      return;
    }

    const container = containerRef.current;
    const containerRect = container.getBoundingClientRect();
    const width = containerRect.width;
    const height = containerRect.height;

    if (width <= 0 || height <= 0) return;

    const { Engine, World, Bodies, Runner, Mouse, MouseConstraint, Body } = Matter;

    const engine = Engine.create();
    engine.world.gravity.y = gravity;

    const boundaryThickness = 60;
    const boundaryOptions = {
      isStatic: true,
      render: { visible: false },
    };

    // Walls around the badge container box
    const floor = Bodies.rectangle(
      width / 2,
      height + boundaryThickness / 2,
      width * 2,
      boundaryThickness,
      boundaryOptions
    );
    const leftWall = Bodies.rectangle(
      -boundaryThickness / 2,
      height / 2,
      boundaryThickness,
      height * 2,
      boundaryOptions
    );
    const rightWall = Bodies.rectangle(
      width + boundaryThickness / 2,
      height / 2,
      boundaryThickness,
      height * 2,
      boundaryOptions
    );
    const ceiling = Bodies.rectangle(
      width / 2,
      -boundaryThickness / 2,
      width * 2,
      boundaryThickness,
      boundaryOptions
    );

    const validElements = elementsRef.current.filter(
      (el): el is HTMLSpanElement => el !== null
    );

    const itemBodies = validElements.map((elem) => {
      const rect = elem.getBoundingClientRect();
      const x = rect.left - containerRect.left + rect.width / 2;
      const y = rect.top - containerRect.top + rect.height / 2;
      const w = Math.max(10, rect.width);
      const h = Math.max(10, rect.height);

      const body = Bodies.rectangle(x, y, w, h, {
        chamfer: { radius: 8 },
        restitution: 0.65,
        frictionAir: 0.015,
        friction: 0.15,
        density: 0.002,
      });

      // Give a tiny natural impulse
      Body.setVelocity(body, {
        x: (Math.random() - 0.5) * 3,
        y: Math.random() * 2,
      });
      Body.setAngularVelocity(body, (Math.random() - 0.5) * 0.06);

      return { elem, body, w, h };
    });

    // Fix DOM element styles for physics positioning
    itemBodies.forEach(({ elem, body }) => {
      elem.style.position = 'absolute';
      elem.style.left = `${body.position.x}px`;
      elem.style.top = `${body.position.y}px`;
      elem.style.transform = `translate(-50%, -50%) rotate(${body.angle}rad)`;
      elem.style.margin = '0';
      elem.style.zIndex = '10';
      elem.style.cursor = 'grab';
    });

    const mouse = Mouse.create(container);
    if ((mouse as any).mousewheel) {
      mouse.element.removeEventListener('mousewheel', (mouse as any).mousewheel);
    }
    if ((mouse as any).DOMMouseScroll) {
      mouse.element.removeEventListener('DOMMouseScroll', (mouse as any).DOMMouseScroll);
    }

    const mouseConstraint = MouseConstraint.create(engine, {
      mouse,
      constraint: {
        stiffness: mouseConstraintStiffness,
        render: { visible: false },
      },
    });

    World.add(engine.world, [
      floor,
      leftWall,
      rightWall,
      ceiling,
      mouseConstraint,
      ...itemBodies.map((ib) => ib.body),
    ]);

    const runner = Runner.create();
    Runner.run(runner, engine);

    let animationFrameId: number;
    const updateLoop = () => {
      itemBodies.forEach(({ body, elem }) => {
        const { x, y } = body.position;
        elem.style.left = `${x}px`;
        elem.style.top = `${y}px`;
        elem.style.transform = `translate(-50%, -50%) rotate(${body.angle}rad)`;
      });
      Engine.update(engine, 1000 / 60);
      animationFrameId = requestAnimationFrame(updateLoop);
    };
    updateLoop();

    return () => {
      cancelAnimationFrame(animationFrameId);
      Runner.stop(runner);
      World.clear(engine.world, false);
      Engine.clear(engine);
      resetElementsLayout();
    };
  }, [effectStarted, gravity, mouseConstraintStiffness]);

  const handleManualClick = () => {
    if (!effectStarted) {
      setEffectStarted(true);
    }
  };

  return (
    <div
      ref={containerRef}
      className={`relative w-full overflow-hidden select-none min-h-[96px] ${className}`}
      onClick={handleManualClick}
    >
      <div className="flex flex-wrap gap-2 w-full h-full items-start content-start">
        {items.map((item, idx) => (
          <span
            key={idx}
            ref={(el) => {
              elementsRef.current[idx] = el;
            }}
            className="px-3 py-1.5 rounded-lg bg-white/[0.04] text-sm font-noto text-zinc-300 hover:text-[#FF95B4] transition-colors border border-white/[0.06] shadow-sm will-change-transform inline-block whitespace-nowrap"
            style={{
              transition: effectStarted ? 'none' : 'color 0.15s ease',
            }}
          >
            {item}
          </span>
        ))}
      </div>
    </div>
  );
};

export default FallingBadges;
