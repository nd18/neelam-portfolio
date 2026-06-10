'use client';
import { useRef, useEffect } from 'react';
import styles from '../hero.module.css';

const LERP = 0.04;
const MAX_DEG = 8;
const ANIM_MS = 3200;
const EXPAND_MS = 0.18 * ANIM_MS;
const ROTATE_MS = ANIM_MS - EXPAND_MS;

// Desktop: full-width bowtie (90° spread)
const BEAM_FRAC_DESKTOP: [number, number][] = [
  [0.5, 0.5], [0, 0], [0, 1],
  [0.5, 0.5], [1, 0], [1, 1],
];

// Stacked layout (≤640): narrower bowtie than desktop, but wide enough to
// light a good chunk of the big name on phones
const BEAM_FRAC_MOBILE: [number, number][] = [
  [0.5, 0.5], [0, 0.35], [0, 0.65],
  [0.5, 0.5], [1, 0.35], [1, 0.65],
];

// matches the stacked-layout (phone) breakpoint in hero.module.css
function isMobile() { return window.innerWidth <= 640; }

// Rest angle of the bowtie. Desktop: 135° diagonal. Stacked layout: slightly
// tilted off vertical so the lower wing crosses the big name text at an angle.
function restDeg() { return isMobile() ? 105 : 135; }

const COLLAPSED_CLIP = 'polygon(50% 50%, 50% 50%, 50% 50%, 50% 50%, 50% 50%, 50% 50%)';

function clipFromFracs(baseFrac: [number, number][], expansion: number): string {
  return `polygon(${baseFrac
    .map(([fx, fy]) => {
      const x = (0.5 + (fx - 0.5) * expansion) * 100;
      const y = (0.5 + (fy - 0.5) * expansion) * 100;
      return `${x.toFixed(2)}% ${y.toFixed(2)}%`;
    })
    .join(', ')})`;
}

function easeInOut(t: number): number {
  return t * t * (3 - 2 * t);
}

function computeBeamPoints(
  angleDeg: number,
  rect: DOMRect,
  containerRect: DOMRect,
  baseFrac: [number, number][],
  expansion = 1
): string {
  // mirror the .beam element exactly: left/top -50%, size 200% of its container
  const cw = containerRect.width;
  const ch = containerRect.height;
  const bl = containerRect.left - cw / 2, bt = containerRect.top - ch / 2;
  const bw = cw * 2, bh = ch * 2;

  const fracs: [number, number][] = baseFrac.map(([fx, fy]) => [
    0.5 + (fx - 0.5) * expansion,
    0.5 + (fy - 0.5) * expansion,
  ]);

  let pts: [number, number][] = fracs.map(([fx, fy]) => [
    bl + fx * bw, bt + fy * bh,
  ]);

  const cx = containerRect.left + cw / 2, cy = containerRect.top + ch / 2;
  const rad = (angleDeg * Math.PI) / 180;
  const c = Math.cos(rad), s = Math.sin(rad);
  pts = pts.map(([x, y]) => {
    const dx = x - cx, dy = y - cy;
    return [cx + dx * c - dy * s, cy + dx * s + dy * c];
  });

  return pts
    .map(([x, y]) => `${(x - rect.left).toFixed(1)},${(y - rect.top).toFixed(1)}`)
    .join(' ');
}

export default function SpotlightBeam() {
  const beamRef = useRef<HTMLDivElement>(null);
  const polyRef = useRef<SVGPolygonElement>(null);
  const settled = useRef(false);
  const curr = useRef(135);
  const tgt = useRef(135);
  const rafId = useRef(0);
  const litRect = useRef<DOMRect | null>(null);
  const bgRect = useRef<DOMRect | null>(null);
  const animStart = useRef(0);

  useEffect(() => {
    const el = beamRef.current;
    const textLit = document.querySelector('[data-big-text-lit]') as HTMLElement | null;
    if (!el) return;

    // .bg container — the beam's geometry reference (not el itself: it gets rotated)
    const bg = el.parentElement;
    if (bg) bgRect.current = bg.getBoundingClientRect();

    // intro is driven from the same rAF tick as the text mask so the two
    // can never drift apart — kill the CSS keyframe animation
    el.style.animation = 'none';
    el.style.clipPath = COLLAPSED_CLIP;
    el.style.transform = `rotate(${restDeg()}deg)`;

    if (textLit) {
      litRect.current = textLit.getBoundingClientRect();
      textLit.style.clipPath = '';
      textLit.style.mask = 'url(#soft-beam-mask)';
      textLit.style.setProperty('-webkit-mask', 'url(#soft-beam-mask)');
    }

    const tick = (now: number) => {
      if (animStart.current === 0) animStart.current = now;
      const elapsed = now - animStart.current;
      const mobile = isMobile();
      const frac = mobile ? BEAM_FRAC_MOBILE : BEAM_FRAC_DESKTOP;
      const rest = restDeg();

      if (!settled.current) {
        let expansion: number;
        let angleDeg: number;

        if (elapsed < EXPAND_MS) {
          expansion = easeInOut(elapsed / EXPAND_MS);
          angleDeg = rest;
        } else {
          expansion = 1;
          angleDeg = rest + easeInOut(Math.min((elapsed - EXPAND_MS) / ROTATE_MS, 1)) * 180;
        }

        // beam and mask updated from the same values, same frame
        el.style.clipPath = clipFromFracs(frac, expansion);
        el.style.transform = `rotate(${angleDeg}deg)`;
        if (polyRef.current && litRect.current && bgRect.current) {
          polyRef.current.setAttribute('points', computeBeamPoints(angleDeg, litRect.current, bgRect.current, frac, expansion));
        }

        if (elapsed >= ANIM_MS) {
          el.style.transform = `rotate(${rest}deg)`;
          curr.current = rest;
          tgt.current = rest;
          settled.current = true;
        }
      } else {
        curr.current += (tgt.current - curr.current) * LERP;
        el.style.transform = `rotate(${curr.current}deg)`;
        if (polyRef.current && litRect.current && bgRect.current) {
          polyRef.current.setAttribute('points', computeBeamPoints(curr.current, litRect.current, bgRect.current, frac));
        }
      }

      rafId.current = requestAnimationFrame(tick);
    };

    const onMouseMove = (e: MouseEvent) => {
      if (!settled.current) return;
      const normalized = (e.clientX - window.innerWidth / 2) / (window.innerWidth / 2);
      tgt.current = restDeg() + normalized * MAX_DEG;
    };

    const onResize = () => {
      if (textLit) litRect.current = textLit.getBoundingClientRect();
      if (bg) bgRect.current = bg.getBoundingClientRect();
      if (settled.current) tgt.current = restDeg();
    };

    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('resize', onResize);
    rafId.current = requestAnimationFrame(tick);

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('resize', onResize);
      cancelAnimationFrame(rafId.current);
    };
  }, []);

  return (
    <>
      <div ref={beamRef} className={styles.beam} />
      <svg
        aria-hidden="true"
        style={{ position: 'absolute', width: 0, height: 0, overflow: 'hidden', pointerEvents: 'none' }}
      >
        <defs>
          <mask
            id="soft-beam-mask"
            maskUnits="userSpaceOnUse"
            x="-4000" y="-4000" width="9000" height="9000"
          >
            <rect x="-4000" y="-4000" width="9000" height="9000" fill="black" />
            <polygon
              ref={polyRef}
              points="0,0 0,0 0,0 0,0 0,0 0,0"
              fill="white"
            />
          </mask>
        </defs>
      </svg>
    </>
  );
}
