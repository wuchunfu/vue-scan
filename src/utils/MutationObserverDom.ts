import { throttle } from 'lodash-es'

export function createDomMutationObserver<T extends Element>(
  getTarget: () => T | null,
  callback: MutationCallback,
  options?: MutationObserverInit,
  throttleWait: number = 200,
) {
  const targetObserver = new MutationObserver(throttle(callback, throttleWait))

  const findTargetObserver = new MutationObserver(throttle(() => {
    const target = getTarget()
    if (target) {
      findTargetObserver.disconnect()
      targetObserver.observe(target, options)
    }
  }, 200))

  findTargetObserver.observe(document.body, {
    childList: true,
    subtree: true,
  })

  return targetObserver
}
