<template>
  <div class="profile-page">
    <TransitionFade>
      <PixelContainer v-if="userData" full-width>
        <div class="profile-page__profile">
          <PixelAvatar v-if="userData?.id" :seed="userData?.id" large />
          <div class="profile-page__profile-info">
            <span>{{ $t('page.profile.username') }}: {{ userData?.username }}</span>
            <span>
              {{ $t('page.profile.registerDate') }}:
              {{ new Date(userData?.createdAt).toLocaleDateString() }}
            </span>
          </div>
          <div class="profile-page__profile-actions">
            <PixelButton
              :label="$t('page.profile.signOut')"
              :loading="signOutLoading"
              @click="handleSignout"
            >
              <template #append-icon>
                <icon name="pixelarticons:logout" />
              </template>
            </PixelButton>
          </div>
        </div>
      </PixelContainer>
    </TransitionFade>
  </div>
</template>

<script setup lang="ts">
import PixelAvatar from '~/components/pixel/PixelAvatar.vue'
import PixelButton from '~/components/pixel/PixelButton.vue'
import PixelContainer from '~/components/pixel/PixelContainer.vue'
import TransitionFade from '~/components/transitions/TransitionFade.vue'

const trpc = useTRPC()
const toast = useToast()
const { session, signOut } = useAuth()

const { data: userData } = await trpc.auth.info.useQuery()

const signOutLoading = ref(false)

async function handleSignout() {
  signOutLoading.value = true
  const { error } = await signOut({ redirectTo: '/auth' })
  if (error) toast.error(error)
  signOutLoading.value = false
}
</script>

<style lang="scss" scoped>
.profile-page {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  padding: 16px;
  max-width: 1200px;

  &__profile {
    display: flex;
    gap: 16px;

    &-info {
      flex: 1;
      display: flex;
      flex-direction: column;
      gap: 8px;
      padding: 8px 0;
    }

    &-actions {
      display: flex;
      flex-direction: column;
      gap: 8px;
      padding: 8px;
    }
  }
}
</style>
