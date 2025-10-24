<template>
  <ClientOnly>
    <teleport to="body">
      <TransitionFade>
        <div v-if="show" class="px-modal__overlay" @click.self="handleClose">
          <TransitionSwipeY appear>
            <div class="px-modal">
              <PixelContainer full-width>
                <div class="px-modal__header">
                  <span class="px-modal__header__title">{{ title }}</span>
                  <PixelButton color="dark" small icon-only @click="handleClose">
                    <template #icon>
                      <icon name="pixelarticons:close" />
                    </template>
                  </PixelButton>
                </div>
                <div class="px-modal__content">
                  <slot />
                </div>
              </PixelContainer>
            </div>
          </TransitionSwipeY>
        </div>
      </TransitionFade>
    </teleport>
  </ClientOnly>
</template>

<script lang="ts" setup>
import PixelButton from '~/components/pixel/PixelButton.vue'
import PixelContainer from '~/components/pixel/PixelContainer.vue'
import TransitionFade from '~/components/transitions/TransitionFade.vue'
import TransitionSwipeY from '~/components/transitions/TransitionSwipeY.vue'

const props = defineProps<{
  title?: string
}>()

const show = defineModel<boolean>('show', {
  default: false,
})

function handleClose() {
  show.value = false
}
</script>

<style lang="scss">
.px-modal {
  min-width: 300px;
  max-width: 90vw;
  max-height: 90vh;

  &__overlay {
    position: fixed;
    inset: 0;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 999;
  }

  &__header {
    display: flex;
    justify-content: space-between;
    padding-bottom: 8px;
    gap: 16px;

    &__title {
      font-size: 20px;
    }
  }

  &__content {
    display: flex;
    flex-direction: column;
    gap: 16px;
  }
}
</style>
