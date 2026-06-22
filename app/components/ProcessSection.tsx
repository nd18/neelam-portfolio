'use client';
import { useRef, useLayoutEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import styles from '../process.module.css';

gsap.registerPlugin(ScrollTrigger);

interface Step {
  title: string;
  desc: string;
  /* drop an image in public/process/ and set its path to replace the placeholder */
  image?: string;
  gradient: string;
}

const STEPS: Step[] = [
  {
    title: 'Briefing',
    desc: 'Send me a detailed brief: who you are, your goals and target audience, what you sell, the features and scope you need, timelines and any sites you love.',
    image: '/process/01_briefing_s.webp',
    gradient: 'linear-gradient(135deg, #2b3a67 0%, #4a6fa5 100%)',
  },
  {
    title: 'Evaluation',
    desc: 'I review the brief, assess scope and fit, and we hop on a call to align on the approach. If it’s a match, I send a clear proposal and timeline.',
    image: '/process/02_evaluation_s.webp',
    gradient: 'linear-gradient(135deg, #1f2024 0%, #5b5e66 100%)',
  },
  {
    title: 'Kickoff',
    desc: 'We lock scope, milestones and deadlines, set up access (Shopify / WordPress, repo) and agree on how we’ll communicate throughout the build.',
    image: '/process/03_kickoff_s.webp',
    gradient: 'linear-gradient(135deg, #5a4632 0%, #b08d57 100%)',
  },
  {
    title: 'Design',
    desc: 'Art direction, moodboard and 2–3 key screens to lock the look and feel. Once the direction is approved, I design the full store or site.',
    image: '/process/04_kickoff_s.webp',
    gradient: 'linear-gradient(135deg, #6d2f4f 0%, #c66b8e 100%)',
  },
  {
    title: 'Development',
    desc: 'I build the approved design in Shopify / Liquid or WordPress — clean, fast and responsive — with regular progress updates so you’re never in the dark.',
    image: '/process/05_dev_s.webp',
    gradient: 'linear-gradient(135deg, #c9622f 0%, #f0a35e 100%)',
  },
  {
    title: 'Quality Assurance',
    desc: 'Cross-browser and device testing, performance tuning and bug fixes. After your final approval, the store is ready to ship and grow.',
    image: '/process/06_qa_s.webp',
    gradient: 'linear-gradient(135deg, #2f5d3a 0%, #7bbf7e 100%)',
  },
];

export default function ProcessSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const section = sectionRef.current!;
    const track = trackRef.current!;

    const mm = gsap.matchMedia();

    // all sizes: pin the section and scroll the track horizontally
    mm.add('(min-width: 1px)', () => {
      const getAmount = () => track.scrollWidth - window.innerWidth;

      const tween = gsap.to(track, {
        x: () => -getAmount(),
        ease: 'none',
        scrollTrigger: {
          trigger: section,
          start: 'top top',
          end: () => `+=${getAmount()}`,
          pin: true,
          scrub: 1,
          invalidateOnRefresh: true,
          anticipatePin: 1,
        },
      });

      return () => { tween.kill(); };
    });

    return () => mm.revert();
  }, []);

  return (
    <section ref={sectionRef} className={styles.process} aria-label="My process">
      <div className={styles.header}>
        <h2 className={styles.title}>My Process</h2>
        <div className={styles.meta}>
          <span>Neelam</span><span>Malaviya</span>
          <span>Project start to finish</span><span>6 steps</span>
          <span>Version</span><span>.01</span>
        </div>
      </div>

      <div ref={trackRef} className={styles.track}>
        <div className={styles.gridPanel} aria-hidden="true" />
        {STEPS.map((step, i) => (
          <article key={step.title} className={styles.step}>
            <div className={styles.stepMedia}>
              {step.image ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={step.image} alt={step.title} style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
              ) : (
                <div className={styles.placeholder} style={{ background: step.gradient }}>
                  {step.title}
                </div>
              )}
            </div>
            <div className={styles.stepHead}>
              <span className={styles.stepNum}>{i + 1}</span>
              <h3 className={styles.stepTitle}>{step.title}</h3>
            </div>
            <p className={styles.stepDesc}>{step.desc}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
