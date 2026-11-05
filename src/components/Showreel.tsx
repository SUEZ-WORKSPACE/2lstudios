"use client";
import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { VideoSlot } from "./VideoSlot";

export function Showreel() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const tl = gsap.timeline({
        defaults: { ease: "none" },
        scrollTrigger: { trigger: root.current, start: "top top", end: "+=170%", pin: true, scrub: 0.6 },
      });
      tl.fromTo(".reel-frame", { clipPath: "inset(29% 31%)" }, { clipPath: "inset(0% 0%)", duration: 1 }, 0)
        .fromTo(".reel-frame .slot", { scale: 1.3 }, { scale: 1, duration: 1 }, 0)
        .fromTo(".reel-word.l", { xPercent: 0 }, { xPercent: -60, duration: 0.8 }, 0)
        .fromTo(".reel-word.r", { xPercent: 0 }, { xPercent: 60, duration: 0.8 }, 0)
        .to(".reel-word", { autoAlpha: 0, duration: 0.35 }, 0.45)
        .to({}, { duration: 0.25 });
    },
    { scope: root },
  );

  return (
    <section className="reel" ref={root} id="showreel" data-scene="02 / Showreel">
      <div className="reel-frame">
        <VideoSlot slot="showreel" />
      </div>
      <div className="reel-words" aria-hidden="true">
        <span className="reel-word l">Show</span>
        <span className="reel-word r">reel</span>
      </div>
      <h2 className="sr-only">Showreel da 2L Studio</h2>
    </section>
  );
}
