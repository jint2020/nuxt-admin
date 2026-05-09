<script setup lang="ts">
</script>

<template>
  <UDashboardPanel id="home">
    <template #header>
      <UDashboardNavbar title="主页" :ui="{ right: 'gap-3' }">
        <template #leading>
          <UDashboardSidebarCollapse />
        </template>

        <template #right>
          快速操作
        </template>
      </UDashboardNavbar>

      <UDashboardToolbar>
        <template #left>
          <!-- NOTE: The `-ms-1` class is used to align with the `DashboardSidebarCollapse` button here. -->
          工具栏
        </template>
      </UDashboardToolbar>
    </template>

    <template #body>
      内容
    </template>
  </UDashboardPanel>
</template>
