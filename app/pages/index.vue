<template>
  <div class="index-page">
    <PixelContainer>
      <div class="index-page__actions">
        <PixelButton :label="$t('page.index.room.create')" @click="showCreateRoomModal = true">
          <template #append-icon>
            <icon name="pixelarticons:plus" />
          </template>
        </PixelButton>

        <PixelButton
          :label="$t('page.index.room.refresh')"
          :loading="activeRoomsLoading || publicRoomsLoading"
          @click="
            () => {
              refreshActiveRooms()
              refreshPublicRooms()
            }
          "
        >
          <template #append-icon>
            <icon name="pixelarticons:reload" />
          </template>
        </PixelButton>
      </div>

      <div class="index-page__rooms">
        <TransitionExpandY>
          <RoomsList
            v-if="activeRooms?.total"
            :title="$t('page.index.room.listActive')"
            :rooms="activeRooms"
            :join-room-loading="joinRoomLoading"
            @join-room="handleJoinRoom"
          />
        </TransitionExpandY>

        <TransitionExpandY>
          <RoomsList
            v-if="publicRooms?.total || publicRoomsLoading"
            :title="$t('page.index.room.listPublic')"
            :rooms="publicRooms"
            :join-room-loading="joinRoomLoading"
            @join-room="handleJoinRoom"
          />
        </TransitionExpandY>
      </div>
    </PixelContainer>

    <PixelModal v-model:show="showCreateRoomModal" :title="$t('page.index.room.creating')">
      <PixelForm
        ref="createRoomForm"
        :validation-schema="createRoomValidationSchema"
        @submit="handleCreateRoom"
      >
        <PixelFormTextInput
          name="name"
          :label="$t('page.index.room.name')"
          :placeholder="$t('page.index.room.name')"
        >
          <template #prepend-icon>
            <icon name="pixelarticons:card-text" />
          </template>
        </PixelFormTextInput>

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
import PixelButton from '~/components/pixel/PixelButton.vue'
import PixelContainer from '~/components/pixel/PixelContainer.vue'
import PixelModal from '~/components/pixel/PixelModal.vue'
import TransitionExpandY from '~/components/transitions/TransitionExpandY.vue'

import RoomsList from '~/components/pages/index/RoomsList.vue'

import { RoomType } from '@prisma/client'
import type { FormContext } from 'vee-validate'
import { z } from 'zod'
import PixelFormTextInput from '~/components/pixel/form/PixelFormTextInput.vue'

const { t } = useI18n()
const toast = useToast()
const trpc = useTRPC()
const router = useRouter()

const createRoomForm = ref<FormContext>()
const showCreateRoomModal = ref(false)
const createRoomLoading = ref(false)
const joinRoomLoading = ref(false)

const {
  data: activeRooms,
  pending: activeRoomsLoading,
  refresh: refreshActiveRooms,
} = trpc.room.listActive.useQuery()
const {
  data: publicRooms,
  pending: publicRoomsLoading,
  refresh: refreshPublicRooms,
} = trpc.room.listPublic.useQuery()

const createRoomValidationSchema = computed(() =>
  z.object({
    name: z
      .string()
      .min(1, t('validation.required'))
      .max(100, { message: t('validation.tooManyCharacters') }),
    private: z.boolean().default(false),
  }),
)

async function handleCreateRoom(values: z.infer<typeof createRoomValidationSchema.value>) {
  createRoomLoading.value = true
  try {
    const room = await trpc.room.create.mutate({
      name: values.name,
      type: values.private ? RoomType.PRIVATE : RoomType.PUBLIC,
    })
    await trpc.room.join.mutate({ id: room.id })
    router.push({ name: 'room-id', params: { id: room.id } })
  } catch (error: any) {
    toast.error(t(error.message))
  } finally {
    createRoomLoading.value = false
  }
}

async function handleJoinRoom(id: string) {
  joinRoomLoading.value = true
  try {
    const room = await trpc.room.join.mutate({ id: id })
    router.push({ name: 'room-id', params: { id: room.id } })
  } catch (error: any) {
    toast.error(t(error.message))
  } finally {
    joinRoomLoading.value = false
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
    justify-content: space-between;
    width: 100%;
  }

  &__rooms {
    display: flex;
    flex-direction: column;
    width: 600px;
  }
}
</style>
