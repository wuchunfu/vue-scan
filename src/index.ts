import { createHighlight, getComponentBoundingRect, getInstanceName, type VueAppInstance } from '@vue/devtools-kit'
import { isVue3, type Plugin } from 'vue-demi'

function highlight(instance: VueAppInstance, uuid: string) {
  const bounds = getComponentBoundingRect(instance)
  if (!bounds.width && !bounds.height)
    return
  const name = getInstanceName(instance)

  if (document.getElementById(uuid)) {
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
  transition: display 1s ease-in-out;
}
#${uuid} #__vue-devtools-component-inspector__card__ {
  background-color: rgba(255, 0, 0, 0.5) !important;
  font-size: 8px !important;
  line-height: 12px !important;
  padding: 2px 4px !important;
}

#${uuid} #__vue-devtools-component-inspector__indicator__ {
  display: none !important;
}

`
  el.appendChild(style)
}

function unhighlight(uuid: string) {
  const el = document.getElementById(uuid)
  if (el) {
    el.style.opacity = '0'
  }
}

function clearhighlight(uuid: string) {
  const el = document.getElementById(uuid)
  if (el) {
    document.body.removeChild(el)
  }
}

const plugin: Plugin = {
  install: (app: any) => {
    app.mixin({
      beforeCreate() {
        (this as any).__uuid = new Date().getTime()
      },
      // 如果组件重新渲染了，那么闪烁一下组件的边缘
      beforeUpdate() {
        const instance = (() => {
          if (isVue3) {
            return (this as any).$
          }
          else {
            return this
          }
        })() as VueAppInstance

        const el = (() => {
          if (isVue3) {
            return instance?.vnode.el
          }
          else {
            return instance?.$el
          }
        })() as HTMLElement | undefined

        if (el) {
          const name = getInstanceName(instance)
          const uuid = `${name}__${(this as any).__uuid as string}`

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
