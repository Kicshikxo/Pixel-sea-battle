<template>
  <div class="index-page">
    <pixel-button @click="handleCreateRoom">
      {{ $t('Создать комнату') }}
      <template #append-icon>
        <icon name="pixelarticons:plus" />
      </template>
    </pixel-button>
    <pixel-button @click="handleSignout">
      {{ $t('indexPage.signOut') }}
      <template #append-icon>
        <icon name="pixelarticons:logout" />
      </template>
    </pixel-button>
    <br />
    <br />
    <pixel-container v-for="room in rooms?.response" full-width>
      <pre>{{ JSON.stringify(room, null, 2) }}</pre>
      <pixel-button @click="handleConnectRoom(room.id)">
        {{ $t('Подключиться') }}
        <template #append-icon>
          <icon name="pixelarticons:cloud-upload" />
        </template>
      </pixel-button>
    </pixel-container>
  </div>
</template>

<script setup lang="ts">
const toast = useToast()
const client = useClient()
const router = useRouter()
const { signOut } = useAuth()

const { data: rooms, refresh: refreshRooms } = client.room.list.useQuery()

async function handleCreateRoom() {
  const { error } = await client.room.create.useQuery()
  if (error.value) toast.error(error.value.message)
  await refreshRooms()
}

async function handleConnectRoom(id: string) {
  const { data, error } = await client.room.connect.useQuery({ id: id })
  if (error.value) toast.error(error.value.message)
  if (data.value) router.push({ name: 'room-id', params: { id: data.value.id } })
  await refreshRooms()
}

async function handleSignout() {
  const { error } = await signOut({ redirectTo: '/auth' })
  if (error) toast.error(error)
}
</script>

<style lang="scss" scoped>
.index-page {
  padding: 32px;
  width: 100%;
}
</style>
