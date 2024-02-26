<template>
  <div class="profile-page">
    <div ref="avatar">
      <pixel-avatar v-if="state.data.value?.id" :seed="state.data.value?.id" size="large" />
    </div>
    <pixel-button @click="handleSignout">
      {{ $t('indexPage.signOut') }}
      <template #append-icon>
        <icon name="pixelarticons:logout" />
      </template>
    </pixel-button>
    <pre>{{ JSON.stringify(state.data.value, null, 2) }}</pre>
  </div>
</template>

<script setup lang="ts">
import gsap from 'gsap'
import Draggable from 'gsap/Draggable'
gsap.registerPlugin(Draggable)

const toast = useToast()
const { state, signOut } = useAuth()
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
