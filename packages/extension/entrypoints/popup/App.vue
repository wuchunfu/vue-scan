<script lang="ts" setup>
import { onMounted, ref, watch } from 'vue'

const autoInjectEnabled = ref(false)

onMounted(async () => {
  const result = await browser.storage.local.get('autoInject')
  autoInjectEnabled.value = result.autoInject ?? false
})

watch(autoInjectEnabled, async (value) => {
  await browser.storage.local.set({ autoInject: value })
})
</script>

<template>
  <div class="min-w-[200px] p-4">
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
  </div>
</template>

<style scoped>

</style>
