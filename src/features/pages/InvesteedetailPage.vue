<script setup lang="ts">
/**
 * 出資先詳細ページ
 * ①出資先情報 / ②出資先基本情報 / ③財務情報 の3コンポーネントを縦に並べる。
 */
import Button from '@/components/ui/button/Button.vue'
import { useInvesteePrintStore } from '@/stores/investeePrintStore.ts'
import { ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import InvesteeBasicInfoSection from '../components/InvesteeBasicInfoSection.vue'
import InvesteeFinancialSection from '../components/InvesteeFinancialSection.vue'
import InvesteeInfoSection from '../components/InvesteeInfoSection.vue'
import { investeeBasicInfoData } from '../constants/investeeBasicInfoData.ts'
import { investeeCompanyData } from '../constants/investeeCompanyData.ts'
import { investeeFinancialData } from '../constants/investeeFinancialData.ts'
import { Printer } from '@lucide/vue'
import InvesteeFileManagerSection from '../components/InvesteeFileManagerSection.vue'
import Tabs from '@/components/ui/tabs/Tabs.vue'
import TabsList from '@/components/ui/tabs/TabsList.vue'
import TabsTrigger from '@/components/ui/tabs/TabsTrigger.vue'
import TabsContent from '@/components/ui/tabs/TabsContent.vue'
import Card from '@/components/ui/card/Card.vue'
import CardContent from '@/components/ui/card/CardContent.vue'
import Calendar from '@/components/ui/calendar/Calendar.vue'

// API未接続のため constants のダミーデータをそのまま利用する
const company = ref(investeeCompanyData)
const basicInfo = ref(investeeBasicInfoData)
const financialData = ref(investeeFinancialData)

function openPrintPreview() {
  const printData = {
    company: company.value,
    basicInfo: basicInfo.value,
    financialData: financialData.value,
  }
  sessionStorage.setItem('printData', JSON.stringify(printData))
  window.open('/print', '_blank')
}

const activeTab = ref<string | number>('page1')
</script>

<template>
  <div class="max-w-6xl space-y-3 p-2">
    <Tabs default-value="page1" @update:modelValue="activeTab = $event">
      <div class="flex">
        <TabsList>
          <TabsTrigger value="page1">Page1</TabsTrigger>
          <TabsTrigger value="page2">Page2</TabsTrigger>
          <TabsTrigger value="page3">Page3</TabsTrigger>
        </TabsList>
        <div class="flex-1"></div>
        <div v-if="activeTab === 'page1'" class="flex justify-center gap-2">
          <Label class="bg-destructive">ここにDataPicker</Label>
        </div>
        <div class="flex-1"></div>
        <div v-if="activeTab === 'page1'" class="flex justify-end gap-2">
          <Button variant="outline" @click="openPrintPreview">
            <Printer />印刷プレビューを開く
          </Button>
        </div>
      </div>
      <TabsContent
        value="page1"
        class="animate-in fade-in slide-in-from-right-2 duration-300 space-y-4"
      >
        <InvesteeInfoSection :company="company" />
        <InvesteeBasicInfoSection v-model="basicInfo" />
        <InvesteeFinancialSection v-model="financialData" />
      </TabsContent>
      <TabsContent
        value="page2"
        class="animate-in fade-in slide-in-from-right-2 duration-300"
      >
        <InvesteeFileManagerSection />
      </TabsContent>
      <TabsContent
        value="page3"
        class="animate-in fade-in slide-in-from-right-2 duration-300"
      >
        <Card>
          <CardContent>コンテンツがありません</CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  </div>
</template>
