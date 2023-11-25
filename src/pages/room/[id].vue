<template>
  <div class="room-page">
    <pixel-container full-width>
      <pixel-text-input v-model="messageText" :label="$t('roomPage.message')" />
      <pixel-button :label="$t('roomPage.sendMessage')" @click="handleSendMessage" />
    </pixel-container>
    <pixel-container v-for="message in socketRoomStore.messages" full-width>({{ new Date(message.createdAt).toLocaleString() }}) {{ message.userId }}: {{ message.text }} </pixel-container>
  </div>
</template>

<script setup lang="ts">
import useSocketRoomStore from '~/store/socketRoom'

const route = useRoute('room-id')
const router = useRouter()
const client = useClient()
const socketRoomStore = useSocketRoomStore()

const messageText = ref('')
socketRoomStore.connectRoom(route.params.id)

async function handleSendMessage() {
  socketRoomStore.sendMessage(messageText.value)
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
