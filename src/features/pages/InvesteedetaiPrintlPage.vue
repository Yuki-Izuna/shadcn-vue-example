<script setup lang="ts">
/**
 * 出資先詳細ページ（印刷用）
 * ①出資先情報 / ②出資先基本情報 / ③財務情報 を縦に並べて、
 * Excel帳票のような表形式で印刷に最適化した見た目で表示。
 * sessionStorage からデータを取得する。
 */
import { computed, onMounted, ref } from 'vue'
import type {
  InvesteeCompanyInfo,
  InvesteeBasicInfoData,
  InvesteeFinancialData,
} from '@/features/types/Investee'
import Button from '@/components/ui/button/Button.vue'
import { Printer, PrinterCheck } from '@lucide/vue'
import { Label } from 'reka-ui'

const company = ref<InvesteeCompanyInfo | null>(null)
const basicInfo = ref<InvesteeBasicInfoData | null>(null)
const financialData = ref<InvesteeFinancialData | null>(null)

// sessionStorage からデータを取得
onMounted(() => {
  const stored = sessionStorage.getItem('printData')
  if (stored) {
    try {
      const data = JSON.parse(stored)
      company.value = data.company
      basicInfo.value = data.basicInfo
      financialData.value = data.financialData
    } catch (err) {
      console.error('データ読み込みエラー:', err)
    }
  }
})

const formattedEstablishedDate = computed(() => {
  if (!company.value) return '-'
  const d = new Date(company.value.establishedDate)
  return Number.isNaN(d.getTime())
    ? company.value.establishedDate
    : d.toLocaleDateString('ja-JP')
})

// 出資先情報の表示項目
const companyInfoFields = computed(() => {
  if (!company.value) return []
  const fields = [
    { label: '会社名', value: company.value.companyName },
    { label: 'カナ', value: company.value.companyNameKana ?? '-' },
    { label: '上場区分', value: company.value.listingStatus },
    { label: '市場名', value: company.value.marketName ?? '-' },
    { label: '業種', value: company.value.industry },
    { label: '代表者', value: company.value.representativeName },
    { label: '設立年月日', value: formattedEstablishedDate.value },
    {
      label: '従業員数',
      value: company.value.employeeCount
        ? `${company.value.employeeCount}名`
        : '-',
    },
    { label: '決算月', value: `${company.value.fiscalYearEndMonth}月` },
    { label: '所在地', value: company.value.address },
    { label: '事業内容', value: company.value.businessDescription },
  ]
  // Webサイトは最後に1つだけ追加
  if (company.value.websiteUrl) {
    fields.push({ label: 'Webサイト', value: company.value.websiteUrl })
  }
  return fields
})

// ✅ 新規追加：2段組み用にペア化
const pairedCompanyFields = computed(() => {
  const pairs = []
  for (let i = 0; i < companyInfoFields.value.length; i += 2) {
    pairs.push([
      companyInfoFields.value[i],
      companyInfoFields.value[i + 1] || null,
    ])
  }
  return pairs
})

// 財務情報の年度一覧
const financialYears = computed(
  () => financialData.value?.rows[0]?.values.map((v) => v.year) ?? []
)

function formatFinancialValue(value: number | null) {
  if (value === null || Number.isNaN(value)) return '-'
  return value.toLocaleString('ja-JP')
}

function handlePrint() {
  window.print()
}
</script>

<template>
  <!-- 印刷ボタン（画面表示時のみ） -->
  <div class="text-right print:hidden">
    <Button variant="outline" @click="handlePrint">
      <PrinterCheck />
      印刷する
    </Button>
  </div>
  <!-- <div
    class="w-[210mm] mx-auto bg-white font-sans text-xs leading-relaxed text-black border border-gray-300 p-6 shadow-lg my-5 print:border-0 print:w-full print:p-[10mm] print:m-0 print:shadow-none"
  > -->
  <div
    class="w-[210mm] mx-auto bg-white font-sans text-xs leading-relaxed text-black px-6 print:border-0 print:w-full print:p-[10mm] print:m-0 print:shadow-none"
  >
    <!-- ①出資先情報 -->
    <section v-if="company" class="mb-4 print:break-inside-avoid">
      <div class="text-[14pt] font-bold mb-1 border-b border-gray-400 px-">
        出資先情報
      </div>
      <table class="w-full border-collapse text-[10pt]">
        <tbody>
          <tr
            v-for="pair in pairedCompanyFields"
            :key="pair[0].label"
            class="border-b border-gray-300"
          >
            <td
              class="w-[18%] bg-gray-50 border-r border-gray-300 px-2 py-1.5 font-bold..."
            >
              {{ pair[0].label }}
            </td>
            <td
              class="w-[32%] px-2 py-1.5 align-top break-words border-r border-gray-300"
            >
              {{ pair[0].value }}
            </td>
            <template v-if="pair[1]">
              <td
                class="w-[18%] bg-gray-50 border-r border-gray-300 px-2 py-1.5 font-bold..."
              >
                {{ pair[1].label }}
              </td>
              <td class="w-[32%] px-2 py-1.5 align-top break-words">
                {{ pair[1].value }}
              </td>
            </template>
          </tr>
        </tbody>
      </table>
    </section>

    <!-- ②出資先基本情報 -->
    <section v-if="basicInfo" class="mb-4 print:break-inside-avoid">
      <div class="text-[14pt] font-bold mb-1 border-b border-gray-400 px-">
        出資先基本情報
      </div>
      <div class="grid grid-cols-2 gap-4">
        <!-- 左: 保有株式情報 -->
        <div class="border border-gray-400">
          <h3
            class="text-[10pt] font-bold bg-gray-100 border-b border-gray-400 px-2 py-2 m-0"
          >
            保有株式情報
          </h3>
          <table class="w-full border-collapse text-[10pt]">
            <tbody>
              <tr
                v-for="item in basicInfo.holdingItems"
                :key="item.id"
                class="border-b border-gray-300"
              >
                <td
                  class="w-[45%] bg-gray-50 border-r border-gray-300 px-2 py-1.5 font-bold align-top text-[10pt]"
                >
                  {{ item.label }}
                </td>
                <td class="w-[55%] px-2 py-1.5 align-top break-words">
                  {{ item.value }}
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- 右: 出資先概況 -->
        <div class="border border-gray-400">
          <h3
            class="text-[10pt] font-bold bg-gray-100 border-b border-gray-400 px-2 py-2 m-0"
          >
            出資先概況
          </h3>
          <table class="w-full border-collapse text-[10pt]">
            <tbody>
              <tr
                v-for="item in basicInfo.investeeStatsItems"
                :key="item.id"
                class="border-b border-gray-300"
              >
                <td
                  class="w-[45%] bg-gray-50 border-r border-gray-300 px-2 py-1.5 font-bold align-top text-[10pt]"
                >
                  {{ item.label }}
                </td>
                <td class="w-[55%] px-2 py-1.5 align-top break-words">
                  {{ item.value }}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </section>

    <!-- ③財務情報 -->
    <section v-if="financialData" class="mb-8 print:break-inside-avoid">
      <div class="text-[14pt] font-bold mb-1 border-b border-gray-400 px-">
        財務情報
      </div>
      <div class="overflow-x-auto">
        <table class="w-full border-collapse text-[10pt]">
          <thead class="bg-gray-100 border-t border-b border-gray-400">
            <tr>
              <th
                class="border-r border-gray-400 px-2 py-2 font-bold text-center text-[10pt]"
              >
                項目
              </th>
              <th
                v-for="year in financialYears"
                :key="year"
                class="border-r border-gray-400 px-1 py-2 font-bold text-center w-[13%] text-[9.5pt]"
              >
                {{ year }}年度
              </th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="row in financialData.rows" :key="row.id">
              <td
                class="w-[22%] bg-gray-50 border-r border-gray-400 px-2 py-1.5 font-bold align-top whitespace-nowrap overflow-hidden text-ellipsis border-b border-gray-300"
              >
                {{ row.label }}
                <span v-if="row.unit" class="text-[9pt] text-gray-600">
                  ({{ row.unit }})
                </span>
              </td>
              <td
                v-for="yv in row.values"
                :key="yv.year"
                class="w-[13%] border-r border-b border-gray-400 px-1 py-1.5 text-right font-mono text-[9.5pt]"
              >
                {{ formatFinancialValue(yv.value) }}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>
  </div>
</template>
