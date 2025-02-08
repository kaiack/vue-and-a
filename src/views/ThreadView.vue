<script setup lang="ts">
import { fetchComments, fetchThread, fetchUser } from '@/lib/requests'
import type { Comment } from '@/lib/requests'
import { getUserInfo } from '@/lib/utils'
import { useQuery } from '@tanstack/vue-query'
import { computed } from 'vue'
import ThreadMain from '@/components/ThreadMain.vue'
const userInfo = getUserInfo()

const props = defineProps<{ threadId: number }>()
const isEnabled = computed(() => {
  return props.threadId !== -1
})
const {
  isPending: isThreadPending,
  isError: isThreadError,
  isLoading,
  data: threadData, // WHY THIS NO WORKY???!?!?
  error: ThreadError,
  refetch,
} = useQuery({
  queryKey: ['thread', props], // KEY HAS TO BE THE REF ITSELF NOT THE VALUE FOR THIS TO WORK!!!
  queryFn: () => fetchThread(props.threadId, userInfo.token),
  staleTime: 30 * 1000,
  enabled: isEnabled,
  // For some reason, this needs to be an arrow function that returns that function rather than the function itself like in the docs?!?!
})

const creatorId = computed(() => threadData.value?.creatorId)
const threadId2 = computed(() => threadData.value?.id)
const enableThreadQueries = computed(() => !!threadData.value?.creatorId)
const enableCommentQueries = computed(() => !!threadData.value?.id)

const {
  isLoading: isUserLoading,
  isError,
  error,
  data: creatorData,
} = useQuery({
  queryKey: ['user', creatorId],
  queryFn: () => fetchUser(creatorId.value || 1, userInfo.token), // TODO: Better way to handle the creatorId == undefined case?
  staleTime: 60 * 1000,
  enabled: enableThreadQueries,
})

const {
  isLoading: isCommmentsLoading,
  isError: isCommentError,
  error: commentError,
  data: commentsData,
} = useQuery({
  queryKey: ['comments', threadId2],
  queryFn: () => fetchComments(threadId2.value || 0, userInfo.token), // TODO: Better way to handle the creatorId == undefined case?
  staleTime: 5 * 1000,
  enabled: enableCommentQueries,
})

export type nestedComment = Comment & { children: nestedComment[] }

const rootComments = computed(() => {
  const map = new Map()
  const roots: nestedComment[] = []

  // First, build a map where each key is a comment id and value is the comment itself
  commentsData.value?.forEach((comment) => {
    map.set(comment.id, { ...comment, children: [] })
  })

  // Then, assign comments to their parent based on parentCommentId
  commentsData.value?.forEach((comment) => {
    if (comment.parentCommentId === null) {
      roots.push(map.get(comment.id))
    } else {
      const parent = map.get(comment.parentCommentId)
      parent.children.push(map.get(comment.id))
    }
  })

  return roots
})
// TODO Fetch Comment data here as well
</script>
<template>
  <div class="flex justify-center h-full">
    <div v-if="threadData" class="w-full flex lg:pl-10 lg:pr-0 px-5 justify-center">
      <div class="w-full">
        <ThreadMain :thread="threadData" :creator="creatorData" :comments="rootComments" />
      </div>
      <!-- Add Comments component here -->
    </div>
    <div v-else-if="isLoading" class="flex justify-center mt-5">
      <span class="loading loading-spinner loading-lg"></span>
    </div>
    <div v-else class="flex flex-col items-center w-full">
      <div class="flex w-1/5 flex-col gap-4 mt-10">
        <div class="skeleton h-32 w-full"></div>
        <div class="skeleton h-4 w-28"></div>
        <div class="skeleton h-4 w-full"></div>
        <div class="skeleton h-4 w-full"></div>
      </div>
      <h2 class="mt-5 text-primary-content">Select a thread</h2>
    </div>
  </div>
</template>
