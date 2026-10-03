import { Directive, ElementRef, NgZone, OnDestroy, OnInit, inject } from '@angular/core';

/**
 * Exposes the pointer position inside the host as the CSS variables
 * `--mx` / `--my`, which `.bento-tile::before` uses for its spotlight glow.
 *
 * Runs outside Angular's zone (pointermove would otherwise trigger change
 * detection on every mouse move) and writes at most once per animation frame.
 */
@Directive({
  selector: '[appSpotlight]',
})
export class SpotlightDirective implements OnInit, OnDestroy {
  private el = inject(ElementRef<HTMLElement>);
  private zone = inject(NgZone);
  private frame = 0;
  private x = 0;
  private y = 0;

  private onPointerMove = (event: PointerEvent) => {
    if (event.pointerType !== 'mouse') {
      return; // no hover glow on touch
    }
    this.x = event.clientX;
    this.y = event.clientY;
    if (!this.frame) {
      this.frame = requestAnimationFrame(this.update);
    }
  };

  private update = () => {
    this.frame = 0;
    const host = this.el.nativeElement as HTMLElement;
    const rect = host.getBoundingClientRect();
    host.style.setProperty('--mx', `${this.x - rect.left}px`);
    host.style.setProperty('--my', `${this.y - rect.top}px`);
  };

  ngOnInit() {
    this.zone.runOutsideAngular(() =>
      this.el.nativeElement.addEventListener('pointermove', this.onPointerMove, { passive: true })
    );
  }

  ngOnDestroy() {
    this.el.nativeElement.removeEventListener('pointermove', this.onPointerMove);
    cancelAnimationFrame(this.frame);
  }
}
