<script setup lang="ts">
import { ref } from 'vue'

const b = ref('')
</script>

<template>
  <div>
    <div>
      {{ b }}
    </div>
    <HelloWorld v-model:msg="b" />
  </div>
</template>
