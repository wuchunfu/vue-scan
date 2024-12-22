import { throttle } from 'lodash-es'
import { getComponentBoundingRect, getInstanceName } from './utils'

export interface ComponentBoundingRect {
  top: number
  left: number
  width: number
  height: number
  right: number
  bottom: number
}

export function isInViewport(bounds: ComponentBoundingRect): boolean {
  const viewportWidth = window.innerWidth
  const viewportHeight = window.innerHeight
  const scrollTop = window.scrollY
  const scrollLeft = window.scrollX

  return !(
    bounds.right < scrollLeft
    || bounds.bottom < scrollTop
    || bounds.left > scrollLeft + viewportWidth
    || bounds.top > scrollTop + viewportHeight
  )
}

interface HighlightItem {
  bounds: ComponentBoundingRect
  name: string
  flashCount: number
  hideComponentName: boolean
  startTime: number
  lastUpdateTime: number
  opacity: number
  state: 'fade-in' | 'visible' | 'fade-out'
}

class HighlightCanvas {
  private canvas: HTMLCanvasElement
  private ctx: CanvasRenderingContext2D
  private readonly DISPLAY_DURATION = 3000
  private readonly FADE_IN_DURATION = 300
  private readonly FADE_OUT_DURATION = 1000
  private highlights: Map<string, HighlightItem> = new Map()
  private animationFrame: number | null = null
  private textMetricsCache: Map<string, TextMetrics> = new Map()

  constructor() {
    this.canvas = document.createElement('canvas')
    this.canvas.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      pointer-events: none;
      z-index: 9999;
    `
    this.ctx = this.canvas.getContext('2d')!
    document.body.appendChild(this.canvas)
    this.updateCanvasSize()
    window.addEventListener('resize', () => this.updateCanvasSize())
  }

  private updateCanvasSize() {
    this.canvas.width = window.innerWidth
    this.canvas.height = window.innerHeight
  }

  drawHighlight(bounds: ComponentBoundingRect, uuid: string, name: string, flashCount: number, hideComponentName = false) {
    const now = Date.now()
    const existingItem = this.highlights.get(uuid)

    if (existingItem) {
      existingItem.bounds = bounds
      existingItem.name = name
      existingItem.flashCount = flashCount
      existingItem.hideComponentName = hideComponentName
      existingItem.lastUpdateTime = now

      if (existingItem.state === 'fade-out') {
        existingItem.state = 'visible'
        existingItem.opacity = 1
      }
    }
    else {
      this.highlights.set(uuid, {
        bounds,
        name,
        flashCount,
        hideComponentName,
        startTime: now,
        lastUpdateTime: now,
        opacity: 0,
        state: 'fade-in',
      })
    }

    this.scheduleRender()
  }

  private scheduleRender() {
    if (this.animationFrame)
      return
    this.animationFrame = requestAnimationFrame(() => this.render())
  }

  private render() {
    const now = Date.now()

    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)

    const scrollLeft = window.scrollX
    const scrollTop = window.scrollY

    this.ctx.font = '12px sans-serif'
    this.ctx.textBaseline = 'middle'

    for (const [uuid, item] of this.highlights.entries()) {
      if (!isInViewport(item.bounds))
        continue

      const fadeInElapsed = now - item.startTime
      const idleTime = now - item.lastUpdateTime
      const fadeOutElapsed = now - item.startTime

      switch (item.state) {
        case 'fade-in':
          item.opacity = Math.min(1, fadeInElapsed / this.FADE_IN_DURATION)
          if (fadeInElapsed >= this.FADE_IN_DURATION) {
            item.state = 'visible'
            item.opacity = 1
          }
          break

        case 'visible':
          if (idleTime >= this.DISPLAY_DURATION) {
            item.state = 'fade-out'
            item.startTime = now
          }
          break

        case 'fade-out':
          item.opacity = Math.max(0, 1 - (fadeOutElapsed / this.FADE_OUT_DURATION))
          if (fadeOutElapsed >= this.FADE_OUT_DURATION) {
            this.highlights.delete(uuid)
            continue
          }
          break
      }

      this.drawBorder(item, scrollLeft, scrollTop)
      if (!item.hideComponentName) {
        this.drawLabel(item, scrollLeft, scrollTop, item.opacity)
      }
    }

    if (this.highlights.size > 0) {
      this.animationFrame = requestAnimationFrame(() => this.render())
    }
    else {
      this.animationFrame = null
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
    }
  }

  private drawBorder(item: HighlightItem, scrollLeft: number, scrollTop: number) {
    const { bounds, flashCount, opacity } = item
    this.ctx.strokeStyle = `rgba(${Math.min(255, flashCount * 6)}, ${Math.max(0, 255 - flashCount * 6)}, 0, ${opacity})`
    this.ctx.lineWidth = 2
    this.ctx.strokeRect(
      bounds.left - scrollLeft,
      bounds.top - scrollTop,
      bounds.width,
      bounds.height,
    )
  }

  private drawLabel(item: HighlightItem, scrollLeft: number, scrollTop: number, opacity: number) {
    const { bounds, name, flashCount } = item
    const labelMetrics = this.getTextMetrics(name)
    const padding = 6
    const labelHeight = 20

    // 计算标签位置
    let labelX = bounds.left - scrollLeft + padding // 在框内左侧
    let labelY = bounds.top - scrollTop + padding // 在框内顶部

    // 确保标签在视口内
    const viewportHeight = window.innerHeight
    const labelTotalHeight = labelHeight + padding * 2

    // 如果标签底部超出视口
    if (labelY + labelTotalHeight > viewportHeight) {
      // 将标签固定在视口底部
      labelY = viewportHeight - labelTotalHeight - padding
    }

    // 如果标签右侧超出视口
    const viewportWidth = window.innerWidth
    const labelTotalWidth = labelMetrics.width + padding * 2
    if (labelX + labelTotalWidth > viewportWidth) {
      // 将标签固定在视口右侧
      labelX = viewportWidth - labelTotalWidth - padding
    }

    // 绘制背景
    this.ctx.fillStyle = `rgba(${Math.min(255, flashCount * 6)}, ${Math.max(0, 255 - flashCount * 6)}, 0, ${opacity * 0.8})`
    this.ctx.fillRect(labelX, labelY, labelMetrics.width + padding * 2, labelHeight)

    // 绘制文本
    this.ctx.fillStyle = Math.min(255, flashCount * 6) > 128
      ? `rgba(255, 255, 255, ${opacity})`
      : `rgba(0, 0, 0, ${opacity})`
    this.ctx.fillText(name, labelX + padding, labelY + labelHeight / 2)
  }

  private getTextMetrics(text: string): TextMetrics {
    const cached = this.textMetricsCache.get(text)
    if (cached)
      return cached

    const metrics = this.ctx.measureText(text)
    this.textMetricsCache.set(text, metrics)
    return metrics
  }

  clear(uuid: string) {
    const item = this.highlights.get(uuid)
    if (item && item.state !== 'fade-out') {
      item.state = 'fade-out'
      item.startTime = Date.now()
      this.scheduleRender()
    }
  }

  clearAll() {
    this.highlights.clear()
    this.textMetricsCache.clear()
    if (this.animationFrame) {
      cancelAnimationFrame(this.animationFrame)
      this.animationFrame = null
    }
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
  }

  destroy() {
    this.clearAll()
    if (this.canvas && this.canvas.parentNode) {
      this.canvas.parentNode.removeChild(this.canvas)
    }
  }
}

let highlightCanvas: HighlightCanvas | null = new HighlightCanvas()

window.addEventListener('unload', () => {
  if (highlightCanvas) {
    highlightCanvas.destroy()
    highlightCanvas = null
  }
})

type UpdateHighlightFn = (
  bounds: ComponentBoundingRect,
  name: string,
  flashCount: number,
  hideComponentName?: boolean
) => void

export function createUpdateHighlight(): UpdateHighlightFn {
  return throttle<UpdateHighlightFn>(
    (bounds, name, flashCount, hideComponentName) => {
      if (!isInViewport(bounds) || !highlightCanvas)
        return
      highlightCanvas.drawHighlight(bounds, name, name, flashCount, hideComponentName)
    },
    500,
  )
}

export function highlight(
  instance: any,
  uuid: string,
  flashCount: number,
  options?: {
    hideComponentName?: boolean
  },
) {
  const bounds = getComponentBoundingRect(instance)
  if (!bounds.width && !bounds.height)
    return
  if (!isInViewport(bounds))
    return

  const name = `${getInstanceName(instance)} x ${flashCount}`
  highlightCanvas?.drawHighlight(bounds, uuid, name, flashCount, options?.hideComponentName)
}

export function unhighlight(uuid: string) {
  highlightCanvas?.clear(uuid)
}

export function clearhighlight(uuid: string) {
  highlightCanvas?.clear(uuid)
}
