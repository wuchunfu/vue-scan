<script lang="ts" setup>
import { onMounted, ref, watch } from 'vue'
import { autoInject, blacklist } from '../../utils/storage'

const autoInjectEnabled = ref(false)
const blacklistPatterns = ref<string[]>([])
const newPattern = ref('')

onMounted(async () => {
  const [isAutoInject, _patterns] = await Promise.all([
    autoInject.getValue(),
    blacklist.getValue(),
  ])

  autoInjectEnabled.value = Boolean(isAutoInject)
  blacklistPatterns.value = Object.values(_patterns)
})

// Watch autoInject changes
watch(autoInjectEnabled, async (value) => {
  await autoInject.setValue(value)
})

// Watch blacklist changes
watch(blacklistPatterns, async (value) => {
  await blacklist.setValue(value)
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

  if (!blacklistPatterns.value.includes(newPattern.value)) {
    blacklistPatterns.value = [...blacklistPatterns.value, newPattern.value]
    newPattern.value = ''
  }
}

async function removePattern(pattern: string) {
  blacklistPatterns.value = blacklistPatterns.value.filter(p => p !== pattern)
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
          class="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 outline-none border-none cursor-pointer"
          @click="addPattern"
        >
          Add
        </button>
      </div>

      <ul class="flex flex-col gap-1 pl-0">
        <li
          v-for="pattern in blacklistPatterns"
          :key="pattern"
          class="flex justify-between items-center gap-2 px-2 py-1 bg-gray-100 rounded"
        >
          <span class="truncate">{{ pattern }}</span>
          <button
            class="text-red-500 hover:text-red-600 cursor-pointer"
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
