<template>
  <div class="password-recovery-page">
    <PixelContainer>
      <div class="password-recovery-page__container">
        <TransitionExpandY>
          <PixelForm
            v-if="sended === false"
            :validation-schema="passwordRecoverySchema"
            @submit="handleChangePassword"
          >
            <PixelFormTextInput
              name="email"
              type="email"
              autocomplete="username"
              :label="$t('page.passwordRecovery.accountEmail')"
              :placeholder="$t('page.passwordRecovery.accountEmail')"
              full-width
            >
              <template #prepend-icon>
                <icon name="pixelarticons:mail" />
              </template>
            </PixelFormTextInput>
            <PixelButton
              type="submit"
              :label="$t('page.passwordRecovery.sendPasswordRecovery')"
              :loading="loading"
              full-width
            />
          </PixelForm>
          <div v-else class="password-recovery-page__column">
            <span> {{ $t('page.passwordRecovery.passwordRecoverySucessfullySended') }} </span>

            <PixelButton
              :label="$t('page.passwordRecovery.openAuthPage')"
              :loading="loading"
              full-width
              @click="handleOpenAuthPage"
            />
          </div>
        </TransitionExpandY>
      </div>
    </PixelContainer>
  </div>
</template>

<script setup lang="ts">
import PixelForm from '~/components/pixel/form/PixelForm.vue'
import PixelFormTextInput from '~/components/pixel/form/PixelFormTextInput.vue'
import PixelButton from '~/components/pixel/PixelButton.vue'
import PixelContainer from '~/components/pixel/PixelContainer.vue'
import TransitionExpandY from '~/components/transitions/TransitionExpandY.vue'

import { z } from 'zod'

definePageMeta({
  auth: false,
})

const { t } = useI18n()
const toast = useToast()
const router = useRouter()
const trpc = useTRPC()

const loading = ref(false)
const sended = ref(false)

const passwordRecoverySchema = computed(() =>
  z.object({
    email: z
      .string()
      .min(1, t('validation.required'))
      .email(t('validation.invalidEmail'))
      .default(''),
  }),
)

async function handleChangePassword(values: z.infer<typeof passwordRecoverySchema.value>) {
  loading.value = true
  try {
    await trpc.passwordRecovery.send.mutate({
      email: values.email,
    })

    sended.value = true
  } catch (error: any) {
    toast.error(t(error.message))
  } finally {
    loading.value = false
  }
}

async function handleOpenAuthPage() {
  loading.value = true
  await router.push({ name: 'auth' })
  loading.value = false
}
</script>

<style lang="scss" scoped>
.password-recovery-page {
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;

  &__container {
    width: 450px !important;
  }

  &__column {
    display: flex;
    flex-direction: column;
    gap: 16px;
    width: 100%;
  }
}
</style>
