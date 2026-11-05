const EVENT = "2l:intro-done";

let done = false;

export function finishIntro() {
  done = true;
  window.dispatchEvent(new Event(EVENT));
}

/** Corre `cb` quando a abertura terminar (ou já, se já terminou). */
export function onIntroDone(cb: () => void) {
  if (done) {
    cb();
    return () => {};
  }
  window.addEventListener(EVENT, cb, { once: true });
  return () => window.removeEventListener(EVENT, cb);
}
