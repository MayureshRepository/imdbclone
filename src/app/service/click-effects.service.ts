import { Injectable, NgZone, OnDestroy, inject } from '@angular/core';

/** Elements that get a ripple when pressed. Add `data-ripple` to opt in anything else. */
const RIPPLE_SELECTOR = [
  '.btn',
  '.btn-primary',
  '.btn-ghost',
  '.btn-danger',
  '.btn-accent',
  '.poster-card',
  '.bento-tile-link',
  '.fav-toggle',
  '[data-ripple]',
].join(',');

/** Elements that emit a heart burst when clicked (only while not yet favorited). */
const BURST_SELECTOR = '.fav-toggle:not(.active), [data-burst]';

const BURST_PARTICLES = 8;

/**
 * Global, dependency-free click feedback:
 *  - a material-style ripple from the pointer position on buttons and cards
 *  - a small burst of hearts when adding a favorite
 * Runs outside Angular's zone so it never triggers change detection.
 */
@Injectable({
  providedIn: 'root',
})
export class ClickEffectsService implements OnDestroy {
  private zone = inject(NgZone);
  private reduceMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)');

  private onPointerDown = (event: PointerEvent) => {
    if (event.button !== 0 || this.reduceMotion?.matches) {
      return;
    }
    const target = (event.target as HTMLElement | null)?.closest<HTMLElement>(RIPPLE_SELECTOR);
    if (target) {
      this.ripple(target, event);
    }
  };

  private onClick = (event: MouseEvent) => {
    if (this.reduceMotion?.matches) {
      return;
    }
    // Evaluated on capture, before Angular flips the button into its "active" state.
    const target = (event.target as HTMLElement | null)?.closest<HTMLElement>(BURST_SELECTOR);
    if (target) {
      this.burst(event.clientX, event.clientY);
    }
  };

  init() {
    this.zone.runOutsideAngular(() => {
      document.addEventListener('pointerdown', this.onPointerDown, { passive: true });
      document.addEventListener('click', this.onClick, { capture: true, passive: true });
    });
  }

  ngOnDestroy() {
    document.removeEventListener('pointerdown', this.onPointerDown);
    document.removeEventListener('click', this.onClick, { capture: true });
  }

  private ripple(host: HTMLElement, event: PointerEvent) {
    if (getComputedStyle(host).position === 'static') {
      host.style.position = 'relative';
    }

    // A clipping layer inside the host, so the host itself can keep
    // overflow visible (e.g. the favorites badge sits outside its button).
    let layer = host.querySelector<HTMLElement>(':scope > .ripple-layer');
    if (!layer) {
      layer = document.createElement('span');
      layer.className = 'ripple-layer';
      host.appendChild(layer);
    }

    const rect = host.getBoundingClientRect();
    const size = Math.hypot(rect.width, rect.height) * 2;
    const dot = document.createElement('span');
    dot.className = 'ripple';
    dot.style.width = dot.style.height = `${size}px`;
    dot.style.left = `${event.clientX - rect.left - size / 2}px`;
    dot.style.top = `${event.clientY - rect.top - size / 2}px`;
    layer.appendChild(dot);
    dot.addEventListener('animationend', () => dot.remove(), { once: true });
  }

  private burst(x: number, y: number) {
    for (let i = 0; i < BURST_PARTICLES; i++) {
      const angle = (Math.PI * 2 * i) / BURST_PARTICLES + (Math.random() - 0.5) * 0.5;
      const distance = 28 + Math.random() * 22;
      const particle = document.createElement('span');
      particle.className = 'burst-particle material-icons-round';
      particle.textContent = 'favorite';
      particle.style.left = `${x}px`;
      particle.style.top = `${y}px`;
      particle.style.setProperty('--dx', `${Math.cos(angle) * distance}px`);
      particle.style.setProperty('--dy', `${Math.sin(angle) * distance}px`);
      particle.style.setProperty('--rot', `${(Math.random() - 0.5) * 70}deg`);
      particle.style.setProperty('--size', `${10 + Math.random() * 6}px`);
      particle.style.color = i % 3 === 0 ? '#f5c518' : i % 3 === 1 ? '#f43f5e' : '#8b7dff';
      document.body.appendChild(particle);
      particle.addEventListener('animationend', () => particle.remove(), { once: true });
    }
  }
}
