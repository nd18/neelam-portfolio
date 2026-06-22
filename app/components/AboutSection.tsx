'use client';
import { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import styles from '../about.module.css';

gsap.registerPlugin(ScrollTrigger);

const LINES = [
  'I craft e-commerce experiences',
  'that turn visitors into customers,',
  'not just traffic.',
];

export default function AboutSection() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const section = sectionRef.current!;
    const inners = section.querySelectorAll(`.${styles.lineInner}`);

    const tween = gsap.fromTo(
      inners,
      { yPercent: 110 },
      {
        yPercent: 0,
        duration: 0.9,
        ease: 'power4.out',
        stagger: 0.12,
        scrollTrigger: {
          trigger: section,
          start: 'top 70%',
        },
      }
    );

    return () => {
      tween.scrollTrigger?.kill();
      tween.kill();
    };
  }, []);

  return (
    <section ref={sectionRef} className={styles.about} aria-label="About me">
      <h2 className={styles.statement}>
        {LINES.map(line => (
          <span key={line} className={styles.line}>
            <span className={styles.lineInner}>{line}</span>
          </span>
        ))}
      </h2>
    </section>
  );
}
