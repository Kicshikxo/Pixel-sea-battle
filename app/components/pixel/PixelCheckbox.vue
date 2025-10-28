<template>
  <div class="px-checkbox">
    <label :for="id" class="px-checkbox__label">
      <PixelBorder depth="2">
        <div class="px-checkbox__icon-wrapper">
          <TransitionSwipe>
            <icon class="px-checkbox__icon" :key="iconName" :name="iconName" size="20" />
          </TransitionSwipe>
        </div>
      </PixelBorder>
    </label>
    <input
      :name="name"
      class="px-checkbox__input"
      :id="id"
      type="checkbox"
      :disabled="disabled"
      :value="modelValue"
      @input="handleInput"
    />
    <label v-if="label" :for="id" class="px-checkbox__label">{{ label }}</label>
  </div>
  <div class="px-checkbox__info">
    <TransitionSwipe>
      <span v-if="error" class="px-checkbox__info__error">{{ error }}</span>
    </TransitionSwipe>
  </div>
</template>

<script setup lang="ts">
import PixelBorder from '~/components/pixel/PixelBorder.vue'
import TransitionSwipe from '~/components/transitions/TransitionSwipe.vue'

const props = withDefaults(
  defineProps<{
    name?: string
    modelValue?: boolean
    label?: string
    error?: string
    disabled?: boolean
  }>(),
  {
    name: undefined,
    modelValue: false,
    label: '',
    error: '',
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

  &__icon-wrapper {
    display: flex;
    background-color: var(--px-color-white);
    width: 20px;
    height: 20px;
  }
  &__icon {
    color: var(--px-color-black);
  }

  &__label {
    display: inline-flex;
  }

  &__info {
    display: flex;
    align-items: flex-start;
    height: 24px;
    overflow: hidden;

    &__error {
      margin-right: auto;
      font-size: 12px;
      color: var(--px-color-red);
    }
  }
}
</style>
