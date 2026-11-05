"use client";
import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";

const LINES = [
  "Há empresas muito boas que ninguém conhece.",
  "O problema nunca foi a empresa.",
  "Foi a imagem.",
  "Pedidos e aniversários ficam para outros. Aqui, filmamos marcas.",
];

const SCALE = ["∞", "10", "5", "3", "2", "1.5", "1", "0.7"];

export function Manifesto() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const parts = gsap.utils.toArray<HTMLElement>(".mf-line");
      const OUT = { filter: "blur(9px)", opacity: 0.16 };
      const IN = { filter: "blur(0px)", opacity: 1 };
      gsap.set(parts, OUT);

      const tl = gsap.timeline({
        defaults: { ease: "power1.inOut", duration: 1 },
        scrollTrigger: { trigger: root.current, start: "top top", end: `+=${parts.length * 90}%`, pin: true, scrub: 0.5 },
      });

      parts.forEach((p, i) => {
        tl.to(p, IN, i * 1.6);
        if (i < parts.length - 1) tl.to(p, OUT, i * 1.6 + 1.3);
      });
      tl.fromTo(".mf-needle", { top: "0%" }, { top: "100%", ease: "none", duration: tl.duration() }, 0);
    },
    { scope: root },
  );

  return (
    <section className="mf paper" ref={root} id="manifesto" data-scene="03 / Foco">
      <p className="mf-text">
        {LINES.map((l) => (
          <span className="mf-line" key={l}>
            {l}{" "}
          </span>
        ))}
      </p>
      <div className="mf-scale mono" aria-hidden="true">
        <i className="mf-needle" />
        {SCALE.map((s) => (
          <span key={s}>{s}</span>
        ))}
      </div>
    </section>
  );
}
