<script setup lang="ts">
import type { Thread } from '@/lib/requests'

const props = defineProps<{ thread: Thread }>()
</script>
<template>
  <div>
    <div class="flex justify-between items-center">
      <h1 class="font-bold text-4xl">
        {{ props.thread.title }}
      </h1>
      <div class="flex">
        <div class="dropdown dropdown-hover">
          <div
            tabindex="0"
            role="button"
            class="btn m-1 bg-neutral text-neutral-content hover:text-neutral"
          >
            Options
          </div>
          <ul
            tabindex="0"
            class="dropdown-content menu bg-base-100 rounded-box z-[1] w-52 p-2 shadow"
          >
            <li><a>Edit</a></li>
            <li><a>Watch</a></li>
            <li><a>Delete</a></li>
          </ul>
        </div>
      </div>
    </div>
    <p>{{ props.thread.content }}</p>
    <div>{{ props.thread.creatorId }}</div>
  </div>
</template>
