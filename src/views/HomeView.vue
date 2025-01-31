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
import { fetchThreads, fetchUser, ForumClient, type Thread } from '@/lib/requests'
import { clearUser, getUserInfo } from '@/lib/utils'
import router from '@/router'
import { computed } from 'vue'

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
  queryKey: ['threads', userInfo.token],
  queryFn: ({ pageParam }: { pageParam: number }) => fetchThreads(pageParam, userInfo.token),
  initialPageParam: 0,
  getNextPageParam: (lastPage: Thread[], allPages, lastPageParam: number) => {
    if (lastPage.length < 5) {
      return undefined
    }
    return lastPageParam + 5
  },
})

const users = computed<number[] | undefined>(() =>
  data?.value?.pages.flat(1).map((thread) => thread.creatorId),
)

// const queries = computed(
//   () =>
//     users.value?.map((userId) => {
//       return {
//         queryKey: ['user', userId],
//         queryFn: () => fetchUser(userId, userInfo.token), // TODO: Add longer cache time to this query
//       }
//     }) || [],
// )

const queries2 = computed(() => {
  console.log(data.value?.pages.length)
  return data.value?.pages.length
    ? data.value.pages.flat(1).map((thread) => {
        return {
          queryKey: ['user', thread.creatorId],
          queryFn: () => fetchUser(thread.creatorId, userInfo.token),
        }
      })
    : []
})

// How to deal with potenitally undefined value????? what to do???
const userQueries = useQueries({ queries: queries2 }) // YOU HAVE TO PASS IT THE COMPUTED VALUE RAW, DONT DO QUERIES.VALUE. WTF THOUGH!!?? THESE DOCS ARE ASS
</script>

<template>
  <main class="h-full w-full grid grid-cols-10">
    <div class="col-span-4 lg:col-span-2">
      <div v-for="(threads, index) in data?.pages" :key="index" class="">
        <div v-for="thread in threads" :key="thread.id" class="">
          {{ thread.title }}
        </div>
      </div>
      <button class="btn" v-if="hasNextPage" @click="() => fetchNextPage()">Load More</button>
      <div v-for="user in userQueries" :key="user.data?.id">
        {{ user.data?.name }}
      </div>
    </div>
    <div class="col-span-6 lg:col-span-8">Post Content...</div>
  </main>
</template>
