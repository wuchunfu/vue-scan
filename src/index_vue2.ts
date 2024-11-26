import type { ObjectPlugin } from 'vue-demi'
import type { Options } from './types'
import process from 'node:process'
import { getInstanceName, type VueAppInstance } from '@vue/devtools-kit'
import { clearhighlight, highlight, unhighlight } from './core'

const plugin: ObjectPlugin<Options> = {
  install: (app: any, options) => {
    if (process.env.NODE_ENV === 'production' || options?.enable === false) {
      return
    }

    app.mixin({
      beforeCreate() {
        (this as any).__uuid = new Date().getTime()
      },
      beforeUpdate() {
        const instance = (() => {
          this.subTree = {
            el: this.$el,
            component: this.$children,
          }
          return this
        })() as VueAppInstance

        const el = (() => {
          return instance?.$el
        })() as HTMLElement | undefined

        if (el) {
          const name = getInstanceName(instance)
          const uuid = `${name}__${(this as any).__uuid as string}`.replaceAll(' ', '_')

          highlight(instance, uuid)

          setTimeout(() => {
            unhighlight(uuid)
          }, 500)
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
