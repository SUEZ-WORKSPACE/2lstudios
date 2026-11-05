"use client";
import { useEffect, useRef, useState } from "react";
import { videos, type VideoKey } from "@/content/site";

/** Estática de televisão, desenhada em baixa resolução e só quando visível. */
export function TvStatic() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const c = ref.current!;
    const ctx = c.getContext("2d");
    if (!ctx) return;
    const W = (c.width = 192);
    const H = (c.height = 108);
    const img = ctx.createImageData(W, H);
    let visible = false;
    let raf = 0;
    let last = 0;
    const draw = (t: number) => {
      if (!visible) return;
      raf = requestAnimationFrame(draw);
      if (t - last < 70) return;
      last = t;
      const d = img.data;
      for (let i = 0; i < d.length; i += 4) {
        const v = 18 + Math.random() * 78;
        d[i] = d[i + 1] = d[i + 2] = v;
        d[i + 3] = 255;
      }
      ctx.putImageData(img, 0, 0);
    };
    const io = new IntersectionObserver(([e]) => {
      visible = e.isIntersecting;
      cancelAnimationFrame(raf);
      if (visible) raf = requestAnimationFrame(draw);
    });
    io.observe(c);
    return () => {
      io.disconnect();
      cancelAnimationFrame(raf);
    };
  }, []);

  return <canvas ref={ref} aria-hidden="true" />;
}

function NoSignal({ n, hint }: { n: string; hint: string }) {
  return (
    <div className="nosignal">
      <TvStatic />
      <div className="nosignal-tag mono">
        <strong>Sem sinal</strong>
        <span>Vídeo {n}</span>
        <span>{hint}</span>
      </div>
    </div>
  );
}

export function VideoSlot({ slot, className }: { slot: VideoKey; className?: string }) {
  const { src, poster, n, hint } = videos[slot];
  const ref = useRef<HTMLVideoElement>(null);
  const [muted, setMuted] = useState(true);
  const [missing, setMissing] = useState(false);

  useEffect(() => {
    const v = ref.current;
    if (!v) return;
    // O erro pode ter disparado antes de o React ligar o onError.
    if (v.error) setMissing(true);
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) v.play().catch(() => {});
        else v.pause();
      },
      { threshold: 0.2 },
    );
    io.observe(v);
    return () => io.disconnect();
  }, [src]);

  if (!src || missing) {
    return (
      <div className={`slot ${className ?? ""}`}>
        <NoSignal n={n} hint={hint} />
      </div>
    );
  }

  return (
    <div className={`slot ${className ?? ""}`} data-cursor={muted ? "Ligar som" : "Tirar som"}>
      <video
        ref={ref}
        src={src}
        poster={poster || undefined}
        muted={muted}
        loop
        playsInline
        preload="metadata"
        onClick={() => setMuted((m) => !m)}
        onError={() => setMissing(true)}
      />
    </div>
  );
}
