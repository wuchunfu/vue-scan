import type { VueAppInstance } from '@vue/devtools-kit'
import type { Plugin } from 'vue-demi'
import type { VueScanBaseOptions, VueScanOptions } from './types'
import { createOnBeforeUnmountHook, createOnBeforeUpdateHook } from './core/index'
import { isDev } from './utils'

const plugin: Plugin<VueScanOptions> = {
  install: (app, options?: VueScanBaseOptions) => {
    const { enable = isDev() } = options || {}

    if (!enable) {
      return
    }

    app.mixin({
      beforeMount() {
        const instance = (() => {
          return (this as any).$
        })() as VueAppInstance

        instance.__vue_scan_injected__ = true
      },
      beforeUpdate() {
        const instance = (() => {
          return (this as any).$
        })() as VueAppInstance

        const hook = createOnBeforeUpdateHook(instance, options)

        hook?.()
      },
      beforeUnmount() {
        const instance = (() => {
          return (this as any).$
        })() as VueAppInstance

        const hook = createOnBeforeUnmountHook(instance)

        hook?.()
      },
    })
  },
}

export default plugin

export * from './types'
