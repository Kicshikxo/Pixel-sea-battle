<template>
  <pixel-border :full-width="fullWidth">
    <button :class="['px-button', 'px-text', `px-button--${color}`, { 'px-button--full-width': fullWidth, 'px-button--small': small, 'px-button--large': large }]" :name="name" :type="type" :disabled="disabled">
      <slot name="prepend-icon" />
      <slot />
      <span>{{ label }}</span>
      <slot name="append-icon" />
    </button>
  </pixel-border>
</template>

<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    name?: string
    type?: 'button' | 'submit'
    color?: 'dark' | 'light' | 'red' | 'green' | 'blue' | 'yellow'
    label?: string
    small?: boolean
    large?: boolean
    disabled?: boolean
    fullWidth?: boolean
  }>(),
  {
    name: undefined,
    type: 'button',
    color: 'blue',
    small: false,
    large: false,
    disabled: false,
    fullWidth: false,
  },
)
</script>

<style lang="scss" scoped>
.px-button {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 4px;
  padding: 0.25rem 0.75rem;
  font-size: 16px;
  background: #3b3b3b;
  text-transform: uppercase;

  &__border {
    display: flex;
    background: var(--px-border-color);
    padding: var(--px-border-width);
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
    &:hover {
      background: var(--px-color-dark-hover);
    }
    &:active {
      background: var(--px-color-dark-active);
    }
  }

  &--light {
    background: var(--px-color-light);
    color: var(--px-color-dark);
    &:hover {
      background: var(--px-color-light-hover);
    }
    &:active {
      background: var(--px-color-light-active);
    }
  }

  &--red {
    background: var(--px-color-red);
    color: var(--px-color-white);
    &:hover {
      background: var(--px-color-red-hover);
    }
    &:active {
      background: var(--px-color-red-active);
    }
  }

  &--green {
    background: var(--px-color-green);
    color: var(--px-color-white);
    &:hover {
      background: var(--px-color-green-hover);
    }
    &:active {
      background: var(--px-color-green-active);
    }
  }

  &--blue {
    background: var(--px-color-blue);
    color: var(--px-color-white);
    &:hover {
      background: var(--px-color-blue-hover);
    }
    &:active {
      background: var(--px-color-blue-active);
    }
  }

  &--yellow {
    background: var(--px-color-yellow);
    color: var(--px-color-white);
    &:hover {
      background: var(--px-color-yellow-hover);
    }
    &:active {
      background: var(--px-color-yellow-active);
    }
  }
}
</style>
