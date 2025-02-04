<script setup lang="ts">
import { clearUser } from '@/lib/utils'
import router from '@/router'

const logout = () => {
  clearUser()
  router.push('/login')
}

const goToProfile = () => {
  router.push('/profile')
}

const goHome = () => {
  router.push('/')
}
</script>

<template>
  <div class="navbar bg-base-100 border-b-2 border-neutral-content">
    <div class="flex-1">
      <a class="btn btn-ghost text-xl text-primary" @click="goHome">Vue & A</a>
    </div>
    <div class="flex-none">
      <div class="dropdown dropdown-end">
        <div tabindex="0" role="button" class="btn btn-ghost btn-circle avatar">
          <div class="w-10 rounded-full">
            <img
              alt="Tailwind CSS Navbar component"
              src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp"
            />
          </div>
        </div>
        <ul
          tabindex="0"
          class="menu menu-sm dropdown-content bg-base-100 rounded-box z-[1] mt-3 w-52 p-2 shadow"
        >
          <li>
            <a class="justify-between" @click="goToProfile">
              Profile
              <span class="badge">New</span>
            </a>
          </li>
          <li><a>Settings</a></li>
          <li><a @click="logout">Logout</a></li>
        </ul>
      </div>
    </div>
  </div>
</template>
