import { autoInject, blacklist } from '../utils/storage'

export default defineContentScript({
  matches: ['<all_urls>'],
  async main() {
    const [isAutoInject, _blacklistPatterns] = await Promise.all([
      autoInject.getValue(),
      blacklist.getValue(),
    ])

    const blacklistPatterns = Object.values(_blacklistPatterns)

    // Check if current URL is blacklisted
    const currentUrl = window.location.href
    const isBlacklisted = blacklistPatterns.some((pattern) => {
      if (pattern === '<all_urls>')
        return true

      try {
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

    if (isAutoInject && !isBlacklisted) {
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
        isAutoInject,
        isBlacklisted,
        currentUrl,
      })
    }
  },
})
