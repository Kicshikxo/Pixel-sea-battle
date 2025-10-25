<template>
  <div class="room-page">
    <PixelContainer full-width>
      <RoomBoard />
    </PixelContainer>

    <PixelContainer full-width>
      <RoomMessages
        ref="roomMessages"
        :messages="socketRoomStore.messages"
        :loading="sendMessageLoading"
        @send-message="handleSendMessage"
      />
    </PixelContainer>
  </div>
</template>

<script setup lang="ts">
import RoomBoard from '~/components/pages/room/RoomBoard.vue'
import RoomMessages from '~/components/pages/room/RoomMessages.vue'
import PixelContainer from '~/components/pixel/PixelContainer.vue'

import useSocketRoomStore from '~/store/socketRoom'

definePageMeta({
  middleware: async (to) => {
    const trpc = useTRPC()
    try {
      await trpc.room.join.mutate({ id: to.params.id as string })
    } catch (error: any) {
      return navigateTo({ name: 'index', query: { error: error.message } })
    }
  },
})

const route = useRoute('room-id')
const socketRoomStore = useSocketRoomStore()

const roomMessages = ref<InstanceType<typeof RoomMessages>>()
const sendMessageLoading = ref(false)

const roomId = computed(() => route.params.id as string)

function beforeUnloadHandler(event: BeforeUnloadEvent) {
  event.preventDefault()

  return true
}
onMounted(async () => {
  window.addEventListener('beforeunload', beforeUnloadHandler)

  await socketRoomStore.joinRoom(roomId.value)
})
onUnmounted(async () => {
  window.removeEventListener('beforeunload', beforeUnloadHandler)

  await socketRoomStore.leaveRoom(roomId.value)
})

async function handleSendMessage(messageText: string) {
  sendMessageLoading.value = true
  try {
    await socketRoomStore.sendMessage(messageText)
  } finally {
    roomMessages.value?.resetForm()
    sendMessageLoading.value = false
  }
}
</script>

<style lang="scss" scoped>
.room-page {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  padding: 16px;
}
</style>
