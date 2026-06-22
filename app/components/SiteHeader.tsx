'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import styles from '../hero.module.css';
import ContactOverlay from './ContactOverlay';
import TiltButton from './TiltButton';

export default function SiteHeader() {
  const [contactOpen, setContactOpen] = useState(false);
  const [onDark, setOnDark] = useState(false);

  // header stays visible everywhere; over a dark section the logo flips to light
  useEffect(() => {
    const check = () => {
      let dark = false;
      document.querySelectorAll('[data-header-dark]').forEach((el) => {
        const r = el.getBoundingClientRect();
        if (r.top <= 64 && r.bottom >= 64) dark = true;
      });
      setOnDark(dark);
    };
    check();
    window.addEventListener('scroll', check, { passive: true });
    window.addEventListener('resize', check);
    return () => {
      window.removeEventListener('scroll', check);
      window.removeEventListener('resize', check);
    };
  }, []);

  return (
    <>
      <nav className={`${styles.nav} ${onDark ? styles.navDark : ''}`}>
        <Link href="/" aria-label="Home" className={styles.navLogo}>
          <Image src="/byniel-logo.png" alt="By Niel" width={64} height={64} />
        </Link>
        <TiltButton
          className={styles.ctaBtn}
          onClick={() => setContactOpen(o => !o)}
        >
          <span style={{ position: 'relative', display: 'inline-block' }}>
            <span style={{ visibility: contactOpen ? 'hidden' : 'visible' }}>Book a call</span>
            <span style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', visibility: contactOpen ? 'visible' : 'hidden' }}>Close &nbsp;&nbsp; ✕</span>
          </span>
        </TiltButton>
      </nav>

      {contactOpen && <div className={styles.darkOverlay} />}
      <ContactOverlay isOpen={contactOpen} onClose={() => setContactOpen(false)} />
    </>
  );
}
