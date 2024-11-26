# z-vue-scan

A Vue scanning plugin that works with both Vue 2 and Vue 3. The component will flash with a red border when it will update.

[![NPM version](https://img.shields.io/npm/v/z-vue-scan?color=a1b858&label=)](https://www.npmjs.com/package/z-vue-scan)

## Features

- 🎯 Works with both Vue 2 and Vue 3
- 🔄 Powered by [vue-demi](https://github.com/vueuse/vue-demi)
- 📦 Lightweight
- 💪 Written in TypeScript

## Installation

```bash
# npm
npm install z-vue-scan

# yarn
yarn add z-vue-scan

# pnpm
pnpm add z-vue-scan
```

## Usage

```ts
// vue3
import { createApp } from 'vue'
import VueScan from 'z-vue-scan'

import App from './App.vue'

const app = createApp(App)
app.use(VueScan)
app.mount('#app')
```

```ts
// vue2
import Vue from 'vue'
import VueScan from 'z-vue-scan/dist/index_vue2'
import App from './App.vue'

Vue.use(VueScan)

new Vue({
  render: h => h(App),
}).$mount('#app')
```

## Development

```bash
# Install dependencies
pnpm install

# Run development server with Vue 3 example
pnpm dev

# Run development server with Vue 2 example
pnpm dev:vue2

# Build the package
pnpm build

# Run type check
pnpm typecheck

# Run linting
pnpm lint
```

## License

[MIT](./LICENSE) License  2024 [zcf0508](https://github.com/zcf0508)
