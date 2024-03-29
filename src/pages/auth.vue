<template>
  <div class="sign-in-page">
    <pixel-container>
      <pixel-form class="sign-in-page__form" :validation-schema="validationSchema" @submit="handleSubmit">
        <pixel-transition-swipe-y>
          <div class="sign-in-page__form-title" :key="action">{{ action === 'signIn' ? $t('authPage.signInTitle') : $t('authPage.signUpTitle') }}</div>
        </pixel-transition-swipe-y>

        <pixel-transition-expand-y>
          <div class="sign-in-page__form-content" :key="action">
            <template v-if="action === 'signIn'">
              <pixel-form-text-input name="email" autocomplete="username" :label="$t('authPage.emailLabel')" :placeholder="$t('authPage.emailPlaceholder')">
                <template #prepend-icon>
                  <icon name="pixelarticons:mail" />
                </template>
              </pixel-form-text-input>
              <pixel-form-text-input name="password" autocomplete="current-password" type="password" :label="$t('authPage.passwordLabel')" :placeholder="$t('authPage.passwordPlaceholder')">
                <template #prepend-icon>
                  <icon name="pixelarticons:lock" />
                </template>
              </pixel-form-text-input>
            </template>
            <template v-if="action === 'signUp'">
              <pixel-form-text-input name="name" :label="$t('authPage.usernameLabel')" :placeholder="$t('authPage.usernamePlaceholder')">
                <template #prepend-icon>
                  <icon name="pixelarticons:user" />
                </template>
              </pixel-form-text-input>
              <pixel-form-text-input name="email" autocomplete="username" :label="$t('authPage.emailLabel')" :placeholder="$t('authPage.emailPlaceholder')">
                <template #prepend-icon>
                  <icon name="pixelarticons:mail" />
                </template>
              </pixel-form-text-input>
              <pixel-form-text-input name="password" type="password" autocomplete="new-password" :label="$t('authPage.passwordLabel')" :placeholder="$t('authPage.passwordPlaceholder')">
                <template #prepend-icon>
                  <icon name="pixelarticons:lock" />
                </template>
              </pixel-form-text-input>
            </template>
          </div>
        </pixel-transition-expand-y>

        <pixel-transition-swipe-y>
          <div class="sign-in-page__options" :key="action">
            <span v-if="action === 'signIn'" class="sign-in-page__options__forgot-password">{{ $t('authPage.forgotPassword') }}</span>
            <span v-if="action === 'signIn'" class="sign-in-page__options__sign-in" @click="action = 'signUp'">{{ $t('authPage.noAccount') }}</span>
            <span v-if="action === 'signUp'" class="sign-in-page__options__sign-up" @click="action = 'signIn'">{{ $t('authPage.alreadyHaveAccount') }}</span>
          </div>
        </pixel-transition-swipe-y>

        <pixel-button type="submit" :label="action === 'signIn' ? $t('authPage.signIn') : $t('authPage.signUp')" :loading="loading" :disabled="googleLoading" full-width>
          <template #append-icon>
            <icon name="pixelarticons:login" />
          </template>
        </pixel-button>

        <pixel-divider :text="$t('authPage.googleSignIn')" width="32" />

        <pixel-border class="sign-in-page__google-signin" full-width>
          <GoogleSignInButton class="sign-in-page__google-signin-button" @success="handleGoogleSignIn" :locale="locale" :theme="$colorMode.value === 'dark' ? 'filled_black' : 'outline'" :width="400" text="continue_with" />
        </pixel-border>
      </pixel-form>
    </pixel-container>
  </div>
</template>

<script setup lang="ts">
import { type CredentialResponse } from 'vue3-google-signin'
import { z } from 'zod'

definePageMeta({
  auth: false,
})

const toast = useToast()
const route = useRoute()
const router = useRouter()
const { t, locale } = useI18n()
const { signIn, signUp, googleSignIn } = useAuth()

const action = ref<'signIn' | 'signUp'>(route.query.signIn !== undefined ? 'signIn' : route.query.signUp !== undefined ? 'signUp' : 'signIn')

const loading = ref(false)
const googleLoading = ref(false)

watch(
  action,
  (value) => {
    router.push({ query: { [value]: null, redirectTo: route.query.redirectTo } })
  },
  { immediate: true },
)

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
  const { error } = await googleSignIn({ accessToken: response.credential!, redirectTo: (route.query.redirectTo as string) ?? '/' })
  if (error) toast.error(t(error))
  googleLoading.value = false
}
async function handleSignIn(values: z.infer<typeof signInValidationSchema.value>) {
  loading.value = true
  const { error } = await signIn({ email: values.email, password: values.password, redirectTo: (route.query.redirectTo as string) ?? '/' })
  if (error) toast.error(t(error))
  loading.value = false
}
async function handleSignUp(values: z.infer<typeof signUpValidationSchema.value>) {
  loading.value = true
  const { error } = await signUp({ email: values.email, username: values.name, password: values.password, redirectTo: (route.query.redirectTo as string) ?? '/' })
  if (error) toast.error(t(error))
  loading.value = false
}

const handleSubmit = computed(() => (action.value === 'signIn' ? handleSignIn : handleSignUp))
</script>

<style lang="scss" scoped>
.sign-in-page {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  &__form {
    width: 400px !important;

    &-title {
      font-size: 20px;
      margin: 16px;
    }

    &-content {
      width: 100%;
    }
  }

  &__options {
    display: flex;
    align-items: center;
    margin-bottom: 24px;
    width: 100%;

    &__forgot-password,
    &__sign-in,
    &__sign-up {
      cursor: pointer;
      color: var(--px-color-blue);
      --px-color-text-shadow: var(--px-color-shadow-blue);

      @media (hover: hover) {
        &:hover {
          color: var(--px-color-blue-hover);
        }
      }
      &:active {
        color: var(--px-color-blue-active);
      }
    }
    &__forgot-password {
      margin-right: auto;
    }
    &__sign-in,
    &__sign-up {
      margin-left: auto;
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
      background: var(--px-color-white-on-light-black-on-dark);
      color-scheme: auto;
    }
  }
}
</style>
