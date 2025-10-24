<template>
  <div class="room-page">
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
import RoomMessages from '~/components/pages/room/RoomMessages.vue'
import PixelContainer from '~/components/pixel/PixelContainer.vue'

import useSocketRoomStore from '~/store/socketRoom'

const route = useRoute('room-id')
const router = useRouter()
const toast = useToast()
const trpc = useTRPC()
const { t } = useI18n()
const socketRoomStore = useSocketRoomStore()

const roomMessages = ref<InstanceType<typeof RoomMessages>>()
const sendMessageLoading = ref(false)

function beforeUnloadHandler(event: BeforeUnloadEvent) {
  event.preventDefault()

  return true
}
onMounted(async () => {
  window.addEventListener('beforeunload', beforeUnloadHandler)

  try {
    await trpc.room.join.mutate({ id: route.params.id as string })
    await socketRoomStore.joinRoom(route.params.id as string)
  } catch (error: any) {
    toast.error(t(error.message))
    router.push({ name: 'index' })
  }
})
onUnmounted(async () => {
  window.removeEventListener('beforeunload', beforeUnloadHandler)
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
  padding: 16px;
  display: flex;
  flex-direction: column;
  align-items: center;
}
</style>
