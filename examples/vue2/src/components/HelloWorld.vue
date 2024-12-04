<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'HelloWorld',
  props: {
    value: String,
  },
  emits: ['update:value'],
  methods: {
    handleInput(e: Event) {
      this.$emit('update:value', (e.target as HTMLInputElement)?.value)
    },
  },
})
</script>

<template>
  <div>
    <div>
      {{ $props.value }}
    </div>
    input: <input :value="$props.value" @input="handleInput">
  </div>
</template>
