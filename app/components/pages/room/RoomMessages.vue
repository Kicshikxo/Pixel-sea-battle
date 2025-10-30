<template>
  <div class="room-messages">
    <PixelForm
      ref="form"
      :validation-schema="messageValidationSchema"
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

        <PixelButton
          type="submit"
          :label="$t('page.room.sendMessage')"
          :loading="sendLoading"
          class="room-messages__input__button--desktop"
        >
          <template #append-icon>
            <icon name="pixelarticons:forward" />
          </template>
        </PixelButton>
        <PixelButton
          type="submit"
          :loading="sendLoading"
          icon-only
          class="room-messages__input__button--mobile"
        >
          <template #icon>
            <icon name="pixelarticons:forward" />
          </template>
        </PixelButton>
      </div>
      <TransitionExpand>
        <div v-if="showTypingIndicator">
          <div class="room-messages__typing-indicator">
            <icon class="room-messages__typing-indicator__icon" name="pixelarticons:edit" />
            <span class="room-messages__typing-indicator__text">
              {{ t('page.room.typing') }}
            </span>
          </div>
        </div>
      </TransitionExpand>
    </PixelForm>

    <TransitionExpand>
      <PixelLoader v-if="messagesLoading" class="room-messages__loader" />
    </TransitionExpand>

    <TransitionExpand>
      <div v-if="messages.length" class="room-messages__list">
        <TransitionExpand group>
          <div v-for="message in messages" :key="message.id" class="room-messages__list__container">
            <PixelContainer full-width>
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
        </TransitionExpand>
      </div>
    </TransitionExpand>
  </div>
</template>

<script setup lang="ts">
import PixelForm from '~/components/pixel/form/PixelForm.vue'
import PixelFormTextInput from '~/components/pixel/form/PixelFormTextInput.vue'
import PixelButton from '~/components/pixel/PixelButton.vue'
import PixelContainer from '~/components/pixel/PixelContainer.vue'
import PixelLoader from '~/components/pixel/PixelLoader.vue'
import TransitionExpand from '~/components/transitions/TransitionExpand.vue'

import type { RoomMessage, User } from '@prisma/client'
import type { FormContext } from 'vee-validate'
import { z } from 'zod'

const { t } = useI18n()
const { session } = useAuth()

const props = withDefaults(
  defineProps<{
    messages?: (RoomMessage & { user: User })[]
    showTypingIndicator?: boolean
    messagesLoading?: boolean
    sendLoading?: boolean
  }>(),
  {
    messages: () => [],
    showTypingIndicator: false,
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

defineExpose({
  formContext: () => form.value?.formContext,
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
    margin-bottom: 8px;

    &__button--desktop {
      @include on-breakpoint(sm) {
        display: none;
      }
    }
    &__button--mobile {
      display: none;
      @include on-breakpoint(sm) {
        display: flex;
      }
    }
  }

  &__typing-indicator {
    display: flex;
    align-items: center;
    gap: 16px;
    padding-bottom: 16px;

    &__icon {
      animation: typing-icon 1s infinite;
    }

    @keyframes typing-icon {
      0% {
        transform: translateX(0);
      }
      20% {
        transform: translateX(8px);
      }
      40% {
        transform: translateX(0);
      }
      60% {
        transform: translateX(4px);
      }
      80%,
      100% {
        transform: translateX(0);
      }
    }

    &__text:after {
      content: '123';
      display: inline-block;
      width: 1ch;
      animation: typing-dots 1s steps(3, end) infinite;
    }

    @keyframes typing-dots {
      0%,
      20% {
        content: '';
      }
      40% {
        content: '.';
      }
      60% {
        content: '..';
      }
      80%,
      100% {
        content: '...';
      }
    }
  }

  &__list {
    display: flex;
    flex-direction: column;
    width: 100%;
    max-height: calc((52px + 8px) * 5 - 8px);
    overflow-y: auto;

    &__container:not(:last-child) {
      margin-bottom: 8px;
    }
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

    &__message {
      word-break: break-all;
    }
  }
}
</style>
