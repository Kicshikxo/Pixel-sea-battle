<template>
  <div class="confirm-email-page">
    <PixelContainer>
      <PixelForm class="confirm-email-page__form" @submit="handleSubmit">
        <template v-if="confirmed === false">
          <span v-if="Boolean(userError) === false">
            {{ $t('page.confirmEmail.confirmYourEmail') }}:
            <PixelBorder full-width>
              <span class="confirm-email-page__email">{{ userInfo?.email }}</span>
            </PixelBorder>
          </span>
          <span v-else>
            {{ $t('page.confirmEmail.unableToConfirmEmail') }}
          </span>
          <br />
          <PixelButton
            v-if="Boolean(userError) === false"
            type="submit"
            :label="$t('page.confirmEmail.confirmEmail')"
            :loading="loading"
            :disabled="Boolean(userError)"
            full-width
          />
          <PixelButton
            v-else
            :label="$t('page.confirmEmail.goBackHome')"
            @click="router.push({ name: 'index' })"
            full-width
          />
        </template>
        <template v-else-if="confirmed === true">
          <span> {{ $t('page.confirmEmail.emailConfirmed') }} </span>
          <br />
          <PixelButton
            type="submit"
            :label="$t('page.confirmEmail.openAccount')"
            :loading="loading"
            full-width
          />
        </template>
      </PixelForm>
    </PixelContainer>
  </div>
</template>

<script setup lang="ts">
import PixelForm from '~/components/pixel/form/PixelForm.vue'
import PixelBorder from '~/components/pixel/PixelBorder.vue'
import PixelButton from '~/components/pixel/PixelButton.vue'
import PixelContainer from '~/components/pixel/PixelContainer.vue'

definePageMeta({
  auth: false,
})

const { t } = useI18n()
const toast = useToast()
const route = useRoute('confirmEmail-id')
const router = useRouter()
const trpc = useTRPC()

const loading = ref(false)
const confirmed = ref(false)

const { data: userInfo, error: userError } = await trpc.email.info.useQuery({
  emailConfirmationId: route.params.id as string,
})

onMounted(() => {
  if (userError.value) toast.error(t(userError.value.message))
})

async function handleConfirmEmail() {
  loading.value = true
  try {
    await trpc.email.confirm.query({
      emailConfirmationId: route.params.id as string,
    })

    confirmed.value = true
  } catch (error: any) {
    toast.error(t(error.message))
  } finally {
    loading.value = false
  }
}

async function handleOpenAccount() {
  loading.value = true
  await router.push({ name: 'index' })
  loading.value = false
}

const handleSubmit = computed(() => (confirmed.value ? handleOpenAccount : handleConfirmEmail))
</script>

<style lang="scss" scoped>
.confirm-email-page {
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;

  &__form {
    width: 450px !important;
  }

  &__email {
    width: 100%;
    padding: 8px;
    background: var(--px-color-white);
    color: var(--px-color-black);
  }
}
</style>
