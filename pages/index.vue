<template>
  <div class="index-page">
    <div>Статус входа: {{ state.status }}</div>
    <div>Данные аккаунта: {{ state.data.value }}</div>
    <div>Статус соединения сокета: {{ socketStore.socket.connected }}</div>
    <div>ID сокета: {{ socketStore.socket.id }}</div>
    <div>
      Сообщения сокетов:
      <pixel-border v-for="message in socketStore.messages" style="margin: 8px 0">
        <div style="padding: 8px; background: var(--px-color-dark)">
          {{ message }}
        </div>
      </pixel-border>
    </div>
    <br />
    <pixel-button @click="socketStore.initSocket()" style="margin-right: 8px">
      Инициализация сокетов
      <template #append-icon>
        <icon name="pixelarticons:cloud" />
      </template>
    </pixel-button>
    <pixel-button @click="handleHello" style="margin-right: 8px">
      Поздороваться со всеми
      <template #append-icon>
        <icon name="pixelarticons:human-handsup" />
      </template>
    </pixel-button>
    <pixel-button @click="handleSignout">
      Выйти
      <template #append-icon>
        <icon name="pixelarticons:logout" />
      </template>
    </pixel-button>
  </div>
</template>

<script setup lang="ts">
import useSocketStore from '~/store/socket'

const client = useClient()
const { state, signOut } = useAuth()
const socketStore = useSocketStore()

function handleHello() {
  client.hello.useQuery({ text: 'broadcast!' })
}
function handleSignout() {
  signOut({ redirectTo: '/login' })
}
</script>

<style lang="scss" scoped>
.index-page {
  padding: 32px;
}
</style>
