export interface VueScanBaseOptions {
  enable?: boolean
  hideCompnentName?: boolean
  interval?: number
}

export type VueScanOptions = [
  VueScanBaseOptions | undefined,
]
