import { defineConfig } from 'vite';

// base '/longpf/' so the site works on GitHub Pages at tridinhbui.github.io/longpf
export default defineConfig({
  base: process.env.NODE_ENV === 'production' ? '/longpf/' : '/',
});
