<template>
  <div class="room-messages">
    <PixelForm
      ref="form"
      :validation-schema="messageValidationSchema"
      :title="$t('page.room.messages')"
      full-width
      @submit="handleSubmit"
    >
      <div class="room-messages__input">
        <PixelFormTextInput
          name="message"
          :label="$t('page.room.message')"
          :placeholder="$t('page.room.message')"
          :readonly="sendLoading"
          :max-length="1000"
        >
          <template #prepend-icon>
            <icon name="pixelarticons:mail" />
          </template>
        </PixelFormTextInput>

        <PixelButton type="submit" :label="$t('page.room.sendMessage')" :loading="sendLoading" />
      </div>
    </PixelForm>

    <TransitionExpandY>
      <PixelLoader v-if="messagesLoading" class="room-messages__loader" />
    </TransitionExpandY>

    <TransitionExpandY>
      <div v-if="messages?.length" class="room-messages__list">
        <PixelContainer
          v-for="message in messages"
          :key="message.id"
          class="room-messages__list-item__container"
          full-width
        >
          <TransitionExpandY appear>
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
          </TransitionExpandY>
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
import PixelLoader from '~/components/pixel/PixelLoader.vue'
import TransitionExpandY from '~/components/transitions/TransitionExpandY.vue'

import type { RoomMessage, User } from '@prisma/client'
import type { FormContext } from 'vee-validate'
import { z } from 'zod'

const { t } = useI18n()
const { session } = useAuth()

const props = withDefaults(
  defineProps<{
    messages?: (RoomMessage & { user: User })[] | null
    messagesLoading?: boolean
    sendLoading?: boolean
  }>(),
  {
    messages: null,
    messagesLoading: false,
    sendLoading: false,
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
  justify-content: center;
  align-items: center;
  width: 100%;

  &__input {
    display: flex;
    align-items: center;
    gap: 8px;
    width: 100%;
  }

  &__list {
    display: flex;
    flex-direction: column;
    width: 100%;
    max-height: calc((52px + 8px) * 5 - 8px);
    overflow-y: auto;
  }

  &__list-item {
    display: flex;
    gap: 4px;

    &__container {
      min-height: 52px;

      &:not(:last-child) {
        margin-bottom: 8px;
      }
    }

    &__username {
      font-weight: bold;
      color: var(--px-color-blue);

      &--current {
        color: var(--px-color-green);
      }
    }

    &__message {
      word-break: break-all;
    }
  }
}
</style>
