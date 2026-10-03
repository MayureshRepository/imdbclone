const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="300" height="450" viewBox="0 0 300 450">
  <defs>
    <linearGradient id="g" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#252b40"/>
      <stop offset="1" stop-color="#11141f"/>
    </linearGradient>
  </defs>
  <rect width="300" height="450" fill="url(#g)"/>
  <g fill="none" stroke="#5b6386" stroke-width="6" stroke-linejoin="round" transform="translate(110 160)">
    <rect x="3" y="3" width="74" height="60" rx="8"/>
    <path d="M3 21h74M21 3l10 18M45 3l10 18"/>
  </g>
  <text x="150" y="275" font-family="Inter, Arial, sans-serif" font-size="18" font-weight="600" fill="#7c84a6" text-anchor="middle">No poster</text>
</svg>`;

/** Placeholder shown when a poster URL is missing or fails to load. */
export const POSTER_FALLBACK = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;

/** `(error)` handler for poster <img> elements; swaps in the placeholder once. */
export function handlePosterError(event: Event) {
  const img = event.target as HTMLImageElement;
  if (!img.hasAttribute('data-error-handled')) {
    img.setAttribute('data-error-handled', 'true');
    img.src = POSTER_FALLBACK;
  }
}
