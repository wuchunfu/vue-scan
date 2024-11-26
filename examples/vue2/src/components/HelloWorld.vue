<script setup lang="ts">
const props = defineProps(['value'])
const emit = defineEmits(['update:value'])

function handleInput(e: Event) {
  emit('update:value', (e.target as HTMLInputElement)?.value)
}
</script>

<template>
  <div>
    <div>
      {{ props.value }}
    </div>
    input: <input :value="props.value" @input="handleInput">
  </div>
</template>
