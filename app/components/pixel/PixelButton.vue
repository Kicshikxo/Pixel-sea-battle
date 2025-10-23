<template>
  <component v-if="link" :is="to ? NuxtLink : 'span'" :to="to" :class="['px-button--link']">
    <slot>
      {{ label }}
    </slot>
  </component>
  <PixelBorder v-else :rainbow="rainbow" :full-width="fullWidth">
    <component
      :is="to ? NuxtLink : 'button'"
      :to="to"
      :class="[
        'px-button',
        `px-button--${color}`,
        {
          'px-button--loading': loading,
          'px-button--disabled': disabled,
          'px-button--icon-only': iconOnly,
          'px-button--full-width': fullWidth,
          'px-button--small': small,
          'px-button--large': large,
        },
      ]"
      :name="name"
      :type="type"
      :disabled="loading || disabled"
    >
      <div>
        <TransitionSwipeY speed="fast">
          <div class="px-button__content-wrapper" :key="loading.toString()">
            <PixelLoader v-if="loading" class="px-button__icon px-button__content-loader" />

            <div :class="['px-button__content', { 'px-button__content--loading': loading }]">
              <template v-if="iconOnly">
                <span class="px-button__icon">
                  <slot name="icon" />
                </span>
              </template>
              <template v-else>
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
              </template>
            </div>
          </div>
        </TransitionSwipeY>
      </div>
    </component>
  </PixelBorder>
</template>

<script setup lang="ts">
import { NuxtLink } from '#components'

import PixelBorder from '~/components/pixel/PixelBorder.vue'
import PixelLoader from '~/components/pixel/PixelLoader.vue'
import TransitionSwipeY from '~/components/transitions/TransitionSwipeY.vue'

const props = withDefaults(
  defineProps<{
    name?: string
    link?: boolean
    to?: string
    type?: 'button' | 'submit'
    color?: 'dark' | 'light' | 'red' | 'yellow' | 'green' | 'blue'
    label?: string
    small?: boolean
    large?: boolean
    rainbow?: boolean
    loading?: boolean
    disabled?: boolean
    iconOnly?: boolean
    fullWidth?: boolean
  }>(),
  {
    name: undefined,
    link: false,
    to: undefined,
    type: 'button',
    color: 'blue',
    small: false,
    large: false,
    rainbow: false,
    loading: false,
    disabled: false,
    iconOnly: false,
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

    &-wrapper {
      display: flex;
      justify-content: center;
      align-items: center;
      position: relative;
    }

    &-loader {
      position: absolute;
    }

    &--loading {
      opacity: 0;
    }
  }

  &--loading {
    filter: contrast(75%);
  }

  &--disabled {
    filter: contrast(50%);
  }

  &--icon-only {
    padding: 0;
    aspect-ratio: 1 / 1;
  }

  &--full-width {
    width: 100%;
  }

  &--small {
    font-size: 12px;
    height: 32px;
  }

  &--large {
    font-size: 20px;
    height: 48px;
  }

  &--link {
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

  &--dark {
    background: var(--px-color-dark);
    color: var(--px-color-white-on-dark-black-on-light);

    &:not(:disabled) {
      @media (hover: hover) {
        &:hover {
          background: var(--px-color-dark-hover);
        }
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
      @media (hover: hover) {
        &:hover {
          background: var(--px-color-light-hover);
        }
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
      @media (hover: hover) {
        &:hover {
          background: var(--px-color-red-hover);
        }
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
      @media (hover: hover) {
        &:hover {
          background: var(--px-color-yellow-hover);
        }
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
      @media (hover: hover) {
        &:hover {
          background: var(--px-color-green-hover);
        }
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
      @media (hover: hover) {
        &:hover {
          background: var(--px-color-blue-hover);
        }
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
      @media (hover: hover) {
        &:hover {
          background: var(--px-color-yellow-hover);
        }
      }

      &:active {
        background: var(--px-color-yellow-active);
      }
    }
  }
}
</style>
