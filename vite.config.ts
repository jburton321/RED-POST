import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

/**
 * Dev-only proxy for /api/listings must match api/listings.ts: Ruuster returns 401 without
 * slug (and expects status=Active). Reads RUUSTER_LISTINGS_EXTRA_PARAMS from .env — same as Vercel.
 */
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  const extraRaw = (env.RUUSTER_LISTINGS_EXTRA_PARAMS ?? '').trim();

  const origin = (() => {
    const fromVite = (env.VITE_API_PROXY ?? '').replace(/\/$/, '');
    if (fromVite) return fromVite;
    const base = (env.RUUSTER_API_URL || 'https://redpostrealty.ruuster.com/api').replace(/\/$/, '');
    return base.endsWith('/api') ? base.slice(0, -4) : base;
  })();

  return {
    plugins: [react()],
    server: {
      proxy: {
        '/api/listings': {
          target: origin,
          changeOrigin: true,
          rewrite: (path) => {
            const u = new URL(path, 'http://vite.local');
            const q = new URLSearchParams();
            q.set('status', 'Active');
            if (extraRaw) {
              const parsed = new URLSearchParams(extraRaw.startsWith('?') ? extraRaw.slice(1) : extraRaw);
              parsed.forEach((value, key) => {
                if (value !== '') q.set(key, value);
              });
            }
            u.searchParams.forEach((value, key) => {
              if (value !== '') q.set(key, value);
            });
            return `/api/listings?${q.toString()}`;
          },
        },
      },
    },
    build: {
      target: 'es2020',
      sourcemap: false,
      rollupOptions: {
        output: {
          manualChunks: {
            vendor: ['react', 'react-dom', 'react-router-dom'],
            maps: ['leaflet', 'react-leaflet'],
          },
        },
      },
    },
  };
});
