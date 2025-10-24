<template>
  <div class="room-messages">
    <PixelForm
      ref="form"
      class="room-messages__form"
      :validation-schema="messageValidationSchema"
      :title="$t('page.room.messages')"
      full-width
      @submit="handleSubmit"
    >
      <PixelFormTextInput
        name="message"
        :label="$t('page.room.message')"
        :placeholder="$t('page.room.message')"
        :readonly="loading"
      >
        <template #prepend-icon>
          <icon name="pixelarticons:mail" />
        </template>
      </PixelFormTextInput>

      <PixelButton
        type="submit"
        :label="$t('page.room.sendMessage')"
        :loading="loading"
        class="room-messages__button"
      />
    </PixelForm>

    <TransitionExpandY>
      <div v-if="messages?.length" class="room-messages__list">
        <PixelContainer v-for="message in messages" full-width>
          <div class="room-messages__list-item">
            <span class="room-messages__list-item__time">
              ({{ new Date(message.createdAt).toLocaleTimeString() }})
            </span>
            <span>
              <span
                :class="[
                  'room-messages__list-item__username',
                  {
                    'room-messages__list-item__username--current':
                      session.data.value?.id === message.user.id,
                  },
                ]"
              >
                {{ message.user.username }}
              </span>
              <span>:</span>
            </span>
            <span class="room-messages__list-item__message">
              {{ message.text }}
            </span>
          </div>
        </PixelContainer>
      </div>
    </TransitionExpandY>
  </div>
</template>

<script setup lang="ts">
import PixelForm from '~/components/pixel/form/PixelForm.vue'
import PixelFormTextInput from '~/components/pixel/form/PixelFormTextInput.vue'
import PixelButton from '~/components/pixel/PixelButton.vue'
import PixelContainer from '~/components/pixel/PixelContainer.vue'
import TransitionExpandY from '~/components/transitions/TransitionExpandY.vue'

import type { RoomMessage, User } from '@prisma/client'
import type { FormContext } from 'vee-validate'
import { z } from 'zod'

const { t } = useI18n()
const { session } = useAuth()

const props = withDefaults(
  defineProps<{
    messages?: (RoomMessage & { user: User })[] | null
    loading?: boolean
  }>(),
  {
    messages: null,
    loading: false,
  },
)
const emits = defineEmits<{
  'send-message': [message: string]
}>()

const form = ref<{ formContext: FormContext<MessageFormValues> }>()

const messageValidationSchema = computed(() =>
  z.object({
    message: z
      .string()
      .max(1000, { message: t('validation.tooManyCharacters') })
      .default(''),
  }),
)
type MessageFormValues = z.infer<typeof messageValidationSchema.value>

function resetForm() {
  form.value?.formContext.resetForm()
}

defineExpose({
  resetForm,
})

async function handleSubmit(values: MessageFormValues) {
  if (values.message.length === 0) return
  emits('send-message', values.message)
}
</script>

<style lang="scss" scoped>
.room-messages {
  display: flex;
  flex-direction: column;
  gap: 16px;
  width: 100%;

  &__button {
    margin-left: auto;
  }

  &__list {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  &__list-item {
    display: flex;
    gap: 4px;

    &__username {
      font-weight: bold;
      color: var(--px-color-blue);

      &--current {
        color: var(--px-color-green);
      }
    }
  }
}
</style>
