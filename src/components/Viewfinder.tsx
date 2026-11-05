"use client";
import { useEffect, useRef } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";

const FPS = 25;
const pad = (n: number) => String(n).padStart(2, "0");

/** O visor da câmara: o site inteiro é visto através dele. O timecode corre com o tempo e com o scroll. */
export function Viewfinder({ label = "01 / Abertura" }: { label?: string }) {
  const tc = useRef<HTMLSpanElement>(null);
  const scene = useRef<HTMLSpanElement>(null);
  const bar = useRef<HTMLElement>(null);

  useEffect(() => {
    const start = performance.now();
    const tick = () => {
      const frames = Math.floor(((performance.now() - start) / 1000) * FPS + window.scrollY * 0.5);
      const f = frames % FPS;
      const s = Math.floor(frames / FPS);
      if (tc.current) tc.current.textContent = `${pad(Math.floor(s / 3600))}:${pad(Math.floor(s / 60) % 60)}:${pad(s % 60)}:${pad(f)}`;
    };
    gsap.ticker.add(tick);

    const scenes = gsap.utils.toArray<HTMLElement>("[data-scene]");
    const progress = ScrollTrigger.create({
      start: 0,
      end: "max",
      onUpdate(self) {
        if (bar.current) bar.current.style.transform = `scaleX(${self.progress})`;
        // Lido do ecrã: secções fixadas contam correctamente enquanto estão presas.
        const mid = innerHeight / 2;
        let active = scenes[0];
        for (const el of scenes) if (el.getBoundingClientRect().top <= mid) active = el;
        const label = active.dataset.scene ?? "";
        if (scene.current && scene.current.textContent !== label) scene.current.textContent = label;
      },
    });

    return () => {
      gsap.ticker.remove(tick);
      progress.kill();
    };
  }, []);

  return (
    <>
      <div className="vf mono" aria-hidden="true">
        <i className="vf-c tl" /><i className="vf-c tr" /><i className="vf-c bl" /><i className="vf-c br" />
        <div className="vf-top">
          <span className="vf-rec">REC</span>
          <span ref={tc}>00:00:00:00</span>
        </div>
        <div className="vf-bottom">
          <span ref={scene}>{label}</span>
          <span className="vf-spec">4K · 25p · f/1.4 · ISO 800</span>
          <span className="vf-bat"><b ref={bar} /></span>
        </div>
      </div>
      <i className="vf-dot" aria-hidden="true" />
    </>
  );
}
