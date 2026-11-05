"use client";
import { useRef, useState, type FormEvent } from "react";
import { animate, svg } from "animejs";
import { contact, services } from "@/content/site";
import { ScrollTrigger, useGSAP } from "@/lib/gsap";
import { CAMERA, ELL, MARK_VIEWBOX, TWO } from "./Logo";

const STRIPES = Array.from({ length: 12 }, (_, i) => i);

function Stick({ className }: { className: string }) {
  return (
    <svg className={className} viewBox="0 0 600 44" preserveAspectRatio="none" aria-hidden="true">
      <rect width="600" height="44" fill="#fff" />
      {STRIPES.map((i) => (
        <polygon key={i} points={`${i * 56 - 22},44 ${i * 56 + 6},44 ${i * 56 + 34},0 ${i * 56 + 6},0`} fill="#231f20" />
      ))}
    </svg>
  );
}

export function Contact() {
  const root = useRef<HTMLElement>(null);
  const [sent, setSent] = useState(false);

  const clap = (then?: () => void) => {
    const stick = root.current!.querySelector(".cl-top");
    const board = root.current!.querySelector(".cl-board");
    animate(stick!, { rotate: [-17, 0], duration: 210, ease: "inQuad" });
    animate(board!, {
      translateY: [{ to: 7, duration: 60, delay: 200 }, { to: 0, duration: 340 }],
      ease: "outElastic(1, .4)",
      onComplete: () => then?.(),
    });
  };

  useGSAP(
    () => {
      const stick = root.current!.querySelector<HTMLElement>(".cl-top")!;
      stick.style.transform = "rotate(-17deg)";
      ScrollTrigger.create({ trigger: ".cl-board", start: "top 70%", once: true, onEnter: () => clap() });

      const drawables = svg.createDrawable(root.current!.querySelectorAll(".ft-mark path"));
      animate(drawables, { draw: "0 0", duration: 1 });
      ScrollTrigger.create({
        trigger: ".ft-mark",
        start: "top 90%",
        once: true,
        onEnter: () => {
          animate(drawables, { draw: "0 1", duration: 1800, ease: "inOutQuart" });
          animate(root.current!.querySelectorAll(".ft-mark path"), {
            fillOpacity: [0, 1],
            duration: 900,
            delay: 1300,
            ease: "outQuad",
          });
        },
      });
    },
    { scope: root },
  );

  const submit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    const body = [
      `Empresa: ${f.get("empresa")}`,
      `Serviço: ${f.get("servico")}`,
      `Contacto: ${f.get("contacto")}`,
      `Ideia: ${f.get("ideia") || "-"}`,
    ].join("\n");
    const url = `https://wa.me/${contact.whatsapp}?text=${encodeURIComponent(body)}`;

    const stick = root.current!.querySelector<HTMLElement>(".cl-top")!;
    animate(stick, {
      rotate: -17,
      duration: 260,
      ease: "outQuad",
      onComplete: () =>
        clap(() => {
          setSent(true);
          window.location.href = url;
        }),
    });
  };

  const today = new Intl.DateTimeFormat("pt-PT", { day: "2-digit", month: "2-digit", year: "numeric" }).format(new Date());

  return (
    <section className="ct" ref={root} id="contacto" data-scene="08 / Acção">
      <div className="ct-grid">
        <div className="ct-copy">
          <h2>
            Luz.
            <br />
            Câmara.
            <br />
            <em>Falta a tua marca.</em>
          </h2>
          <p>Preenche a claquete e carrega em Acção: a mensagem segue para o nosso WhatsApp. Respondemos com uma ideia, não com uma tabela de preços.</p>
          <div className="ct-links mono">
            <a href={`https://wa.me/${contact.whatsapp}`} target="_blank" rel="noreferrer" data-focus>WhatsApp {contact.whatsappLabel}</a>
            <a href={contact.instagram} data-focus>Instagram</a>
            <a href={contact.facebook} data-focus>Facebook</a>
            <a href={contact.linkedin} data-focus>LinkedIn</a>
          </div>
        </div>

        <form className="cl-board" onSubmit={submit}>
          <div className="cl-sticks">
            <Stick className="cl-top" />
            <Stick className="cl-bottom" />
          </div>
          <div className="cl-body">
            <label className="cl-wide">
              <span className="mono">Produção</span>
              <input name="empresa" required placeholder="Nome da empresa" autoComplete="organization" />
            </label>
            <label>
              <span className="mono">Serviço</span>
              <select name="servico" defaultValue={services[0].name}>
                {services.map((s) => (
                  <option key={s.take}>{s.name}</option>
                ))}
              </select>
            </label>
            <label>
              <span className="mono">Contacto</span>
              <input name="contacto" required placeholder="Telefone ou email" />
            </label>
            <label className="cl-wide">
              <span className="mono">A ideia</span>
              <textarea name="ideia" rows={2} placeholder="O que precisas de mostrar?" />
            </label>
            <div className="cl-meta mono">
              <span>Dir. 2L Studio</span>
              <span suppressHydrationWarning>Data {today}</span>
              <span>Cena 01 · Take 01</span>
            </div>
            <button className="cl-go" type="submit" data-focus>
              {sent ? "Corta! A abrir o WhatsApp" : "Acção"}
            </button>
          </div>
        </form>
      </div>

      <footer className="ft">
        <svg className="ft-mark" viewBox={MARK_VIEWBOX} role="img" aria-label="2L Studio">
          <path d={TWO} />
          <path d={ELL} />
          <path d={CAMERA} />
        </svg>
        <div className="ft-row mono">
          <span>© {new Date().getFullYear()} 2L Studio</span>
          <span>Fim de bobina</span>
          <a href="https://suez.co.ao" target="_blank" rel="noopener" data-focus>
            Desenvolvido por Suez Inovações
          </a>
          <a href="#inicio" data-focus>Rebobinar</a>
        </div>
      </footer>
    </section>
  );
}
