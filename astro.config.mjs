import { defineConfig } from 'astro/config'
import UnoCSS from 'unocss/astro'
import sitemap from '@astrojs/sitemap'

export default defineConfig({
  site: 'https://liting.ink',
  integrations: [
    UnoCSS({
      injectReset: true,
    }),
    sitemap(),
  ],
})
