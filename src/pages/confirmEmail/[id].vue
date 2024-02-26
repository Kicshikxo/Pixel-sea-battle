<template>
  <div class="confirm-email-page">
    <pixel-container>
      <pixel-form class="confirm-email-page__form" @submit="handleSubmit">
        <template v-if="confirmed === false">
          <span v-if="Boolean(userError) === false">
            {{ $t('confirmEmailPage.confirmYourEmail') }}:
            <pixel-border full-width>
              <span class="confirm-email-page__email">{{ userInfo?.email }}</span>
            </pixel-border>
          </span>
          <span v-else>
            {{ $t('confirmEmailPage.unableToConfirmEmail') }}
          </span>
          <br />
          <pixel-button v-if="Boolean(userError) === false" type="submit" :label="$t('confirmEmailPage.confirmEmail')" :loading="loading" :disabled="Boolean(userError)" full-width />
          <pixel-button v-else :label="$t('confirmEmailPage.goBackHome')" @click="router.push({ name: 'index' })" full-width />
        </template>
        <template v-else-if="confirmed === true">
          <span> {{ $t('confirmEmailPage.emailConfirmed') }} </span>
          <br />
          <pixel-button type="submit" :label="$t('confirmEmailPage.openAccount')" :loading="loading" full-width />
        </template>
      </pixel-form>
    </pixel-container>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  auth: false,
})

const { t } = useI18n()
const toast = useToast()
const route = useRoute('confirmEmail-id')
const router = useRouter()
const client = useClient()

const loading = ref(false)
const confirmed = ref(false)

const { data: userInfo, error: userError } = await client.email.info.useQuery({ emailConfirmationId: route.params.id })

onMounted(() => {
  if (userError.value) toast.error(t(userError.value.message))
})

async function handleConfirmEmail() {
  loading.value = true
  const { error } = await client.email.confirm.useQuery({ emailConfirmationId: route.params.id })
  if (error.value) toast.error(t(error.value.message))
  if (!error.value) confirmed.value = true
  loading.value = false
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
