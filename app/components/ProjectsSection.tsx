'use client';
import { useRef, useState, useLayoutEffect } from 'react';
import Image from 'next/image';
import gsap from 'gsap';
import { SplitText } from 'gsap/SplitText';
import TiltButton from './TiltButton';
import styles from '../projects.module.css';

gsap.registerPlugin(SplitText);

interface Project {
  title: string;
  desc: string;
  tags: string[];
  url: string;
  /* drop a screenshot in public/projects/ and set its path here */
  image?: string;
  gradient: string;
  label: string;
}

const PROJECTS: Project[] = [
  {
    title: 'Studio Forge: Figma to custom WordPress theme',
    desc: 'Fully custom WordPress theme built from scratch off Figma designs — pixel-perfect, with ACF and Custom Post Types powering a flexible, client-manageable content architecture.',
    tags: ['WordPress', 'ACF / CPT', 'Figma'],
    url: 'https://studioforge.in/',
    image: '/projects/studioforge.jpg',
    gradient: 'linear-gradient(135deg, #232526 0%, #757f9a 100%)',
    label: 'Studio Forge',
  },
  {
    title: 'Beyond Appliances: custom Shopify store locator',
    desc: 'Replaced a paid third-party store-locator app with a custom Shopify-native solution — faster, fully branded, and free of recurring app fees.',
    tags: ['Shopify', 'Custom App', 'India'],
    url: 'https://beyondappliances.in/',
    image: '/projects/beyond-appliances.png',
    gradient: 'linear-gradient(135deg, #1a2980 0%, #26d0ce 100%)',
    label: 'Beyond Appliances',
  },
  {
    title: 'ShisenFox: premium custom Shopify store',
    desc: 'Custom product image sliders and advanced theme work aligned to a premium brand identity, with JudgeMe reviews and Klaviyo email automation driving repeat purchases.',
    tags: ['Shopify', 'Klaviyo', 'JudgeMe'],
    url: 'https://shisenfox.com/',
    image: '/projects/shisenfox.jpg',
    gradient: 'linear-gradient(135deg, #5f2c82 0%, #c084d8 100%)',
    label: 'ShisenFox',
  },
  {
    title: 'Beruru: clean, conversion-focused Shopify build',
    desc: 'A polished Shopify storefront with a refined product experience and brand-led design, built for clarity and conversion across every device.',
    tags: ['Shopify', 'Custom Theme', 'Branding'],
    url: 'https://beruru.com/',
    image: '/projects/beruru.png',
    gradient: 'linear-gradient(135deg, #614385 0%, #516395 100%)',
    label: 'Beruru',
  },
  {
    title: 'Cerascreen: 8 storefronts, one design system',
    desc: 'Full codebase refactor across 8 Shopify storefronts with a unified Bootstrap design system, custom filters, Quick View, Cart Drawer and Wishlist — contributing to 30% revenue growth.',
    tags: ['Shopify Plus', 'Design System', 'Germany'],
    url: 'https://www.cerascreen.de/',
    image: '/projects/cerascreen.jpg',
    gradient: 'linear-gradient(135deg, #1f4037 0%, #99b898 100%)',
    label: 'Cerascreen',
  },
  {
    title: 'Guppy Moms: community-driven Shopify store',
    desc: 'A warm, mom-focused Shopify storefront with custom sections and a smooth shopping flow tailored to the brand’s community and product range.',
    tags: ['Shopify', 'Custom Theme', 'Responsive'],
    url: 'https://guppymoms.com/',
    image: '/projects/guppy-moms.png',
    gradient: 'linear-gradient(135deg, #ee9ca7 0%, #ffdde1 100%)',
    label: 'Guppy Moms',
  },
  {
    title: 'HiGRID Sleep: Shopify Plus buying experience',
    desc: 'Fully custom Liquid product page replacing the default Shopify template — a conversion-optimized buying experience that lifted revenue 20% within 2 months of launch.',
    tags: ['Shopify Plus', 'Liquid', 'UK'],
    url: 'https://higridsleep.co.uk/',
    image: '/projects/higrid-sleep.jpg',
    gradient: 'linear-gradient(135deg, #2b3a67 0%, #4a6fa5 100%)',
    label: 'HiGRID Sleep',
  },
  {
    title: 'Vanaura Organics: responsive Shopify build',
    desc: 'Responsive storefront across all devices on the Ella theme, with improved navigation and app integrations — delivered through iterative client feedback cycles.',
    tags: ['Shopify', 'Ella Theme', 'Responsive'],
    url: 'https://vanauraorganics.com/',
    image: '/projects/vanaura-organics.jpg',
    gradient: 'linear-gradient(135deg, #355c3a 0%, #a8c686 100%)',
    label: 'Vanaura Organics',
  },
  {
    title: 'Zoom Shoes: fast, bold Shopify storefront',
    desc: 'An energetic footwear Shopify store with custom product displays and a snappy, mobile-first shopping experience built to convert.',
    tags: ['Shopify', 'Custom Theme', 'India'],
    url: 'https://www.zoomshoes.in/',
    image: '/projects/zoom-shoes.png',
    gradient: 'linear-gradient(135deg, #f12711 0%, #f5af19 100%)',
    label: 'Zoom Shoes',
  },
  {
    title: 'Sai Photo Studio: custom WordPress site',
    desc: 'A visually rich WordPress website for a photography studio — image-forward layouts and an easy-to-manage content structure.',
    tags: ['WordPress', 'Custom Theme', 'Portfolio'],
    url: 'https://saiphoto.co.in/',
    image: '/projects/sai-photo-studio.png',
    gradient: 'linear-gradient(135deg, #4b6cb7 0%, #182848 100%)',
    label: 'Sai Photo Studio',
  },
  {
    title: 'Mosaic Moments: bespoke WordPress build',
    desc: 'A custom WordPress site with tailored layouts and flexible content blocks, crafted to match the brand’s identity end to end.',
    tags: ['WordPress', 'ACF', 'Responsive'],
    url: 'https://mosaic-moments.in/',
    image: '/projects/mosaic-moments.png',
    gradient: 'linear-gradient(135deg, #c94b4b 0%, #4b134f 100%)',
    label: 'Mosaic Moments',
  },
  {
    title: 'Timbaktu Collective: nonprofit WordPress site',
    desc: 'A content-rich WordPress website for a grassroots collective — built for storytelling, accessibility, and easy ongoing updates.',
    tags: ['WordPress', 'Nonprofit', 'CMS'],
    url: 'https://timbaktu.org/',
    image: '/projects/timbaktu.png',
    gradient: 'linear-gradient(135deg, #11998e 0%, #38ef7d 100%)',
    label: 'Timbaktu',
  },
];

function Media({ project, big }: { project: Project; big?: boolean }) {
  if (project.image) {
    return (
      <Image
        src={project.image}
        alt={project.label}
        fill
        sizes={big ? '(max-width: 1024px) 90vw, 45vw' : '18vw'}
        style={{ objectFit: 'cover', objectPosition: 'center top' }}
      />
    );
  }
  return (
    <div className={styles.placeholder} style={{ background: project.gradient }}>
      {project.label}
    </div>
  );
}

interface Transition {
  from: number;
  to: number;
  dir: 1 | -1;
}

export default function ProjectsSection() {
  const [index, setIndex] = useState(0);
  // while set, ghost copies of the old/new media fly across the section and
  // the next project's text is double-buffered in a hidden overlay layer —
  // no React re-render happens mid-flight, so the motion never stutters
  const [trans, setTrans] = useState<Transition | null>(null);
  const justSwapped = useRef(false);

  const sectionRef = useRef<HTMLElement>(null);
  const featuredMediaRef = useRef<HTMLDivElement>(null);
  const thumbARef = useRef<HTMLButtonElement>(null);
  const thumbBRef = useRef<HTMLButtonElement>(null);
  const thumbsRef = useRef<HTMLDivElement>(null);
  const ghostClipRef = useRef<HTMLDivElement>(null);
  const oldGhostRef = useRef<HTMLDivElement>(null);
  const newGhostRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const tagsRef = useRef<HTMLDivElement>(null);
  const descRef = useRef<HTMLParagraphElement>(null);
  const inTitleRef = useRef<HTMLHeadingElement>(null);
  const inTagsRef = useRef<HTMLDivElement>(null);
  const inDescRef = useRef<HTMLParagraphElement>(null);
  const inThumbRef = useRef<HTMLDivElement>(null);
  const countRef = useRef<HTMLParagraphElement>(null);
  const lastDir = useRef<1 | -1>(1);

  const go = (dir: 1 | -1) => {
    if (trans) return; // ignore clicks mid-flight
    setTrans({ from: index, to: (index + dir + PROJECTS.length) % PROJECTS.length, dir });
  };

  // warm-up on mount: prime SplitText (font metrics) and park the ghost
  // layers at the featured rect so the first real flight has zero setup cost
  useLayoutEffect(() => {
    const s1 = new SplitText(titleRef.current, { type: 'lines', mask: 'lines' });
    const s2 = new SplitText(descRef.current, { type: 'lines', mask: 'lines' });
    s1.revert();
    s2.revert();
    const sec = sectionRef.current!.getBoundingClientRect();
    const feat = featuredMediaRef.current!.getBoundingClientRect();
    gsap.set(ghostClipRef.current, {
      left: feat.left - sec.left,
      top: feat.top - sec.top,
      width: feat.width,
      height: feat.height,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // media flight: old featured exits left, new one zooms up from the thumbnail
  useLayoutEffect(() => {
    if (!trans) return;
    lastDir.current = trans.dir;
    const sec = sectionRef.current!.getBoundingClientRect();
    const feat = featuredMediaRef.current!.getBoundingClientRect();
    const thumb = thumbARef.current?.getBoundingClientRect();
    const thumbB = thumbBRef.current?.getBoundingClientRect();
    const hasThumb = !!thumb && thumb.width > 0;

    const fx = feat.left - sec.left;
    const fy = feat.top - sec.top;
    const oldGhost = oldGhostRef.current!;
    const newGhost = newGhostRef.current!;
    // keep the clip locked over the featured slot; ghosts just slide inside it
    gsap.set(ghostClipRef.current, { left: fx, top: fy, width: feat.width, height: feat.height });
    gsap.set([oldGhost, newGhost], { x: 0, y: 0, scale: 1, opacity: 1 });

    // travel one slot-width + a small gap; clip hides anything outside
    const travel = feat.width + 60;
    // fast continuous flight — old and new overlap so there is no empty gap
    const D = 0.62;
    const OVERLAP = 0.1; // new starts while old is still clearing — feels instant
    const E = 'power3.inOut';

    // split ALL text (outgoing + incoming overlay) up front, before any motion
    // starts — mid-flight there are only pure transform tweens, zero reflow
    const outTitle = new SplitText(titleRef.current, { type: 'lines', mask: 'lines' });
    const outDesc = new SplitText(descRef.current, { type: 'lines', mask: 'lines' });
    const inTitle = new SplitText(inTitleRef.current, { type: 'lines', mask: 'lines' });
    const inDesc = new SplitText(inDescRef.current, { type: 'lines', mask: 'lines' });
    gsap.set([...inTitle.lines, ...inDesc.lines], { yPercent: 110 });
    gsap.set(inTagsRef.current, { autoAlpha: 0, y: 18 });

    const tl = gsap.timeline({
      onComplete: () => {
        // hide outgoing before reverting so restored text never flashes;
        // the index effect below makes it visible again with the new content
        gsap.set([titleRef.current, descRef.current, tagsRef.current], { autoAlpha: 0 });
        outTitle.revert();
        outDesc.revert();
        inTitle.revert();
        inDesc.revert();
        justSwapped.current = true;
        setIndex(trans.to);
        setTrans(null);
      },
    });

    if (trans.dir === 1) {
      // old slides out to the left, new slides in from the right — clipped to slot
      tl.to(oldGhost, { x: -travel, duration: D, ease: E }, 0)
        .fromTo(newGhost, { x: travel }, { x: 0, duration: D, ease: E }, OVERLAP);
    } else {
      // going back: old slides out right, previous slides in from the left
      tl.to(oldGhost, { x: travel, duration: D, ease: E }, 0)
        .fromTo(newGhost, { x: -travel }, { x: 0, duration: D, ease: E }, OVERLAP);
    }

    // upcoming thumbnails reshuffle in lockstep with the featured flight
    if (hasThumb && thumbB && thumbB.width > 0) {
      const shiftX = thumbB.left - thumb.left;
      if (trans.dir === 1) {
        tl.to(thumbBRef.current, { x: -shiftX, duration: D, ease: E }, OVERLAP);
        if (inThumbRef.current) {
          tl.fromTo(inThumbRef.current,
            { x: shiftX }, { x: 0, duration: D, ease: E }, OVERLAP);
        }
      } else {
        tl.to(thumbARef.current, { x: shiftX, duration: D, ease: E }, OVERLAP)
          .to(thumbBRef.current, { opacity: 0, x: shiftX * 0.35, duration: D * 0.6, ease: 'power2.in' }, 0);
      }
    }

    // text crossfades quickly: old slides up, new slides in just behind it
    tl.to([outTitle.lines, outDesc.lines],
        { yPercent: -110, duration: 0.34, ease: 'power2.in', stagger: 0.04 }, 0)
      .to(tagsRef.current,
        { autoAlpha: 0, y: -12, duration: 0.28, ease: 'power2.in' }, 0)
      // count rolls up through its own mask (yPercent), not a fade
      .to(countRef.current,
        { yPercent: -110, duration: 0.3, ease: 'power2.in' }, 0)
      .to(inTitle.lines,
        { yPercent: 0, duration: 0.55, ease: 'power3.out', stagger: 0.05 }, OVERLAP + 0.16)
      .to(inDesc.lines,
        { yPercent: 0, duration: 0.5, ease: 'power3.out', stagger: 0.04 }, OVERLAP + 0.22)
      .to(inTagsRef.current,
        { autoAlpha: 1, y: 0, duration: 0.4, ease: 'power2.out' }, OVERLAP + 0.32);

    return () => {
      // if interrupted (HMR/unmount) snap to the end state first so
      // index/counter/thumbs never get stuck halfway
      if (tl.progress() < 1) tl.progress(1);
      tl.kill();
    };
  }, [trans]);

  // after the media lands: restore the (now updated) base text layer,
  // reset glided thumbs, ease the fresh one in, roll the counter
  useLayoutEffect(() => {
    if (!justSwapped.current) return;
    justSwapped.current = false;
    gsap.set([titleRef.current, descRef.current, tagsRef.current], { autoAlpha: 1, y: 0 });
    // both slots are visually continuous now (B glided to A, the incoming
    // third thumb landed on B) — just reset transforms under the new render
    gsap.set([thumbARef.current, thumbBRef.current], { x: 0, opacity: 1 });
    // new slide number rolls in through its mask (reset y/alpha from the exit)
    const tween = gsap.fromTo(countRef.current,
      { yPercent: 110, y: 0, autoAlpha: 1 },
      { yPercent: 0, duration: 0.45, ease: 'power3.out' });
    return () => { tween.kill(); };
  }, [index]);

  const project = PROJECTS[index];
  const incoming = trans ? PROJECTS[trans.to] : null;
  const thumbA = PROJECTS[(index + 1) % PROJECTS.length];
  const thumbB = PROJECTS[(index + 2) % PROJECTS.length];

  return (
    <section ref={sectionRef} className={styles.projects} aria-label="Projects">
      <div ref={ghostClipRef} className={styles.ghostClip} style={{ opacity: trans ? 1 : 0 }}>
        <div ref={oldGhostRef} className={styles.ghost}>
          <Media project={trans ? PROJECTS[trans.from] : project} big />
        </div>
        <div ref={newGhostRef} className={styles.ghost}>
          <Media project={trans ? PROJECTS[trans.to] : project} big />
        </div>
      </div>

      <div className={styles.inner}>
        <p className={styles.sectionLabel}>
          Projects you might also be interested in
        </p>

        <div className={styles.featured}>
          {/* hidden during a flight (the ghosts own the visuals) but kept
              mounted so its GPU layer stays warm — prevents the duplicate */}
          <div ref={featuredMediaRef} className={styles.featuredMedia} style={{ opacity: trans ? 0 : 1 }}>
            <Media project={project} big />
          </div>
          <div className={styles.textBlock}>
            <div>
              <div className={styles.titleMask}>
                <h2 ref={titleRef} className={styles.title}>{project.title}</h2>
              </div>
              <div ref={tagsRef} className={styles.tags}>
                {project.tags.map(tag => (
                  <span key={tag}>{tag}</span>
                ))}
              </div>
            </div>
            {incoming && (
              <div className={styles.incomingLayer}>
                <div className={styles.titleMask}>
                  <h2 ref={inTitleRef} className={styles.title}>{incoming.title}</h2>
                </div>
                <div ref={inTagsRef} className={styles.tags}>
                  {incoming.tags.map(tag => (
                    <span key={tag}>{tag}</span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        <div className={styles.side}>
          <div ref={thumbsRef} className={styles.thumbs}>
            <button ref={thumbARef} className={styles.thumb} onClick={() => go(1)} aria-label={`Next: ${thumbA.label}`}>
              {!(trans && trans.dir === 1) && <Media project={thumbA} />}
            </button>
            <button ref={thumbBRef} className={styles.thumb} onClick={() => go(1)} aria-label={`Upcoming: ${thumbB.label}`}>
              <Media project={thumbB} />
            </button>
            {trans && trans.dir === 1 && (
              <div ref={inThumbRef} className={styles.thumbIncoming} aria-hidden="true">
                <Media project={PROJECTS[(trans.to + 2) % PROJECTS.length]} />
              </div>
            )}
          </div>

          <div className={styles.pager}>
            <p className={styles.count}>
              <span className={styles.countMask}>
                <span ref={countRef} className={styles.countCurrent}>
                  {String(index + 1).padStart(2, '0')}
                </span>
              </span>
              {' '}/
              <span className={styles.countTotal}>
                {String(PROJECTS.length).padStart(2, '0')}
              </span>
            </p>
            <div className={styles.arrows}>
              <TiltButton className={styles.arrowBtn} onClick={() => go(-1)} ariaLabel="Previous project">←</TiltButton>
              <TiltButton className={styles.arrowBtn} onClick={() => go(1)} ariaLabel="Next project">→</TiltButton>
            </div>
          </div>

          <div>
            <div className={styles.textBlock}>
              <p ref={descRef} className={styles.desc}>{project.desc}</p>
              {incoming && (
                <p ref={inDescRef} className={`${styles.desc} ${styles.incomingLayer}`}>
                  {incoming.desc}
                </p>
              )}
            </div>
            <TiltButton className={styles.viewBtn} href={project.url} target="_blank" rel="noopener noreferrer">
              View Project
            </TiltButton>
          </div>
        </div>
      </div>
    </section>
  );
}
