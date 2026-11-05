"use client";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { getLenis } from "./SmoothScroll";
import { LogoMark } from "./Logo";

const LINKS = [
  { href: "#showreel", label: "Showreel" },
  { href: "#servicos", label: "Serviços" },
  { href: "#processo", label: "Processo" },
  { href: "#artes", label: "Design e redes" },
  { href: "#contacto", label: "Contacto" },
];

export function Nav() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (open) getLenis()?.stop();
    else if (!document.documentElement.classList.contains("is-loading")) getLenis()?.start();
  }, [open]);

  return (
    <>
      <header className="nav">
        <a href="#inicio" className="nav-logo" data-focus aria-label="2L Studio, início" onClick={() => setOpen(false)}>
          <LogoMark />
        </a>
        <button type="button" className="nav-btn mono" data-focus aria-expanded={open} onClick={() => setOpen((o) => !o)}>
          {open ? "Fechar" : "Menu"}
        </button>
      </header>
      <AnimatePresence>
        {open && (
          <motion.nav
            className="menu"
            initial={{ clipPath: "inset(0 0 100% 0)" }}
            animate={{ clipPath: "inset(0 0 0% 0)" }}
            exit={{ clipPath: "inset(100% 0 0% 0)" }}
            transition={{ duration: 0.7, ease: [0.76, 0, 0.24, 1] }}
          >
            <ul>
              {LINKS.map((l, i) => (
                <li key={l.href}>
                  <motion.a
                    href={l.href}
                    data-focus
                    onClick={() => setOpen(false)}
                    initial={{ y: "110%" }}
                    animate={{ y: 0 }}
                    transition={{ duration: 0.8, delay: 0.2 + i * 0.06, ease: [0.16, 1, 0.3, 1] }}
                  >
                    {l.label}
                  </motion.a>
                </li>
              ))}
            </ul>
          </motion.nav>
        )}
      </AnimatePresence>
    </>
  );
}
