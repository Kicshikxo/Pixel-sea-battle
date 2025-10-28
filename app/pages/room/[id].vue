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
        <span v-if="(roomStore.room?.status ?? roomLastStatus) === RoomStatus.PENDING">
          {{ $t('page.room.confirmUnsafeLeaveMessage') }}
        </span>
        <span v-else>
          {{ $t('page.room.confirmSafeLeaveMessage') }}
        </span>

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

import { RoomStatus } from '@prisma/client'
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

const trpc = useTRPC()
const { t } = useI18n()
const toast = useToast()
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
const roomLastStatus = ref<RoomStatus | null>(null)

function beforeUnloadHandler(event: BeforeUnloadEvent) {
  event.preventDefault()

  return true
}
onMounted(async () => {
  window.addEventListener('beforeunload', beforeUnloadHandler)

  try {
    await roomStore.connectRoom(roomId.value)
  } finally {
    messagesLoading.value = false
  }
})
onUnmounted(async () => {
  window.removeEventListener('beforeunload', beforeUnloadHandler)

  if (roomStore.room) {
    await roomStore.disconnectRoom(roomId.value)
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
    roomLastStatus.value = roomStore.room?.status ?? null

    await roomStore.disconnectRoom(roomId.value)
    if (roomLastStatus.value === RoomStatus.PENDING) {
      await trpc.room.leave.mutate({ id: roomId.value })
    }
  } catch (error: any) {
    toast.error(t(error.message))
  } finally {
    if (roomLeaveLocation.value) {
      await router.push({ path: roomLeaveLocation.value.path })
    } else {
      await router.push({ name: 'index' })
    }

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
