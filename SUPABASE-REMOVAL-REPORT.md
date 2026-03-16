# Supabase Removal Report

**Project:** Red Post Realty  
**Date:** March 16, 2026  
**Status:** Complete

---

## Summary

Supabase has been fully removed. Listings now come from the Ruuster API via a proxy, and leads are submitted to Formspree or a custom endpoint.

| Before | After |
|--------|-------|
| Supabase `listings` table | Ruuster API → `/api/listings` proxy |
| Supabase `leads` table | Formspree or custom endpoint |
| `@supabase/supabase-js` | Removed |
| `src/lib/supabase.ts` | Deleted |
| `supabase/` folder | Deleted |

---

## Architecture

### Listings Flow

```
Frontend                    Dev (Vite)              Prod (Vercel)
   │                            │                         │
   │  fetch('/api/listings')    │                         │
   ├───────────────────────────►│  proxy → Ruuster        │
   │                            │  (may 401)              │
   │                            │                         │
   │  fetch('/api/listings')    │                         ├──► api/listings.ts
   │                            │                         │         │
   │                            │                         │         └──► Ruuster API
   │  ◄── records or fallback   │                         │
```

- **Dev:** Vite proxies `/api` → `https://redpostrealty.ruuster.com`. If Ruuster returns 401, fallback listings are used.
- **Prod:** Vercel serverless function at `api/listings.ts` proxies to Ruuster. Set `RUUSTER_API_URL` and `RUUSTER_API_KEY` (if required) in Vercel env.

### Leads Flow

```
Frontend
   │
   │  submitLead() → POST
   ├──► Formspree (VITE_FORMSPREE_ID)
   │    or
   └──► Custom endpoint (VITE_LEADS_ENDPOINT)
```

---

## Files Changed

### Added

| File | Purpose |
|------|---------|
| `src/lib/listingsApi.ts` | Fetches listings from `/api/listings`, maps Ruuster response to `ListingRecord` |
| `src/lib/leadsApi.ts` | Submits leads to Formspree or custom endpoint |
| `api/listings.ts` | Vercel Edge function – proxies to Ruuster API |
| `vercel.json` | Vercel build config, SPA rewrites |

### Modified

| File | Changes |
|------|---------|
| `src/lib/listings.ts` | Removed Supabase; uses `fetchListingsFromApi()` |
| `src/components/MultiStepForm.tsx` | Uses `submitLead()` instead of Supabase insert; added error state |
| `src/components/form/StepContact.tsx` | Added `submitError` prop for error display |
| `vite.config.ts` | Added proxy: `/api` → Ruuster |
| `.env.example` | Replaced Supabase vars with new env vars |
| `src/vite-env.d.ts` | Added `ImportMetaEnv` for new env vars |

### Deleted

| File/Folder | Reason |
|-------------|--------|
| `src/lib/supabase.ts` | No longer used |
| `supabase/` | Entire folder (migrations, functions) |
| `@supabase/supabase-js` | npm package removed |

---

## Environment Variables

### Frontend (.env)

| Variable | Required | Description |
|----------|----------|-------------|
| `VITE_API_BASE` | No | Base URL for API (default: `''` = same origin) |
| `VITE_FORMSPREE_ID` | For leads | Formspree form ID from formspree.io |
| `VITE_LEADS_ENDPOINT` | Alternative | Custom POST endpoint for leads (JSON body) |

### Vercel (Dashboard → Project → Settings → Environment Variables)

| Variable | Required | Description |
|----------|----------|-------------|
| `RUUSTER_API_URL` | No | Default: `https://redpostrealty.ruuster.com/api` |
| `RUUSTER_API_KEY` | If Ruuster requires auth | API key for Ruuster |

---

## Setup Steps

### 1. Leads (Formspree)

1. Go to [formspree.io](https://formspree.io) and create a form.
2. Copy the form ID (e.g. `xyzabcde`).
3. Add to `.env`:
   ```
   VITE_FORMSPREE_ID=xyzabcde
   ```

### 2. Deploy to Vercel

1. Connect the repo to Vercel.
2. Add env vars in the Vercel dashboard (optional):
   - `RUUSTER_API_URL` (if different from default)
   - `RUUSTER_API_KEY` (if Ruuster requires it)
3. Deploy. The `api/` folder is used as serverless functions.

### 3. Ruuster API

If Ruuster returns 401, you may need to:

- Obtain an API key from Ruuster.
- Set `RUUSTER_API_KEY` in Vercel.
- Confirm the correct listings endpoint (e.g. `/listings`, `/listings/active`).

---

## Fallback Behavior

- **Listings:** If the API fails (404, 401, 500, network error), the app uses `FALLBACK_LISTINGS` from `listingData.ts`.
- **Leads:** If no `VITE_FORMSPREE_ID` or `VITE_LEADS_ENDPOINT` is set, submission fails and an error is shown.

---

## Verification

- [x] `npm run build` succeeds
- [x] No Supabase imports remain
- [x] Bundle size reduced (Supabase removed)
- [x] Listings fallback works when API fails
- [x] Leads form shows error when endpoint is not configured

---

## Notes

- Ruuster API returned 401 when tested; you may need an API key.
- `FALLBACK_LISTINGS` is still used when the API is unavailable.
- Ruuster widget (`ruuster.com/widget/integration.js`) in `index.html` is unchanged and still loads.
