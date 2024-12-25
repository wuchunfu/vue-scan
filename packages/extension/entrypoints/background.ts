export default defineBackground(() => {
  console.log('Background script started', { id: browser.runtime.id })

  browser.storage.local.get(['autoInject', 'blacklist']).then((result) => {
    const updates: Record<string, any> = {}

    if (result.autoInject === undefined)
      updates.autoInject = false

    if (!Array.isArray(result.blacklist))
      updates.blacklist = []

    if (Object.keys(updates).length > 0) {
      browser.storage.local.set(updates)
      console.log('Initial storage state updated:', updates)
    }
  })
})
