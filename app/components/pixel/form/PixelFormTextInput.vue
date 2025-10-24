<template>
  <Field
    :name="name"
    type="text"
    v-slot="{ field, errorMessage, handleChange, handleBlur, handleReset }"
  >
    <PixelTextInput
      :name="name"
      :type="type"
      :autocomplete="autocomplete"
      :label="label"
      :placeholder="placeholder"
      :readonly="readonly"
      :max-length="maxLength"
      :full-width="fullWidth"
      :clearable="clearable"
      :error="errorMessage"
      :model-value="field.value"
      @update:model-value="handleChange"
      @blur="handleBlur"
      @clear="handleReset"
    >
      <template #prepend-icon>
        <slot name="prepend-icon" />
      </template>
      <template #append-icon>
        <slot name="append-icon" />
      </template>
    </PixelTextInput>
  </Field>
</template>

<script setup lang="ts">
import PixelTextInput from '~/components/pixel/PixelTextInput.vue'

import { Field } from 'vee-validate'

const props = withDefaults(
  defineProps<{
    name: string
    type?: 'text' | 'email' | 'password'
    autocomplete?: string
    label?: string
    placeholder?: string
    readonly?: boolean
    maxLength?: number | string
    fullWidth?: boolean
    clearable?: boolean
  }>(),
  {
    type: 'text',
    autocomplete: 'one-time-code',
    label: '',
    placeholder: '',
    readonly: false,
    maxLength: undefined,
    fullWidth: true,
    clearable: false,
  },
)
</script>
