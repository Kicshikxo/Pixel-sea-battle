<template>
  <div :class="['px-text-input', { 'px-text-input--full-width': fullWidth }]">
    <label v-if="label" :for="id" class="px-text-input__label">{{ label }}</label>

    <pixel-border :full-width="fullWidth" :color="error ? 'red' : 'dark'">
      <div class="px-text-input__wrapper">
        <div class="px-text-input__icon">
          <slot name="prepend-icon" />
        </div>
        <input
          class="px-text-input__field"
          :id="id"
          :name="name"
          :type="computedType"
          :autocomplete="autocomplete"
          :value="modelValue"
          @input="handleInput"
          @blur="handleBlur"
          :placeholder="placeholder"
          :readonly="readonly"
          :maxlength="maxLength"
          spellcheck="false"
        />
        <transition name="px-text-input__icon-swipe" mode="out-in">
          <div v-if="clearable" class="px-text-input__icon">
            <icon name="pixelarticons:close" class="px-text-input__icon-clear" @click="handleClear" />
          </div>
        </transition>
        <transition name="px-text-input__icon-swipe" mode="out-in">
          <div v-if="type === 'password'" :key="passwordIcon" class="px-text-input__icon">
            <icon :name="passwordIcon" class="px-text-input__icon-show-password" @click="handleShowPassword" />
          </div>
        </transition>
        <div class="px-text-input__icon">
          <slot name="append-icon" />
        </div>
      </div>
    </pixel-border>

    <div class="px-text-input__info">
      <transition name="px-text-input__info__error-swipe" mode="out-in">
        <span v-if="error" class="px-text-input__info__error">{{ error }}</span>
      </transition>
      <span v-if="maxLength" class="px-text-input__info__max-length-counter"> {{ modelValue.length ?? 0 }} / {{ maxLength }} </span>
    </div>
  </div>
</template>

<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    name?: string
    modelValue?: string
    type?: 'text' | 'email' | 'password'
    autocomplete?: string
    label?: string
    placeholder?: string
    error?: string
    readonly?: boolean
    maxLength?: number | string
    fullWidth?: boolean
    clearable?: boolean
  }>(),
  {
    name: undefined,
    modelValue: '',
    type: 'text',
    autocomplete: 'off',
    label: '',
    placeholder: '',
    error: '',
    readonly: false,
    maxLength: undefined,
    fullWidth: true,
    clearable: false,
  },
)
const emits = defineEmits<{
  'update:modelValue': [value: string]
  blur: []
  clear: []
}>()

const id = ref(`px-text-input-${getCurrentInstance()?.uid}`)
const showPassword = ref(false)

const computedType = computed(() => (props.type === 'password' ? (showPassword.value ? 'text' : 'password') : props.type))
const passwordIcon = computed(() => (showPassword.value ? 'pixelarticons:eye-closed' : 'pixelarticons:eye'))

function handleInput(event: Event) {
  emits('update:modelValue', ((event as InputEvent).target as HTMLInputElement).value ?? '')
}

function handleBlur() {
  emits('blur')
}

function handleShowPassword() {
  showPassword.value = !showPassword.value
}

function handleClear() {
  emits('update:modelValue', '')
  nextTick(() => emits('clear'))
}
</script>

<style lang="scss" scoped>
.px-text-input {
  display: flex;
  flex-direction: column;

  &--full-width {
    width: 100%;
  }

  &__wrapper {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 4px;
    width: 100%;
    height: 40px;
    padding: 8px;
    color: var(--px-color-dark);
    background: var(--px-color-white);
  }

  &__field {
    width: 100%;
    font-size: 16px;
    color: var(--px-color-black);
    caret-color: var(--px-color-black);
    background: transparent;

    &:-webkit-autofill,
    &:-webkit-autofill:hover,
    &:-webkit-autofill:focus,
    &:-webkit-autofill:active {
      box-shadow: 0 0 0 50px var(--px-color-white) inset !important;
      -webkit-text-fill-color: var(--px-color-black) !important;
    }

    &:-webkit-autofill::first-line,
    &:-webkit-autofill:hover::first-line,
    &:-webkit-autofill:focus::first-line,
    &:-webkit-autofill:active::first-line {
      font-family: 'Minecraft' !important;
      font-size: 20px !important;
    }
  }

  &__icon {
    display: flex;
    color: var(--px-color-black);
    transition: transform 0.25s cubic-bezier(0.175, 0.885, 0.32, 1.275), opacity 0.25s cubic-bezier(0.175, 0.885, 0.32, 1.275);

    &-clear,
    &-show-password {
      cursor: pointer;
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

  &__info {
    display: flex;
    align-items: flex-start;
    height: 24px;
    overflow: hidden;

    &__error {
      margin-right: auto;
      font-size: 12px;
      color: var(--px-color-red);
      transition: transform 0.25s cubic-bezier(0.175, 0.885, 0.32, 1.275), opacity 0.25s cubic-bezier(0.175, 0.885, 0.32, 1.275);

      &-swipe-enter-from {
        opacity: 0;
        transform: translateY(100%);
      }
      &-swipe-leave-to {
        opacity: 0;
        transform: translateY(-100%);
      }
    }

    &__max-length-counter {
      margin-left: auto;
      font-size: 12px;
    }
  }
}
</style>
