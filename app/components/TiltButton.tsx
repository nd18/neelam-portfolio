'use client';

import { useRef, useEffect, ReactNode } from 'react';

const MAX_TILT = 18;     // max degrees of rotation at the button's edge
const PERSPECTIVE = 420; // lower = stronger 3D depth
const LERP = 0.16;       // smoothing — lower is more elastic

interface Props {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
  href?: string;
  target?: string;
  rel?: string;
  ariaLabel?: string;
}

/* Tilts in 3D toward the cursor while hovering, easing back flat on leave. */
export default function TiltButton({ children, className, onClick, href, target, rel, ariaLabel }: Props) {
  const ref = useRef<HTMLAnchorElement & HTMLButtonElement>(null);
  const curr = useRef({ rx: 0, ry: 0 });
  const tgt = useRef({ rx: 0, ry: 0 });
  const rafId = useRef(0);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const onMove = (e: MouseEvent) => {
      const { left, top, width, height } = el.getBoundingClientRect();
      const px = (e.clientX - left) / width - 0.5;  // -0.5 (left) .. 0.5 (right)
      const py = (e.clientY - top) / height - 0.5;  // -0.5 (top)  .. 0.5 (bottom)
      tgt.current = { ry: px * MAX_TILT * 2, rx: -py * MAX_TILT * 2 };
    };
    const onLeave = () => { tgt.current = { rx: 0, ry: 0 }; };

    const tick = () => {
      curr.current.rx += (tgt.current.rx - curr.current.rx) * LERP;
      curr.current.ry += (tgt.current.ry - curr.current.ry) * LERP;
      el.style.transform =
        `perspective(${PERSPECTIVE}px) rotateX(${curr.current.rx.toFixed(2)}deg) rotateY(${curr.current.ry.toFixed(2)}deg)`;
      rafId.current = requestAnimationFrame(tick);
    };

    el.addEventListener('mousemove', onMove);
    el.addEventListener('mouseleave', onLeave);
    rafId.current = requestAnimationFrame(tick);

    return () => {
      el.removeEventListener('mousemove', onMove);
      el.removeEventListener('mouseleave', onLeave);
      cancelAnimationFrame(rafId.current);
    };
  }, []);

  if (href) {
    return (
      <a ref={ref} className={className} href={href} target={target} rel={rel} aria-label={ariaLabel}>
        {children}
      </a>
    );
  }
  return (
    <button ref={ref} className={className} onClick={onClick} aria-label={ariaLabel}>
      {children}
    </button>
  );
}
