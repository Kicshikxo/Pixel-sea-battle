<template>
  <div class="sign-in-page">
    <pixel-form class="sign-in-page__form" :validation-schema="schema" @submit="handleSubmit">
      <div class="sign-in-page__form-title">{{ t('signInPage.title') }}</div>
      <pixel-form-text-input name="email" :label="t('signInPage.emailLabel')" :placeholder="t('signInPage.emailPlaceholder')" />
      <pixel-form-text-input name="password" type="password" :label="t('signInPage.passwordLabel')" :placeholder="t('signInPage.passwordPlaceholder')" />

      <div class="sign-in-page__options">
        <pixel-checkbox class="sign-in-page__options__remeber-me" v-model="rememberMe" :label="t('signInPage.rememberMe')" />
        <span class="sign-in-page__options__sign-up">{{ t('signInPage.noAccount') }}</span>
      </div>

      <pixel-button type="submit" :label="t('signInPage.signIn')" :loading="loading" :disabled="googleLoading" full-width>
        <template #append-icon>
          <icon name="pixelarticons:login" />
        </template>
      </pixel-button>

      <pixel-divider :text="t('signInPage.googleSignIn')" width="32" />

      <pixel-border class="sign-in-page__google-signin" full-width>
        <GoogleSignInButton class="sign-in-page__google-signin-button" @success="handleGoogleSignin" :locale="locale" :theme="$colorMode.value === 'dark' ? 'filled_black' : 'outline'" :width="372" text="continue_with" />
      </pixel-border>
    </pixel-form>
  </div>
</template>

<script setup lang="ts">
import { type CredentialResponse } from 'vue3-google-signin'
import { z } from 'zod'

definePageMeta({
  auth: false,
})

const schema = z.object({
  email: z.string().min(1, 'Необходимое поле').email('Невалидная почта'),
  password: z.string().min(1, 'Необходимое поле').max(100, { message: 'Слишком много символов' }),
})

const { t, locale } = useI18n()
const route = useRoute()
const { signIn, googleSignin } = useAuth()

const rememberMe = ref(true)
const action = ref<'signIn' | 'signUp'>('signIn')
const loading = ref(false)
const googleLoading = ref(false)

async function handleGoogleSignin(response: CredentialResponse) {
  googleLoading.value = true
  await googleSignin({ accessToken: response.credential!, redirectTo: (route.query.redirectTo as string) ?? '/' })
  googleLoading.value = false
}
async function handleSubmit(values: z.infer<typeof schema>) {
  loading.value = true
  await signIn({ email: values.email, password: values.password, redirectTo: (route.query.redirectTo as string) ?? '/' })
  loading.value = false
}
</script>

<style lang="scss" scoped>
.sign-in-page {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  flex: 1;

  &__form {
    width: 400px !important;
  }

  &__form-title {
    font-size: 20px;
    margin: 16px;
  }

  &__options {
    display: flex;
    align-items: center;
    margin-bottom: 24px;
    width: 100%;

    &__remember-me {
      margin-right: auto;
    }

    &__sign-up {
      cursor: pointer;
      color: var(--px-color-blue);
      --px-color-text-shadow: var(--px-color-shadow-blue);
      margin-left: auto;
      &:hover {
        color: var(--px-color-blue-hover);
      }
      &:active {
        color: var(--px-color-blue-active);
      }
    }
  }

  &__google-signin {
    display: flex;
    justify-content: center;
    align-items: flex-start;
    height: 64px !important;

    &-button {
      width: 100%;
      height: 40px;
      background: var(--px-color-black-inverted);
      color-scheme: auto;
    }
  }
}
</style>
