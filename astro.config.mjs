import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import mdx from '@astrojs/mdx';
import { mintlify } from '@mintlify/astro';
import tailwindcss from '@tailwindcss/vite';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  integrations: [mintlify({ docsDir: './docs' }), react(), mdx()],
  markdown: {
    shikiConfig: {
      theme: 'github-light-default',
    },
  },
  vite: {
    plugins: [tailwindcss()],
    worker: {
      format: 'es',
    },
    resolve: {
      alias: {
        '@mintlify/components': path.resolve(__dirname, 'src/mintlify-components/index.ts'),
        '@/components': path.resolve(__dirname, 'src/mintlify-components'),
        '@': path.resolve(__dirname, 'src/mintlify-components'),
        'react-use-rect': path.resolve(__dirname, 'node_modules/react-use-rect/dist/index.esm.js'),
      },
    },
  },
});
