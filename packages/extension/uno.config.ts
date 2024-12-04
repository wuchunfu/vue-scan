import { defineConfig, presetIcons, presetWind } from 'unocss'

export default defineConfig({
  content: { filesystem: ['entrypoints/popup/*/*.{ts,tsx,vue}'] },
  theme: {
    colors: {
      primary: '#0088ff',
      success: '#00cca3',
      warn: '#ff7f0f',
      error: '#f54327',
    },
    boxShadow: {
      default: '0 2px 16px rgba(0, 0, 0, 0.09)',
    },
  },
  presets: [
    presetWind(),
    presetIcons({
      scale: 1,
      prefix: 'i-',
      extraProperties: {
        'display': 'inline-block',
        'min-width': '1em',
      },
    }),
  ],
})
