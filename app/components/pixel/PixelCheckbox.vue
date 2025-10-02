<template>
  <div class="px-checkbox">
    <label :for="id" class="px-checkbox__label">
      <PixelBorder level="2">
        <div class="px-checkbox__icon__wrapper">
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
      :checked="modelValue"
      @input="handleInput"
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
    modelValue?: boolean
    label?: string
    disabled?: boolean
  }>(),
  {
    modelValue: false,
    label: '',
    disabled: false,
  },
)
const emits = defineEmits<{
  'update:modelValue': [value: boolean]
}>()

const id = ref(`px-checkbox-${useId()}`)

const iconName = computed(() => (props.modelValue ? 'pixelarticons:check' : 'pixelarticons:close'))

function handleInput(event: Event) {
  emits('update:modelValue', ((event as InputEvent).target as HTMLInputElement).checked ?? false)
}
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

  &__icon {
    color: var(--px-color-black);

    &__wrapper {
      display: flex;
      background: var(--px-color-white);
      width: 20px;
      height: 20px;
    }
  }

  &__label {
    display: inline-flex;
  }
}
</style>
