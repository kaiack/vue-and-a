<script setup lang="ts">
import {
  useQueryClient,
  useQuery,
  useMutation,
  useInfiniteQuery,
  type QueryKey,
  type InfiniteData,
} from '@tanstack/vue-query'
import { fetchThreads, fetchUser, ForumClient, type Thread } from '@/lib/requests'
import { clearUser, getUserInfo } from '@/lib/utils'
import router from '@/router'

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
    // console.log(lastPage.length)
    if (lastPage.length < 5) {
      return undefined
    }
    return lastPageParam + 5
  },
})
</script>

<template>
  <main class="h-full w-full grid grid-cols-10">
    <div class="col-span-4 lg:col-span-2">
      <div v-for="(threads, index) in data?.pages" :key="index">
        <div v-for="thread in threads" :key="thread.id">
          {{ thread.title }}
        </div>
      </div>
      <button class="btn" v-if="hasNextPage" @click="() => fetchNextPage()">Load More</button>
    </div>
    <div class="col-span-6 lg:col-span-8">Post Content...</div>
  </main>
</template>
