<template>
  <div class="index-page">
    <pixel-button @click="handleCreateRoom">
      {{ $t('indexPage.createRoom') }}
      <template #append-icon>
        <icon name="pixelarticons:plus" />
      </template>
    </pixel-button>
    <br />
    <br />
    <pixel-container v-for="room in rooms?.response" full-width>
      {{ room.id }}
      <div>
        <pixel-avatar v-for="{ userId } in room.users" :seed="userId" />
      </div>
      <br />
      <pixel-button @click="handleJoinRoom(room.id)">
        {{ $t('indexPage.join') }}
        <template #append-icon>
          <icon name="pixelarticons:cloud-upload" />
        </template>
      </pixel-button>
    </pixel-container>
  </div>
</template>

<script setup lang="ts">
const { t } = useI18n()
const toast = useToast()
const client = useClient()
const router = useRouter()

const { data: rooms, refresh: refreshRooms } = client.room.list.useQuery()

async function handleCreateRoom() {
  const { error } = await client.room.create.useQuery()
  if (error.value) toast.error(t(error.value.message))
  await refreshRooms()
}

async function handleJoinRoom(id: string) {
  const { data, error } = await client.room.join.useQuery({ id: id })
  if (error.value) toast.error(t(error.value.message))
  if (data.value) router.push({ name: 'room-id', params: { id: data.value.id } })
  await refreshRooms()
}
</script>

<style lang="scss" scoped>
.index-page {
  flex: 1;
  padding: 32px;
}
</style>
