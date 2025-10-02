<template>
  <Field :name="name" v-slot="{ field, errorMessage, handleChange, handleBlur, handleReset }">
    <PixelTextInput
      :name="name"
      :model-value="field.value"
      @update:model-value="handleChange"
      @blur="handleBlur"
      @clear="handleReset"
      :type="type"
      :autocomplete="autocomplete"
      :label="label"
      :placeholder="placeholder"
      :error="errorMessage"
      :maxlength="maxLength"
      :full-width="fullWidth"
      :clearable="clearable"
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
import { Field } from 'vee-validate'
import PixelTextInput from '~/components/pixel/PixelTextInput.vue'

const props = withDefaults(
  defineProps<{
    name: string
    type?: 'text' | 'email' | 'password'
    autocomplete?: string
    label?: string
    placeholder?: string
    maxLength?: number | string
    fullWidth?: boolean
    clearable?: boolean
  }>(),
  {
    type: 'text',
    autocomplete: 'one-time-code',
    label: '',
    placeholder: '',
    maxLength: undefined,
    fullWidth: true,
    clearable: false,
  },
)
</script>
