const FALLBACK_SVG = `data:image/svg+xml,${encodeURIComponent(`
<svg xmlns="http://www.w3.org/2000/svg" width="800" height="600" viewBox="0 0 800 600">
  <rect width="800" height="600" fill="#0a0a0a"/>
  <rect x="0" y="0" width="800" height="600" fill="url(#grid)" opacity="0.15"/>
  <defs>
    <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
      <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#222" stroke-width="0.5"/>
    </pattern>
  </defs>
  <rect x="330" y="220" width="140" height="100" rx="4" fill="none" stroke="#333" stroke-width="1.5"/>
  <circle cx="360" cy="252" r="10" fill="none" stroke="#444" stroke-width="1.5"/>
  <path d="M338 310 L380 268 L410 298 L430 278 L462 310 Z" fill="none" stroke="#333" stroke-width="1.5"/>
  <text x="400" y="360" text-anchor="middle" font-family="Helvetica Neue, Arial, sans-serif" font-size="11" font-weight="700" fill="#444" letter-spacing="3">IMAGE COMING SOON</text>
  <text x="400" y="382" text-anchor="middle" font-family="Helvetica Neue, Arial, sans-serif" font-size="9" fill="#333" letter-spacing="1.5">RED POST REALTY</text>
</svg>
`)}`;

export function handleImgError(e: React.SyntheticEvent<HTMLImageElement>) {
  const target = e.currentTarget;
  if (target.src !== FALLBACK_SVG) {
    target.src = FALLBACK_SVG;
  }
}
