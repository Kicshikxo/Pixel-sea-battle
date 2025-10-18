<template>
  <div class="px-checkbox">
    <label :for="id" class="px-checkbox__label">
      <PixelBorder level="2">
        <div class="px-checkbox__icon-wrapper">
          <TransitionSwipeY>
            <icon class="px-checkbox__icon" :key="iconName" :name="iconName" size="20" />
          </TransitionSwipeY>
        </div>
      </PixelBorder>
    </label>
    <input
      class="px-checkbox__input"
      :id="id"
      type="checkbox"
      v-model="checked"
      :disabled="disabled"
    />
    <label v-if="label" :for="id" class="px-checkbox__label">{{ label }}</label>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, useId } from 'vue'
import PixelBorder from '~/components/pixel/PixelBorder.vue'
import TransitionSwipeY from '~/components/transitions/TransitionSwipeY.vue'

const props = withDefaults(
  defineProps<{
    label?: string
    disabled?: boolean
  }>(),
  {
    label: '',
    disabled: false,
  },
)
const emits = defineEmits<{
  'update:modelValue': [value: boolean]
}>()

const checked = defineModel<boolean>()

const id = ref(`px-checkbox-${useId()}`)

const iconName = computed(() => (checked.value ? 'pixelarticons:check' : 'pixelarticons:close'))
</script>

<style lang="scss" scoped>
.px-checkbox {
  display: flex;
  justify-content: center;
  align-items: center;
  height: min-content;
  gap: 4px;

  &__input {
    display: none;
  }

  &__icon-wrapper {
    display: flex;
    background: var(--px-color-white);
    width: 20px;
    height: 20px;
  }
  &__icon {
    color: var(--px-color-black);
  }

  &__label {
    display: inline-flex;
  }
}
</style>
