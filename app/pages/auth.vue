<template>
  <div class="auth-page">
    <PixelContainer>
      <PixelForm
        ref="form"
        class="auth-page__form"
        :validation-schema="validationSchema"
        :title="action === 'sign-in' ? $t('page.auth.signInTitle') : $t('page.auth.signUpTitle')"
        animated-title
        @submit="handleSubmit"
      >
        <TransitionExpand>
          <div class="auth-page__form-content" :key="action">
            <template v-if="action === 'sign-in'">
              <PixelFormTextInput
                name="email"
                type="email"
                autocomplete="username"
                :label="$t('page.auth.emailLabel')"
                :placeholder="$t('page.auth.emailPlaceholder')"
              >
                <template #prepend-icon>
                  <icon name="pixelarticons:mail" />
                </template>
              </PixelFormTextInput>
              <PixelFormTextInput
                name="password"
                autocomplete="current-password"
                type="password"
                :label="$t('page.auth.passwordLabel')"
                :placeholder="$t('page.auth.passwordPlaceholder')"
              >
                <template #prepend-icon>
                  <icon name="pixelarticons:lock" />
                </template>
              </PixelFormTextInput>
            </template>
            <template v-if="action === 'sign-up'">
              <PixelFormTextInput
                name="name"
                :label="$t('page.auth.usernameLabel')"
                :placeholder="$t('page.auth.usernamePlaceholder')"
              >
                <template #prepend-icon>
                  <icon name="pixelarticons:user" />
                </template>
              </PixelFormTextInput>
              <PixelFormTextInput
                name="email"
                type="email"
                autocomplete="username"
                :label="$t('page.auth.emailLabel')"
                :placeholder="$t('page.auth.emailPlaceholder')"
              >
                <template #prepend-icon>
                  <icon name="pixelarticons:mail" />
                </template>
              </PixelFormTextInput>
              <PixelFormTextInput
                name="password"
                type="password"
                autocomplete="new-password"
                :label="$t('page.auth.passwordLabel')"
                :placeholder="$t('page.auth.passwordPlaceholder')"
              >
                <template #prepend-icon>
                  <icon name="pixelarticons:lock" />
                </template>
              </PixelFormTextInput>
            </template>
          </div>
        </TransitionExpand>

        <TransitionSwipe>
          <div class="auth-page__options" :key="action">
            <span
              v-if="action === 'sign-in'"
              class="auth-page__options__forgot-password"
              @click="handlePasswordRecovery"
            >
              {{ $t('page.auth.forgotPassword') }}
            </span>
            <span
              v-if="action === 'sign-up'"
              class="auth-page__options__guest-sign-in"
              @click="handleGuestSignIn"
            >
              {{ $t('page.auth.guestSignIn') }}
            </span>
            <span
              v-if="action === 'sign-in'"
              class="auth-page__options__sign-up"
              @click="action = 'sign-up'"
            >
              {{ $t('page.auth.noAccount') }}
            </span>
            <span
              v-if="action === 'sign-up'"
              class="auth-page__options__sign-in"
              @click="action = 'sign-in'"
            >
              {{ $t('page.auth.haveAnAccount') }}
            </span>
          </div>
        </TransitionSwipe>

        <PixelButton
          type="submit"
          :label="action === 'sign-in' ? $t('page.auth.signIn') : $t('page.auth.signUp')"
          :loading="loading"
          :disabled="googleLoading"
          full-width
        >
          <template #append-icon>
            <icon name="pixelarticons:login" />
          </template>
        </PixelButton>

        <PixelDivider :text="$t('page.auth.googleSignIn')" width="32" />

        <PixelBorder class="auth-page__google-signin">
          <GoogleSignInButton
            class="auth-page__google-signin-button--desktop"
            text="continue_with"
            :width="400"
            :locale="locale"
            :theme="$colorMode.value === 'dark' ? 'filled_black' : 'outline'"
            @success="handleGoogleSignIn"
          />
          <GoogleSignInButton
            class="auth-page__google-signin-button--mobile"
            text="continue_with"
            :width="300"
            :locale="locale"
            :theme="$colorMode.value === 'dark' ? 'filled_black' : 'outline'"
            @success="handleGoogleSignIn"
          />
        </PixelBorder>
      </PixelForm>
    </PixelContainer>
  </div>
</template>

<script setup lang="ts">
import PixelForm from '~/components/pixel/form/PixelForm.vue'
import PixelFormTextInput from '~/components/pixel/form/PixelFormTextInput.vue'
import PixelBorder from '~/components/pixel/PixelBorder.vue'
import PixelButton from '~/components/pixel/PixelButton.vue'
import PixelContainer from '~/components/pixel/PixelContainer.vue'
import PixelDivider from '~/components/pixel/PixelDivider.vue'
import TransitionExpand from '~/components/transitions/TransitionExpand.vue'
import TransitionSwipe from '~/components/transitions/TransitionSwipe.vue'

import type { CredentialResponse } from 'vue3-google-signin'
import { z } from 'zod'

definePageMeta({
  auth: false,
})

const toast = useToast()
const route = useRoute('auth')
const router = useRouter()
const { t, locale } = useI18n()
const { signIn, signUp, googleSignIn, guestSignIn } = useAuth()

const action = ref<'sign-in' | 'sign-up'>(
  route.query.signIn !== undefined
    ? 'sign-in'
    : route.query.signUp !== undefined
      ? 'sign-up'
      : 'sign-in',
)

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
    email: z
      .string()
      .min(1, t('validation.required'))
      .email(t('validation.invalidEmail'))
      .default(''),
    password: z
      .string()
      .min(1, t('validation.required'))
      .max(100, { message: t('validation.tooManyCharacters') })
      .default(''),
  }),
)
type SignInFormValues = z.infer<typeof signInValidationSchema.value>

const signUpValidationSchema = computed(() =>
  z.object({
    email: z
      .string()
      .min(1, t('validation.required'))
      .email(t('validation.invalidEmail'))
      .default(''),
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
type SignUpFormValues = z.infer<typeof signUpValidationSchema.value>

const validationSchema = computed(() =>
  action.value === 'sign-in' ? signInValidationSchema.value : signUpValidationSchema.value,
)

async function handleGoogleSignIn(response: CredentialResponse) {
  googleLoading.value = true
  const { error } = await googleSignIn({
    idToken: response.credential!,
    redirectTo: (route.query.redirectTo as string) ?? '/',
  })
  if (error) toast.error(t(error))
  googleLoading.value = false
}
async function handleGuestSignIn() {
  loading.value = true
  const { error } = await guestSignIn({
    redirectTo: (route.query.redirectTo as string) ?? '/',
  })
  if (error) toast.error(t(error))
  loading.value = false
}
async function handleSignIn(values: SignInFormValues) {
  loading.value = true
  const { error } = await signIn({
    email: values.email,
    password: values.password,
    redirectTo: (route.query.redirectTo as string) ?? '/',
  })
  if (error) toast.error(t(error))
  loading.value = false
}
async function handleSignUp(values: SignUpFormValues) {
  loading.value = true
  const { error } = await signUp({
    email: values.email,
    username: values.name,
    password: values.password,
    redirectTo: (route.query.redirectTo as string) ?? '/',
  })
  if (error) toast.error(t(error))
  loading.value = false
}
function handlePasswordRecovery() {
  router.push({ name: 'password-recovery' })
}

async function handleSubmit(values: Record<string, any>) {
  if (action.value === 'sign-in') {
    await handleSignIn(values as SignInFormValues)
  } else {
    await handleSignUp(values as SignUpFormValues)
  }
}
</script>

<style lang="scss" scoped>
.auth-page {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  &__form {
    width: 400px;

    @include on-breakpoint(sm) {
      width: auto;
      max-width: 100%;
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
    &__guest-sign-in,
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
    &__forgot-password,
    &__guest-sign-in {
      margin-right: auto;
    }
    &__sign-in,
    &__sign-up {
      margin-left: auto;
      text-align: right;
    }
  }

  &__google-signin {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 64px !important;
    margin: 0 auto;

    &-button--desktop {
      width: 400px;
    }
    &-button--mobile {
      width: 300px;
    }

    &-button--desktop,
    &-button--mobile {
      height: 40px;
      background-color: var(--px-color-white-on-light-black-on-dark);
      color-scheme: auto;
    }

    &-button--desktop {
      @include on-breakpoint(sm) {
        display: none !important;
      }
    }
    &-button--mobile {
      display: none !important;
      @include on-breakpoint(sm) {
        display: inline-flex !important;
      }
    }
  }
}
</style>
