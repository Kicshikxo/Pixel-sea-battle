<template>
  <div class="player-board">
    <table class="player-board__table">
      <tbody>
        <tr v-for="row in 11" :key="row" class="player-board__table__row">
          <td
            v-for="column in 11"
            :key="column"
            :class="[
              'player-board__table__cell',
              { 'player-board__table__cell--label': row === 1 || column === 1 },
            ]"
            @click="handleClickCell(row, column)"
          >
            {{ getCellLabel(row, column) }}
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script lang="ts" setup>
const { t } = useI18n()

function getCellLabel(row: number, column: number): string {
  if (row === 1 && column > 1) {
    return (
      [
        t('page.room.board.A'),
        t('page.room.board.B'),
        t('page.room.board.C'),
        t('page.room.board.D'),
        t('page.room.board.E'),
        t('page.room.board.F'),
        t('page.room.board.G'),
        t('page.room.board.H'),
        t('page.room.board.I'),
        t('page.room.board.J'),
      ][column - 2] ?? ''
    )
  }

  if (column === 1 && row > 1) {
    return String(row - 1)
  }

  return ''
}

function handleClickCell(row: number, column: number) {
  console.log(row, column)
}
</script>

<style lang="scss" scoped>
.player-board {
  &__table {
    border-collapse: collapse;

    &__cell {
      width: 32px;
      height: 32px;
      border: 2px solid var(--px-color-black-on-light-white-on-dark);
      text-align: center;
      font-size: 12px;

      &--label {
        border: none;
      }
    }
  }
}
</style>
