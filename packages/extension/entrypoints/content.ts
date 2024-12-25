export default defineContentScript({
  matches: ['<all_urls>'],
  async main() {
    // 获取 autoInject 状态
    const { autoInject = false } = await browser.storage.local.get('autoInject')

    // 根据状态决定是否注入脚本
    if (autoInject) {
      console.log('Auto inject enabled, injecting script...')
      const script = document.createElement('script')
      script.src = browser.runtime.getURL('/auto.cjs')
      script.onload = function () {
        console.log('script injected.')
      }
      document.body.appendChild(script)
    }
    else {
      console.log('Auto inject disabled, skipping script injection')
    }
  },
})
