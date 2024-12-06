import type { VueAppInstance } from '@vue/devtools-kit'
import { getInstanceName } from '@vue/devtools-kit'
import { clearhighlight, highlight, unhighlight } from './highlight'

export interface BACE_VUE_INSTANCE extends VueAppInstance {
  __vue_scan_injected__?: boolean
  /** beforeUpdate */
  bu?: Array<() => void> | null
  /** beforeUnmount */
  bum?: Array<() => void> | null
  _uid?: number
  __flashCount?: number
  __flashTimeout?: ReturnType<typeof setTimeout> | null
  $options?: {
    beforeUpdate?: Array<() => void> | null
    beforeDestroy?: Array<() => void> | null
  }
}

export function createOnBeforeUpdateHook(instance?: BACE_VUE_INSTANCE, options?: {
  hideCompnentName?: boolean
  interval?: number
}) {
  const {
    interval = 1000,
  } = options || {}

  if (!instance) {
    return
  }

  const el = instance?.subTree?.el || instance.$el

  if (!el) {
    return
  }

  const name = getInstanceName(instance)
  const uuid = `${name}__${instance.uid || instance._uid}`.replaceAll(' ', '_')

  return () => {
    if (!instance.__flashCount) {
      instance.__flashCount = 0
    }

    instance.__flashCount++

    highlight(instance, uuid, instance.__flashCount, options)

    if (instance.__flashTimeout) {
      clearTimeout(instance.__flashTimeout)
      instance.__flashTimeout = null
    }

    instance.__flashTimeout = setTimeout(() => {
      unhighlight(uuid)
      instance.__flashTimeout = null
      instance.__flashCount = 0
    }, interval)
  }
}

export function createOnBeforeUnmountHook(instance?: BACE_VUE_INSTANCE) {
  if (!instance) {
    return
  }

  const el = instance?.subTree?.el || instance.$el

  if (!el) {
    return
  }

  const name = getInstanceName(instance)
  const uuid = `${name}__${instance.uid || instance._uid}`.replaceAll(' ', '_')

  return () => {
    clearhighlight(uuid)
  }
}
