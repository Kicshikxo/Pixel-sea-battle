<template>
  <Field :name="name" v-slot="{ field, errorMessage, handleChange, handleBlur, handleReset }">
    <pixel-text-input
      :name="name"
      :model-value="field.value"
      @update:model-value="handleChange"
      @blur="handleBlur"
      @clear="handleReset"
      :type="type"
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
    </pixel-text-input>
  </Field>
</template>

<script setup lang="ts">
import { Field } from 'vee-validate'

const props = withDefaults(
  defineProps<{
    name: string
    type?: 'text' | 'email' | 'password'
    label?: string
    placeholder?: string
    maxLength?: number | string
    fullWidth?: boolean
    clearable?: boolean
  }>(),
  {
    type: 'text',
    label: '',
    placeholder: '',
    maxLength: undefined,
    fullWidth: true,
    clearable: false,
  },
)
</script>
