'use client';
import { useEffect, useRef } from 'react';
import styles from '../hero.module.css';

export default function Cube3D() {
  const cubeRef = useRef<HTMLDivElement>(null);
  const rafId = useRef(0);
  const angle = useRef(0);

  useEffect(() => {
    const cube = cubeRef.current;
    if (!cube) return;

    const animate = () => {
      angle.current += 0.25;
      cube.style.transform = `rotateX(${angle.current * 0.6}deg) rotateY(${angle.current}deg)`;
      rafId.current = requestAnimationFrame(animate);
    };

    rafId.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(rafId.current);
  }, []);

  return (
    <div className={styles.cubeWrapper}>
      <div ref={cubeRef} className={styles.cube}>
        <div className={styles.cubeFace} style={{ transform: 'translateZ(80px)' }} />
        <div className={styles.cubeFace} style={{ transform: 'rotateY(180deg) translateZ(80px)' }} />
        <div className={styles.cubeFace} style={{ transform: 'rotateY(-90deg) translateZ(80px)' }} />
        <div className={styles.cubeFace} style={{ transform: 'rotateY(90deg) translateZ(80px)' }} />
        <div className={styles.cubeFace} style={{ transform: 'rotateX(90deg) translateZ(80px)' }} />
        <div className={styles.cubeFace} style={{ transform: 'rotateX(-90deg) translateZ(80px)' }} />
      </div>
    </div>
  );
}
