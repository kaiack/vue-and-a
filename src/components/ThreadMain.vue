<script setup lang="ts">
import type { Thread, UserInfo } from '@/lib/requests'
import { getUserInfo } from '@/lib/utils'
import { computed } from 'vue'

const props = defineProps<{ thread: Thread; creator: UserInfo | undefined }>()
const userInfo = getUserInfo()
// TODO: Add default creator value here
const creatorInfo = computed<UserInfo>(() =>
  props.creator
    ? props.creator
    : {
        id: 0,
        email: 'email@email.com',
        name: 'John Smith',
        password: '',
        image: 'https://i.sstatic.net/l60Hf.png',
        admin: false,
      },
)
</script>
<template>
  <div>
    <div class="grid grid-cols-10">
      <div class="col-span-1">
        <div class="flex gap-12">
          <div class="flex flex-col items-center gap-2">
            <img
              src="https://t4.ftcdn.net/jpg/02/15/84/43/360_F_215844325_ttX9YiIIyeaR7Ne6EaLLjMAmy4GvPC69.jpg"
              alt="default profile picture"
              class="w-16 rounded-full"
            />
            <div>
              {{ creatorInfo.name }}
            </div>
            <div class="flex flex-col items-center justify-between">
              <div v-if="props.thread.likes.includes(userInfo.userId)">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  class="size-6"
                >
                  <path
                    d="m11.645 20.91-.007-.003-.022-.012a15.247 15.247 0 0 1-.383-.218 25.18 25.18 0 0 1-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0 1 12 5.052 5.5 5.5 0 0 1 16.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 0 1-4.244 3.17 15.247 15.247 0 0 1-.383.219l-.022.012-.007.004-.003.001a.752.752 0 0 1-.704 0l-.003-.001Z"
                  />
                </svg>
              </div>
              <div v-else>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke-width="1.5"
                  stroke="currentColor"
                  class="size-6"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z"
                  />
                </svg>
              </div>
              <div>
                {{ props.thread.likes.length }}
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="col-span-9">
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
      </div>
    </div>
  </div>
</template>
