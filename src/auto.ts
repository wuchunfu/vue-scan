import type { VNodeNormalizedChildren } from 'vue-demi'
import { type BACE_VUE_INSTANCE, createOnBeforeUnmountHook, createOnBeforeUpdateHook } from './core/hook'
import plugin from './index'

(() => {
  // eslint-disable-next-line node/prefer-global/process
  if (!window.process) {
    // @ts-expect-error browser mock
    // eslint-disable-next-line node/prefer-global/process
    window.process = {
      env: {
        NODE_ENV: 'development',
      },
    }
  }

  if (!window.__VUE_SCAN__) {
    window.__VUE_SCAN__ = {
      plugin,
      createOnBeforeUpdateHook,
      createOnBeforeUnmountHook,
    }
  }
})()

// Check if the __vue_app__ property exists on the #app node of the page

function injectVueScan(node: HTMLElement) {
  // @ts-expect-error vue internal
  if ((node.__vue_app__ || node.__vue__)) {
    // @ts-expect-error vue internal
    if (node.__vue_app__) { // VUE 3
      // @ts-expect-error vue internal
      const vueInstance = node.__vue_app__._container._vnode.component as BACE_VUE_INSTANCE

      // @ts-expect-error vue internal
      node.__vue_app__.use(window.__VUE_SCAN__.plugin)

      if (!vueInstance.__vue_scan_injected__) {
        console.log(vueInstance)
      }

      function mixinChildren(children: VNodeNormalizedChildren) {
        if (!children) {
          return
        }

        if (typeof children === 'string') {
          return
        }

        if (!Array.isArray(children)) {
          return
        }

        children.forEach((item) => {
          if (typeof item !== 'object') {
            return
          }

          if (item && 'component' in item && item.component) {
            mixin(item.component as BACE_VUE_INSTANCE)
          }
          else if (item && 'children' in item) {
            mixinChildren(item.children)
          }
        })
      }

      function mixin(vueInstance: BACE_VUE_INSTANCE) {
        if (vueInstance.subTree?.el && vueInstance.__vue_scan_injected__ !== true) {
          const onBeforeUpdate = createOnBeforeUpdateHook(vueInstance)
          const onBeforeUnmount = createOnBeforeUnmountHook(vueInstance)

          if (onBeforeUpdate) {
            if (vueInstance?.bu) {
              vueInstance.bu.push(onBeforeUpdate)
            }
            else {
              vueInstance!.bu = [onBeforeUpdate]
            }
          }

          if (onBeforeUnmount) {
            if (vueInstance?.bum) {
              vueInstance.bum.push(onBeforeUnmount)
            }
            else {
              vueInstance!.bum = [onBeforeUnmount]
            }
          }
        }

        if (!vueInstance?.subTree?.component && vueInstance?.subTree?.children) {
          mixinChildren(vueInstance.subTree.children)
        }
        else if (vueInstance?.subTree?.component) {
          mixin(vueInstance.subTree.component as BACE_VUE_INSTANCE)
        }

        else if (!vueInstance?.subTree && vueInstance?.children) {
          mixinChildren(vueInstance.children)
        }
      }

      mixin(vueInstance)

      if (!vueInstance.__vue_scan_injected__) {
        console.log('vue scan inject success')
      }

      vueInstance.__vue_scan_injected__ = true
    }
    // @ts-expect-error vue internal
    else if (node.__vue__) { // VUE 2
      // @ts-expect-error vue internal
      const vueInstance = node.__vue__ as BACE_VUE_INSTANCE

      if (!vueInstance.__vue_scan_injected__) {
        console.log(vueInstance)
      }

      function mixin(vueInstance: BACE_VUE_INSTANCE) {
        if (vueInstance?.$el && vueInstance.__vue_scan_injected__ !== true) {
          const onBeforeUpdate = createOnBeforeUpdateHook(vueInstance)
          const onBeforeUnmount = createOnBeforeUnmountHook(vueInstance)

          if (onBeforeUpdate) {
            if (vueInstance?.$options?.beforeUpdate) {
              vueInstance.$options.beforeUpdate.push(onBeforeUpdate)
            }
            else if (vueInstance?.$options) {
              vueInstance.$set(vueInstance.$options, 'beforeUpdate', [onBeforeUpdate])
            }
          }

          if (onBeforeUnmount) {
            if (vueInstance?.$options?.beforeDestroy) {
              vueInstance.$options.beforeDestroy.push(onBeforeUnmount)
            }
            else if (vueInstance?.$options) {
              vueInstance.$set(vueInstance.$options, 'beforeDestroy', [onBeforeUnmount])
            }
          }
        }

        if (vueInstance?.$children) {
          (vueInstance?.$children as Array<BACE_VUE_INSTANCE>).forEach((child) => {
            mixin(child)
          })
        }
      }

      mixin(vueInstance)

      if (!vueInstance.__vue_scan_injected__) {
        console.log('vue scan inject success')
      }

      vueInstance.__vue_scan_injected__ = true
    }
  }
}

function getMountDoms() {
  const elements = Array.from(document.body.children)

  return elements.filter((element) => {
    // @ts-expect-error vue internal
    return !!element.id && (!!element.__vue_app__ || !!element.__vue__)
  })
}

const documentObserver = new MutationObserver(() => {
  const mountDoms = getMountDoms()

  if (mountDoms.length === 0) {
    return
  }

  if (window.__VUE_SCAN__) {
    mountDoms.forEach((mountDom) => {
      const node = document.getElementById(mountDom.id)
      if (node) {
        // @ts-expect-error vue internal
        if (node.__vue_app__) {
          documentObserver.disconnect()
        }

        injectVueScan(node)
      }
    })
  }
})

documentObserver.observe(document.body, {
  attributes: true,
  childList: true,
  subtree: true,
})
