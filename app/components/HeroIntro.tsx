'use client';
import { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { SplitText } from 'gsap/SplitText';
import styles from '../hero.module.css';

gsap.registerPlugin(SplitText);

export default function HeroIntro() {
  const rootRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const root = rootRef.current!;
    const targets = Array.from(root.querySelectorAll('h1, p')) as Element[];
    const splits = targets.map(
      (el) => new SplitText(el, { type: 'lines', mask: 'lines' })
    );
    const lines = splits.flatMap((s) => s.lines);

    gsap.set(lines, { yPercent: 110 });
    const tween = gsap.to(lines, {
      yPercent: 0,
      duration: 0.9,
      ease: 'power4.out',
      stagger: 0.08,
      delay: 0.2,
    });

    return () => {
      tween.kill();
      splits.forEach((s) => s.revert());
    };
  }, []);

  return (
    <section ref={rootRef} className={styles.content}>
      <div className={styles.leftText}>
        <h1>
          Shopify Stores &amp;<br />
          B2B Websites<br />
          That Drive Revenue
        </h1>
      </div>

      <p className={styles.rightText}>
        Senior e-commerce developer with 7+ years delivering custom Shopify
        Plus themes, Liquid development and WordPress CMS builds.
        <br />
        Clients like Cerascreen saw 30% revenue growth.
        <br />
        <span className={styles.highlight}>Available remote, worldwide.</span>
      </p>
    </section>
  );
}
