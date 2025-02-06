<script setup lang="ts">
// in <script setup>
const props = defineProps({
  title: String,
  likes: Number,
  creator: String,
  createdAt: String,
  isLiked: Boolean,
})
</script>

<template>
  <div class="card bg-base-100 w-full shadow-md">
    <div class="card-body">
      <div class="flex justify-between items-center">
        <h2 class="card-title">{{ props.title }}</h2>
        <div>{{ props.likes }} {{ isLiked && '<3' }}</div>
      </div>
      <div class="flex justify-between items-center">
        <div class="text-md">{{ props.creator }}</div>
        <div class="text-md">{{ props.createdAt }}</div>
      </div>
    </div>
  </div>
</template>
