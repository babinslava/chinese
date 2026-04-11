import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';

// For GitHub Pages: set GITHUB_PAGES_SITE and GITHUB_PAGES_BASE env vars,
// or edit these values directly.
// Example for https://username.github.io/chinese-course/
//   site: 'https://username.github.io'
//   base: '/chinese-course'
export default defineConfig({
  site: process.env.GITHUB_PAGES_SITE || 'http://localhost:4321',
  base: process.env.GITHUB_PAGES_BASE || '/',
  integrations: [mdx()],
});
