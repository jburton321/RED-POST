# Non-Dependencies Audit Report

**Project:** Red Post Realty  
**Date:** March 16, 2026  
**Scope:** Full project scan for non-essential, regenerable, or removable files

---

## Summary

| Category | Items Found | Action Taken |
|----------|-------------|--------------|
| Build output | 1 | Removed |
| Cache directories | 1 | Removed |
| Previously removed (Bolt) | 1 | Already removed |
| Essential (kept) | — | No action |

---

## Removed

### 1. `dist/` (Build Output)
- **Size:** ~63 MB
- **Purpose:** Production build artifacts from `npm run build`
- **Reason:** Regenerable; not a dependency
- **Action:** Deleted
- **Restore:** Run `npm run build`

### 2. `node_modules/.vite/` (Vite Cache)
- **Size:** ~9.6 MB
- **Purpose:** Vite dependency pre-bundling cache
- **Reason:** Regenerable on next `npm run dev` or `npm run build`
- **Action:** Deleted
- **Restore:** Automatic on next dev/build

### 3. `.bolt/` (Bolt Template Scaffolding)
- **Status:** Removed in prior audit
- **Contents:** config.json, prompt
- **Reason:** Bolt.new template artifacts; not needed for project

---

## Kept (Essential or Required)

| Item | Reason |
|------|--------|
| `.env` | Runtime config (Supabase keys); required for app |
| `.env.example` | Template for env setup; useful for onboarding |
| `package-lock.json` | Lockfile for reproducible installs |
| `node_modules/` | npm dependencies; required |
| `public/images/.gitkeep` | Git convention for directory tracking |
| All source files | Application code |
| All config files | Build/tooling configuration |

---

## Not Present (No Action)

The following common non-essential items were **not found** in the project:

- `.DS_Store` (macOS)
- `*.log` files
- `.vscode/` (except extensions.json if recommended)
- `.cursor/` (Cursor-specific)
- `coverage/` (test coverage)
- `.cache/`
- `dist-ssr/`

---

## Recommendations

1. **dist/** and **node_modules/.vite/** are in `.gitignore` — they will not be committed.
2. Run `npm run build` when you need a fresh production build.
3. Vite cache will regenerate automatically on the next dev/build run.

---

## Verification

After removal:
- `npm run build` — succeeds
- `npm run dev` — succeeds (Vite cache rebuilds)
- Project structure — clean
