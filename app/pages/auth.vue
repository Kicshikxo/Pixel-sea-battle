<template>
  <div class="sign-in-page">
    <PixelContainer>
      <PixelForm
        class="sign-in-page__form"
        :validation-schema="validationSchema"
        @submit="handleSubmit"
      >
        <TransitionSwipeY>
          <div class="sign-in-page__form-title" :key="action">
            {{ action === 'signIn' ? $t('page.auth.signInTitle') : $t('page.auth.signUpTitle') }}
          </div>
        </TransitionSwipeY>

        <TransitionExpandY>
          <div class="sign-in-page__form-content" :key="action">
            <template v-if="action === 'signIn'">
              <PixelFormTextInput
                name="email"
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
            <template v-if="action === 'signUp'">
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
        </TransitionExpandY>

        <TransitionSwipeY>
          <div class="sign-in-page__options" :key="action">
            <span
              v-if="action === 'signIn'"
              class="sign-in-page__options__forgot-password"
              @click="handlePasswordRecovery"
            >
              {{ $t('page.auth.forgotPassword') }}
            </span>
            <span
              v-if="action === 'signIn'"
              class="sign-in-page__options__sign-in"
              @click="action = 'signUp'"
            >
              {{ $t('page.auth.noAccount') }}
            </span>
            <span
              v-if="action === 'signUp'"
              class="sign-in-page__options__sign-up"
              @click="action = 'signIn'"
            >
              {{ $t('page.auth.alreadyHaveAccount') }}
            </span>
          </div>
        </TransitionSwipeY>

        <PixelButton
          type="submit"
          :label="action === 'signIn' ? $t('page.auth.signIn') : $t('page.auth.signUp')"
          :loading="loading"
          :disabled="googleLoading"
          full-width
        >
          <template #append-icon>
            <icon name="pixelarticons:login" />
          </template>
        </PixelButton>

        <PixelDivider :text="$t('page.auth.googleSignIn')" width="32" />

        <PixelBorder class="sign-in-page__google-signin" full-width>
          <GoogleSignInButton
            class="sign-in-page__google-signin-button"
            @success="handleGoogleSignIn"
            :locale="locale"
            :theme="$colorMode.value === 'dark' ? 'filled_black' : 'outline'"
            :width="400"
            text="continue_with"
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
import TransitionExpandY from '~/components/transitions/TransitionExpandY.vue'
import TransitionSwipeY from '~/components/transitions/TransitionSwipeY.vue'

import type { CredentialResponse } from 'vue3-google-signin'
import { z } from 'zod'

definePageMeta({
  auth: false,
})

const toast = useToast()
const route = useRoute('auth')
const router = useRouter()
const { t, locale } = useI18n()
const { signIn, signUp, googleSignIn } = useAuth()

const action = ref<'signIn' | 'signUp'>(
  route.query.signIn !== undefined
    ? 'signIn'
    : route.query.signUp !== undefined
      ? 'signUp'
      : 'signIn',
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

const validationSchema = computed(() =>
  action.value === 'signIn' ? signInValidationSchema.value : signUpValidationSchema.value,
)

async function handleGoogleSignIn(response: CredentialResponse) {
  googleLoading.value = true
  const { error } = await googleSignIn({
    accessToken: response.credential!,
    redirectTo: (route.query.redirectTo as string) ?? '/',
  })
  if (error) toast.error(t(error))
  googleLoading.value = false
}
async function handleSignIn(values: z.infer<typeof signInValidationSchema.value>) {
  loading.value = true
  const { error } = await signIn({
    email: values.email,
    password: values.password,
    redirectTo: (route.query.redirectTo as string) ?? '/',
  })
  if (error) toast.error(t(error))
  loading.value = false
}
async function handleSignUp(values: z.infer<typeof signUpValidationSchema.value>) {
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

async function handleSubmit(values: Record<string, any>) {
  if (action.value === 'signIn') {
    await handleSignIn(values as z.infer<typeof signInValidationSchema.value>)
  } else {
    await handleSignUp(values as z.infer<typeof signUpValidationSchema.value>)
  }
}

function handlePasswordRecovery() {
  router.push({ name: 'password-recovery' })
}
</script>

<style lang="scss" scoped>
.sign-in-page {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  &__form {
    width: 400px;

    &-title {
      font-size: 20px;
      margin-bottom: 16px;
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
