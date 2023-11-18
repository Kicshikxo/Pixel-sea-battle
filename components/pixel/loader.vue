<template>
  <icon name="pixelarticons:loader" class="px-loader" />
</template>

<script setup lang="ts"></script>

<style lang="scss" scoped>
.px-loader {
  animation: px-loader-spin 4s cubic-bezier(0.175, 0.885, 0.32, 1.275) infinite;
}

@keyframes px-loader-spin {
  0% {
    transform: rotate(0deg);
  }
  12.5% {
    transform: rotate(45deg);
  }
  25.0% {
    transform: rotate(90deg);
  }
  37.5% {
    transform: rotate(135deg);
  }
  50% {
    transform: rotate(180deg);
  }
  62.5% {
    transform: rotate(225deg);
  }
  75.0% {
    transform: rotate(270deg);
  }
  87.5% {
    transform: rotate(315deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>
