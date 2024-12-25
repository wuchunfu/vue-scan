export default defineContentScript({
  matches: ['<all_urls>'],
  async main() {
    // 获取 autoInject 状态和黑名单列表
    const {
      autoInject = false,
      blacklist: _blacklist,
    }: {
      autoInject: boolean
      blacklist: string
    } = await browser.storage.local.get(['autoInject', 'blacklist'])

    const blacklist = JSON.parse(_blacklist) as string[]

    // 检查当前 URL 是否在黑名单中
    const currentUrl = window.location.href
    const isBlacklisted = blacklist.some((pattern) => {
      if (pattern === '<all_urls>')
        return true

      try {
        // 将匹配模式转换为正则表达式
        const regexPattern = pattern
          .replace(/\./g, '\\.')
          .replace(/\*/g, '.*')
          .replace(/\?/g, '.')
        const regex = new RegExp(`^${regexPattern}$`)
        return regex.test(currentUrl)
      }
      catch {
        return false
      }
    })

    // 如果启用了自动注入且不在黑名单中，则注入脚本
    if (autoInject && !isBlacklisted) {
      console.log('Auto inject enabled and not blacklisted, injecting script...')
      const script = document.createElement('script')
      script.src = browser.runtime.getURL('/auto.cjs')
      script.onload = function () {
        console.log('script injected.')
      }
      document.body.appendChild(script)
    }
    else {
      console.log('Script injection skipped:', {
        autoInject,
        isBlacklisted,
        currentUrl,
      })
    }
  },
})
