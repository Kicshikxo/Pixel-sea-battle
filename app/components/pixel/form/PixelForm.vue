<template>
  <Form
    :class="['px-form', { 'px-form--full-width': fullWidth }]"
    :validation-schema="toTypedSchema(validationSchema ?? z.object({}))"
    @submit="handleSubmit"
  >
    <slot />
  </Form>
</template>

<script setup lang="ts" generic="T extends z.ZodSchema">
import { toTypedSchema } from '@vee-validate/zod'
import { Form } from 'vee-validate'
import { z } from 'zod'

const props = withDefaults(
  defineProps<{
    validationSchema?: T
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
  align-items: start;

  &--full-width {
    width: 100%;
  }
}
</style>
