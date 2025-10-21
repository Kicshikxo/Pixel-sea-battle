<template>
  <div class="password-recovery-page">
    <PixelContainer>
      <div class="password-recovery-page__container">
        <TransitionExpandY>
          <PixelForm :validation-schema="passwordRecoverySchema" @submit="handleChangePassword">
            <div class="password-recovery-page__form-title">
              {{ userInfo?.email ?? $t('page.passwordRecovery.passwordRecovery') }}
            </div>
            <template v-if="changed === false">
              <template v-if="Boolean(userError) === false">
                <input type="text" name="username" autocomplete="username" style="display: none" />

                <PixelFormTextInput
                  name="password"
                  type="password"
                  autocomplete="new-password"
                  :label="$t('page.passwordRecovery.newPassword')"
                  :placeholder="$t('page.passwordRecovery.newPassword')"
                  full-width
                >
                  <template #prepend-icon>
                    <icon name="pixelarticons:lock" />
                  </template>
                </PixelFormTextInput>
                <PixelButton
                  type="submit"
                  :label="$t('page.passwordRecovery.changePassword')"
                  :loading="loading"
                  full-width
                />
              </template>

              <div v-else class="password-recovery-page__column">
                <span v-if="userError">
                  {{ $t(userError?.message) }}
                </span>
                <span v-else>
                  {{ $t('page.passwordRecovery.unableToChangePassword') }}
                </span>

                <PixelButton
                  :label="$t('page.passwordRecovery.openAuthPage')"
                  @click="router.push({ name: 'auth' })"
                  full-width
                />
              </div>
            </template>
            <div v-else class="password-recovery-page__column">
              <span> {{ $t('page.passwordRecovery.passwordSuccessfullyChanged') }} </span>

              <PixelButton
                :label="$t('page.passwordRecovery.openAuthPage')"
                :loading="loading"
                full-width
                @click="handleOpenAuthPage"
              />
            </div>
          </PixelForm>
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
const route = useRoute('password-recovery-id')
const router = useRouter()
const trpc = useTRPC()

const loading = ref(false)
const changed = ref(false)

const { data: userInfo, error: userError } = await trpc.passwordRecovery.info.useQuery({
  passwordRecoveryId: route.params.id,
})

onMounted(() => {
  if (userError.value) toast.error(t(userError.value.message))
})

const passwordRecoverySchema = computed(() =>
  z.object({
    password: z
      .string()
      .min(1, t('validation.required'))
      .max(100, { message: t('validation.tooManyCharacters') })
      .default(''),
  }),
)

async function handleChangePassword(values: z.infer<typeof passwordRecoverySchema.value>) {
  loading.value = true
  try {
    await trpc.passwordRecovery.change.mutate({
      passwordRecoveryId: route.params.id,
      password: values.password,
    })

    changed.value = true
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

  &__form-title {
    font-size: 20px;
    margin-bottom: 16px;
    word-break: break-all;
  }

  &__column {
    display: flex;
    flex-direction: column;
    gap: 16px;
    width: 100%;
  }
}
</style>
