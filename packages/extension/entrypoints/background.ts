import { autoInject, blacklist } from '../utils/storage'

export default defineBackground(() => {
  console.log('Background script started', { id: browser.runtime.id })

  console.log({
    autoInject,
    blacklist,
  })
})
