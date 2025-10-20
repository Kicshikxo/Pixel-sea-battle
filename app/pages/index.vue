<template>
  <div class="index-page">
    <PixelContainer>
      <div class="index-page__actions">
        <PixelButton @click="showCreateRoom = true">
          {{ $t('page.index.room.create') }}
          <template #append-icon>
            <icon name="pixelarticons:plus" />
          </template>
        </PixelButton>
        <PixelDivider mode="vertical" :text="$t('page.index.room.or')" />
        <PixelButton @click="showCreateRoom = true">
          {{ $t('page.index.room.create') }}
          <template #append-icon>
            <icon name="pixelarticons:plus" />
          </template>
        </PixelButton>
      </div>
    </PixelContainer>

    <br />
    <br />
    <PixelContainer v-for="room in rooms?.response" full-width>
      {{ room.id }}
      <div>
        <PixelAvatar v-for="{ userId } in room.users" :seed="userId" />
      </div>
      <br />
      <PixelButton @click="handleJoinRoom(room.id)">
        {{ $t('page.index.room.join') }}
        <template #append-icon>
          <icon name="pixelarticons:cloud-upload" />
        </template>
      </PixelButton>
    </PixelContainer>

    <PixelModal v-model:show="showCreateRoom" :title="$t('page.index.room.creating')">
      <PixelForm
        ref="createRoomForm"
        :validation-schema="createRoomValidationSchema"
        @submit="handleCreateRoom"
      >
        <PixelFormCheckbox name="private" :label="$t('page.index.room.private')" />

        <PixelButton
          type="submit"
          :label="$t('page.index.room.create')"
          :loading="createRoomLoading"
          full-width
        >
          <template #append-icon>
            <icon name="pixelarticons:plus" />
          </template>
        </PixelButton>
      </PixelForm>
    </PixelModal>
  </div>
</template>

<script setup lang="ts">
import PixelForm from '~/components/pixel/form/PixelForm.vue'
import PixelFormCheckbox from '~/components/pixel/form/PixelFormCheckbox.vue'
import PixelAvatar from '~/components/pixel/PixelAvatar.vue'
import PixelButton from '~/components/pixel/PixelButton.vue'
import PixelContainer from '~/components/pixel/PixelContainer.vue'
import PixelDivider from '~/components/pixel/PixelDivider.vue'
import PixelModal from '~/components/pixel/PixelModal.vue'

import { RoomType } from '@prisma/client'
import type { FormContext } from 'vee-validate'
import { z } from 'zod'

const { t } = useI18n()
const toast = useToast()
const trpc = useTRPC()
const router = useRouter()

const createRoomForm = ref<FormContext>()
const showCreateRoom = ref(false)
const createRoomLoading = ref(false)

const { data: rooms, refresh: refreshRooms } = trpc.room.listActive.useQuery()

const createRoomValidationSchema = computed(() =>
  z.object({
    private: z.boolean().default(false),
  }),
)

async function handleCreateRoom(values: z.infer<typeof createRoomValidationSchema.value>) {
  createRoomLoading.value = true
  try {
    const room = await trpc.room.create.query({
      type: values.private ? RoomType.PRIVATE : RoomType.PUBLIC,
    })
    await trpc.room.join.query({ id: room.id })
    router.push({ name: 'room-id', params: { id: room.id } })
  } catch (error: any) {
    toast.error(t(error.message))
  } finally {
    createRoomLoading.value = false
  }
}

async function handleJoinRoom(id: string) {
  try {
    const room = await trpc.room.join.query({ id: id })
    router.push({ name: 'room-id', params: { id: room.id } })

    await refreshRooms()
  } catch (error: any) {
    toast.error(t(error.message))
  }
}
</script>

<style lang="scss" scoped>
.index-page {
  flex: 1;
  padding: 32px;
  display: flex;
  flex-direction: column;
  align-items: center;

  &__actions {
    display: flex;
    justify-content: center;
    align-items: center;
    // width: 100%;
    gap: 16px;
    height: 128px;
  }
}
</style>
