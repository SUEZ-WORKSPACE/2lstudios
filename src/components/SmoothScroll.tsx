"use client";
import { useEffect } from "react";
import Lenis from "lenis";
import { gsap, ScrollTrigger } from "@/lib/gsap";

let instance: Lenis | null = null;
export const getLenis = () => instance;

export function SmoothScroll() {
  useEffect(() => {
    const lenis = new Lenis({ lerp: 0.11, wheelMultiplier: 0.95 });
    instance = lenis;
    if (document.documentElement.classList.contains("is-loading")) lenis.stop();

    lenis.on("scroll", ScrollTrigger.update);
    const raf = (t: number) => lenis.raf(t * 1000);
    gsap.ticker.add(raf);
    gsap.ticker.lagSmoothing(0);

    const anchors = (e: MouseEvent) => {
      const a = (e.target as Element).closest?.('a[href^="#"]');
      const href = a?.getAttribute("href");
      if (!href || href === "#") return;
      e.preventDefault();
      lenis.scrollTo(href === "#inicio" ? 0 : href, { duration: 1.6 });
    };
    document.addEventListener("click", anchors);

    document.fonts?.ready.then(() => ScrollTrigger.refresh());

    return () => {
      document.removeEventListener("click", anchors);
      gsap.ticker.remove(raf);
      lenis.destroy();
      instance = null;
    };
  }, []);

  return null;
}
