'use client';

import { useRef, useEffect, ReactNode } from 'react';

const RADIUS = 140;   // px from center that triggers attraction
const STRENGTH = 0.38; // how far the button moves (fraction of distance)
const LERP = 0.12;    // smoothing factor — lower = more elastic/springy

export default function MagneticButton({
  children,
  className,
  onClick,
}: {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
}) {
  const ref = useRef<HTMLButtonElement>(null);
  const curr = useRef({ x: 0, y: 0 });
  const tgt = useRef({ x: 0, y: 0 });
  const rafId = useRef(0);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const onMouseMove = (e: MouseEvent) => {
      const { left, top, width, height } = el.getBoundingClientRect();
      const cx = left + width / 2;
      const cy = top + height / 2;
      const dx = e.clientX - cx;
      const dy = e.clientY - cy;

      if (Math.hypot(dx, dy) < RADIUS) {
        tgt.current = { x: dx * STRENGTH, y: dy * STRENGTH };
      } else {
        tgt.current = { x: 0, y: 0 };
      }
    };

    const tick = () => {
      curr.current.x += (tgt.current.x - curr.current.x) * LERP;
      curr.current.y += (tgt.current.y - curr.current.y) * LERP;
      el.style.transform = `translate(${curr.current.x}px, ${curr.current.y}px)`;
      rafId.current = requestAnimationFrame(tick);
    };

    window.addEventListener('mousemove', onMouseMove);
    rafId.current = requestAnimationFrame(tick);

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      cancelAnimationFrame(rafId.current);
    };
  }, []);

  return (
    <button ref={ref} className={className} onClick={onClick}>
      {children}
    </button>
  );
}
