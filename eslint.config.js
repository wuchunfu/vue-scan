import antfu from '@antfu/eslint-config'

export default antfu({
  ignores: [
    'docs',
    'dist',
    'packages/extension/.output',
    'packages/extension/.wxt',
    'packages/extension/public',
  ],
}, [
  {
    rules: {
      'no-console': ['warn'],
    },
  },
])
