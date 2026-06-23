'use client';
import { useRef, useState, useLayoutEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import styles from '../reviews.module.css';

gsap.registerPlugin(ScrollTrigger);

interface Review {
  quote: string;
  role: string;
  company: string;
  logo: string;
  /* drop a square photo in public/reviews/ and set its path here */
  photo?: string;
  meta: { label: string; value: string }[];
}

const REVIEWS: Review[] = [
  {
    quote: 'Neelam refactored our eight storefronts into one clean design system. Revenue grew 30% and our team finally enjoys working in the theme.',
    role: 'E-commerce Lead',
    company: 'Cerascreen',
    logo: 'cerascreen',
    meta: [
      { label: 'Result', value: '+30% revenue' },
      { label: 'Platform', value: 'Shopify Plus' },
      { label: 'Scope', value: '8 storefronts' },
      { label: 'Location', value: 'Germany' },
    ],
  },
  {
    quote: 'The custom product page lifted our revenue 20% within two months of launch. Neelam just gets conversion.',
    role: 'Founder',
    company: 'HiGRID Sleep',
    logo: 'higrid',
    meta: [
      { label: 'Result', value: '+20% in 2 months' },
      { label: 'Platform', value: 'Shopify Plus' },
      { label: 'Scope', value: 'Custom PDP' },
      { label: 'Location', value: 'United Kingdom' },
    ],
  },
  {
    quote: 'Our storefront finally feels as premium as our products. Sliders, reviews and email flows all just work.',
    role: 'Brand Manager',
    company: 'ShisenFox',
    logo: 'shisenfox',
    meta: [
      { label: 'Result', value: 'Higher AOV' },
      { label: 'Platform', value: 'Shopify' },
      { label: 'Scope', value: 'Theme + Klaviyo' },
      { label: 'Location', value: 'Germany' },
    ],
  },
  {
    quote: 'Neelam turned our Figma into a pixel-perfect WordPress theme our team can actually manage. A real pleasure to work with.',
    role: 'Creative Director',
    company: 'Studio Forge',
    logo: 'studioforge',
    meta: [
      { label: 'Result', value: 'Pixel-perfect build' },
      { label: 'Platform', value: 'WordPress' },
      { label: 'Scope', value: 'Figma → theme' },
      { label: 'Location', value: 'India' },
    ],
  },
  {
    quote: 'We replaced a paid store-locator app with a custom Shopify solution — faster, fully branded, and no more monthly fees.',
    role: 'Operations Lead',
    company: 'Beyond Appliances',
    logo: 'beyond',
    meta: [
      { label: 'Result', value: 'Zero app fees' },
      { label: 'Platform', value: 'Shopify' },
      { label: 'Scope', value: 'Custom locator' },
      { label: 'Location', value: 'India' },
    ],
  },
];

function go(i: number, dir: 1 | -1) {
  return (i + dir + REVIEWS.length) % REVIEWS.length;
}

export default function ReviewsSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const beamRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);
  const dirRef = useRef<1 | -1>(1);
  const animatingRef = useRef(false);
  const [index, setIndex] = useState(0);

  // scroll-driven reveal: as the section scrolls up out of the process
  // section, a cream wedge grows over the purple — wide on the LEFT, tapering
  // to a point on the RIGHT, symmetric about the vertical centre.
  useLayoutEffect(() => {
    const section = sectionRef.current!;
    const beam = beamRef.current!;

    const ctx = gsap.context(() => {
      const G = 3; // half-gap between the two edges at the right (beam mouth)
      const prog = { t: 0 };
      const apply = () => {
        const t = prog.t;
        if (t <= 0.5) {
          // Phase 1: cream beam fans open from a small vertical gap on the right
          // edge — left base grows; the right "mouth" (2·G) opens with it.
          const p = t / 0.5;
          const H = 50 * p; // 0 → 50
          const g = G * p;  // gap ramps in so it's hidden at t=0
          beam.style.clipPath =
            `polygon(0% ${50 - H}%, 100% ${50 - g}%, 100% ${50 + g}%, 0% ${50 + H}%)`;
        } else {
          // Phase 2: the top & bottom diagonal seams slide RIGHT, so the purple
          // top-right & bottom-right wedges sweep off the right edge → full cream.
          const X = 100 * ((t - 0.5) / 0.5); // 0 → 100
          beam.style.clipPath =
            `polygon(0% 0%, ${X}% 0%, 100% ${50 - G}%, 100% ${50 + G}%, ${X}% 100%, 0% 100%)`;
        }
      };
      apply();

      // pin the section so it has room to open SLOWLY after it's fully in view.
      // The growing wedge itself uncovers the (static) content in sequence —
      // quote in the centre first, then meta at the top, controls at the bottom.
      gsap.to(prog, {
        t: 1,
        ease: 'none',
        onUpdate: apply,
        scrollTrigger: {
          trigger: section,
          start: 'top top',
          end: '+=150%',
          pin: true,
          scrub: 1,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
      });
    }, section);

    return () => ctx.revert();
  }, []);

  // horizontal slider: the white beam's content travels across the screen on
  // each slide change. The beam's angled (parallelogram) edges turn that
  // horizontal travel into a diagonal wipe over the fixed purple background.
  const change = (dir: 1 | -1) => {
    if (animatingRef.current) return;
    animatingRef.current = true;
    dirRef.current = dir;
    gsap.to(innerRef.current, {
      xPercent: -100 * dir,
      autoAlpha: 0,
      duration: 0.32,
      ease: 'power2.in',
      onComplete: () => setIndex((i) => go(i, dir)),
    });
  };

  // re-entry on slide change: new content slides in from the opposite side.
  // Skip the very first mount — initial reveal is driven by the scroll timeline.
  const mountedRef = useRef(false);
  useLayoutEffect(() => {
    if (!mountedRef.current) {
      mountedRef.current = true;
      return;
    }
    const dir = dirRef.current;
    const tween = gsap.fromTo(
      innerRef.current,
      { xPercent: 100 * dir, autoAlpha: 0 },
      {
        xPercent: 0,
        autoAlpha: 1,
        duration: 0.45,
        ease: 'power2.out',
        onComplete: () => { animatingRef.current = false; },
      }
    );
    return () => { tween.kill(); };
  }, [index]);

  const r = REVIEWS[index];

  return (
    <section ref={sectionRef} className={styles.reviews} aria-label="Client reviews">
      {/* cream wedge beam revealed over the fixed purple base on scroll */}
      <div ref={beamRef} className={styles.beam}>
        <div ref={innerRef} className={styles.inner}>
          <div className={styles.metaRow}>
            {r.meta.map((m) => (
              <div key={m.label} className={styles.metaItem}>
                <span className={styles.metaLabel}>{m.label}</span>
                <span className={styles.metaValue}>{m.value}</span>
              </div>
            ))}
          </div>

          <div className={styles.body}>
            <blockquote className={styles.quote}>“{r.quote}”</blockquote>

            <div className={styles.attribution}>
              <div className={styles.who}>
                <span className={styles.logo}>{r.company}</span>
                <span className={styles.role}>{r.role}</span>
              </div>
              <div className={styles.avatar}>
                {r.photo ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={r.photo} alt={r.company} />
                ) : (
                  r.company.charAt(0)
                )}
              </div>
            </div>
          </div>

          <div className={styles.controls}>
            <div className={styles.pager}>
              <div className={styles.arrows}>
                <button className={styles.arrowBtn} onClick={() => change(-1)} aria-label="Previous review">←</button>
                <button className={styles.arrowBtn} onClick={() => change(1)} aria-label="Next review">→</button>
              </div>
              <p className={styles.count}>
                {String(index + 1).padStart(2, '0')}
                <span className={styles.countTotal}>/ {String(REVIEWS.length).padStart(2, '0')}</span>
              </p>
            </div>
         </div>
        </div>
      </div>
    </section>
  );
}
