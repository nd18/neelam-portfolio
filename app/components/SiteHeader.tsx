'use client';
import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import styles from '../hero.module.css';
import ContactOverlay from './ContactOverlay';

export default function SiteHeader() {
  const [contactOpen, setContactOpen] = useState(false);

  return (
    <>
      <nav className={styles.nav}>
        <button className={styles.menuBtn} aria-label="Menu">
          <span className={styles.hamburger}>
            <span className={styles.line} />
            <span className={styles.line} />
          </span>
          <span className={styles.menuLabel}>Menu</span>
        </button>
        <Link href="/" aria-label="Home" className={styles.navLogo}>
          <Image src="/byniel-logo.png" alt="By Niel" width={64} height={64} />
        </Link>
        <button
          className={styles.ctaBtn}
          onClick={() => setContactOpen(o => !o)}
        >
          <span style={{ position: 'relative', display: 'inline-block' }}>
            <span style={{ visibility: contactOpen ? 'hidden' : 'visible' }}>Got a project?</span>
            <span style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', visibility: contactOpen ? 'visible' : 'hidden' }}>Close &nbsp;&nbsp; ✕</span>
          </span>
        </button>
      </nav>

      {contactOpen && <div className={styles.darkOverlay} />}
      <ContactOverlay isOpen={contactOpen} onClose={() => setContactOpen(false)} />
    </>
  );
}
