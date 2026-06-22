'use client';
import { useRef, useEffect, useLayoutEffect, useState } from 'react';
import gsap from 'gsap';
import styles from '../hero.module.css';

const CALENDLY_URL = 'https://calendly.com/byniel/30min';

declare global {
  interface Window {
    Calendly?: { initPopupWidget: (opts: { url: string }) => void };
  }
}

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

  // load the Calendly popup widget assets once + warm up its connections so
  // the scheduling iframe appears quickly when the user clicks
  useEffect(() => {
    const addPreconnect = (id: string, href: string) => {
      if (document.getElementById(id)) return;
      const l = document.createElement('link');
      l.id = id;
      l.rel = 'preconnect';
      l.href = href;
      l.crossOrigin = '';
      document.head.appendChild(l);
    };
    addPreconnect('calendly-pre-assets', 'https://assets.calendly.com');
    addPreconnect('calendly-pre-main', 'https://calendly.com');

    if (!document.getElementById('calendly-widget-css')) {
      const link = document.createElement('link');
      link.id = 'calendly-widget-css';
      link.rel = 'stylesheet';
      link.href = 'https://assets.calendly.com/assets/external/widget.css';
      document.head.appendChild(link);
    }
    if (!document.getElementById('calendly-widget-js')) {
      const script = document.createElement('script');
      script.id = 'calendly-widget-js';
      script.src = 'https://assets.calendly.com/assets/external/widget.js';
      script.async = true;
      document.body.appendChild(script);
    }
  }, []);

  const openCalendly = (e: React.MouseEvent) => {
    e.preventDefault();
    if (window.Calendly) {
      window.Calendly.initPopupWidget({ url: CALENDLY_URL });
      onClose();
    } else {
      window.open(CALENDLY_URL, '_blank', 'noopener,noreferrer');
    }
  };

  useEffect(() => {
    if (isOpen) setMounted(true);
  }, [isOpen]);

  useLayoutEffect(() => {
    if (!mounted) return;
    const panel = panelRef.current!;
    gsap.killTweensOf(panel);

    const isMobile = window.innerWidth <= 640;
    const { left, right, bottom } = getButtonRect();
    // 5-point polygon so GSAP can interpolate between CLOSED and OPEN
    // CLOSED: flat button rectangle (all 5 pts collapsed to button boundary)
    const CLOSED = `polygon(${left}% 0%, ${right}% 0%, ${right}% ${bottom}%, ${left}% ${bottom}%, ${left}% ${bottom}%)`;
    // OPEN: desktop fans out into a diagonal cone; mobile fills the screen so
    // the content never gets clipped by the narrow triangle
    const OPEN = isMobile
      ? `polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%, 0% 100%)`
      : `polygon(${left}% 0%, ${right}% 0%, ${right}% ${bottom}%, 82% 100%, 0% 100%)`;

    if (isOpen) {
      gsap.fromTo(panel,
        { clipPath: CLOSED },
        { clipPath: OPEN, duration: 0.85, ease: 'power4.inOut' }
      );
    } else {
      gsap.to(panel, {
        clipPath: CLOSED,
        duration: 0.7,
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
    // no cursor parallax on mobile (full-screen panel, no pointer)
    if (window.innerWidth <= 640) return;
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
          <a href={CALENDLY_URL} onClick={openCalendly} className={styles.contactHeading}>
            <span className={styles.headingLine}>Book a free</span>
            <span className={styles.headingLine}>intro call</span>
          </a>
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
