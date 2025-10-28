<template>
  <div :class="['px-text-input', { 'px-text-input--full-width': fullWidth }]">
    <label v-if="label" :for="id" class="px-text-input__label">{{ label }}</label>

    <PixelBorder :full-width="fullWidth" :color="error ? 'red' : 'dark'">
      <div class="px-text-input__wrapper">
        <div class="px-text-input__icon">
          <slot name="prepend-icon" />
        </div>
        <TransitionFade>
          <input
            class="px-text-input__field"
            :key="computedType"
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
        </TransitionFade>
        <TransitionSwipe>
          <div v-if="clearable && !readonly" class="px-text-input__icon">
            <icon
              name="pixelarticons:close"
              class="px-text-input__icon-clear"
              @click="handleClear"
            />
          </div>
        </TransitionSwipe>
        <TransitionSwipe>
          <div v-if="type === 'password'" :key="passwordIcon" class="px-text-input__icon">
            <icon
              :name="passwordIcon"
              class="px-text-input__icon-show-password"
              @click="handleShowPassword"
            />
          </div>
        </TransitionSwipe>
        <div class="px-text-input__icon">
          <slot name="append-icon" />
        </div>
      </div>
    </PixelBorder>

    <div class="px-text-input__info">
      <TransitionSwipe>
        <span v-if="error" class="px-text-input__info__error">{{ error }}</span>
      </TransitionSwipe>
      <span v-if="maxLength" class="px-text-input__info__max-length-counter">
        {{ modelValue.length ?? 0 }} / {{ maxLength }}
      </span>
    </div>
  </div>
</template>

<script setup lang="ts">
import PixelBorder from '~/components/pixel/PixelBorder.vue'
import TransitionFade from '~/components/transitions/TransitionFade.vue'
import TransitionSwipe from '~/components/transitions/TransitionSwipe.vue'

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
    autocomplete: 'one-time-code',
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

const id = ref(`px-text-input-${useId()}`)
const showPassword = ref(false)

const computedType = computed(() =>
  props.type === 'password' ? (showPassword.value ? 'text' : 'password') : props.type,
)
const passwordIcon = computed(() =>
  showPassword.value ? 'pixelarticons:eye-closed' : 'pixelarticons:eye',
)

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

  &__label {
    font-size: 16px;
    height: 24px;
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
    background-color: var(--px-color-white);
  }

  &__field {
    width: 100%;
    font-size: 16px;
    color: var(--px-color-black);
    caret-color: var(--px-color-black);
    background-color: transparent;

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
      font-size: 16px !important;
    }
  }

  &__icon {
    display: flex;
    color: var(--px-color-black);

    &-clear,
    &-show-password {
      cursor: pointer;
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
    }

    &__max-length-counter {
      margin-left: auto;
      font-size: 12px;
    }
  }
}
</style>
