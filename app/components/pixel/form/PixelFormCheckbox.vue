<template>
  <Field :name="name" type="checkbox" :value="true" v-slot="{ field, errorMessage, handleChange }">
    <PixelCheckbox
      :name="name"
      :label="label"
      :disabled="disabled"
      :error="errorMessage"
      :model-value="field.checked"
      @update:model-value="handleChange"
    />
  </Field>
</template>

<script setup lang="ts">
import PixelCheckbox from '~/components/pixel/PixelCheckbox.vue'

import { Field } from 'vee-validate'

const props = withDefaults(
  defineProps<{
    name: string
    label?: string
    disabled?: boolean
  }>(),
  {
    label: '',
    disabled: false,
  },
)
</script>
