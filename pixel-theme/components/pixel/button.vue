<template>
  <pixel-border :full-width="fullWidth">
    <button
      :class="['px-button', 'px-text', `px-button--${color}`, { 'px-button--loading': loading, 'px-button--disabled': disabled, 'px-button--full-width': fullWidth, 'px-button--small': small, 'px-button--large': large }]"
      :name="name"
      :type="type"
      :disabled="loading || disabled"
    >
      <transition name="px-button__loading-swipe" mode="out-in">
        <span v-if="loading" class="px-button__content">
          <pixel-loader class="px-button__icon" />
        </span>
        <span v-else class="px-button__content">
          <span class="px-button__icon">
            <slot name="prepend-icon" />
          </span>
          <span>
            <slot>
              {{ label }}
            </slot>
          </span>
          <span class="px-button__icon">
            <slot name="append-icon" />
          </span>
        </span>
      </transition>
    </button>
  </pixel-border>
</template>

<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    name?: string
    type?: 'button' | 'submit'
    color?: 'dark' | 'light' | 'red' | 'yellow' | 'green' | 'blue'
    label?: string
    small?: boolean
    large?: boolean
    loading?: boolean
    disabled?: boolean
    fullWidth?: boolean
  }>(),
  {
    name: undefined,
    type: 'button',
    color: 'blue',
    small: false,
    large: false,
    loading: false,
    disabled: false,
    fullWidth: false,
  },
)
</script>

<style lang="scss" scoped>
.px-button {
  height: 40px;
  padding: 0.25rem 0.75rem;
  font-size: 16px;
  background: #3b3b3b;
  text-transform: uppercase;
  transition: filter 0.125s;

  &__content {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 4px;
    transition: transform 0.125s cubic-bezier(0.175, 0.885, 0.32, 1.275), opacity 0.125s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  }

  &__loading-swipe-enter-from {
    opacity: 0;
    transform: translateY(100%);
  }
  &__loading-swipe-leave-to {
    opacity: 0;
    transform: translateY(-100%);
  }

  &--loading {
    filter: contrast(75%);
  }

  &--disabled {
    filter: contrast(50%);
  }

  &--full-width {
    width: 100%;
  }

  &--small {
    font-size: 12px;
  }

  &--large {
    font-size: 20px;
  }

  &--dark {
    background: var(--px-color-dark);
    color: var(--px-color-white);
    &:not(:disabled) {
      &:hover {
        background: var(--px-color-dark-hover);
      }
      &:active {
        background: var(--px-color-dark-active);
      }
    }
  }

  &--light {
    background: var(--px-color-light);
    color: var(--px-color-dark);
    :not(:disabled) {
      &:hover {
        background: var(--px-color-light-hover);
      }
      &:active {
        background: var(--px-color-light-active);
      }
    }
  }

  &--red {
    background: var(--px-color-red);
    color: var(--px-color-white);
    &:not(:disabled) {
      &:hover {
        background: var(--px-color-red-hover);
      }
      &:active {
        background: var(--px-color-red-active);
      }
    }
  }

  &--yellow {
    background: var(--px-color-yellow);
    color: var(--px-color-white);
    &:not(:disabled) {
      &:hover {
        background: var(--px-color-yellow-hover);
      }
      &:active {
        background: var(--px-color-yellow-active);
      }
    }
  }

  &--green {
    background: var(--px-color-green);
    color: var(--px-color-white);
    &:not(:disabled) {
      &:hover {
        background: var(--px-color-green-hover);
      }
      &:active {
        background: var(--px-color-green-active);
      }
    }
  }

  &--blue {
    background: var(--px-color-blue);
    color: var(--px-color-white);
    &:not(:disabled) {
      &:hover {
        background: var(--px-color-blue-hover);
      }
      &:active {
        background: var(--px-color-blue-active);
      }
    }
  }

  &--yellow {
    background: var(--px-color-yellow);
    color: var(--px-color-white);
    &:not(:disabled) {
      &:hover {
        background: var(--px-color-yellow-hover);
      }
      &:active {
        background: var(--px-color-yellow-active);
      }
    }
  }
}
</style>
