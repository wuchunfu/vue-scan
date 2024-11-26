import type { Plugin } from 'vue-demi'
import { getInstanceName, type VueAppInstance } from '@vue/devtools-kit'
import { clearhighlight, highlight, unhighlight } from './core'

const plugin: Plugin = {
  install: (app: any) => {
    app.mixin({
      beforeCreate() {
        (this as any).__uuid = new Date().getTime()
      },
      // 如果组件重新渲染了，那么闪烁一下组件的边缘
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
