<script setup lang="ts">
import AppSidebar from '@/components/AppSidebar.vue'
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar'
import Separator from './components/ui/separator/Separator.vue'
import SidebarTrigger from './components/ui/sidebar/SidebarTrigger.vue'
import { useRoute } from 'vue-router'
import { computed } from 'vue'

const route = useRoute()
const isPrintRoute = computed(() => {
  return route.path.includes('/print')
})
</script>

<template>
  <!-- 通常ページ -->
  <template v-if="!isPrintRoute">
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header
          class="flex h-10 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12 bg-input"
        >
          <div class="flex items-center gap-2 px-4">
            <SidebarTrigger class="-ml-1" />
            <Separator
              orientation="vertical"
              class="mr-2 data-[orientation=vertical]:h-4"
            />
          </div>
        </header>
        <div class="flex flex-1 flex-col gap-4 p-4">
          <router-view />
        </div>
      </SidebarInset>
    </SidebarProvider>
  </template>

  <!-- 印刷ページ：サイドバーなし -->
  <template v-else>
    <div class="flex flex-1 flex-col gap-4 py-4 px-8">
      <router-view />
    </div>
  </template>
</template>

<!-- <template>
  <h1>Hello App!</h1>
  <p><strong>Current route path:</strong> {{ $route.fullPath }}</p>
  <nav>
    <RouterLink to="/">Go to Home</RouterLink>
    <RouterLink to="/about">Go to About</RouterLink>
  </nav>
  <main>
    <RouterView />
  </main>
</template> -->

<!-- <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem class="hidden md:block">
                <BreadcrumbLink href="#">
                  Building Your Application
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator class="hidden md:block" />
              <BreadcrumbItem>
                <BreadcrumbPage>Data Fetching</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb> -->
