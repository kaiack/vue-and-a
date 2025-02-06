<script setup lang="ts">
import {
  useQueryClient,
  useQuery,
  useMutation,
  useInfiniteQuery,
  type QueryKey,
  type InfiniteData,
  useQueries,
} from '@tanstack/vue-query'
import {
  fetchThread,
  fetchThreads,
  fetchUser,
  ForumClient,
  type Thread,
  type UserInfo,
} from '@/lib/requests'
import { clearUser, getUserInfo } from '@/lib/utils'
import router from '@/router'
import { computed, ref } from 'vue'
import ListCard from '@/components/ListCard.vue'

import ThreadView from './ThreadView.vue'

// Access QueryClient instance
const queryClient = useQueryClient()
const userInfo = getUserInfo()
if (userInfo.token === '' || userInfo.userId === 0) {
  clearUser()
  router.push('/login')
}
// // Query
// const { isPending, isError, data, error } = useQuery({
//   queryKey: ['user', userInfo.userId],
//   queryFn: () => fetchUser(userInfo.userId, userInfo.token),
//   // For some reason, this needs to be an arrow function that returns that function rather than the function itself like in the docs?!?!
// })
// const start = 0
// const { isPending, isError, data, error } = useQuery({
//   queryKey: ['threads', start],
//   queryFn: () => fetchThreads(0, userInfo.token),
// })

const {
  data,
  error,
  fetchNextPage,
  hasNextPage,
  isFetching,
  isFetchingNextPage,
  isPending,
  isError,
  // } = useInfiniteQuery<Thread[], Error, Thread[], string[], number>({
} = useInfiniteQuery<Thread[], Error, InfiniteData<Thread[], unknown>, QueryKey, number>({
  queryKey: ['threads'],
  queryFn: ({ pageParam }: { pageParam: number }) => fetchThreads(pageParam, userInfo.token),
  initialPageParam: 0,
  getNextPageParam: (lastPage: Thread[], allPages, lastPageParam: number) => {
    if (lastPage.length < 5) {
      return undefined
    }
    return lastPageParam + 5
  },
})

const users = computed<number[] | undefined>(() => [
  ...new Set(data?.value?.pages.flat(1).map((thread) => thread.creatorId)),
])

const queries = computed(
  () =>
    users.value?.map((userId) => {
      return {
        queryKey: ['user', userId],
        queryFn: () => fetchUser(userId, userInfo.token), // TODO: Add longer cache time to this query
        staleTime: 60 * 1000,
      }
    }) || [],
)

// const queries2 = computed(() => {
//   console.log(data.value?.pages.length)
//   return data.value?.pages.length
//     ? data.value.pages.flat(1).map((thread) => {
//         return {
//           queryKey: ['user', thread.creatorId],
//           queryFn: () => fetchUser(thread.creatorId, userInfo.token),
//           staleTime: 60 * 1000,
//         }
//       })
//     : []
// })

// How to deal with potenitally undefined value????? what to do???
const userQueries = useQueries({ queries: queries }) // YOU HAVE TO PASS IT THE COMPUTED VALUE RAW, DONT DO QUERIES.VALUE. WTF THOUGH!!?? THESE DOCS ARE ASS
const usersMap = computed(
  () => new Map(userQueries.value.map((user) => [user.data?.id, { ...user.data }])),
)
const currentThreadId = ref<number>(-1)

// const currentThread = computed<Thread | null>(() => {
//   return threadInfo.value ? threadInfo.value : null
// })
const fetchThreadData = (threadId: number) => {
  currentThreadId.value = threadId
  // refetch()
}
</script>

<template>
  <main class="h-full w-full grid grid-cols-10 bg-base-100">
    <div
      class="col-span-4 lg:col-span-2 px-2 border-r-2 border-solid border-neutral-content rounded-3xl pt-2 bg-base-200"
    >
      <div v-for="(threads, index) in data?.pages" :key="index" class="">
        <!-- <div v-for="thread in threads" :key="thread.id" class="">
          {{ thread.title }}
          {{ usersMap.get(thread.creatorId)?.name }}
        </div> -->
        <ListCard
          v-for="thread in threads"
          :created-at="thread.createdAt"
          :creator="usersMap.get(thread.creatorId)?.name || ''"
          :title="thread.title"
          :likes="thread.likes.length"
          :isLiked="thread.likes.includes(userInfo.userId)"
          :key="thread.id"
          class="mb-4 bg-base-100 text-secondary-content"
          @click="fetchThreadData(thread.id)"
        />
      </div>
      <div class="flex w-full justify-center">
        <button class="btn bg-accent" v-if="hasNextPage" @click="() => fetchNextPage()">
          Load More
        </button>
      </div>
    </div>
    <div class="col-span-6 lg:col-span-8 p-4">
      <ThreadView :thread-id="currentThreadId" />
    </div>
  </main>
</template>
