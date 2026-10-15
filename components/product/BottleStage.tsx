'use client';

import { useLayoutEffect, useRef } from 'react';
import { gsap, ScrollTrigger } from '@/lib/gsap';
import { MM } from '@/lib/motion';
import styles from './BottleStage.module.css';

/**
 * THE product element. Exactly one instance exists for the whole page; it
 * never unmounts and is never duplicated per section. Acts do not animate
 * it directly - each act drops a <BottlePose> marker declaring where the
 * bottle should be while that act is on screen, and this stage tweens
 * between consecutive markers on scroll.
 *
 * That is what makes one product read as many product moments.
 */

type Pose = {
  x: number;        // vw offset from viewport centre
  y: number;        // vh offset from viewport centre
  scale: number;
  rotate: number;   // deg
  opacity: number;
  blur: number;     // px
};

const DEFAULT: Pose = { x: 0, y: 0, scale: 1, rotate: 0, opacity: 1, blur: 0 };

const num = (v: string | undefined, fallback: number) =>
  v === undefined || v === '' ? fallback : Number(v);

function readPose(el: HTMLElement, mobile: boolean): Pose {
  const d = el.dataset;
  const pick = (key: string, mKey: string, fallback: number) =>
    num(mobile && d[mKey] !== undefined ? d[mKey] : d[key], fallback);

  return {
    x: pick('x', 'mx', DEFAULT.x),
    y: pick('y', 'my', DEFAULT.y),
    scale: pick('scale', 'mscale', DEFAULT.scale),
    rotate: pick('rotate', 'mrotate', DEFAULT.rotate),
    opacity: pick('opacity', 'mopacity', DEFAULT.opacity),
    blur: pick('blur', 'mblur', DEFAULT.blur),
  };
}

const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

const blendPose = (a: Pose, b: Pose, t: number): Pose => ({
  x: lerp(a.x, b.x, t),
  y: lerp(a.y, b.y, t),
  scale: lerp(a.scale, b.scale, t),
  rotate: lerp(a.rotate, b.rotate, t),
  opacity: lerp(a.opacity, b.opacity, t),
  blur: lerp(a.blur, b.blur, t),
});

/**
 * Writes a pose straight to the element's style. The leading translate is
 * the centring offset - it lives here rather than in a GSAP xPercent so the
 * bottle is correctly placed on the very first paint, before any scroll has
 * happened. (It also matches the CSS fallback transform.)
 */
function applyPose(el: HTMLElement, p: Pose) {
  el.style.transform =
    `translate(-50%, -50%) translate(${p.x}vw, ${p.y}vh) scale(${p.scale}) rotate(${p.rotate}deg)`;
  el.style.opacity = String(p.opacity);
  el.style.visibility = p.opacity < 0.01 ? 'hidden' : 'visible';
  el.style.filter = p.blur > 0.01 ? `blur(${p.blur}px)` : 'none';
}

export default function BottleStage() {
  const stage = useRef<HTMLDivElement>(null);
  const bottle = useRef<HTMLDivElement>(null);
  const float = useRef<HTMLImageElement>(null);

  useLayoutEffect(() => {
    const stageEl = stage.current;
    const bottleEl = bottle.current;
    if (!stageEl || !bottleEl) return;

    const mm = gsap.matchMedia();

    /**
     * The pose is derived from scroll position rather than played back from
     * a timeline.
     *
     * Two earlier approaches failed. One scrubbed tween per pose captures
     * its start value lazily, so any jump - a deep link, a reload halfway
     * down - renders them out of order and the bottle lands wrong. A single
     * timeline fixed that, but its segment offsets were measured once at
     * mount, so it drifted out of alignment whenever ScrollTrigger refreshed
     * after fonts and images changed the layout, and the bottle stayed
     * unposed until the first scroll event rendered it.
     *
     * Computing the pose directly from scrollY solves all of it: the state
     * is a pure function of scroll, it can be applied immediately on mount,
     * and re-measuring on refresh is all that a layout change requires.
     */
    const choreograph = (mobile: boolean) => {
      const anchors = Array.from(
        document.querySelectorAll<HTMLElement>('[data-bottle-pose]'),
      );
      if (!anchors.length) return;

      const poses = anchors.map((a) => readPose(a, mobile));
      let tops: number[] = [];
      const measure = () => {
        tops = anchors.map((a) => a.getBoundingClientRect().top + window.scrollY);
      };

      /** Each pose is reached as its anchor arrives at the top of the
       *  viewport; between segments the bottle simply holds. */
      const poseAt = (y: number): Pose => {
        const vh = window.innerHeight;
        let result = poses[0];
        for (let i = 1; i < poses.length; i++) {
          const end = tops[i];
          const start = end - vh;
          if (y >= end) {
            result = poses[i];
            continue;
          }
          if (y <= start) break;
          const t = (y - start) / (end - start);
          // Smoothstep: the bottle eases into and out of each move instead
          // of changing direction abruptly at the segment boundaries.
          result = blendPose(poses[i - 1], poses[i], t * t * (3 - 2 * t));
          break;
        }
        return result;
      };

      const render = (y: number) => applyPose(bottleEl, poseAt(y));

      // Pose it now, before any scrolling, so the first painted frame after
      // the preloader lifts is already correct.
      measure();
      render(window.scrollY);

      ScrollTrigger.create({
        start: 0,
        end: () => document.documentElement.scrollHeight - window.innerHeight,
        invalidateOnRefresh: true,
        onRefresh: () => {
          measure();
          render(window.scrollY);
        },
        onUpdate: (self) => render(self.scroll()),
      });
    };

    mm.add(MM.desktop, () => {
      choreograph(false);
      // Slow idle drift so the bottle never feels pasted onto the page.
      gsap.to(float.current, {
        y: -14,
        duration: 4.5,
        ease: 'sine.inOut',
        repeat: -1,
        yoyo: true,
      });
    });

    mm.add(MM.mobile, () => choreograph(true));

    mm.add(MM.reduced, () => {
      // No choreography, no drift: hold the hero pose. The stage is anchored
      // to the opening frame in CSS, so it scrolls away like any other
      // element instead of hovering over the whole page.
      const first = document.querySelector<HTMLElement>('[data-bottle-pose]');
      if (first) applyPose(bottleEl, readPose(first, false));
    });

    // mm.revert() tears down every tween and ScrollTrigger created inside
    // the matchMedia branches.
    return () => mm.revert();
  }, []);

  return (
    <div ref={stage} className={styles.stage} aria-hidden="true">
      <div ref={bottle} className={styles.bottle}>
        <div className={styles.glow} />
        <img
          ref={float}
          className={styles.img}
          src="/product/bottle@2x.webp"
          // Phones render the bottle at ~46vw, so they take the 1x file
          // (113KB) rather than the 292KB one the hero needs on desktop.
          srcSet="/product/bottle.webp 367w, /product/bottle@2x.webp 733w"
          sizes="(max-width: 767px) 46vw, 23vw"
          width={733}
          height={2007}
          alt=""
          fetchPriority="high"
          decoding="async"
        />
        <div className={styles.contact} />
      </div>
    </div>
  );
}

/**
 * A zero-size marker an act drops to declare the bottle's pose while that
 * act is on screen. Keeps choreography declarative and colocated with the
 * section it belongs to, instead of one giant timeline in this file.
 *
 * Mobile overrides are optional; anything omitted falls back to desktop.
 */
export function BottlePose(props: {
  id: string;
  x?: number; y?: number; scale?: number; rotate?: number; opacity?: number; blur?: number;
  mx?: number; my?: number; mscale?: number; mrotate?: number; mopacity?: number; mblur?: number;
}) {
  const { id, ...pose } = props;
  const data: Record<string, string> = {};
  for (const [k, v] of Object.entries(pose)) {
    if (v !== undefined) data[`data-${k}`] = String(v);
  }
  return <div data-bottle-pose={id} className={styles.pose} {...data} />;
}
