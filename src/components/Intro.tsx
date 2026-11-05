"use client";
import { useRef, useState } from "react";
import { animate, createTimeline, svg, stagger } from "animejs";
import { gsap, useGSAP } from "@/lib/gsap";
import { finishIntro } from "@/lib/intro";
import { getLenis } from "./SmoothScroll";
import { CAMERA, ELL, FULL_VIEWBOX, LETTERS, TWO } from "./Logo";

/** Contagem de película (3, 2, 1), desenho do logo e o obturador a abrir. */
export function Intro() {
  const root = useRef<HTMLDivElement>(null);
  const [gone, setGone] = useState(false);

  useGSAP(
    () => {
      const el = root.current!;
      const num = el.querySelector<HTMLElement>(".in-num")!;
      let finished = false;

      const open = () => {
        if (finished) return;
        finished = true;
        tl.pause();
        finishIntro();
        getLenis()?.start();
        document.documentElement.classList.remove("is-loading");
        gsap
          .timeline({ onComplete: () => setGone(true) })
          .to(el.querySelector(".in-logo"), { autoAlpha: 0, scale: 1.04, duration: 0.3, ease: "power2.in" })
          .to(el.querySelector(".in-lid.t"), { yPercent: -100, duration: 1, ease: "expo.inOut" }, 0.12)
          .to(el.querySelector(".in-lid.b"), { yPercent: 100, duration: 1, ease: "expo.inOut" }, 0.12);
      };

      document.documentElement.classList.add("is-loading");
      getLenis()?.stop();

      const drawables = svg.createDrawable(el.querySelectorAll(".in-draw"));
      const sweep = svg.createDrawable(el.querySelector(".in-sweep")!);
      animate(sweep, { draw: "0 0", duration: 0 });
      const tl = createTimeline({ autoplay: false, onComplete: open });
      const beat = 420;

      tl.add(sweep, { draw: ["0 0", "0 1"], duration: beat * 3, ease: "linear" }, 0);
      [3, 2, 1].forEach((n, i) => {
        tl.call(() => { num.textContent = String(n); }, i * beat);
      });
      tl.add(el.querySelector(".in-leader")!, { opacity: 0, duration: 120, ease: "linear" }, beat * 3)
        .add(el.querySelector(".in-logo")!, { opacity: [0, 1], duration: 1 }, beat * 3 + 40)
        .add(drawables, { draw: ["0 0", "0 1"], duration: 800, ease: "inOutQuart", delay: stagger(90) }, beat * 3 + 60)
        .add(el.querySelectorAll(".in-draw"), { fillOpacity: [0, 1], duration: 340, ease: "outQuad" }, beat * 3 + 700)
        .add(el.querySelectorAll(".in-letter"), { opacity: [0, 1], translateY: [8, 0], duration: 420, delay: stagger(40), ease: "outExpo" }, beat * 3 + 760)
        .add({}, { duration: 260 });

      const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (reduced) {
        finished = true;
        finishIntro();
        getLenis()?.start();
        document.documentElement.classList.remove("is-loading");
        setGone(true);
      } else {
        tl.play();
      }

      el.addEventListener("click", open);
      return () => {
        tl.pause();
        document.documentElement.classList.remove("is-loading");
      };
    },
    { scope: root },
  );

  if (gone) return null;

  return (
    <div className="in" ref={root} aria-hidden="true">
      <i className="in-lid t" />
      <i className="in-lid b" />
      <div className="in-leader">
        <i className="in-h" />
        <i className="in-v" />
        <svg viewBox="0 0 200 200">
          <circle cx="100" cy="100" r="96" />
          <circle cx="100" cy="100" r="78" />
          <circle className="in-sweep" cx="100" cy="100" r="48" pathLength={1} transform="rotate(-90 100 100)" />
        </svg>
        <span className="in-num">3</span>
      </div>
      <svg className="in-logo" viewBox={FULL_VIEWBOX}>
        <path className="in-draw" d={TWO} />
        <path className="in-draw" d={ELL} />
        <path className="in-draw" d={CAMERA} />
        {LETTERS.map((d) => (
          <path className="in-letter" key={d} fillRule="evenodd" d={d} />
        ))}
      </svg>
    </div>
  );
}
