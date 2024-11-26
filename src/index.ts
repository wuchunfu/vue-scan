import type { Plugin } from 'vue-demi'
import type { Options } from './types'
import { getInstanceName, type VueAppInstance } from '@vue/devtools-kit'
import { clearhighlight, highlight, unhighlight } from './core'
import { isDev } from './utils'

const plugin: Plugin<Options> = {
  install: (app: any, options) => {
    const { enable = isDev() } = options || {}

    if (!enable) {
      return
    }

    app.mixin({
      beforeCreate() {
        (this as any).__uuid = new Date().getTime()

        this.__flashTimeout = null as ReturnType<typeof setTimeout> | null
      },
      beforeUpdate() {
        const instance = (() => {
          return (this as any).$
        })() as VueAppInstance

        const el = (() => {
          return instance?.vnode.el
        })() as HTMLElement | undefined

        if (el) {
          const name = getInstanceName(instance)
          const uuid = `${name}__${(this as any).__uuid as string}`.replaceAll(' ', '_')

          highlight(instance, uuid, options)

          if (this.__flashTimeout) {
            clearTimeout(this.__flashTimeout)
            this.__flashTimeout = null
          }

          this.__flashTimeout = setTimeout(() => {
            unhighlight(uuid)
            this.__flashTimeout = null
          }, 200)
        }
      },
      unmounted() {
        const uuid = `${(this as any).__uuid as string}`
        clearhighlight(uuid)
      },
    })
  },
}

export default plugin
