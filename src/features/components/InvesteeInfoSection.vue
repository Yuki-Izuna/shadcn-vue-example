<script setup lang="ts">
/**
 * ①出資先情報
 * 出資先の会社名・上場区分などの基本情報を二段組みで表示する。
 * ページ上部に配置する想定。編集は別ページ（編集画面）へ遷移する。
 */
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Pencil } from '@lucide/vue'
import type { InvesteeCompanyInfo } from '@/features/types/Investee'

const props = defineProps<{
  company: InvesteeCompanyInfo
  /** 編集ボタン押下時の遷移先。未指定なら /investees/:id/edit へ遷移する */
  editPath?: string
}>()

const router = useRouter()

const listingBadgeVariant = computed(() => {
  switch (props.company.listingStatus) {
    case '上場':
      return 'default'
    case '上場準備中':
      return 'secondary'
    default:
      return 'outline'
  }
})

const formattedEstablishedDate = computed(() => {
  const d = new Date(props.company.establishedDate)
  return Number.isNaN(d.getTime())
    ? props.company.establishedDate
    : d.toLocaleDateString('ja-JP')
})

// 二段組みで表示する基本情報の項目
const infoFields = computed(() => [
  { label: '業種', value: props.company.industry },
  { label: '代表者', value: props.company.representativeName },
  { label: '設立年月日', value: formattedEstablishedDate.value },
  {
    label: '従業員数',
    value: props.company.employeeCount
      ? `${props.company.employeeCount}名`
      : '-',
  },
  { label: '決算月', value: `${props.company.fiscalYearEndMonth}月` },
  { label: '所在地', value: props.company.address },
  { label: '事業内容', value: props.company.businessDescription },
  { label: 'Webサイト', value: props.company.websiteUrl ?? '-' },
])

function handleEditClick() {
  const target = props.editPath ?? `/investees/${props.company.id}/edit`
  router.push(target)
}
</script>

<template>
  <Card>
    <CardHeader class="flex flex-row items-start justify-between gap-4">
      <div class="space-y-1.5">
        <div class="flex flex-wrap items-center gap-2">
          <CardTitle class="text-xl">{{ company.companyName }}</CardTitle>
          <Badge :variant="listingBadgeVariant">{{
            company.listingStatus
          }}</Badge>
          <span v-if="company.marketName" class="text-sm text-muted-foreground">
            {{ company.marketName }}
          </span>
        </div>
        <p v-if="company.companyNameKana" class="text-sm text-muted-foreground">
          {{ company.companyNameKana }}
        </p>
      </div>

      <Button variant="outline" size="sm" @click="handleEditClick">
        <Pencil class="mr-1.5 h-4 w-4" />
        編集
      </Button>
    </CardHeader>

    <CardContent>
      <dl class="grid grid-cols-1 gap-x-8 gap-y-4 sm:grid-cols-2">
        <div v-for="field in infoFields" :key="field.label" class="space-y-1">
          <dt class="text-xs text-muted-foreground">{{ field.label }}</dt>
          <dd class="text-sm leading-relaxed">{{ field.value }}</dd>
        </div>
      </dl>
    </CardContent>
  </Card>
</template>
