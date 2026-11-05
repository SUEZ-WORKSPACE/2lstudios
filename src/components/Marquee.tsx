"use client";
import { useRef } from "react";
import { gsap, ScrollTrigger, useGSAP } from "@/lib/gsap";
import { Tri } from "./Logo";

const WORDS = ["Audiovisual", "Comunicação", "Marketing digital", "Branding", "Design", "Fotografia", "Redes sociais", "Publicidade"];

export function Marquee() {
  const root = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const tween = gsap.to(".mq-track", { xPercent: -50, duration: 38, ease: "none", repeat: -1 });
      const st = ScrollTrigger.create({
        trigger: root.current,
        start: "top bottom",
        end: "bottom top",
        onUpdate(self) {
          const v = self.getVelocity() / 260;
          gsap.to(tween, {
            timeScale: gsap.utils.clamp(-7, 7, v === 0 ? 1 : v),
            duration: 0.2,
            overwrite: true,
            onComplete: () => {
              gsap.to(tween, { timeScale: 1, duration: 1 });
            },
          });
        },
      });
      return () => st.kill();
    },
    { scope: root },
  );

  const row = (key: string, hidden?: boolean) =>
    WORDS.map((w) => (
      <span className="mq-item" key={key + w} aria-hidden={hidden || undefined}>
        {w}
        <Tri className="mq-tri" />
      </span>
    ));

  return (
    <div className="mq paper" ref={root}>
      <div className="mq-track">
        {row("a")}
        {row("b", true)}
      </div>
    </div>
  );
}
