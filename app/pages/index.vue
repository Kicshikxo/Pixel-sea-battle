<template>
  <div class="index-page">
    <PixelButton @click="handleCreateRoom">
      {{ $t('page.index.createRoom') }}
      <template #append-icon>
        <icon name="pixelarticons:plus" />
      </template>
    </PixelButton>
    <br />
    <br />
    <PixelContainer v-for="room in rooms?.response" full-width>
      {{ room.id }}
      <div>
        <PixelAvatar v-for="{ userId } in room.users" :seed="userId" />
      </div>
      <br />
      <PixelButton @click="handleJoinRoom(room.id)">
        {{ $t('page.index.join') }}
        <template #append-icon>
          <icon name="pixelarticons:cloud-upload" />
        </template>
      </PixelButton>
    </PixelContainer>
  </div>
</template>

<script setup lang="ts">
import PixelAvatar from '~/components/pixel/PixelAvatar.vue'
import PixelButton from '~/components/pixel/PixelButton.vue'
import PixelContainer from '~/components/pixel/PixelContainer.vue'

const { t } = useI18n()
const toast = useToast()
const trpc = useTRPC()
const router = useRouter()

const { data: rooms, refresh: refreshRooms } = trpc.room.list.useQuery()

async function handleCreateRoom() {
  const { error } = await trpc.room.create.useQuery()
  if (error.value) toast.error(t(error.value.message))
  await refreshRooms()
}

async function handleJoinRoom(id: string) {
  const { data, error } = await trpc.room.join.useQuery({ id: id })
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
