import {
  updateHighlight as _updateHighlight,
  type ComponentHighLighterOptions,
  createHighlight,
  type VueAppInstance,
} from '@vue/devtools-kit'
import { throttle } from 'lodash-es'
import { getComponentBoundingRect, getInstanceName } from './utils'

type UpdateHighlightFn = (
  options: ComponentHighLighterOptions & { elementId?: string, style?: Partial<CSSStyleDeclaration> },
  flashCount: number,
  hideCompnentName?: boolean,
) => void

export function createUpdateHighlight(): UpdateHighlightFn {
  return throttle<UpdateHighlightFn>(
    (
      options: ComponentHighLighterOptions & { elementId?: string, style?: Partial<CSSStyleDeclaration> },
      flashCount: number,
      hideCompnentName?: boolean,
    ) => {
      _updateHighlight(options)

      if (!options.elementId) {
        return
      }

      const {
        bounds,
        elementId: uuid,
      } = options

      const continerEl = document.getElementById(uuid)
      if (!continerEl) {
        return
      }

      const styleEl = continerEl.querySelector('style')

      if (styleEl) {
        styleEl.innerHTML = `
#${uuid} {
  transition: opacity 3s ease-in-out, top 0.25s ease-in-out, left 0.25s ease-in-out;
}
#${uuid} #__vue-devtools-component-inspector__card__ {
  background-color: rgba(${Math.min(255, flashCount * 6)}, ${Math.max(0, 255 - flashCount * 6)}, 0, 0.8) !important;
  color: ${Math.min(255, flashCount * 6) > 128 ? '#fff' : '#000'} !important;
  font-size: 8px !important;
  line-height: 12px !important;
  padding: 2px 4px !important;
  top: ${bounds.top < 16 ? 0 : '-16px'} !important;
  display: ${hideCompnentName ? 'none' : 'block'} !important;
}

#${uuid} #__vue-devtools-component-inspector__indicator__ {
  display: none !important;
}

`
      }
    },
    300,
  )
}

export function highlight(
  instance: VueAppInstance & { __updateHighlight: UpdateHighlightFn },
  uuid: string,
  flashCount: number,
  options?: {
    hideCompnentName?: boolean
  },
) {
  const bounds = getComponentBoundingRect(instance)
  if (!bounds.width && !bounds.height)
    return
  const name = `${getInstanceName(instance)} x ${flashCount}`

  const continerEl = document.getElementById(uuid)
  if (continerEl) {
    instance.__updateHighlight(
      {
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
      },
      flashCount,
      options?.hideCompnentName,
    )

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
  background-color: rgba(${Math.min(255, flashCount * 6)}, ${Math.max(0, 255 - flashCount * 6)}, 0, 0.8) !important;
  color: ${Math.min(255, flashCount * 6) > 128 ? '#fff' : '#000'} !important;
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
