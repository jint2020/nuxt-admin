<script setup lang="ts">
const router = useRouter()
</script>

<template>
  <UDashboardPanel id="403" :ui="{ right: 'gap-3' }">
    <template #body>
      <div class="flex flex-col items-center justify-center h-full py-20">
        <div class="text-center">
          <UIcon
            name="i-lucide-shield-x"
            class="size-16 mx-auto text-(--ui-text-muted) mb-6"
          />
          <h1 class="text-4xl font-bold mb-2">
            403
          </h1>
          <p class="text-lg text-(--ui-text-muted) mb-6">
            抱歉，您没有权限访问此页面
          </p>
          <div class="flex items-center justify-center gap-3">
            <UButton
              color="neutral"
              variant="outline"
              icon="i-lucide-arrow-left"
              @click="router.back()"
            >
              返回上一页
            </UButton>
            <UButton
              icon="i-lucide-house"
              @click="router.push('/')"
            >
              回到首页
            </UButton>
          </div>
        </div>
      </div>
    </template>
  </UDashboardPanel>
</template>
