import type { VueAppInstance } from '@vue/devtools-kit'
import type { Plugin } from 'vue-demi'
import type { VueScanBaseOptions } from './types'
import { createOnBeforeUnmountHook, createOnBeforeUpdateHook } from './core/index'
import { isDev } from './utils'

const plugin: Plugin<VueScanBaseOptions> = {
  install: (app, options?: VueScanBaseOptions) => {
    const { enable = isDev() } = options || {}

    if (!enable) {
      return
    }

    app.mixin({
      beforeMount() {
        const instance = this as VueAppInstance

        if (!instance.__bu) {
          instance.__bu = createOnBeforeUpdateHook(instance, options)
        }

        if (!instance.__bum) {
          instance.__bum = createOnBeforeUnmountHook(instance)
        }

        instance.__vue_scan_injected__ = true
      },
      beforeUpdate() {
        const instance = this as VueAppInstance

        instance.__bu?.()
      },
      beforeDestroy() {
        const instance = this as VueAppInstance

        instance.__bum?.()
      },
    })
  },
}

export default plugin

export * from './types'
