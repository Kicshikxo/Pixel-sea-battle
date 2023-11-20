<template>
  <pixel-border :full-width="fullWidth">
    <Form :class="['px-form', { 'px-form--full-width': fullWidth }]" :validation-schema="toTypedSchema(validationSchema ?? z.object({}))" @submit="handleSubmit">
      <slot />
    </Form>
  </pixel-border>
</template>

<script setup lang="ts" generic="T extends z.ZodSchema">
import { toTypedSchema } from '@vee-validate/zod'
import { Form } from 'vee-validate'
import { z } from 'zod'

const props = withDefaults(
  defineProps<{
    validationSchema?: z.ZodSchema
    fullWidth?: boolean
  }>(),
  {
    fullWidth: true,
  },
)
const emits = defineEmits<{
  submit: [values: z.infer<T>]
}>()

function handleSubmit(values: z.infer<T>) {
  emits('submit', values)
}
</script>

<style lang="scss" scoped>
.px-form {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background: var(--px-color-dark);
  padding: 12px;

  &--full-width {
    width: 100%;
  }
}
</style>
