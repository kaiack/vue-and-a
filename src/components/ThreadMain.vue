<script setup lang="ts">
import type { Thread } from '@/lib/requests'

const props = defineProps<{ thread: Thread }>()
</script>
<template>
  <div>
    {{ props.thread.content }}
  </div>
</template>
