<script setup lang="ts">
import { useQueryClient, useQuery, useMutation } from '@tanstack/vue-query'
import { fetchUser, ForumClient } from '@/lib/requests'
import { clearUser, getUserInfo } from '@/lib/utils'
import router from '@/router'

// Access QueryClient instance
const queryClient = useQueryClient()
const userInfo = getUserInfo()
if (userInfo.token === '' || userInfo.userId === 0) {
  clearUser()
  router.push('/login')
}
// Query
const { isPending, isError, data, error } = useQuery({
  queryKey: ['user', userInfo.userId],
  queryFn: () => fetchUser(userInfo.userId, userInfo.token),
  // For some reason, this needs to be an arrow function that returns that function rather than the function itself like in the docs?!?!
})
</script>

<template>
  <main class="h-full w-full">
    <span v-if="isPending">Loading...</span>
    <span v-else-if="isError">Error: {{ error?.message }}</span>
    <span v-else>
      <div>{{ data?.id }}</div>
      <div>{{ data?.email }}</div>
      <div>{{ data?.name }}</div>
      <div>{{ data?.admin }}</div>
    </span>
  </main>
</template>
