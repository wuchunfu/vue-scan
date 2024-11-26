<script setup lang="ts">
import { ref } from 'vue'
import HelloWorld from './components/HelloWorld.vue'

const b = ref('')
</script>

<template>
  <div>
    <div>
      {{ b }}
    </div>
    <HelloWorld :value="b" @update:value="(v) => b = v" />
  </div>
</template>
