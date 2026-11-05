"use client";
import { useEffect, useRef } from "react";
import { gsap, SplitText, useGSAP } from "@/lib/gsap";
import { onIntroDone } from "@/lib/intro";
import { about } from "@/content/site";

type Lens = ReturnType<typeof import("./lensScene").createLens>;

export function Hero() {
  const root = useRef<HTMLElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);
  const lens = useRef<Lens | null>(null);
  const progress = useRef(0);

  useEffect(() => {
    let alive = true;
    let cancelIntro = () => {};
    let removePointer = () => {};

    import("./lensScene").then(({ createLens }) => {
      if (!alive || !canvas.current) return;
      const l = createLens(canvas.current);
      l.state.progress = progress.current;
      lens.current = l;

      cancelIntro = onIntroDone(() => gsap.to(l.state, { open: 1, duration: 2.1, ease: "expo.out" }));

      const move = (e: PointerEvent) =>
        l.setPointer((e.clientX / innerWidth) * 2 - 1, (e.clientY / innerHeight) * 2 - 1);
      window.addEventListener("pointermove", move, { passive: true });
      removePointer = () => window.removeEventListener("pointermove", move);
    });

    return () => {
      alive = false;
      cancelIntro();
      removePointer();
      lens.current?.dispose();
      lens.current = null;
    };
  }, []);

  useGSAP(
    () => {
      const lines = SplitText.create(".hero-title", { type: "lines", mask: "lines", linesClass: "ln" });
      gsap.set(lines.lines, { yPercent: 110 });
      gsap.set(".hero-foot > *", { autoAlpha: 0, y: 14 });

      const off = onIntroDone(() => {
        gsap.to(lines.lines, { yPercent: 0, duration: 1.3, ease: "expo.out", stagger: 0.11, delay: 0.15 });
        gsap.to(".hero-foot > *", { autoAlpha: 1, y: 0, duration: 0.9, ease: "power3.out", stagger: 0.1, delay: 0.7 });
      });

      // Uma só linha do tempo no pin: lente, título e fade andam juntos.
      gsap
        .timeline({
          defaults: { ease: "none" },
          scrollTrigger: {
            trigger: root.current,
            start: "top top",
            end: "+=140%",
            pin: true,
            scrub: true,
            onUpdate(self) {
              progress.current = self.progress;
              if (lens.current) lens.current.state.progress = self.progress;
            },
          },
        })
        .to(".hero-title", { yPercent: -18, autoAlpha: 0, ease: "power1.in", duration: 0.6 }, 0)
        .to(".hero-foot", { autoAlpha: 0, duration: 0.25 }, 0)
        .to(canvas.current, { autoAlpha: 0, ease: "power2.in", duration: 0.28 }, 0.72);

      return () => {
        off();
        lines.revert();
      };
    },
    { scope: root },
  );

  return (
    <section className="hero" ref={root} id="inicio" data-scene="01 / Abertura">
      <canvas ref={canvas} className="hero-canvas" aria-hidden="true" />
      <h1 className="hero-title">
        <span className="block">Quem não</span>
        <span className="block">é visto,</span>
        <span className="block">não é lembrado.</span>
      </h1>
      <div className="hero-foot">
        <p>
          {about.lead}
        </p>
        <span className="mono">Rola para fechar o diafragma</span>
      </div>
    </section>
  );
}
