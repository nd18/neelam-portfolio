'use client';
import { useRef, useEffect, useLayoutEffect, useState } from 'react';
import Link from 'next/link';
import gsap from 'gsap';
import styles from '../hero.module.css';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

function getButtonRect() {
  const btn = document.querySelector(`.${styles.ctaBtn}`) as HTMLElement | null;
  if (!btn) return { left: 88, right: 110, bottom: 8 };
  const r = btn.getBoundingClientRect();
  return {
    left:   (r.left   / window.innerWidth)  * 100,
    right:  (r.right  / window.innerWidth)  * 100,
    bottom: (r.bottom / window.innerHeight) * 100,
  };
}

export default function ContactOverlay({ isOpen, onClose }: Props) {
  const [mounted, setMounted] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) setMounted(true);
  }, [isOpen]);

  useLayoutEffect(() => {
    if (!mounted) return;
    const panel = panelRef.current!;
    gsap.killTweensOf(panel);

    const { left, right, bottom } = getButtonRect();
    // 5-point polygon so GSAP can interpolate between CLOSED and OPEN
    // CLOSED: flat button rectangle (all 5 pts collapsed to button boundary)
    const CLOSED = `polygon(${left}% 0%, ${right}% 0%, ${right}% ${bottom}%, ${left}% ${bottom}%, ${left}% ${bottom}%)`;
    // OPEN: beam follows button right edge down to bottom-right corner, then fans out
    const OPEN   = `polygon(${left}% 0%, ${right}% 0%, ${right}% ${bottom}%, 82% 100%, 0% 100%)`;

    if (isOpen) {
      gsap.fromTo(panel,
        { clipPath: CLOSED },
        { clipPath: OPEN, duration: 1.3, ease: 'power4.inOut' }
      );
    } else {
      gsap.to(panel, {
        clipPath: CLOSED,
        duration: 1.0,
        ease: 'power4.inOut',
        onComplete: () => setMounted(false),
      });
    }
  }, [isOpen, mounted]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  useEffect(() => {
    if (!mounted) return;
    const panel = panelRef.current!;
    const { left, right, bottom } = getButtonRect();
    // Simple linear offset: both bottom vertices shift left together
    // beam width stays constant, no trig blowup
    const BASE_RIGHT = 82;
    const BASE_LEFT  = 0;

    const onMouseMove = (e: MouseEvent) => {
      const mx = (e.clientX / window.innerWidth) * 100;
      // Mouse left of 60% pulls beam left; mouse right never pushes beam right
      const raw    = (mx - 60) * 0.4;
      const offset = Math.max(-28, Math.min(0, raw)); // only leftward, max −28%

      const newClip = `polygon(${left}% 0%, ${right}% 0%, ${right}% ${bottom}%, ${BASE_RIGHT + offset}% 100%, ${BASE_LEFT + offset}% 100%)`;
      gsap.to(panel, { clipPath: newClip, duration: 1.2, ease: 'sine.out' });
    };

    window.addEventListener('mousemove', onMouseMove);
    return () => window.removeEventListener('mousemove', onMouseMove);
  }, [mounted]);

  if (!mounted) return null;

  return (
    <div className={styles.contactOverlay}>
      <div ref={panelRef} className={styles.contactGreenPanel}>
        <div className={styles.contactContent}>
          <p className={styles.contactLabel}>Book a call</p>
          <Link href="/contact" className={styles.contactHeading}>
            <span className={styles.headingLine}>Book a free</span>
            <span className={styles.headingLine}>intro call</span>
          </Link>
          <p className={styles.contactSub}>
            I&apos;ll walk through your store, what&apos;s blocking revenue,
            and what I&apos;d fix first.
          </p>
          <ul className={styles.contactProof}>
            <li><strong>30% revenue growth</strong> — Cerascreen, 8 Shopify storefronts</li>
            <li><strong>20% revenue lift in 2 months</strong> — HiGRID Sleep, Shopify Plus</li>
            <li><strong>20+ projects delivered</strong> — Shopify &amp; WordPress</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
