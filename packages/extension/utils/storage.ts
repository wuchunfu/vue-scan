import { storage } from 'wxt/storage'

export const autoInject = storage.defineItem<boolean>('local:autoInject', {
  fallback: false,
})

export const blacklist = storage.defineItem<string[]>('local:blacklist', {
  fallback: [],
})
