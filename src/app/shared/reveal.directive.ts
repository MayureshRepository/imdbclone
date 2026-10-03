import {
  AfterViewInit,
  Directive,
  ElementRef,
  HostBinding,
  Input,
  OnDestroy,
  inject,
} from '@angular/core';

/** One observer shared by every revealed element (cheaper than one per card). */
let sharedObserver: IntersectionObserver | null = null;

function getObserver(): IntersectionObserver | null {
  if (typeof IntersectionObserver === 'undefined') {
    return null;
  }
  sharedObserver ??= new IntersectionObserver(
    (entries, observer) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      }
    },
    { rootMargin: '0px 0px -40px 0px', threshold: 0.1 }
  );
  return sharedObserver;
}

/**
 * Fades and lifts the host into view the first time it scrolls into the
 * viewport. Pass a delay in ms to stagger siblings: `[appReveal]="i * 60"`.
 * Styling lives in styles.css (`.reveal` / `.is-visible`).
 */
@Directive({
  selector: '[appReveal]',
})
export class RevealDirective implements AfterViewInit, OnDestroy {
  @Input() appReveal: number | '' = 0;

  @HostBinding('class.reveal') readonly reveal = true;

  @HostBinding('style.--reveal-delay')
  get delay(): string {
    return `${Number(this.appReveal) || 0}ms`;
  }

  private el = inject(ElementRef<HTMLElement>);

  ngAfterViewInit() {
    const host = this.el.nativeElement as HTMLElement;
    const observer = getObserver();
    if (observer) {
      observer.observe(host);
    } else {
      host.classList.add('is-visible');
    }
  }

  ngOnDestroy() {
    sharedObserver?.unobserve(this.el.nativeElement);
  }
}
