<template>
  <div class="index-page">
    <PixelButton
      class="index-page__create-room-button"
      :label="$t('page.index.room.create')"
      @click="showCreateRoom = true"
    >
      <template #append-icon>
        <icon name="pixelarticons:plus" />
      </template>
    </PixelButton>
    <PixelButton
      class="index-page__create-room-button"
      :label="$t('page.index.room.refresh')"
      @click="refreshActiveRooms().then(() => refreshPublicRooms())"
    >
      <template #append-icon>
        <icon name="pixelarticons:reload" />
      </template>
    </PixelButton>
    <PixelContainer>
      <div class="index-page__actions">
        <TransitionExpandY>
          <div v-if="activeRooms?.total" class="index-page__rooms">
            <PixelDivider :text="$t('page.index.room.listActive')" />
            <TransitionExpandY>
              <div v-if="activeRoomsLoading">
                <PixelLoader />
              </div>
            </TransitionExpandY>
            <TransitionExpandY>
              <div class="index-page__rooms-list">
                <PixelContainer v-for="room in activeRooms?.response" :key="room.id" full-width>
                  <div class="index-page__room">
                    <div class="index-page__room__name">{{ room.name }}</div>
                    <div class="index-page__room__avatars">
                      <PixelAvatar
                        v-for="{ userId } in room.states"
                        :key="userId"
                        :seed="userId"
                        small
                      />
                    </div>
                    <PixelButton
                      @click="handleJoinRoom(room.id)"
                      :label="$t('page.index.room.join')"
                      small
                      full-width
                    />
                  </div>
                </PixelContainer>
              </div>
            </TransitionExpandY>
          </div>
        </TransitionExpandY>

        <TransitionExpandY>
          <div v-if="publicRooms?.total || publicRoomsLoading" class="index-page__rooms">
            <PixelDivider :text="$t('page.index.room.listPublic')" />
            <TransitionExpandY>
              <div v-if="publicRoomsLoading">
                <PixelLoader />
              </div>
            </TransitionExpandY>
            <TransitionExpandY>
              <div class="index-page__rooms-list">
                <PixelContainer v-for="room in publicRooms?.response" :key="room.id" full-width>
                  <div class="index-page__room">
                    <div class="index-page__room__name">{{ room.name }}</div>
                    <div class="index-page__room__avatars">
                      <PixelAvatar
                        v-for="{ userId } in room.states"
                        :key="userId"
                        :seed="userId"
                        small
                      />
                    </div>
                    <PixelButton
                      @click="handleJoinRoom(room.id)"
                      :label="$t('page.index.room.join')"
                      small
                      full-width
                    />
                  </div>
                </PixelContainer>
              </div>
            </TransitionExpandY>
          </div>
        </TransitionExpandY>
      </div>
    </PixelContainer>

    <PixelModal v-model:show="showCreateRoom" :title="$t('page.index.room.creating')">
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
import PixelAvatar from '~/components/pixel/PixelAvatar.vue'
import PixelButton from '~/components/pixel/PixelButton.vue'
import PixelContainer from '~/components/pixel/PixelContainer.vue'
import PixelDivider from '~/components/pixel/PixelDivider.vue'
import PixelModal from '~/components/pixel/PixelModal.vue'
import TransitionExpandY from '~/components/transitions/TransitionExpandY.vue'

import { RoomType } from '@prisma/client'
import type { FormContext } from 'vee-validate'
import { z } from 'zod'
import PixelFormTextInput from '~/components/pixel/form/PixelFormTextInput.vue'
import PixelLoader from '~/components/pixel/PixelLoader.vue'

const { t } = useI18n()
const toast = useToast()
const trpc = useTRPC()
const router = useRouter()

const createRoomForm = ref<FormContext>()
const showCreateRoom = ref(false)
const createRoomLoading = ref(false)

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
  try {
    const room = await trpc.room.join.mutate({ id: id })
    router.push({ name: 'room-id', params: { id: room.id } })
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

  &__create-room-button {
    margin-bottom: 32px;
  }

  &__actions {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: 16px;
    width: 600px;
  }

  &__rooms {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: 16px;
    width: 100%;
  }

  &__rooms-list {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 16px;
    width: 100%;
  }

  &__room {
    display: flex;
    flex-direction: column;
    gap: 8px;

    &__name {
      font-size: 12px;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    &__avatars {
      display: flex;
      gap: 8px;
    }
  }
}
</style>
