import type { VueScanBaseOptions } from 'z-vue-scan'
import process from 'node:process'
import { addPluginTemplate, defineNuxtModule } from '@nuxt/kit'

// Module options TypeScript interface definition
export interface ModuleOptions extends VueScanBaseOptions {}

export default defineNuxtModule<ModuleOptions>({
  meta: {
    name: 'z-vue-scan-nuxt-module',
    configKey: 'vueScan',
  },
  // Default configuration options of the Nuxt module
  defaults: {
    enable: process.env.NODE_ENV === 'development',
  },
  setup(_options, _nuxt) {
    addPluginTemplate({
      filename: 'vue-scan.plugin.mjs',
      getContents: () => `
import { defineNuxtPlugin } from '#app'
import VueScan from 'z-vue-scan'

export default defineNuxtPlugin((nuxtApp) => {
  const options = ${JSON.stringify(_options)}
  
  nuxtApp.vueApp.use(VueScan, options)
})
      `,
      mode: 'client',
    })
  },
})
