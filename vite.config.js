import { defineConfig } from 'vite';

// Relative base so the build works at the domain root (Vercel)
// and under a sub-path (GitHub Pages: /longpf/).
export default defineConfig({
  base: './',
});
