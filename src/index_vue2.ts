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
      onBeforeMount() {
        const instance = (() => {
          this.$vnode._componentTag = this.$vnode.tag
          this.subTree = {
            el: this.$el,
            children: this.$children,
            component: this.$children ? null : this.$vnode,
          }
          this.type = this.$vnode
          return this
        })() as VueAppInstance

        // @ts-expect-error injected flag
        instance.__vue_scan_injected__ = true
      },
      beforeUpdate() {
        const instance = (() => {
          this.$vnode._componentTag = this.$vnode.tag
          this.subTree = {
            el: this.$el,
            children: this.$children,
            component: this.$children ? null : this.$vnode,
          }
          this.type = this.$vnode
          return this
        })() as VueAppInstance

        const hook = createOnBeforeUpdateHook(instance, options)

        hook?.()
      },
      onBeforeUnmount() {
        const instance = (() => {
          this.$vnode._componentTag = this.$vnode.tag
          this.subTree = {
            el: this.$el,
            children: this.$children,
            component: this.$children ? null : this.$vnode,
          }
          this.type = this.$vnode
          return this
        })() as VueAppInstance

        const hook = createOnBeforeUnmountHook(instance)

        hook?.()
      },
    })
  },
}

export default plugin

export * from './types'
