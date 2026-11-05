"use client";
import { useRef } from "react";
import { motion } from "motion/react";
import { posters } from "@/content/site";
import { CAMERA, ELL, TWO } from "./Logo";
import { VideoSlot } from "./VideoSlot";

const LAYOUT = [
  { left: "5%", top: "5%", rotate: -7 },
  { left: "39%", top: "7%", rotate: 4 },
  { left: "6%", top: "52%", rotate: 5 },
  { left: "60%", top: "40%", rotate: -4 },
];

function Art({ variant }: { variant: (typeof posters)[number]["variant"] }) {
  if (variant === "tri")
    return (
      <svg viewBox="470 150 110 160" preserveAspectRatio="xMidYMid slice" fill="currentColor">
        <path d={CAMERA} />
      </svg>
    );
  if (variant === "two")
    return (
      <svg viewBox="290 150 110 150" preserveAspectRatio="xMidYMid slice" fill="currentColor">
        <path d={TWO} />
      </svg>
    );
  if (variant === "ell")
    return (
      <svg viewBox="415 200 110 160" preserveAspectRatio="xMidYMid slice" fill="currentColor">
        <path d={ELL} />
      </svg>
    );
  return (
    <svg viewBox="0 0 400 400" fill="currentColor">
      {Array.from({ length: 16 }, (_, i) => {
        const x = (i % 4) * 100;
        const y = Math.floor(i / 4) * 100;
        const flip = i === 5 || i === 10;
        return (
          <g key={i} transform={`translate(${x + 18} ${y + 14}) scale(0.78) translate(-485 -172)`} opacity={flip ? 1 : 0.22}>
            <path d={CAMERA} />
          </g>
        );
      })}
    </svg>
  );
}

export function Table() {
  const table = useRef<HTMLDivElement>(null);

  return (
    <section className="tb paper" id="artes" data-scene="07 / Design e redes">
      <header className="tb-head">
        <h2>Em cima da mesa, e no teu feed.</h2>
        <p>
          Design e redes sociais saem da mesma equipa que filma. A marca fica igual em todo o lado.
          Pega nas peças. Mexe.
        </p>
      </header>
      <div className="tb-grid">
        <div className="tb-phone">
          <VideoSlot slot="social" />
        </div>
        <div className="tb-table" ref={table}>
          {posters.map((p, i) => (
            <motion.article
              key={p.id}
              className={`poster${i % 2 ? " inv" : ""}`}
              style={LAYOUT[i]}
              drag
              dragConstraints={table}
              dragElastic={0.12}
              dragTransition={{ bounceStiffness: 260, bounceDamping: 22 }}
              whileHover={{ scale: 1.03 }}
              whileDrag={{ scale: 1.08, rotate: 0, zIndex: 5 }}
              data-cursor="Arrastar"
            >
              <div className="poster-art">
                {p.image ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={p.image} alt={p.line} draggable={false} />
                ) : (
                  <Art variant={p.variant} />
                )}
              </div>
              <div className="poster-txt">
                <strong>{p.line}</strong>
                <span className="mono">{p.sub}</span>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
