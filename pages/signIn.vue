<template>
  <div class="sign-in-page">
    <pixel-form class="sign-in-page__form" :validation-schema="validationSchema" @submit="handleSubmit">
      <div class="sign-in-page__form-title">{{ action === 'signIn' ? $t('signInPage.signInTitle') : $t('signInPage.signUpTitle') }}</div>

      <template v-if="action === 'signIn'">
        <pixel-form-text-input name="email" autocomplete="username" :label="$t('signInPage.emailLabel')" :placeholder="$t('signInPage.emailPlaceholder')">
          <template #prepend-icon>
            <icon name="pixelarticons:mail" />
          </template>
        </pixel-form-text-input>
        <pixel-form-text-input name="password" autocomplete="current-password" type="password" :label="$t('signInPage.passwordLabel')" :placeholder="$t('signInPage.passwordPlaceholder')">
          <template #prepend-icon>
            <icon name="pixelarticons:lock" />
          </template>
        </pixel-form-text-input>
      </template>
      <template v-if="action === 'signUp'">
        <pixel-form-text-input name="name" :label="$t('signInPage.usernameLabel')" :placeholder="$t('signInPage.usernamePlaceholder')">
          <template #prepend-icon>
            <icon name="pixelarticons:user" />
          </template>
        </pixel-form-text-input>
        <pixel-form-text-input name="email" autocomplete="username" :label="$t('signInPage.emailLabel')" :placeholder="$t('signInPage.emailPlaceholder')">
          <template #prepend-icon>
            <icon name="pixelarticons:mail" />
          </template>
        </pixel-form-text-input>
        <pixel-form-text-input name="password" type="password" autocomplete="new-password" :label="$t('signInPage.passwordLabel')" :placeholder="$t('signInPage.passwordPlaceholder')">
          <template #prepend-icon>
            <icon name="pixelarticons:lock" />
          </template>
        </pixel-form-text-input>
      </template>

      <div class="sign-in-page__options">
        <pixel-checkbox v-if="action === 'signIn'" class="sign-in-page__options__remeber-me" v-model="rememberMe" :label="$t('signInPage.rememberMe')" />
        <span v-if="action === 'signIn'" class="sign-in-page__options__sign-up" @click="action = 'signUp'">{{ $t('signInPage.noAccount') }}</span>
        <span v-if="action === 'signUp'" class="sign-in-page__options__sign-up" @click="action = 'signIn'">{{ $t('signInPage.alreadyHaveAccount') }}</span>
      </div>

      <pixel-button type="submit" :label="action === 'signIn' ? $t('signInPage.signIn') : $t('signInPage.signUp')" :loading="loading" :disabled="googleLoading" full-width>
        <template #append-icon>
          <icon name="pixelarticons:login" />
        </template>
      </pixel-button>

      <pixel-divider :text="$t('signInPage.googleSignIn')" width="32" />

      <pixel-border class="sign-in-page__google-signin" full-width>
        <GoogleSignInButton class="sign-in-page__google-signin-button" @success="handleGoogleSignIn" :locale="locale" :theme="$colorMode.value === 'dark' ? 'filled_black' : 'outline'" :width="372" text="continue_with" />
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

const route = useRoute()
const { t, locale } = useI18n()
const { signIn, signUp, googleSignIn } = useAuth()

const rememberMe = ref(true)
const action = ref<'signIn' | 'signUp'>('signIn')
const loading = ref(false)
const googleLoading = ref(false)

const signInValidationSchema = computed(() =>
  z.object({
    email: z.string().min(1, t('validation.required')).email(t('validation.invalidEmail')).default(''),
    password: z
      .string()
      .min(1, t('validation.required'))
      .max(100, { message: t('validation.tooManyCharacters') })
      .default(''),
  }),
)

const signUpValidationSchema = computed(() =>
  z.object({
    email: z.string().min(1, t('validation.required')).email(t('validation.invalidEmail')).default(''),
    name: z
      .string()
      .min(1, t('validation.required'))
      .max(100, { message: t('validation.tooManyCharacters') })
      .default(''),
    password: z
      .string()
      .min(1, t('validation.required'))
      .max(100, { message: t('validation.tooManyCharacters') })
      .default(''),
  }),
)

const validationSchema = computed(() => (action.value === 'signIn' ? signInValidationSchema.value : signUpValidationSchema.value))

async function handleGoogleSignIn(response: CredentialResponse) {
  googleLoading.value = true
  await googleSignIn({ accessToken: response.credential!, redirectTo: (route.query.redirectTo as string) ?? '/' })
  googleLoading.value = false
}
async function handleSignIn(values: z.infer<typeof signInValidationSchema.value>) {
  loading.value = true
  await signIn({ email: values.email, password: values.password, redirectTo: (route.query.redirectTo as string) ?? '/' })
  loading.value = false
}
async function handleSignUp(values: z.infer<typeof signUpValidationSchema.value>) {
  loading.value = true
  await signUp({ email: values.email, username: values.name, password: values.password, redirectTo: (route.query.redirectTo as string) ?? '/' })
  loading.value = false
}

const handleSubmit = computed(() => (action.value === 'signIn' ? handleSignIn : handleSignUp))
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

    &__sign-in,
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
