import type { ObjectPlugin } from 'vue-demi'
import type { Options } from './types'
import { getInstanceName, type VueAppInstance } from '@vue/devtools-kit'
import { clearhighlight, debounceUnhighlightSettimeout, highlight } from './core'
import { isDev } from './utils'

const plugin: ObjectPlugin<Options> = {
  install: (app: any, options) => {
    const { enable = !isDev() } = options

    if (enable === false) {
      return
    }

    app.mixin({
      beforeCreate() {
        (this as any).__uuid = new Date().getTime()
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

          debounceUnhighlightSettimeout(uuid)
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
