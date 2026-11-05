"use client";
import { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";

const SIZE = 34;
const PAD = 10;

/**
 * O cursor é o retículo de focagem de uma câmara.
 * Sobre [data-focus] trava à volta do elemento, como o autofoco num rosto.
 * Sobre [data-cursor] mostra uma etiqueta.
 */
export function Cursor() {
  const box = useRef<HTMLDivElement>(null);
  const dot = useRef<HTMLDivElement>(null);
  const label = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (!matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    document.documentElement.classList.add("has-cursor");

    const b = box.current!;
    const d = dot.current!;
    const cur = { x: innerWidth / 2, y: innerHeight / 2, w: SIZE, h: SIZE };
    const mouse = { x: cur.x, y: cur.y };
    let lock: Element | null = null;
    let seen = false;
    let lastText = "";
    gsap.set([b, d], { autoAlpha: 0 });

    const setLabel = (t: string) => {
      if (t === lastText) return;
      lastText = t;
      label.current!.textContent = t;
    };

    const move = (e: PointerEvent) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
      if (!seen) {
        seen = true;
        cur.x = mouse.x;
        cur.y = mouse.y;
        gsap.to([b, d], { autoAlpha: 1, duration: 0.3 });
      }
      const t = e.target as Element | null;
      lock = t?.closest?.("[data-focus]") ?? null;
      setLabel(t?.closest?.("[data-cursor]")?.getAttribute("data-cursor") ?? "");
    };

    const press = () => gsap.to(b, { scale: 0.86, duration: 0.12, overwrite: "auto" });
    const release = () => gsap.to(b, { scale: 1, duration: 0.35, ease: "back.out(3)", overwrite: "auto" });
    const leave = () => gsap.to([b, d], { autoAlpha: 0, duration: 0.2 });
    const enter = () => seen && gsap.to([b, d], { autoAlpha: 1, duration: 0.2 });

    const tick = () => {
      let tx = mouse.x;
      let ty = mouse.y;
      let tw = lastText ? SIZE * 2.3 : SIZE;
      let th = lastText ? SIZE * 2.3 : SIZE;
      let k = 0.28;
      if (lock && lock.isConnected) {
        const r = lock.getBoundingClientRect();
        tx = r.left + r.width / 2;
        ty = r.top + r.height / 2;
        tw = r.width + PAD * 2;
        th = r.height + PAD * 2;
        k = 0.2;
      }
      cur.x += (tx - cur.x) * k;
      cur.y += (ty - cur.y) * k;
      cur.w += (tw - cur.w) * k;
      cur.h += (th - cur.h) * k;
      b.style.width = `${cur.w}px`;
      b.style.height = `${cur.h}px`;
      gsap.set(b, { x: cur.x - cur.w / 2, y: cur.y - cur.h / 2 });
      gsap.set(d, { x: mouse.x, y: mouse.y });
      b.classList.toggle("is-lock", !!lock);
    };

    window.addEventListener("pointermove", move, { passive: true });
    window.addEventListener("pointerdown", press);
    window.addEventListener("pointerup", release);
    document.documentElement.addEventListener("pointerleave", leave);
    document.documentElement.addEventListener("pointerenter", enter);
    gsap.ticker.add(tick);

    return () => {
      document.documentElement.classList.remove("has-cursor");
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerdown", press);
      window.removeEventListener("pointerup", release);
      document.documentElement.removeEventListener("pointerleave", leave);
      document.documentElement.removeEventListener("pointerenter", enter);
      gsap.ticker.remove(tick);
    };
  }, []);

  return (
    <div className="cursor" aria-hidden="true">
      <div className="cursor-box" ref={box}>
        <i /><i /><i /><i />
        <span className="cursor-label mono" ref={label} />
      </div>
      <div className="cursor-dot" ref={dot} />
    </div>
  );
}
