"use client";
import { useRef } from "react";
import { process } from "@/content/site";
import { gsap, useGSAP } from "@/lib/gsap";

export function Process() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(min-width: 900px)", () => {
        const track = root.current!.querySelector<HTMLElement>(".pr-track")!;
        gsap.to(track, {
          x: () => -(track.scrollWidth - innerWidth),
          ease: "none",
          scrollTrigger: {
            trigger: root.current,
            start: "top top",
            end: () => `+=${track.scrollWidth - innerWidth}`,
            pin: true,
            scrub: 0.6,
            invalidateOnRefresh: true,
          },
        });
      });
    },
    { scope: root },
  );

  return (
    <section className="pr" ref={root} id="processo" data-scene="05 / Rodagem">
      <div className="pr-track">
        <div className="pr-intro">
          <span className="mono">Do briefing à estreia</span>
          <h2>Cinco fotogramas até à estreia.</h2>
        </div>
        <ol className="pr-strip">
          {process.map((p, i) => (
            <li className={`pr-frame${i % 2 ? " neg" : ""}`} key={p.n}>
              <span className="mono pr-n">{p.n}A</span>
              <h3>{p.title}</h3>
              <p>{p.text}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
