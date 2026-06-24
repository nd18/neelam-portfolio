'use client';
import { useRef, useState, useLayoutEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';
import TiltButton from './TiltButton';
import styles from '../reviews.module.css';

gsap.registerPlugin(ScrollTrigger, SplitText);

interface Review {
  quote: string;
  name: string;
  role: string;
  company: string;
  logo: string;
  /* drop a square photo in public/reviews/ and set its path here */
  photo?: string;
  meta: { label: string; value: string }[];
}

const REVIEWS: Review[] = [
  {
    quote:
      'Neelam has done an outstanding job. She was highly reliable, always responded promptly, and her documentation consistently exceeded expectations. She brought great clarity to projects and delivered exactly what was discussed—often going above and beyond by thinking one step ahead. With fast and straightforward communication, she created excellent code and developed impressive features for our website. I truly valued working with her and can highly recommend her as a colleague.',
    role: 'Team Lead',
    company: 'Cerascreen',
    logo: 'cerascreen',
    photo: '/reviews/antonia.jpg',
    name: 'Antonia Bayer',
    meta: [
      { label: 'Result', value: 'Above & beyond' },
      { label: 'Platform', value: 'Shopify' },
      { label: 'Scope', value: 'Website features' },
      { label: 'Location', value: 'Germany' },
    ],
  },
  {
    quote:
      "We have been working with Neelam since August 2022 and it's been such a pleasure! She helps our agency with a number of custom development projects, from WordPress to Shopify sites and is always on time with great communication throughout the process. I would highly recommend working with Neelam.",
    role: 'Brand Manager',
    company: 'The Sleep Company',
    logo: 'sleepcompany',
    photo: '/reviews/niki.jpg',
    name: 'Niki Khandelwal',
    meta: [
      { label: 'Since', value: 'August 2022' },
      { label: 'Platform', value: 'Shopify + WordPress' },
      { label: 'Scope', value: 'Custom development' },
      { label: 'Engagement', value: 'Ongoing' },
    ],
  },
  {
    quote:
      'Neelam came up with a scalable, custom solution for Shopify collection filters. Her scripts work like a charm and she completed this job fairly quickly. She is responsible and a very reliable professional. We switched from one-off projects to a long-term collaboration.',
    role: 'Digital Product Head',
    company: 'Cerascreen',
    logo: 'cerascreen',
    photo: '/reviews/maksim.jpg',
    name: 'Maksim Micheliov',
    meta: [
      { label: 'Result', value: 'Long-term collab' },
      { label: 'Platform', value: 'Shopify' },
      { label: 'Scope', value: 'Collection filters' },
      { label: 'Location', value: 'Germany' },
    ],
  },
  {
    quote:
      'Cannot speak more highly of the work Neelam carried out. She showed a solid understanding of the brief, developed an intelligent, creative and well thought-out set of mockups, delivered on time and on budget.',
    role: 'IT Director',
    company: 'Guppy Moms',
    logo: 'guppymoms',
    photo: '/reviews/atul.jpg',
    name: 'Atul Ahuwalia',
    meta: [
      { label: 'Result', value: 'On time & on budget' },
      { label: 'Scope', value: 'Design + mockups' },
      { label: 'Delivery', value: 'On schedule' },
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
  const quoteRef = useRef<HTMLQuoteElement>(null);
  const metaRef = useRef<HTMLDivElement>(null);
  const attrRef = useRef<HTMLDivElement>(null);
  const countRef = useRef<HTMLSpanElement>(null);
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

      const ENTRY = 0.35; // how far the beam opens during the scroll-in

      // Phase A — entrance (NOT pinned): the beam already starts opening slowly
      // as the section scrolls up into view.
      gsap.to(prog, {
        t: ENTRY,
        ease: 'none',
        onUpdate: apply,
        scrollTrigger: {
          trigger: section,
          start: 'top bottom',
          end: 'top top',
          scrub: 1, // same smoothing as phase B → no hitch at the hand-off
          invalidateOnRefresh: true,
        },
      });

      // Phase B — pinned: finish opening + sweep purple off the right → full cream.
      gsap.fromTo(
        prog,
        { t: ENTRY },
        {
          t: 1,
          ease: 'none',
          immediateRender: false, // don't snap to ENTRY before phase A is done
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
        }
      );
    }, section);

    return () => ctx.revert();
  }, []);

  // slide change: the quote reveals line-by-line (same as the portfolio
  // description) — old lines slide up & out, then new lines slide up into view.
  const change = (dir: 1 | -1) => {
    if (animatingRef.current) return;
    animatingRef.current = true;
    dirRef.current = dir;
    const split = new SplitText(quoteRef.current, { type: 'lines', mask: 'lines' });
    gsap.to(split.lines, {
      yPercent: -110,
      duration: 0.4,
      ease: 'power2.in',
      stagger: 0.04,
      onComplete: () => {
        split.revert();
        setIndex((i) => go(i, dir));
      },
    });
    gsap.to([metaRef.current, attrRef.current], {
      autoAlpha: 0, y: -12, duration: 0.3, ease: 'power2.in',
    });
    // current slide number rolls up out through its mask (total stays put)
    gsap.to(countRef.current, { yPercent: -110, duration: 0.3, ease: 'power2.in' });
  };

  // intro: the FIRST time the section scrolls into view, the quote reveals
  // line-by-line (masked rise) — same feel as the About statement.
  useLayoutEffect(() => {
    const split = new SplitText(quoteRef.current, { type: 'lines', mask: 'lines' });
    gsap.set(split.lines, { yPercent: 110 });
    const tween = gsap.to(split.lines, {
      yPercent: 0,
      duration: 0.9,
      ease: 'power4.out',
      stagger: 0.12,
      scrollTrigger: { trigger: sectionRef.current, start: 'top 55%' },
      onComplete: () => split.revert(),
    });
    return () => {
      tween.scrollTrigger?.kill();
      tween.kill();
      split.revert();
    };
  }, []);

  // re-entry on slide change: new quote lines rise into view (masked stagger).
  // Skip the very first mount — initial reveal is driven by the scroll beam.
  const mountedRef = useRef(false);
  useLayoutEffect(() => {
    if (!mountedRef.current) {
      mountedRef.current = true;
      return;
    }
    const split = new SplitText(quoteRef.current, { type: 'lines', mask: 'lines' });
    gsap.set(split.lines, { yPercent: 110 });
    const tl = gsap.timeline({
      onComplete: () => { split.revert(); animatingRef.current = false; },
    });
    tl.to(split.lines, { yPercent: 0, duration: 0.6, ease: 'power3.out', stagger: 0.05 }, 0)
      .fromTo([metaRef.current, attrRef.current],
        { autoAlpha: 0, y: 14 },
        { autoAlpha: 1, y: 0, duration: 0.5, ease: 'power2.out' }, 0.1)
      // new slide number rolls up into view through its mask
      .fromTo(countRef.current,
        { yPercent: 110 },
        { yPercent: 0, duration: 0.45, ease: 'power3.out' }, 0.1);
    return () => { tl.kill(); };
  }, [index]);

  const r = REVIEWS[index];

  return (
    <section ref={sectionRef} className={styles.reviews} aria-label="Client reviews">
      {/* cream wedge beam revealed over the fixed purple base on scroll */}
      <div ref={beamRef} className={styles.beam}>
        <div className={styles.inner}>
          <div ref={metaRef} className={styles.metaRow}>
            {r.meta.map((m) => (
              <div key={m.label} className={styles.metaItem}>
                <span className={styles.metaLabel}>{m.label}</span>
                <span className={styles.metaValue}>{m.value}</span>
              </div>
            ))}
          </div>

          <div className={styles.body}>
            <blockquote key={index} ref={quoteRef} className={styles.quote}>“{r.quote}”</blockquote>

            <div ref={attrRef} className={styles.attribution}>
              <div className={styles.who}>
                <span className={styles.logo}>{r.name}</span>
                <span className={styles.role}>{r.role}, {r.company}</span>
              </div>
              <div className={styles.avatar}>
                <span className={styles.avatarInitial}>{r.name.charAt(0)}</span>
                {r.photo && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    key={r.photo}
                    className={styles.avatarImg}
                    src={r.photo}
                    alt=""
                    onError={(e) => { e.currentTarget.style.display = 'none'; }}
                  />
                )}
              </div>
            </div>
          </div>

          <div className={styles.controls}>
            <div className={styles.pager}>
              <div className={styles.arrows}>
                <TiltButton className={styles.arrowBtn} onClick={() => change(-1)} ariaLabel="Previous review">←</TiltButton>
                <TiltButton className={styles.arrowBtn} onClick={() => change(1)} ariaLabel="Next review">→</TiltButton>
              </div>
              <p className={styles.count}>
                <span className={styles.countMask}>
                  <span ref={countRef} className={styles.countCurrent}>
                    {String(index + 1).padStart(2, '0')}
                  </span>
                </span>
                {' '}/
                <span className={styles.countTotal}>
                  {String(REVIEWS.length).padStart(2, '0')}
                </span>
              </p>
            </div>
         </div>
        </div>
      </div>
    </section>
  );
}
