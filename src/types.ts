export interface VueScanBaseOptions {
  enable?: boolean
  hideCompnentName?: boolean
}

export type VueScanOptions = [
  VueScanBaseOptions | undefined,
]
