<script lang="ts" setup>
import { onMounted, ref, watch } from 'vue'

const autoInjectEnabled = ref(false)
const blacklist = ref<string[]>([])
const newPattern = ref('')

onMounted(async () => {
  const result = await browser.storage.local.get(['autoInject', 'blacklist'])
  autoInjectEnabled.value = Boolean(result.autoInject ?? false)
  blacklist.value = (() => {
    try {
      return JSON.parse(_blacklist ?? '[]') as string[]
    }
    catch {
      return []
    }
  })()
})

// 监听 autoInjectEnabled 的变化
watch(autoInjectEnabled, async (value) => {
  await browser.storage.local.set({ autoInject: value })
})

// 监听 blacklist 的变化
watch(blacklist, async (value) => {
  await browser.storage.local.set({ blacklist: JSON.stringify(value) })
}, { deep: true })

function isValidPattern(pattern: string) {
  try {
    if (pattern === '<all_urls>')
      return true
    return /^(?:\*|https?|file|ftp|urn):\/\/[^/]*\/.*$/.test(pattern)
  }
  catch {
    return false
  }
}

async function addPattern() {
  if (!newPattern.value || !isValidPattern(newPattern.value)) {
    // eslint-disable-next-line no-alert
    alert('Invalid pattern! Format should be like: *://*.example.com/*')
    return
  }

  if (!blacklist.value?.includes(newPattern.value)) {
    blacklist.value = [...blacklist.value, newPattern.value]
    newPattern.value = ''
  }
}

async function removePattern(pattern: string) {
  blacklist.value = blacklist.value.filter(p => p !== pattern)
}
</script>

<template>
  <div class="min-w-[300px] p-4 flex flex-col gap-4">
    <label class="flex gap-1 items-center justify-between cursor-pointer">
      <span>
        Inject &nbsp;<a href="https://github.com/zcf0508/vue-scan">Vue Scan</a>.
      </span>
      <input
        v-model="autoInjectEnabled"
        class="cursor-pointer"
        type="checkbox"
      >
    </label>

    <div class="flex flex-col gap-2">
      <h3 class="font-medium">
        Blacklist patterns:
      </h3>
      <div class="flex gap-2">
        <input
          v-model="newPattern"
          placeholder="e.g. *://*.example.com/*"
          class="flex-1 px-2 py-1 border rounded"
          @keyup.enter="addPattern"
        >
        <button
          class="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
          @click="addPattern"
        >
          Add
        </button>
      </div>

      <ul class="flex flex-col gap-1">
        <li
          v-for="pattern in blacklist"
          :key="pattern"
          class="flex justify-between items-center gap-2 px-2 py-1 bg-gray-100 rounded"
        >
          <span class="truncate">{{ pattern }}</span>
          <button
            class="text-red-500 hover:text-red-600"
            @click="removePattern(pattern)"
          >
            ✕
          </button>
        </li>
      </ul>
    </div>
  </div>
</template>

<style scoped>
input[type="checkbox"] {
  accent-color: #2563eb;
}
</style>
