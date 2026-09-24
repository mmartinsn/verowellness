/**
 * Motion system, client side (styles in src/styles/motion.css). Imported once by SiteLayout.
 *
 * - Splits `main h1`, `main h2` and any `[data-split]` into masked words so they rise in one after
 *   another when revealed. Only text nodes are wrapped: <br>, <em>, <span class="grad-text">…
 *   stay as they are (a `.grad-text` is kept whole, so its gradient runs across it unbroken).
 *   Skipped inside `[data-nosplit]`.
 * - Adds the pointer light to `.spot` cards and the pull to `[data-magnet]` elements.
 *
 * Headings still read as their full text (the words are only wrapped in inline spans).
 * Under reduced motion only the split happens (it is invisible then); nothing is animated.
 */

const calm = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const fine = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

function splitWords(el: HTMLElement) {
  if (el.classList.contains('is-split') || el.closest('[data-nosplit]')) return;
  let i = 0;
  const wrap = (node: Node) => {
    for (const child of [...node.childNodes]) {
      if (child.nodeType === Node.TEXT_NODE) {
        const parts = (child.textContent ?? '').split(/(\s+)/);
        if (parts.every((p) => !p.trim())) continue;
        const frag = document.createDocumentFragment();
        for (const part of parts) {
          if (!part) continue;
          if (!part.trim()) {
            frag.append(document.createTextNode(part));
            continue;
          }
          const w = document.createElement('span');
          w.className = 'split-w';
          const inner = document.createElement('span');
          inner.className = 'split-i';
          inner.style.setProperty('--wi', String(i++));
          inner.textContent = part;
          w.append(inner);
          frag.append(w);
        }
        child.replaceWith(frag);
      } else if (child instanceof HTMLElement) {
        if (child.tagName === 'BR' || child.classList.contains('sr-only')) continue;
        if (child.classList.contains('grad-text') || child.classList.contains('tm')) {
          // Keep it whole: one masked unit, so gradients and superscripts are not cut per word.
          const w = document.createElement('span');
          w.className = 'split-w';
          child.replaceWith(w);
          child.classList.add('split-i');
          child.style.setProperty('--wi', String(i++));
          w.append(child);
        } else {
          wrap(child);
        }
      }
    }
  };
  wrap(el);
  el.classList.add('is-split');
}

export function initMotion(observe: (el: Element) => void) {
  document.querySelectorAll<HTMLElement>('main h1, main h2, [data-split]').forEach((el) => {
    splitWords(el);
    observe(el);
  });

  if (calm || !fine) return;

  // Pointer light: one glow layer per card, positioned from the pointer.
  document.querySelectorAll<HTMLElement>('.spot').forEach((card) => {
    const glow = document.createElement('span');
    glow.className = 'spot-glow';
    glow.setAttribute('aria-hidden', 'true');
    card.prepend(glow);
    if (getComputedStyle(card).position === 'static') card.style.position = 'relative';
    card.addEventListener('pointermove', (e) => {
      const r = card.getBoundingClientRect();
      card.style.setProperty('--mx', `${e.clientX - r.left}px`);
      card.style.setProperty('--my', `${e.clientY - r.top}px`);
    });
  });

  // Magnetic pull, eased back on leave.
  document.querySelectorAll<HTMLElement>('[data-magnet]').forEach((el) => {
    const strength = Number(el.dataset.magnet) || 0.3;
    el.style.transition = 'translate 0.5s cubic-bezier(0.19, 1, 0.22, 1)';
    el.addEventListener('pointermove', (e) => {
      const r = el.getBoundingClientRect();
      const dx = (e.clientX - r.left - r.width / 2) * strength;
      const dy = (e.clientY - r.top - r.height / 2) * strength;
      el.style.translate = `${dx.toFixed(1)}px ${dy.toFixed(1)}px`;
    });
    el.addEventListener('pointerleave', () => {
      el.style.translate = '0 0';
    });
  });
}
