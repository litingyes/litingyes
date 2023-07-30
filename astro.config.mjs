import { defineConfig } from 'astro/config'
import UnoCSS from 'unocss/astro'
import sitemap from '@astrojs/sitemap'
import image from '@astrojs/image'

export default defineConfig({
  site: 'https://liting.ink',
  integrations: [
    UnoCSS({
      injectReset: true,
    }),
    sitemap(),
    image({
      serviceEntryPoint: '@astrojs/image/sharp',
    }),
  ],
})
