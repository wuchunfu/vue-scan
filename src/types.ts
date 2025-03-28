import type { HighlightCanvasOptions } from './core'

export interface VueScanBaseOptions extends HighlightCanvasOptions {
  enable?: boolean
  hideComponentName?: boolean
  interval?: number
}

export type VueScanOptions = [
  VueScanBaseOptions | undefined,
]
