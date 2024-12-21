<script setup lang="ts">
import { ForumClient } from '@/lib/requests'
import { setUser } from '@/lib/utils'
import router from '@/router'
import { AxiosError } from 'axios'
import { ref } from 'vue'

const getInitialData = () => ({ email: '', password: '' })

const formData = ref(getInitialData())

const handleSubmit = async (event: Event) => {
  // TODO: Add toast for error
  try {
    const response = await ForumClient.post('auth/login', {
      email: formData.value.email,
      password: formData.value.password,
    })
    setUser(response.data.token, response.data.userId)
    formData.value = getInitialData()
    router.push('/')
  } catch (error) {
    console.log('error', (error as AxiosError).message)
  }
}
</script>

<template>
  <div class="flex justify-center items-center bg-base-200 w-full h-full">
    <div class="card bg-base-100 w-96 shadow-xl">
      <div class="card-body">
        <h2 class="card-title text-2xl font-bold mb-6">Login</h2>
        <form @submit.prevent="handleSubmit">
          <div class="form-control">
            <label class="label">
              <span class="label-text">Email</span>
            </label>
            <label class="input input-bordered flex items-center gap-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 16 16"
                fill="currentColor"
                class="w-4 h-4 opacity-70"
              >
                <path
                  d="M2.5 3A1.5 1.5 0 0 0 1 4.5v.793c.026.009.051.02.076.032L7.674 8.51c.206.1.446.1.652 0l6.598-3.185A.755.755 0 0 1 15 5.293V4.5A1.5 1.5 0 0 0 13.5 3h-11Z"
                />
                <path
                  d="M15 6.954 8.978 9.86a2.25 2.25 0 0 1-1.956 0L1 6.954V11.5A1.5 1.5 0 0 0 2.5 13h11a1.5 1.5 0 0 0 1.5-1.5V6.954Z"
                />
              </svg>
              <input
                type="email"
                class="grow"
                placeholder="email@example.com"
                v-model="formData.email"
              />
            </label>
          </div>
          <div class="form-control mt-4">
            <label class="label">
              <span class="label-text">Password</span>
            </label>
            <label class="input input-bordered flex items-center gap-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 16 16"
                fill="currentColor"
                class="w-4 h-4 opacity-70"
              >
                <path
                  fill-rule="evenodd"
                  d="M14 6a4 4 0 0 1-4.899 3.899l-1.955 1.955a.5.5 0 0 1-.353.146H5v1.5a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1-.5-.5v-2.293a.5.5 0 0 1 .146-.353l3.955-3.955A4 4 0 1 1 14 6Zm-4-2a.75.75 0 0 0 0 1.5.5.5 0 0 1 .5.5.75.75 0 0 0 1.5 0 2 2 0 0 0-2-2Z"
                  clip-rule="evenodd"
                />
              </svg>
              <input
                type="password"
                class="grow"
                placeholder="Enter password"
                v-model="formData.password"
              />
            </label>
          </div>
          <div class="form-control mt-6">
            <button class="btn btn-primary">Login</button>
          </div>
        </form>
        <div class="text-center">
          <p class="inline mr-2">Don't have an account?</p>
          <RouterLink to="/register" class="link link-primary">Register</RouterLink>
        </div>
      </div>
    </div>
  </div>
</template>
