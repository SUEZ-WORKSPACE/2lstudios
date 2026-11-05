"use client";
import { useRef } from "react";
import Link from "next/link";
import { gsap, useGSAP } from "@/lib/gsap";
import { Cursor } from "./Cursor";
import { LogoMark } from "./Logo";
import { TvStatic } from "./VideoSlot";
import { Viewfinder } from "./Viewfinder";

export function LostScene() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      // Película mal presa no projetor: o número treme e salta de vez em quando.
      gsap.to(".nf-num", {
        keyframes: { x: [0, -3, 2, -1, 3, 0], y: [0, 2, -2, 1, -1, 0] },
        duration: 0.5,
        ease: "steps(1)",
        repeat: -1,
      });
      gsap.timeline({ repeat: -1, repeatDelay: 2.6 })
        .set(".nf-num", { yPercent: -7, skewX: -5 })
        .set(".nf-num", { yPercent: 5, skewX: 3 }, 0.08)
        .set(".nf-num", { yPercent: 0, skewX: 0 }, 0.16);
      gsap.from(".nf-copy > *", { autoAlpha: 0, y: 18, duration: 0.9, ease: "power3.out", stagger: 0.1, delay: 0.15 });
    },
    { scope: root },
  );

  return (
    <>
      <header className="nav">
        <Link href="/" className="nav-logo" data-focus aria-label="2L Studio, início">
          <LogoMark />
        </Link>
      </header>
      <main className="nf" ref={root} data-scene="404 / Cena cortada">
        <div className="nf-static">
          <TvStatic />
        </div>
        <span className="nf-num" aria-hidden="true">404</span>
        <div className="nf-copy">
          <h1>Esta cena ficou na sala de montagem.</h1>
          <p>A página que procuras não existe ou mudou de lugar.</p>
          <Link href="/" className="nf-back" data-focus>
            Voltar à primeira cena
          </Link>
        </div>
      </main>
      <Viewfinder label="404 / Cena cortada" />
      <Cursor />
    </>
  );
}
