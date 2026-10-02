// @ts-check
import { defineConfig, fontProviders } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  output: "static",
  fonts: [
    {
      provider: fontProviders.fontsource(),
      name: "Road Rage",
      cssVariable: "--font-grunge",
      fallbacks: ["system-ui"]
    },
    {
      provider: fontProviders.fontsource(),
      name: "JetBrains Mono",
      cssVariable: "--font-mono",
      fallbacks: ["monospace"],
      weights: [400, 500, 600, 700, 800],
    }
  ],
  vite: {
    plugins: [tailwindcss()]
  },
  integrations: [sitemap()],
  site: "https://www.akashconnect.com",
  base: "/"
});
