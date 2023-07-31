import { defineConfig } from 'astro/config'
import UnoCSS from 'unocss/astro'
import sitemap from '@astrojs/sitemap'
import image from '@astrojs/image'
import vercel from '@astrojs/vercel/serverless'

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
  output: 'server',
  adapter: vercel(),
})
