import {
  updateHighlight as _updateHighlight,
  createHighlight,
  type VueAppInstance,
} from '@vue/devtools-kit'
import { throttle } from 'lodash-es'
import { getComponentBoundingRect, getInstanceName } from './utils'

const updateHighlight = throttle(_updateHighlight, 300)

export function highlight(instance: VueAppInstance, uuid: string, flashCount: number, options?: {
  hideCompnentName?: boolean
}) {
  const bounds = getComponentBoundingRect(instance)
  if (!bounds.width && !bounds.height)
    return
  const name = `${getInstanceName(instance)} x ${flashCount}`

  if (document.getElementById(uuid)) {
    updateHighlight({
      bounds,
      name,
      elementId: uuid,
      style: {
        backgroundColor: undefined,
        borderWidth: '2px',
        borderColor: `rgb(${Math.min(255, flashCount * 6)}, ${Math.max(0, 255 - flashCount * 6)}, 0)`,
        borderStyle: 'solid',
        opacity: '1',
      },
    })
    return
  }

  const el = createHighlight({
    bounds,
    name,
    elementId: uuid,
    style: {
      backgroundColor: undefined,
      borderWidth: '2px',
      borderColor: `rgb(${Math.min(255, flashCount * 6)}, ${Math.max(0, 255 - flashCount * 6)}, 0)`,
      borderStyle: 'solid',
      opacity: '1',
    },
  })

  // 创建 style 标签，插入到 el 中
  const style = document.createElement('style')

  style.innerHTML = `
#${uuid} {
  transition: opacity 3s ease-in-out, top 0.25s ease-in-out, left 0.25s ease-in-out;
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
    el.remove()
  }
}
