export default defineBackground(() => {
  console.log('Background script started', { id: browser.runtime.id })

  browser.storage.local.get('autoInject').then(({ autoInject }) => {
    if (autoInject === undefined) {
      browser.storage.local.set({ autoInject: false })
    }
    console.log('Initial autoInject state:', autoInject)
  })

  browser.storage.onChanged.addListener((changes) => {
    if ('autoInject' in changes) {
      const { newValue, oldValue } = changes.autoInject
      console.log('Auto inject changed:', { newValue, oldValue })
    }
  })
})
