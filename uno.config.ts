import { defineConfig, presetIcons, presetUno } from 'unocss'
import transformerVariantGroup from '@unocss/transformer-variant-group'

export default defineConfig({
  presets: [
    presetUno(),
    presetIcons({
      extraProperties: {
        'display': 'inline-block',
        'vertical-align': 'middle',
        'width': '24px',
        'height': '24px',
      },
    }),
  ],
  // @ts-ignore
  transformers: [transformerVariantGroup()],
  shortcuts: {
    'u-center': 'flex justify-center items-center',
  },
})
