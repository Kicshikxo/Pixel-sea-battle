<template>
  <div class="room-page">
    <PixelContainer full-width>
      <RoomBoard />
    </PixelContainer>

    <PixelContainer full-width>
      <RoomMessages
        ref="roomMessages"
        :messages="roomStore.room?.messages"
        :messages-loading="messagesLoading"
        :send-loading="sendMessageLoading"
        @send-message="handleSendMessage"
      />
    </PixelContainer>

    <PixelModal v-model:show="showRoomLeaveModal" :title="$t('page.room.confirmLeave')">
      <div class="leave-room-modal">
        {{ $t('page.room.confirmLeaveMessage') }}
        <div class="leave-room-modal__actions">
          <PixelButton
            :label="$t('page.room.cancel')"
            full-width
            :disabled="roomLeaveLoading"
            @click="showRoomLeaveModal = false"
          />
          <PixelButton
            :label="$t('page.room.leave')"
            color="red"
            full-width
            :loading="roomLeaveLoading"
            @click="handleLeaveRoom"
          />
        </div>
      </div>
    </PixelModal>
  </div>
</template>

<script setup lang="ts">
import RoomBoard from '~/components/pages/room/RoomBoard.vue'
import RoomMessages from '~/components/pages/room/RoomMessages.vue'
import PixelButton from '~/components/pixel/PixelButton.vue'
import PixelContainer from '~/components/pixel/PixelContainer.vue'
import PixelModal from '~/components/pixel/PixelModal.vue'

import useRoomStore from '~/store/room'

import type { RouteLocation } from 'vue-router'

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
const router = useRouter()
const roomStore = useRoomStore()

const roomMessages = ref<InstanceType<typeof RoomMessages>>()
const messagesLoading = ref(true)
const sendMessageLoading = ref(false)

const showRoomLeaveModal = ref(false)
const roomLeaveLocation = ref<RouteLocation>()
const roomLeaveLoading = ref(false)

const roomId = computed(() => route.params.id as string)

function beforeUnloadHandler(event: BeforeUnloadEvent) {
  event.preventDefault()

  return true
}
onMounted(async () => {
  window.addEventListener('beforeunload', beforeUnloadHandler)

  try {
    await roomStore.joinRoom(roomId.value)
  } finally {
    messagesLoading.value = false
  }
})
onUnmounted(async () => {
  window.removeEventListener('beforeunload', beforeUnloadHandler)

  if (roomStore.room) {
    await roomStore.leaveRoom(roomId.value)
  }
})
onBeforeRouteLeave(async (to) => {
  if (showRoomLeaveModal.value) {
    return true
  }

  roomLeaveLocation.value = to
  showRoomLeaveModal.value = true

  return false
})

async function handleLeaveRoom() {
  roomLeaveLoading.value = true

  try {
    await roomStore.leaveRoom(roomId.value)

    if (roomLeaveLocation.value) {
      await router.push({ path: roomLeaveLocation.value.path })
    } else {
      await router.push({ name: 'index' })
    }
  } finally {
    roomLeaveLoading.value = false
    showRoomLeaveModal.value = false
  }
}

async function handleSendMessage(messageText: string) {
  sendMessageLoading.value = true
  try {
    await roomStore.sendMessage(messageText)
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
  max-width: 1200px;
}

.leave-room-modal {
  display: flex;
  flex-direction: column;
  gap: 16px;
  max-width: 450px;

  &__actions {
    display: flex;
    gap: 8px;
  }
}
</style>
