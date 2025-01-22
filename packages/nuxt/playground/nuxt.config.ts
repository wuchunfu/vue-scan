export default defineNuxtConfig({
  modules: ['../src/module'],
  vueScan: {
    enable: true,
  },
  devtools: { enabled: true },
  compatibilityDate: '2025-01-22',
})
