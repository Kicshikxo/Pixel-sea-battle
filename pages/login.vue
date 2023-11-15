<template>
  <div class="login-page">
    <pixel-form class="login-page__form" :validation-schema="schema" @submit="handleSubmit">
      <div class="login-page__title">Войдите в аккаунт</div>
      <pixel-form-text-input name="email" label="Электронная почта" placeholder="Введите электронную почту" />
      <pixel-form-text-input name="password" type="password" label="Пароль" placeholder="Введите пароль" />

      <pixel-button type="submit" label="Войти" full-width />

      <pixel-divider text="или через Google" width="32" />

      <pixel-border class="login-page__google-signin">
        <GoogleSignInButton @success="handleGoogleSignin" :theme="$colorMode.value === 'dark' ? 'filled_black' : 'outline'" style="color-scheme: auto" />
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

const { signIn, googleSignin } = useAuth()

async function handleGoogleSignin(response: CredentialResponse) {
  await googleSignin({ accessToken: response.credential!, redirectTo: '/' })
}
async function handleSubmit(values: z.infer<typeof schema>) {
  await signIn({ email: values.email, password: values.password, redirectTo: '/' })
}
</script>

<style lang="scss" scoped>
.login-page {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  flex: 1;

  &__title {
    font-size: 20px;
    margin: 16px;
  }

  &__form {
    width: 400px !important;
  }

  &__google-signin {
    display: flex;
    justify-content: center;
    align-items: flex-start;
    height: 48px;
  }
}
</style>
