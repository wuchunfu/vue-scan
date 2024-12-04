import type { VueAppInstance } from '@vue/devtools-kit'
import type { Plugin } from 'vue-demi'
import type { VueScanBaseOptions, VueScanOptions } from './types'
import { createOnBeforeUnmountHook, createOnBeforeUpdateHook } from './core/index'
import { isDev } from './utils'

const plugin: Plugin<VueScanOptions> = {
  install: (app: any, options?: VueScanBaseOptions) => {
    const { enable = isDev() } = options || {}

    if (!enable) {
      return
    }

    app.mixin({
      beforeUpdate() {
        const instance = (() => {
          return (this as any).$
        })() as VueAppInstance

        const hook = createOnBeforeUpdateHook(instance, options)

        hook?.()
      },
      onBeforeUnmount() {
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
