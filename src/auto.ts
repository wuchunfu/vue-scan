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

function initializeObserver(node: HTMLElement) {
  let observer: MutationObserver | undefined

  const callback = () => {
    // @ts-expect-error vue internal
    if (node.__vue_app__ && window.__VUE_SCAN__) {
      observer?.disconnect()

      // @ts-expect-error vue internal
      node.__vue_app__.use(window.__VUE_SCAN__.plugin)

      // @ts-expect-error vue internal
      const vueInstance = node.__vue_app__._container._vnode.component as BACE_VUE_INSTANCE

      console.log(vueInstance)

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

        vueInstance.__vue_scan_injected__ = true

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

      console.log('vue scan inject success')
    }
  }

  observer = new MutationObserver(callback)

  observer.observe(node, {
    attributes: true,
    childList: true,
    subtree: true,
    characterData: true,
  })

  // Run the check immediately
  callback()
}

function getMountDoms() {
  const elements = Array.from(document.body.getElementsByTagName('*'))

  return elements.filter((element) => {
    // @ts-expect-error vue internal
    return !!element.id && !!element.__vue_app__
  })
}

const mountDoms = getMountDoms()

if (mountDoms.length === 0) {
  const documentObserver = new MutationObserver(() => {
    const mountDoms = getMountDoms()

    if (mountDoms.length === 0) {
      return
    }

    mountDoms.forEach((mountDom) => {
      const node = document.getElementById(mountDom.id)
      if (node) {
        documentObserver.disconnect()
        initializeObserver(node)
      }
    })
  })

  documentObserver.observe(document.body, {
    childList: true,
    subtree: true,
  })
}
else {
  mountDoms.forEach((mountDom) => {
    const node = document.getElementById(mountDom.id)
    if (node) {
      initializeObserver(node)
    }
  })
}
