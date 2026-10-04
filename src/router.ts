import { createRouter, createWebHistory } from 'vue-router'

import AboutView from './AboutView.vue'
import HomeView from './HomeView.vue'
import InvesteedetailPage from './features/pages/InvesteedetailPage.vue'
import InvesteedetaiPrintlPage from './features/pages/InvesteedetaiPrintlPage.vue'
import BatchExecutionPage from './features/pages/BatchExecutionPage.vue'
import InvestmentCsvExportPage from './features/pages/InvestmentCsvExportPage.vue'

const routes = [
  { path: '/', component: HomeView },
  { path: '/about', component: AboutView },
  { path: '/example', component: InvesteedetailPage },
  { path: '/export', component: InvestmentCsvExportPage },

  {
    path: '/print',
    component: InvesteedetaiPrintlPage,
    meta: { showSidebar: false },
  },
  { path: '/batch', component: BatchExecutionPage },
]

export const router = createRouter({
  history: createWebHistory(),
  routes,
})
