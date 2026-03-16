# Brand Color Audit Report

**Project:** Red Post Realty  
**Date:** March 16, 2026  
**Official Brand Red:** `#d21920`  
**Previous Red:** `#A62626`

---

## Summary

| Metric | Count |
|--------|-------|
| Files updated | 12 |
| Occurrences replaced | 80+ |
| CSS variables updated | 3 |
| rgba() values updated | 53 |

---

## Official Brand Color Reference

| Format | Value |
|--------|-------|
| **HEX** | `#d21920` |
| **RGB** | `210, 25, 32` |
| **HSL** | `358°, 79%, 46%` |
| **HSV** | `358°, 88%, 82%` |
| **CMYK** | `0%, 88%, 85%, 18%` |

### Derived Variants

| Variant | HEX | Use |
|---------|-----|-----|
| Base (primary) | `#d21920` | Main brand red |
| Glow | `#ff3333` | Glows, highlights |
| Depth | `#5a0000` | Gradients, shadows |
| Hover/Light | `#e82a2f` | Button hovers, gradients |
| Dark | `#b0181e` | Pressed states, dark backgrounds |

---

## Files Updated

### 1. `src/index.css`
- `--red`: `#A62626` → `#d21920`
- `--red-glow`: `#ff2d2d` → `#ff3333`
- `--red-depth`: `#4e0000` → `#5a0000`
- All `rgba(166, 38, 38, X)` → `rgba(210, 25, 32, X)` (53 occurrences)
- Gradient: `#A62626` / `#c43434` → `#d21920` / `#e82a2f`
- Hover states: `#c42e2e` → `#e5252c`, `#8a1e1e`/`#8b1f1f`/`#8e1f1f` → `#b0181e`
- Standalone hex: `#A62626` → `#d21920` (7 occurrences)

### 2. `index.html`
- `theme-color` meta: `#a62727` → `#d21920`

### 3. `tailwind.config.js`
- Added `colors.brand`:
  - `brand-red`: `#d21920`
  - `brand-red-glow`: `#ff3333`
  - `brand-red-depth`: `#5a0000`

### 4. `src/components/MapDossier.tsx`
- Map pin SVG fill: `#A62626` → `#d21920` (2 occurrences)

### 5. `src/components/PropertyMapView.tsx`
- Map pin SVG fill: `#A62626` → `#d21920` (2 occurrences)

### 6. `src/components/AcquisitionCapacity.tsx`
- Agent Commission chart color: `#A62626` → `#d21920`

### 7. `public/email-template.html`
- Heading color, accent bar, bullet points: `#A62626` → `#d21920` (5 occurrences)

### 8. `public/favicon_io/site.webmanifest`
- `theme_color`: `#ffffff` → `#d21920`

### 9. `src/components/form/StepProperty.tsx`
- Text, borders, backgrounds, indicators: `#A62626` → `#d21920` (7 occurrences)

### 10. `src/components/form/StepTimeline.tsx`
- Borders, backgrounds, indicators: `#A62626` → `#d21920` (5 occurrences)

### 11. `src/components/form/StepLocation.tsx`
- Borders, backgrounds, indicators: `#A62626` → `#d21920` (8 occurrences)

### 12. `src/components/form/StepContact.tsx`
- Checkmarks, borders, indicators, accent: `#A62626` → `#d21920` (7 occurrences)

### 13. `src/components/form/StepLifestyle.tsx`
- Borders, backgrounds: `#A62626` → `#d21920` (5 occurrences)

---

## Not Updated (Intentional)

| Item | Reason |
|------|--------|
| `dist/` | Build output; regenerated on `npm run build` |
| `node_modules/` | Third-party dependencies |
| ErrorBoundary `text-red-600` | Tailwind semantic color for errors |
| AcquisitionCapacity chart colors | Other series use distinct colors (green, blue, etc.) |

---

## CSS Variable Usage

All components using `var(--red)` automatically inherit the new brand color. No changes needed for:
- `.text-red`, `.brand-tag`, `.red-post`, `.sa-red-text`, `.tcc-red-weight`
- `.command-btn--red`, `.acq-brand-header`, `.faq-red-weight`
- Form buttons, nav links, CTA buttons, etc.

---

## Verification

- Build: `npm run build` completes successfully
- No remaining references to `#A62626`, `#a62626`, or `rgba(166, 38, 38, ...)` in source files
