import { defineStore } from 'pinia'
import { ref } from 'vue'
import type {
  InvesteeCompanyInfo,
  InvesteeBasicInfoData,
  InvesteeFinancialData,
} from '@/features/types/Investee'

export const useInvesteePrintStore = defineStore('investeePrint', () => {
  const printData = ref<{
    company: InvesteeCompanyInfo | null
    basicInfo: InvesteeBasicInfoData | null
    financialData: InvesteeFinancialData | null
  }>({
    company: null,
    basicInfo: null,
    financialData: null,
  })

  function setPrintData(
    company: InvesteeCompanyInfo,
    basicInfo: InvesteeBasicInfoData,
    financialData: InvesteeFinancialData
  ) {
    printData.value = { company, basicInfo, financialData }
  }

  function clearPrintData() {
    printData.value = { company: null, basicInfo: null, financialData: null }
  }

  return {
    printData,
    setPrintData,
    clearPrintData,
  }
})
