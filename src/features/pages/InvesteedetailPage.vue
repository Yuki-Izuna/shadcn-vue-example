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
</script>

<template>
  <div class="mx-auto max-w-6xl space-y-3 p-2">
    <!-- ← このボタンを追加 -->
    <div class="flex justify-end gap-2">
      <Button variant="outline" @click="openPrintPreview">
        <Printer />印刷プレビューを開く
      </Button>
    </div>
    <InvesteeInfoSection :company="company" />
    <InvesteeBasicInfoSection v-model="basicInfo" />
    <InvesteeFinancialSection v-model="financialData" />
  </div>
</template>
