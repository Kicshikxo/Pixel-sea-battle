<template>
  <Form
    :class="['px-form', { 'px-form--full-width': fullWidth }]"
    :validation-schema="toTypedSchema(validationSchema ?? z.object({}))"
    v-slot="formContext"
    @submit="handleSubmit"
  >
    <TransitionSwipeY>
      <div v-if="title" class="px-form__title" :key="title">
        {{ title }}
      </div>
    </TransitionSwipeY>
    <slot :form-context="formContext" />
  </Form>
</template>

<script setup lang="ts" generic="T extends z.ZodSchema">
import TransitionSwipeY from '~/components/transitions/TransitionSwipeY.vue'

import { toTypedSchema } from '@vee-validate/zod'
import { Form } from 'vee-validate'
import { z } from 'zod'

const props = withDefaults(
  defineProps<{
    validationSchema?: T
    title?: string
    fullWidth?: boolean
  }>(),
  {
    title: '',
    fullWidth: false,
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

  &__title {
    font-size: 20px;
    margin-bottom: 16px;
    word-break: break-all;
  }

  &--full-width {
    width: 100%;
  }
}
</style>
