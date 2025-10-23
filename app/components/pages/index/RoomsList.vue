<template>
  <div class="rooms-list__container">
    <PixelDivider :text="title" class="rooms-list__title" />

    <TransitionExpandY>
      <div v-if="rooms?.total">
        <div class="rooms-list">
          <PixelContainer v-for="room in rooms.response" :key="room.id" full-width>
            <div class="rooms-item">
              <div class="rooms-item__name">{{ room.name }}</div>
              <div class="rooms-item__info">
                <div class="room-item__avatars">
                  <PixelAvatar
                    v-for="{ userId } in room.players"
                    :key="userId"
                    :seed="userId"
                    small
                  />
                </div>
                <div class="rooms-item__actions">
                  <icon v-if="room.type === RoomType.PRIVATE" name="pixelarticons:lock" />
                  <PixelButton
                    @click="$emit('join-room', room.id)"
                    :label="$t('page.index.room.join')"
                    small
                  />
                </div>
              </div>
            </div>
          </PixelContainer>
        </div>
      </div>
    </TransitionExpandY>
  </div>
</template>

<script setup lang="ts">
import PixelAvatar from '~/components/pixel/PixelAvatar.vue'
import PixelButton from '~/components/pixel/PixelButton.vue'
import PixelContainer from '~/components/pixel/PixelContainer.vue'
import PixelDivider from '~/components/pixel/PixelDivider.vue'
import TransitionExpandY from '~/components/transitions/TransitionExpandY.vue'

import { RoomType, type Room, type RoomPlayer } from '@prisma/client'

defineProps<{
  title: string
  rooms: { total: number; response: (Room & { players: RoomPlayer[] })[] } | null
  loading?: boolean
}>()

defineEmits<{
  (e: 'join-room', id: string): void
}>()
</script>

<style lang="scss" scoped>
.rooms-list {
  display: flex;
  flex-direction: column;
  margin-top: 16px;
  gap: 16px;

  &__container {
    display: flex;
    flex-direction: column;
  }
  &__title {
    margin-top: 16px;
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
