<script setup lang="ts">
import type { Comment } from '@/lib/requests'
import type { nestedComment } from '@/views/ThreadView.vue'

const props = defineProps<{ comment: nestedComment }>()
</script>
<template>
  <div class="border-l-2 border-primary">
    <div class="ml-3">
      {{ props.comment.content }}
      <ThreadComment v-for="child in comment.children" :comment="child" :key="child.id" />
    </div>
  </div>
</template>
