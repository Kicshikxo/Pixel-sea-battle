<template>
  <div class="room-page">
    <pixel-container full-width>
      <pixel-text-input v-model="messageText" :label="$t('roomPage.message')" />
      <pixel-button :label="$t('roomPage.sendMessage')" @click="handleSendMessage" />
    </pixel-container>
    <pixel-container v-for="message in socketRoomStore.messages" full-width> ({{ new Date(message.createdAt).toLocaleString() }}) <pixel-avatar :seed="message.userId" size="small" /> {{ message.text }} </pixel-container>
  </div>
</template>

<script setup lang="ts">
import useSocketRoomStore from '~/store/socketRoom'

function beforeUnloadHandler(event: BeforeUnloadEvent) {
  event.preventDefault()

  return true
}
onMounted(() => window.addEventListener('beforeunload', beforeUnloadHandler))
onUnmounted(() => window.removeEventListener('beforeunload', beforeUnloadHandler))

const route = useRoute('room-id')
const router = useRouter()
const client = useClient()
const socketRoomStore = useSocketRoomStore()

const messageText = ref('')

await socketRoomStore.joinRoom(route.params.id)

onBeforeRouteLeave(async () => {
  await socketRoomStore.leaveRoom(route.params.id)
})

async function handleSendMessage() {
  await socketRoomStore.sendMessage(messageText.value)
  messageText.value = ''
}

const { data: room } = await client.room.info.useQuery({ id: route.params.id })
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
