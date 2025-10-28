<template>
  <div class="rooms-list">
    <PixelDivider :text="title" class="rooms-list__title" />

    <TransitionExpand>
      <PixelLoader v-if="roomsLoading" class="rooms-list__loader" />
    </TransitionExpand>

    <TransitionExpand>
      <div v-if="rooms.length" class="rooms-list__list">
        <TransitionExpand group>
          <div v-for="room in rooms" :key="room.id" class="rooms-list__list__container">
            <PixelContainer full-width>
              <div class="rooms-item">
                <div class="rooms-item__name">{{ room.name }}</div>
                <div class="rooms-item__info">
                  <div class="room-item__avatars">
                    <PixelAvatar
                      v-for="player in room.players"
                      :key="player.userId"
                      :seed="player.userId"
                      :title="player.user.username"
                      small
                    />
                  </div>
                  <div class="rooms-item__actions">
                    <icon v-if="room.type === RoomType.PRIVATE" name="pixelarticons:lock" />
                    <PixelButton
                      @click="$emit('join-room', room.id)"
                      :label="$t('page.index.room.join')"
                      :disabled="joinRoomLoading"
                      small
                    />
                  </div>
                </div>
              </div>
            </PixelContainer>
          </div>
        </TransitionExpand>
      </div>
    </TransitionExpand>
  </div>
</template>

<script setup lang="ts">
import PixelAvatar from '~/components/pixel/PixelAvatar.vue'
import PixelButton from '~/components/pixel/PixelButton.vue'
import PixelContainer from '~/components/pixel/PixelContainer.vue'
import PixelDivider from '~/components/pixel/PixelDivider.vue'
import PixelLoader from '~/components/pixel/PixelLoader.vue'
import TransitionExpand from '~/components/transitions/TransitionExpand.vue'

import { RoomType, type Room, type RoomPlayer, type User } from '@prisma/client'

const props = withDefaults(
  defineProps<{
    title: string
    rooms?: (Room & { players: (RoomPlayer & { user: User })[] })[]
    roomsLoading?: boolean
    joinRoomLoading?: boolean
  }>(),
  {
    rooms: () => [],
    roomsLoading: false,
    joinRoomLoading: false,
  },
)
const emits = defineEmits<{
  'join-room': [id: string]
}>()
</script>

<style lang="scss" scoped>
.rooms-list {
  display: flex;
  flex-direction: column;

  &__title {
    margin: 16px 0;
  }

  &__loader {
    margin: 0 auto;
  }

  &__list {
    display: flex;
    flex-direction: column;

    &__container:not(:last-child) {
      margin-bottom: 8px;
    }
  }
}

.rooms-item {
  display: flex;
  flex-direction: column;
  gap: 8px;

  &__name {
    font-size: 14px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  &__info {
    display: flex;
    justify-content: space-between;
  }

  &__avatars {
    display: flex;
    gap: 8px;
  }

  &__actions {
    display: flex;
    align-items: center;
    gap: 8px;
  }
}
</style>
