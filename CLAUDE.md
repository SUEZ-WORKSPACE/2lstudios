# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

Marketing site for 2L Studio, an Angolan communication, marketing and audiovisual agency. One animated page plus a custom 404. Next.js App Router, static output, no backend.

@AGENTS.md

## Commands

```bash
npm run dev        # dev server on :3000; only one per project (a second one refuses to start)
npm run build      # production build, also type-checks
npx tsc --noEmit   # type-check only
```

There is no linter and no test suite. To verify a visual or scroll change, run the site and scroll through it in a browser.

## Project constraints (from the client)

- No shadcn, no lucide-react, no CSS or SVG gradients. Hard stripes use SVG polygons or patterns.
- It must not look AI-generated: no generic SaaS layouts, no stock copy such as "soluções" or "transformamos".
- Palette comes from the logo: ink `#231f20` and white. Red `--rec` is a small accent only (REC dot, a lens ring, hover on two buttons).
- Copy is Portuguese in the agency's pre-1990-agreement spelling: "Acção", "Direcção", "objectivos", "Actuamos".
- Do not invent statistics, clients or testimonials.
- Styling is plain CSS in `src/app/globals.css`. No Tailwind, no CSS modules.

## Architecture

**The concept is a camera viewfinder.** Sections are "scenes" (`data-scene="03 / Foco"`). `Viewfinder` reads which one is at mid-screen and shows it in the fixed HUD, next to a timecode driven by time plus scroll.

**Content lives in `src/content/site.ts`**: services, process steps, contacts and the WhatsApp number, posters, video slots. Change copy there rather than in components, except section headlines, which sit in their components.

**Videos need no code change.** `videos` in `site.ts` points each slot at a fixed filename in `public/videos`. `VideoSlot` falls back to the "Sem sinal" static if the file is missing or fails to load.

**Each animation library has a job:**
- GSAP + ScrollTrigger + SplitText: all scroll-driven work. Always import from `@/lib/gsap`, which registers the plugins.
- anime.js: SVG drawing and one-shots (`Intro`, clapper and footer logo in `Contact`, crew list in `Spotlight`).
- Motion: React-state UI (`Services` accordion, `Nav` overlay, draggable posters in `Table`).
- Three.js: only `components/lensScene.ts`, vanilla and not React. `Hero` loads it with a dynamic `import()` to keep it out of the initial bundle, then drives it through `lens.state.{open, progress}`.
- Lenis: smooth scroll in `SmoothScroll`, wired to ScrollTrigger and the GSAP ticker. Use `getLenis()` to stop or start it.

**Startup order:** `Intro` holds `html.is-loading` and stops Lenis, then calls `finishIntro()`. Anything that should wait for the intro subscribes with `onIntroDone()` from `lib/intro.ts`.

**Logo:** `components/Logo.tsx` holds the vector paths extracted from the client's PDF. Reuse these exports (`TWO`, `ELL`, `CAMERA`, `LETTERS`, `Tri`); never redraw the logo. The camera triangle is the site's separator motif.

**Cursor:** `Cursor` is a focus reticle. Add `data-focus` to make it lock around an element's bounds, and `data-cursor="Label"` to show a label.

**Order in `app/page.tsx` matters:** ScrollTriggers are created in component order, so sections stay in document order and `Viewfinder` stays after them.

## Pitfalls already hit

- **Don't create a second ScrollTrigger on an element that is already pinned.** Its timeline never scrubbed in `Hero`. Put everything on one timeline attached to the pin. For "which section is active", read `getBoundingClientRect()` as `Viewfinder` does.
- **SplitText line masks clip Portuguese accents and descenders** (Ã, É, Q, commas) because line-heights are tight. Pass `linesClass: "ln"`; the `.ln-mask` CSS adds compensating padding.
- **Don't position GSAP-animated elements with the CSS `translate` property.** It threw off `.nf-num` in the 404; use layout or a wrapper.
- **`mix-blend-mode: difference` only blends within its stacking context**, and fixed elements create one. That's why the REC dot is a sibling of `.vf`, not a child, so it can stay red.
- Difference blending over the `#231f20` background renders white as a light grey (`#dce0df`). This is expected in the hero and HUD.
- Next's root layout is the document, so injecting DOM into `body` from a browser test can be wiped by React. Append rather than replacing `innerHTML`.
