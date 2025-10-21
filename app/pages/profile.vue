<template>
  <div class="profile-page">
    <div ref="avatar">
      <PixelAvatar v-if="session.data.value?.id" :seed="session.data.value?.id" large />
    </div>
    <PixelButton @click="handleSignout">
      {{ $t('page.index.signOut') }}
      <template #append-icon>
        <icon name="pixelarticons:logout" />
      </template>
    </PixelButton>
    <pre>{{ JSON.stringify(session.data.value, null, 2) }}</pre>
  </div>
</template>

<script setup lang="ts">
import PixelAvatar from '~/components/pixel/PixelAvatar.vue'
import PixelButton from '~/components/pixel/PixelButton.vue'

import gsap from 'gsap'
import Draggable from 'gsap/Draggable'
gsap.registerPlugin(Draggable)

const toast = useToast()
const { session, signOut } = useAuth()
const avatar = ref<HTMLElement>()

onMounted(() => {
  if (!avatar.value) return
  Draggable.create(avatar.value, {
    inertia: true,
  })
})

async function handleSignout() {
  const { error } = await signOut({ redirectTo: '/auth' })
  if (error) toast.error(error)
}
</script>

<style lang="scss" scoped>
.profile-page {
  flex: 1;
}
</style>
