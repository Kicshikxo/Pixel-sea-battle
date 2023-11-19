<template>
  <div class="confirm-email-page">
    <pixel-form class="confirm-email-page__form" :validation-schema="z.object({})" @submit="handleSubmit">
      <template v-if="confirmed === false">
        <span v-if="Boolean(userError) === false">
          {{ $t('confirmEmailPage.confirmYourEmail') }}:
          <pixel-border full-width
            ><span class="confirm-email-page__email">{{ userInfo?.email }}</span></pixel-border
          >
        </span>
        <span v-else>
          {{ $t('confirmEmailPage.unableToConfirmEmail') }}
        </span>
        <br />
        <pixel-button v-if="Boolean(userError) === false" type="submit" :label="$t('confirmEmailPage.confirmEmail')" :loading="loading" :disabled="Boolean(userError)" full-width />
        <pixel-button v-else :label="$t('confirmEmailPage.goBackHome')" @click="router.push('/')" full-width />
      </template>
      <template v-else-if="confirmed === true">
        <span> {{ $t('confirmEmailPage.emailConfirmed') }} </span>
        <br />
        <pixel-button type="submit" :label="$t('confirmEmailPage.openAccount')" :loading="loading" full-width />
      </template>
    </pixel-form>
  </div>
</template>

<script setup lang="ts">
import { z } from 'zod'

definePageMeta({
  auth: false,
})

const route = useRoute('confirmEmail-id')
const router = useRouter()
const client = useClient()

const loading = ref(false)
const confirmed = ref(false)

const { data: userInfo, error: userError } = await client.email.info.useQuery({ emailConfirmationId: route.params.id })

async function handleConfirmEmail() {
  loading.value = true
  const { error } = await client.email.confirm.useQuery({ emailConfirmationId: route.params.id })
  if (!error.value) confirmed.value = true
  loading.value = false
}

async function handleOpenAccount() {
  loading.value = true
  await router.push('/')
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
    width: 450px;
  }

  &__email {
    width: 100%;
    padding: 8px;
    background: var(--px-color-white);
    color: var(--px-color-black);
  }
}
</style>
