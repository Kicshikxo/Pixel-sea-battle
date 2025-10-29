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
          :label="$t('page.index.quickJoin')"
          :loading="quickMatchLoading"
          :disabled="joinRoomLoading"
          @click="handleQuickJoin"
        >
          <template #prepend-icon>
            <icon name="pixelarticons:shuffle" />
          </template>
        </PixelButton>
      </div>

      <div class="index-page__rooms">
        <div>
          <TransitionExpand>
            <RoomsList
              v-if="roomsStore.activeRooms.length"
              :title="$t('page.index.room.listActive')"
              :rooms="roomsStore.activeRooms"
              :rooms-loading="roomsLoading"
              :join-room-loading="joinRoomLoading"
              @join-room="handleJoinRoom"
            />
          </TransitionExpand>

          <TransitionExpand>
            <RoomsList
              v-if="roomsStore.publicRooms.length || roomsLoading"
              :title="$t('page.index.room.listPublic')"
              :rooms="roomsStore.publicRooms ?? []"
              :rooms-loading="roomsLoading"
              :join-room-loading="joinRoomLoading"
              @join-room="handleJoinRoom"
            />
          </TransitionExpand>
        </div>
      </div>
    </PixelContainer>

    <PixelModal v-model:show="showCreateRoomModal" :title="$t('page.index.room.creating')">
      <template #icon>
        <icon name="pixelarticons:users" />
      </template>

      <div class="create-room-modal">
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
      </div>
    </PixelModal>
  </div>
</template>

<script setup lang="ts">
import PixelForm from '~/components/pixel/form/PixelForm.vue'
import PixelFormCheckbox from '~/components/pixel/form/PixelFormCheckbox.vue'
import PixelFormTextInput from '~/components/pixel/form/PixelFormTextInput.vue'
import PixelButton from '~/components/pixel/PixelButton.vue'
import PixelContainer from '~/components/pixel/PixelContainer.vue'
import PixelModal from '~/components/pixel/PixelModal.vue'
import TransitionExpand from '~/components/transitions/TransitionExpand.vue'

import RoomsList from '~/components/pages/index/RoomsList.vue'

import { RoomType } from '@prisma/client'
import type { FormContext } from 'vee-validate'
import { z } from 'zod'
import useRoomsStore from '~/store/rooms'

const { t } = useI18n()
const toast = useToast()
const trpc = useTRPC()
const route = useRoute('index')
const router = useRouter()
const roomsStore = useRoomsStore()

const createRoomForm = ref<FormContext>()
const showCreateRoomModal = ref(false)

const createRoomLoading = ref(false)
const roomsLoading = ref(true)
const joinRoomLoading = ref(false)
const quickMatchLoading = ref(false)

onMounted(async () => {
  try {
    await roomsStore.getRooms()
  } finally {
    roomsLoading.value = false
  }
})

watch(
  () => route.query.error,
  (error) => {
    if (error) {
      toast.error(t(error as string))
      router.replace({ query: {} })
    }
  },
)

const createRoomValidationSchema = computed(() =>
  z.object({
    name: z
      .string()
      .min(1, t('validation.required'))
      .max(100, { message: t('validation.tooManyCharacters') })
      .default(''),
    private: z.boolean().default(false),
  }),
)
type CreateRoomFormValues = z.infer<typeof createRoomValidationSchema.value>

async function handleCreateRoom(values: CreateRoomFormValues) {
  createRoomLoading.value = true
  try {
    const room = await trpc.room.create.mutate({
      name: values.name,
      type: values.private ? RoomType.PRIVATE : RoomType.PUBLIC,
    })
    await trpc.room.join.mutate({ id: room.id })
    await router.push({ name: 'room-id', params: { id: room.id } })
  } catch (error: any) {
    toast.error(t(error.message))
  } finally {
    createRoomLoading.value = false
  }
}

async function handleJoinRoom(id: string) {
  joinRoomLoading.value = true
  try {
    await router.push({ name: 'room-id', params: { id } })
  } finally {
    joinRoomLoading.value = false
  }
}

async function handleQuickJoin() {
  joinRoomLoading.value = true
  quickMatchLoading.value = true
  try {
    const room = await trpc.room.quickJoin.mutate()
    await router.push({ name: 'room-id', params: { id: room.id } })
  } catch (error: any) {
    toast.error(t(error.message))
  } finally {
    joinRoomLoading.value = false
    quickMatchLoading.value = false
  }
}
</script>

<style lang="scss" scoped>
.index-page {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 16px;

  &__actions {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    gap: 8px;
    margin-bottom: 8px;
  }

  &__rooms {
    display: flex;
    flex-direction: column;
    width: 600px;

    &-wrapper {
      width: 100%;
    }

    @include on-breakpoint(sm) {
      width: calc(100vw - 64px);
    }
  }
}

.create-room-modal {
  max-width: 400px;
}
</style>
