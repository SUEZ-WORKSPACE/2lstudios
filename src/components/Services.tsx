"use client";
import { useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { about, services } from "@/content/site";
import { gsap, SplitText, useGSAP } from "@/lib/gsap";
import { Tri } from "./Logo";

export function Services() {
  const [open, setOpen] = useState(0);
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const split = SplitText.create(".sv-head h2", { type: "lines", mask: "lines", linesClass: "ln" });
      gsap.from(split.lines, {
        yPercent: 110,
        duration: 1.1,
        ease: "expo.out",
        stagger: 0.1,
        scrollTrigger: { trigger: ".sv-head", start: "top 80%" },
      });
      gsap.from(".sv-row", {
        y: 40,
        autoAlpha: 0,
        duration: 0.9,
        ease: "power3.out",
        stagger: 0.07,
        scrollTrigger: { trigger: ".sv-list", start: "top 85%" },
      });
      return () => split.revert();
    },
    { scope: root },
  );

  return (
    <section className="sv paper" ref={root} id="servicos" data-scene="04 / Serviços">
      <header className="sv-head">
        <span className="mono">Lista de planos</span>
        <div>
          <h2>Oito frentes. Uma só equipa.</h2>
          <p className="sv-about">{about.body}</p>
        </div>
      </header>
      <ul className="sv-list">
        {services.map((s, i) => {
          const isOpen = open === i;
          return (
            <li className={`sv-row${isOpen ? " is-open" : ""}`} key={s.take}>
              <button
                type="button"
                className="sv-btn"
                aria-expanded={isOpen}
                onClick={() => setOpen(isOpen ? -1 : i)}
                onPointerEnter={(e) => e.pointerType === "mouse" && setOpen(i)}
                data-focus
              >
                <span className="mono sv-take">{s.take}</span>
                <span className="sv-name">{s.name}</span>
                <Tri className="sv-tri" />
              </button>
              <AnimatePresence initial={false}>
                {isOpen && (
                  <motion.div
                    className="sv-body"
                    initial={{ height: 0 }}
                    animate={{ height: "auto" }}
                    exit={{ height: 0 }}
                    transition={{ duration: 0.55, ease: [0.76, 0, 0.24, 1] }}
                  >
                    <div className="sv-inner">
                      <p>{s.text}</p>
                      <ul className="mono">
                        {s.items.map((it) => (
                          <li key={it}>{it}</li>
                        ))}
                      </ul>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
