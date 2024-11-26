import type { VueScanBaseOptions } from '../types'
import { createHighlight, getComponentBoundingRect, getInstanceName, updateHighlight, type VueAppInstance } from '@vue/devtools-kit'

export function highlight(instance: VueAppInstance, uuid: string, options?: VueScanBaseOptions) {
  const bounds = getComponentBoundingRect(instance)
  if (!bounds.width && !bounds.height)
    return
  const name = getInstanceName(instance)

  if (document.getElementById(uuid)) {
    updateHighlight({
      bounds,
      name,
      elementId: uuid,
      style: {
        backgroundColor: undefined,
        borderWidth: '1px',
        borderColor: 'red',
        borderStyle: 'solid',
        opacity: '1',
      },
    })
    const el = document.getElementById(uuid)
    if (el?.style) {
      el.style.opacity = '1'
    }
    return
  }

  const el = createHighlight({
    bounds,
    name,
    elementId: uuid,
    style: {
      backgroundColor: undefined,
      borderWidth: '1px',
      borderColor: 'red',
      borderStyle: 'solid',
      opacity: '1',
    },
  })

  // 创建 style 标签，插入到 el 中
  const style = document.createElement('style')

  style.innerHTML = `
#${uuid} {
  transition: opacity 1.5s ease-in-out, top 0.5s ease-in-out, left 0.5s ease-in-out;
}
#${uuid} #__vue-devtools-component-inspector__card__ {
  background-color: rgba(255, 0, 0, 0.5) !important;
  font-size: 8px !important;
  line-height: 12px !important;
  padding: 2px 4px !important;
  top: ${bounds.top < 16 ? 0 : '-16px'} !important;
  display: ${options?.hideCompnentName ? 'none' : 'block'} !important;
}

#${uuid} #__vue-devtools-component-inspector__indicator__ {
  display: none !important;
}

`
  el.appendChild(style)
}

export function unhighlight(uuid: string) {
  const el = document.getElementById(uuid)
  if (el) {
    el.style.opacity = '0'
  }
}

export function clearhighlight(uuid: string) {
  const el = document.getElementById(uuid)
  if (el) {
    document.body.removeChild(el)
  }
}
