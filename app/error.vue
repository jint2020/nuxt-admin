<script setup lang="ts">
import type { NuxtError } from '#app'

defineProps<{
  error: NuxtError
}>()

useSeoMeta({
  title: 'Page not found',
  description: '页面走丢了'
})

useHead({
  htmlAttrs: {
    lang: 'zh-CN'
  }
})
</script>

<template>
  <UApp>
    <UError :error="error" />
  </UApp>
</template>
