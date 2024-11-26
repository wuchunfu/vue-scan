export function isDev() {
  return (typeof __DEV__ !== 'undefined' && __DEV__)
    // eslint-disable-next-line node/prefer-global/process
    || (process.env.NODE_ENV === 'development')
    || (import.meta.env && import.meta.env.DEV === true)
}
