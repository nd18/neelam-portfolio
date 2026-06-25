'use client';
import { useEffect } from 'react';
import Image from 'next/image';
import styles from '../footer.module.css';

const EMAIL = 'neelam@byniel.com';
const CALENDLY_URL = 'https://calendly.com/byniel/30min';

const SOCIALS = [
  { label: 'LinkedIn', href: 'https://www.linkedin.com/in/neelammalaviya/' },
  { label: 'GitHub', href: 'https://github.com/nd18' },
  { label: 'Instagram', href: 'https://www.instagram.com/byniel_digital/' },
];

export default function SiteFooter() {
  const toTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });

  // load the Calendly popup widget assets once so "Book a call" opens inline
  useEffect(() => {
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

  const openCall = (e: React.MouseEvent) => {
    e.preventDefault();
    if (window.Calendly) {
      window.Calendly.initPopupWidget({ url: CALENDLY_URL });
    } else {
      window.open(CALENDLY_URL, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <footer className={styles.footer} aria-label="Footer">
      <div className={styles.top}>
        {/* brand + copyright */}
        <div className={styles.brandCol}>
          <Image
            className={styles.logo}
            src="/byniel-logo.png"
            alt="byniel"
            width={96}
            height={96}
            priority={false}
          />
          <p className={styles.copy}>
            © {new Date().getFullYear()} — Neelam Malaviya
            <br />
            All rights reserved.
          </p>
        </div>

        {/* email CTA */}
        <div className={styles.mailCol}>
          <p className={styles.label}>Write me something nice:</p>
          <a className={styles.email} href={`mailto:${EMAIL}`}>{EMAIL}</a>
        </div>

        {/* socials */}
        <div className={styles.linksCol}>
          <p className={styles.label}>Follow me:</p>
          <ul className={styles.linkList}>
            {SOCIALS.map((s) => (
              <li key={s.label}>
                <a href={s.href} target="_blank" rel="noopener noreferrer">{s.label}</a>
              </li>
            ))}
          </ul>
        </div>

        {/* book a call — hidden on mobile (already in the header) */}
        <div className={`${styles.linksCol} ${styles.talkCol}`}>
          <p className={styles.label}>Let&apos;s talk:</p>
          <ul className={styles.linkList}>
            <li>
              <a href={CALENDLY_URL} onClick={openCall}>Book a call</a>
            </li>
          </ul>
        </div>
      </div>

      <button type="button" className={styles.backToTop} onClick={toTop}>
        Back to top
      </button>
    </footer>
  );
}
