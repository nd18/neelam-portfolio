'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import styles from '../hero.module.css';
import ContactOverlay from './ContactOverlay';
import TiltButton from './TiltButton';

export default function SiteHeader() {
  const [contactOpen, setContactOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // fade the header out once the user scrolls away from the top
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 80);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // keep it visible while the contact overlay is open so it can be closed
  const hidden = scrolled && !contactOpen;

  return (
    <>
      <nav className={`${styles.nav} ${hidden ? styles.navHidden : ''}`}>
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
