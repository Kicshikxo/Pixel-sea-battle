<template>
  <div class="px-checkbox">
    <label :for="id" class="px-checkbox__label">
      <pixel-border level="2">
        <div class="px-checkbox__icon__wrapper">
          <transition name="px-checkbox__icon-swipe" mode="out-in">
            <icon class="px-checkbox__icon" :key="iconName" :name="iconName" size="20" />
          </transition>
        </div>
      </pixel-border>
    </label>
    <input class="px-checkbox__input" :id="id" type="checkbox" :checked="modelValue" @input="handleInput" :disabled="disabled" />
    <label v-if="label" :for="id" class="px-checkbox__label">{{ label }}</label>
  </div>
</template>

<script setup lang="ts">
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

const id = ref(`px-checkbox-${getCurrentInstance()?.uid}`)

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
    transition: transform 0.25s cubic-bezier(0.175, 0.885, 0.32, 1.275), opacity 0.25s cubic-bezier(0.175, 0.885, 0.32, 1.275);

    &__wrapper {
      display: flex;
      background: var(--px-color-white);
      width: 20px;
      height: 20px;
    }

    &-swipe-enter-from {
      opacity: 0;
      transform: translateY(100%);
    }
    &-swipe-leave-to {
      opacity: 0;
      transform: translateY(-100%);
    }
  }

  &__label {
    display: inline-flex;
  }
}
</style>
