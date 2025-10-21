<template>
  <div class="room-page">
    <PixelContainer full-width>
      <PixelTextInput v-model="messageText" :label="$t('page.room.message')" />
      <PixelButton :label="$t('page.room.sendMessage')" @click="handleSendMessage" />
    </PixelContainer>
    <ClientOnly>
      <PixelContainer v-for="message in socketRoomStore.messages" full-width>
        ({{ new Date(message.createdAt).toLocaleString() }})
        <PixelAvatar :seed="message.userId" small /> {{ message.text }}
      </PixelContainer>
    </ClientOnly>
  </div>
</template>

<script setup lang="ts">
import PixelAvatar from '~/components/pixel/PixelAvatar.vue'
import PixelButton from '~/components/pixel/PixelButton.vue'
import PixelContainer from '~/components/pixel/PixelContainer.vue'
import PixelTextInput from '~/components/pixel/PixelTextInput.vue'

import useSocketRoomStore from '~/store/socketRoom'

function beforeUnloadHandler(event: BeforeUnloadEvent) {
  event.preventDefault()

  return true
}
onMounted(() => window.addEventListener('beforeunload', beforeUnloadHandler))
onUnmounted(() => window.removeEventListener('beforeunload', beforeUnloadHandler))

const route = useRoute('room-id')
const router = useRouter()
const trpc = useTRPC()
const socketRoomStore = useSocketRoomStore()

const messageText = ref('')

await socketRoomStore.joinRoom(route.params.id as string)

onBeforeRouteLeave(async () => {
  await socketRoomStore.leaveRoom(route.params.id as string)
})

async function handleSendMessage() {
  await socketRoomStore.sendMessage(messageText.value)
  messageText.value = ''
}

const { data: room } = await trpc.room.info.useQuery({ id: route.params.id as string })
if (!room.value) router.push({ name: 'index' })
</script>

<style lang="scss" scoped>
.room-page {
  flex: 1;
  display: flex;
  flex-direction: column;
  padding: 16px;
  gap: 8px;
}
</style>
