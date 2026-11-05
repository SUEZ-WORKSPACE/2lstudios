"use client";
import { useRef } from "react";
import { animate, stagger } from "animejs";
import { crew } from "@/content/site";
import { gsap, ScrollTrigger, useGSAP } from "@/lib/gsap";
import { VideoSlot } from "./VideoSlot";

export function Spotlight() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      gsap.fromTo(
        ".sp-bar",
        { scaleY: 0 },
        {
          scaleY: 1,
          ease: "none",
          scrollTrigger: { trigger: ".sp-screen", start: "top 75%", end: "center center", scrub: true },
        },
      );
      const items = root.current!.querySelectorAll<HTMLElement>(".sp-crew li");
      gsap.set(items, { opacity: 0 });
      ScrollTrigger.create({
        trigger: ".sp-crew",
        start: "top 85%",
        once: true,
        onEnter: () => {
          animate(items, {
            opacity: [0, 1],
            translateY: [18, 0],
            duration: 800,
            ease: "outExpo",
            delay: stagger(70),
          });
        },
      });
    },
    { scope: root },
  );

  return (
    <section className="sp" ref={root} id="filme" data-scene="06 / Em destaque">
      <div className="sp-head">
        <h2>
          O filme que abre
          <br />
          a tua reunião.
        </h2>
        <p>
          Um institucional bem feito entra na sala antes de ti. Mostra a escala, a seriedade e o cuidado
          da empresa em menos tempo do que dura um café.
        </p>
      </div>
      <div className="sp-screen">
        <VideoSlot slot="destaque" />
        <i className="sp-bar top" />
        <i className="sp-bar bottom" />
      </div>
      <div className="sp-foot">
        <span className="mono">Ficha técnica</span>
        <ul className="sp-crew">
          {crew.map((c) => (
            <li key={c}>{c}</li>
          ))}
        </ul>
      </div>
    </section>
  );
}
