import { Directive, ElementRef, HostListener, inject } from '@angular/core';

/**
 * Exposes the pointer position inside the host as the CSS variables
 * `--mx` / `--my`, which `.bento-tile::before` uses for its spotlight glow.
 */
@Directive({
  selector: '[appSpotlight]',
})
export class SpotlightDirective {
  private el = inject(ElementRef<HTMLElement>);

  @HostListener('pointermove', ['$event'])
  onPointerMove(event: PointerEvent) {
    const host = this.el.nativeElement as HTMLElement;
    const rect = host.getBoundingClientRect();
    host.style.setProperty('--mx', `${event.clientX - rect.left}px`);
    host.style.setProperty('--my', `${event.clientY - rect.top}px`);
  }
}
