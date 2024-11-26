<script setup lang="ts">
const msg = defineModel('msg', '')
</script>

<template>
  <div>
    <div>
      {{ msg }}
    </div>
    input: <input v-model="msg">
  </div>
</template>
