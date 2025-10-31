<template>
  <div class="room-board">
    <PlayerBoard />
    <PlayerBoard />
  </div>
</template>

<script lang="ts" setup>
import PlayerBoard from '~/components/pages/room/PlayerBoard.vue'
</script>

<style lang="scss" scoped>
.room-board {
  display: flex;
  justify-content: space-evenly;
  flex-wrap: wrap;
  gap: 16px;
}
</style>
