// components/sections/Loader.tsx
// PHASE 4 — LOADER v4.0
// Choreography (faithful port of the user's Stitch/Figma prototype in
// "Loader reference code/code.html", retimed to a ~7.1s budget per owner
// request — every beat gets enough room to be consciously perceived):
//
//   0.00s      Stage is WHITE with a very subtle pinkish corner gradient
//              (server-rendered — visible from the very first frame)
//   0.20–1.10  Dark dot scales in, dead-center, slowly (0.9s)
//   1.10–1.50  Hold
//   1.50–2.10  Circle slides left; logo mark feeds in (fade+scale) riding it
//   2.10–2.40  Hold
//   2.40–3.53  Dark letters rise bottom-up out of masked containers,
//              slow stagger (0.5s per letter, 0.09s apart)
//   3.53–3.83  Rest
//   3.83–4.33  Editorial pulse — all letters dim to muted sage, then restore
//   4.43–4.58  "SHEK" mutes in color
//   4.53–5.08  "SHEK" dissolves as one group — "ABHI" locked, never moves
//   5.08–5.48  Deliberate hold before the expansion
//   5.48–6.38  IRIS EXPANSION: a disk the site's dark bg color grows from
//              the circle's center until the white stage is completely
//              swallowed — the letters are hidden behind it (z-30 over
//              their z-10) — while the logo mark flies to the top-left dock
//   6.68–7.08  Fresh, natively-sized "ABHI" fades in beside the landed mark
//   ≈7.1s      Total
"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { LogoMark } from "@/components/ui/LogoMark";
import { OWNER_NAME, OWNER_NICKNAME } from "@/constants";

gsap.registerPlugin(useGSAP);

// Tailwind gap-4 — the horizontal space between the circle cluster and the
// name. Needed as a number to compute how far right the cluster starts so
// the dot appears dead-center before sliding left.
const NAME_GAP_PX = 16;

export default function Loader(): React.ReactElement {
  const rootRef = useRef<HTMLDivElement>(null);
  const clusterRef = useRef<HTMLDivElement>(null);
  const circleRef = useRef<HTMLDivElement>(null);
  const markRef = useRef<SVGSVGElement>(null);
  const nameRef = useRef<HTMLDivElement>(null);
  const diskRef = useRef<HTMLDivElement>(null);
  const dockTargetRef = useRef<HTMLDivElement>(null);
  const dockedNameRef = useRef<HTMLDivElement>(null);
  const tlRef = useRef<gsap.core.Timeline | null>(null);

  useGSAP(
    () => {
      const root = rootRef.current;
      const cluster = clusterRef.current;
      const circle = circleRef.current;
      const mark = markRef.current;
      const name = nameRef.current;
      const disk = diskRef.current;
      const dockTarget = dockTargetRef.current;
      const dockedName = dockedNameRef.current;
      if (!root || !cluster || !circle || !mark || !name || !disk || !dockTarget || !dockedName) {
        return;
      }

      // Read stage text colors from CSS custom properties at runtime —
      // stays in sync with globals.css automatically, no hex drift risk
      const rootStyle = getComputedStyle(document.documentElement);
      const stageColor = rootStyle.getPropertyValue("--color-stage-text").trim();
      const stageMuted = rootStyle.getPropertyValue("--color-stage-text-muted").trim();

      document.body.style.overflow = "hidden";
      const finish = (): void => {
        document.body.style.overflow = "";
        gsap.set(root, { display: "none" });
      };

      const keepChars = gsap.utils.toArray<HTMLSpanElement>(".loader-char-keep .char-glyph");
      const restChars = gsap.utils.toArray<HTMLSpanElement>(".loader-char-rest .char-glyph");
      const allChars = [...keepChars, ...restChars];

      // Distance the cluster starts shifted right by, so the dot is visually
      // dead-center before it slides left to make room for the name.
      const startShiftX = name.offsetWidth / 2 + NAME_GAP_PX / 2;

      const tl = gsap.timeline({ onComplete: finish });
      tlRef.current = tl;

      // ── Initial states (at position 0 so REPLAY restores everything) ──
      // Masks carry a static `opacity-0` class as a pre-JS paint guard;
      // this set lifts them in the same tick the glyphs are parked below
      // their masks, so no text is ever visible before its rise.
      tl.set(cluster, { x: startShiftX }, 0)
        .set(circle, { scale: 0, opacity: 1 }, 0)
        .set(mark, { x: 0, y: 0, scale: 0.9, opacity: 0, transformOrigin: "50% 50%" }, 0)
        .set(disk, { x: 0, y: 0, scale: 1, opacity: 1 }, 0)
        .set(".loader-char", { opacity: 1, scale: 1 }, 0)
        .set(allChars, { y: "108%", opacity: 0, color: stageColor }, 0)
        .set(dockedName, { opacity: 0 }, 0)

        // Phase 1 — dot scales in, slowly (0.9s) on the white stage
        .to(circle, { scale: 1, duration: 0.9, ease: "power3.out" }, 0.2)
        .to({}, { duration: 0.4 })

        // Phase 2 — circle slides left, logo feeds in riding with it
        .to(cluster, { x: 0, duration: 0.6, ease: "power2.inOut" })
        .to(mark, { opacity: 1, scale: 1, duration: 0.45, ease: "power2.out" }, "-=0.45")
        .to({}, { duration: 0.3 })

        // Phase 3 — masked letters rise, slow readable stagger
        // (GSAP owns all transforms — no Tailwind transform utilities
        // on animated elements)
        .to(allChars, { y: "0%", opacity: 1, stagger: 0.09, duration: 0.5, ease: "power3.out" })
        .to({}, { duration: 0.3 })

        // Phase 4 — editorial pulse across every letter
        .to(allChars, { color: stageMuted, duration: 0.25, ease: "power1.inOut" })
        .to(allChars, { color: stageColor, duration: 0.25, ease: "power1.inOut" })

        // Phase 5 — "SHEK" mutes then dissolves as one group; "ABHI" never moves
        .to(restChars, { color: stageMuted, duration: 0.15 }, "+=0.1")
        .to(
          ".loader-char-rest",
          { opacity: 0, scale: 0.96, duration: 0.6, ease: "power2.out" },
          "-=0.05"
        )

        // Phase 6 — deliberate hold before the expansion
        .to({}, { duration: 0.4 })

        // Phase 7 — iris expansion + logo flight.
        // The disk is the site's dark bg color growing from the circle's
        // center: it swallows the white stage and the letters behind it
        // (z-30 over their z-10), "applying" the page background as it
        // expands. The mark (cluster z-40) stays visible while it flies.
        .add(() => {
          const circleRect = circle.getBoundingClientRect();
          const centerX = circleRect.left + circleRect.width / 2;
          const centerY = circleRect.top + circleRect.height / 2;
          const maxRadius = Math.hypot(
            Math.max(centerX, window.innerWidth - centerX),
            Math.max(centerY, window.innerHeight - centerY)
          );

          gsap.set(disk, {
            left: circleRect.left,
            top: circleRect.top,
            width: circleRect.width,
            height: circleRect.height,
          });
          gsap.to(disk, {
            scale: (maxRadius / (circleRect.width / 2)) * 1.15,
            duration: 0.9,
            ease: "power4.inOut",
          });

          const startRect = mark.getBoundingClientRect();
          const endRect = dockTarget.getBoundingClientRect();
          gsap.set(mark, { transformOrigin: "top left" });
          gsap.to(mark, {
            x: endRect.left - startRect.left,
            y: endRect.top - startRect.top,
            scale: endRect.width / startRect.width,
            duration: 0.9,
            ease: "power4.inOut",
          });
        })
        .to(circle, { opacity: 0, duration: 0.3 }, "<")
        .to(".loader-char-keep", { opacity: 0, duration: 0.5, ease: "power2.out" }, "<")
        .to({}, { duration: 0.9 })

        // Phase 8 — fresh, correctly-sized nickname fades in beside the
        // landed mark on the now-dark stage
        .to(dockedName, { opacity: 1, duration: 0.4, ease: "power2.out" }, "+=0.25")
        .to({}, { duration: 0.15 });

      return (): void => {
        tl.kill();
      };
    },
    { scope: rootRef }
  );

  return (
    <div
      ref={rootRef}
      className="fixed inset-0 z-loader flex items-center justify-center overflow-hidden"
      style={{
        // Opening stage: white with a barely-visible pinkish gradient at
        // the corners — applied inline so it renders from the very first
        // (server-side) frame, before any JS runs.
        background: "#FFFFFF",
        backgroundImage:
          "radial-gradient(55% 55% at 0% 0%, rgba(244, 172, 197, 0.14), transparent 70%)," +
          "radial-gradient(55% 55% at 100% 0%, rgba(244, 172, 197, 0.12), transparent 70%)," +
          "radial-gradient(55% 55% at 0% 100%, rgba(244, 172, 197, 0.12), transparent 70%)," +
          "radial-gradient(55% 55% at 100% 100%, rgba(244, 172, 197, 0.14), transparent 70%)",
      }}
      aria-hidden="true"
    >
      {/* Iris-expansion disk — same dark color as the site's bg-primary, so
          when it swallows the white stage it IS the page background
          appearing. Geometry + scale driven entirely by GSAP at runtime.
          z-30: above the name text (z-10), below the cluster (z-40). */}
      <div
        ref={diskRef}
        className="pointer-events-none fixed z-30 rounded-full bg-bg-primary"
      />

      <div className="flex items-center gap-4">
        {/* Cluster slides as one unit — the mark rides the slide for free.
            z-40 keeps the mark above the expanding disk (z-30). Circle is
            bg-primary: dark on the white stage, then invisible against the
            expanded disk. */}
        <div ref={clusterRef} className="relative z-40 flex h-28 w-28 items-center justify-center">
          <div ref={circleRef} className="absolute inset-0 rounded-full bg-bg-primary" />
          <LogoMark
            ref={markRef}
            className="relative h-14 w-14"
            fillColor="var(--color-accent-primary)"
            style={{ filter: "drop-shadow(0 0 12px var(--color-accent-glow))" }}
          />
        </div>

        {/* z-10: below the iris disk — the letters get swallowed behind it.
            Dark text for the white opening stage. */}
        <div
          ref={nameRef}
          className="relative z-10 flex items-baseline font-body text-display-lg font-bold uppercase tracking-label"
          style={{ color: "var(--color-stage-text)" }}
        >
          {OWNER_NAME.split("").map((char, i) => {
            const isKeep = i < OWNER_NICKNAME.length;
            return (
              <span
                key={i}
                className={`loader-char inline-block overflow-hidden pb-[0.08em] pr-[0.04em] align-baseline opacity-0 ${
                  isKeep ? "loader-char-keep" : "loader-char-rest"
                }`}
              >
                <span className="char-glyph inline-block">{char}</span>
              </span>
            );
          })}
        </div>
      </div>

      {/* Invisible future-Nav dock slot: the mark flies here, the fresh name
          fades in beside it once the stage is dark. When the real Nav is
          built, its logo slot coordinates must replace left-6 top-6. z-40
          keeps both above the disk. */}
      <div className="pointer-events-none fixed left-6 top-6 z-40 flex h-8 items-center gap-3">
        <div ref={dockTargetRef} className="h-8 w-8" />
        <div
          ref={dockedNameRef}
          className="font-body text-heading-md font-bold uppercase tracking-label text-text-primary opacity-0"
        >
          {OWNER_NICKNAME}
        </div>
      </div>

      {process.env.NODE_ENV === "development" && (
        <DevControls tlRef={tlRef} rootRef={rootRef} />
      )}
    </div>
  );
}

// Dev-only playback controls — never rendered in production builds
function DevControls({
  tlRef,
  rootRef,
}: {
  tlRef: React.RefObject<gsap.core.Timeline | null>;
  rootRef: React.RefObject<HTMLDivElement | null>;
}): React.ReactElement {
  return (
    <div className="pointer-events-auto fixed bottom-4 right-4 z-[60] flex gap-2 text-xs">
      <button
        type="button"
        onClick={() => tlRef.current?.progress(1)}
        className="rounded-full bg-black/10 px-3 py-1.5 text-black"
      >
        SKIP
      </button>
      <button
        type="button"
        onClick={() => {
          if (rootRef.current) rootRef.current.style.display = "flex";
          tlRef.current?.restart();
        }}
        className="rounded-full bg-black/10 px-3 py-1.5 text-black"
      >
        REPLAY
      </button>
    </div>
  );
}
