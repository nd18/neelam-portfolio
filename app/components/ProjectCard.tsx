'use client';
import { useRef, useEffect } from 'react';
import Image from 'next/image';
import styles from '../hero.module.css';

const LERP = 0.08;
const MAX_TILT = 15;
// reveal early, while the spotlight is still sweeping (full sweep = 3200ms)
const REVEAL_DELAY_MS = 800;

export default function ProjectCard() {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const revealRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const curr = useRef({ rx: 0, ry: 0 });
  const tgt = useRef({ rx: 0, ry: 0 });
  const rafId = useRef(0);

  useEffect(() => {
    const wrapper = wrapperRef.current;
    const reveal = revealRef.current;
    const card = cardRef.current;
    if (!wrapper || !reveal || !card) return;

    // Scale in once spotlight animation finishes
    const timer = setTimeout(() => {
      reveal.style.transition = 'transform 1.6s cubic-bezier(0.34, 1.56, 0.64, 1), opacity 1s ease';
      reveal.style.opacity = '1';
      reveal.style.transform = 'scale(1)';
    }, REVEAL_DELAY_MS);

    // tilt follows the cursor across the whole viewport, not just over the card
    const onMouseMove = (e: MouseEvent) => {
      const { left, top, width, height } = wrapper.getBoundingClientRect();
      const cx = left + width / 2;
      const cy = top + height / 2;
      const dx = Math.max(-1, Math.min(1, (e.clientX - cx) / (window.innerWidth / 2)));
      const dy = Math.max(-1, Math.min(1, (e.clientY - cy) / (window.innerHeight / 2)));
      tgt.current = { rx: -dy * MAX_TILT, ry: dx * MAX_TILT };
    };

    // ease back to flat when the cursor leaves the window
    const onMouseLeave = () => {
      tgt.current = { rx: 0, ry: 0 };
    };

    const tick = () => {
      curr.current.rx += (tgt.current.rx - curr.current.rx) * LERP;
      curr.current.ry += (tgt.current.ry - curr.current.ry) * LERP;
      card.style.transform = `rotateX(${curr.current.rx}deg) rotateY(${curr.current.ry}deg)`;
      rafId.current = requestAnimationFrame(tick);
    };

    window.addEventListener('mousemove', onMouseMove);
    document.documentElement.addEventListener('mouseleave', onMouseLeave);
    rafId.current = requestAnimationFrame(tick);

    return () => {
      clearTimeout(timer);
      window.removeEventListener('mousemove', onMouseMove);
      document.documentElement.removeEventListener('mouseleave', onMouseLeave);
      cancelAnimationFrame(rafId.current);
    };
  }, []);

  return (
    <div ref={wrapperRef} className={styles.cardWrapper}>
      <div ref={revealRef} className={styles.cardReveal}>
        <div ref={cardRef} className={styles.card}>
          <Image
            src="/photo.jpg"
            alt="By Niel"
            fill
            style={{ objectFit: 'cover', objectPosition: '30% 35%' }}
            priority
          />
        </div>
      </div>
    </div>
  );
}
