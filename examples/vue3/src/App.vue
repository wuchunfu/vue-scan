<script setup lang="ts">
import { ref } from 'vue'

const a = ref('')
</script>

<template>
  <div>
    <div>
      {{ a }}
    </div>
    input: <input v-model="a">
  </div>
</template>
