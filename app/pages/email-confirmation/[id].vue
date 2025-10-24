<template>
  <div class="email-confirmation-page">
    <PixelContainer>
      <div class="email-confirmation-page__container">
        <TransitionExpandY>
          <PixelForm
            v-if="confirmed === false"
            :title="$t('page.emailConfirmation.emailConfirmation')"
            @submit="handleConfirmEmail"
          >
            <div v-if="Boolean(userError) === false" class="email-confirmation-page__column">
              <span style="width: 100%">
                {{ $t('page.emailConfirmation.emailForConfirmation') }}:
                <PixelBorder full-width>
                  <span class="email-confirmation-page__email">{{ userInfo?.email }}</span>
                </PixelBorder>
              </span>

              <PixelButton
                type="submit"
                :label="$t('page.emailConfirmation.confirmEmail')"
                :loading="loading"
                :disabled="Boolean(userError)"
                full-width
              />
            </div>

            <div v-else class="email-confirmation-page__column">
              <span v-if="userError">
                {{ $t(userError?.message) }}
              </span>
              <span v-else>
                {{ $t('page.emailConfirmation.unableToConfirmEmail') }}
              </span>

              <PixelButton
                :label="$t('page.emailConfirmation.openIndexPage')"
                :loading="loading"
                @click="handleOpenIndexPage"
                full-width
              />
            </div>
          </PixelForm>
          <div v-else class="email-confirmation-page__column">
            <span> {{ $t('page.emailConfirmation.emailConfirmed') }} </span>

            <PixelButton
              :label="$t('page.emailConfirmation.openIndexPage')"
              :loading="loading"
              full-width
              @click="handleOpenIndexPage"
            />
          </div>
        </TransitionExpandY>
      </div>
    </PixelContainer>
  </div>
</template>

<script setup lang="ts">
import PixelForm from '~/components/pixel/form/PixelForm.vue'
import PixelBorder from '~/components/pixel/PixelBorder.vue'
import PixelButton from '~/components/pixel/PixelButton.vue'
import PixelContainer from '~/components/pixel/PixelContainer.vue'
import TransitionExpandY from '~/components/transitions/TransitionExpandY.vue'

definePageMeta({
  auth: false,
})

const { t } = useI18n()
const toast = useToast()
const route = useRoute('email-confirmation-id')
const router = useRouter()
const trpc = useTRPC()

const loading = ref(false)
const confirmed = ref(false)

const { data: userInfo, error: userError } = await trpc.emailConfirmation.info.useQuery({
  emailConfirmationId: route.params.id,
})

onMounted(() => {
  if (userError.value) toast.error(t(userError.value.message))
})

async function handleConfirmEmail() {
  loading.value = true
  try {
    await trpc.emailConfirmation.confirm.mutate({
      emailConfirmationId: route.params.id,
    })

    confirmed.value = true
  } catch (error: any) {
    toast.error(t(error.message))
  } finally {
    loading.value = false
  }
}

async function handleOpenIndexPage() {
  loading.value = true
  await router.push({ name: 'index' })
  loading.value = false
}
</script>

<style lang="scss" scoped>
.email-confirmation-page {
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

  &__email {
    width: 100%;
    padding: 8px;
    background-color: var(--px-color-white);
    color: var(--px-color-black);
  }
}
</style>
