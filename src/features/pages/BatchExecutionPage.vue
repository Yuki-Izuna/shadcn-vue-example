<script setup lang="ts">
import { Badge } from '@/components/ui/badge'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { BATCH_EXECUTIONS } from '@/features/constants/batch'
import { computed, ref } from 'vue'

const hideCompleted = ref(false)

const displayedBatches = computed(() => {
  console.log('huga!', hideCompleted.value)
  return hideCompleted.value
    ? BATCH_EXECUTIONS.filter((batch) => batch.status !== 'completed')
    : BATCH_EXECUTIONS
})

const getStatusBadge = (status: string) => {
  const variants: Record<
    string,
    'outline' | 'default' | 'destructive' | 'secondary'
  > = {
    pending: 'outline',
    completed: 'default',
    failed: 'destructive',
  }
  const labels: Record<string, string> = {
    pending: '計画済み',
    completed: '実行済み',
    failed: '失敗',
  }
  return { variant: variants[status], label: labels[status] }
}

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('ja-JP')
}
</script>

<template>
  <div class="max-w-6xl space-y-3 p-2">
    <Card>
      <CardHeader>
        <CardTitle>バッチ実行情報</CardTitle>
        <CardDescription
          >計画済みおよび実行済みのバッチ実行スケジュール</CardDescription
        >
      </CardHeader>
      <CardContent class="space-y-6">
        <div class="flex items-center space-x-2">
          <Checkbox
            id="hide-completed"
            :checked="hideCompleted"
            @click="hideCompleted = !hideCompleted"
          />
          <label for="hideCompleted" class="text-sm font-medium cursor-pointer">
            実行済みバッチを表示する
          </label>
        </div>

        <div class="border rounded-lg overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead class="w-[40%]">バッチ名</TableHead>
                <TableHead class="w-[20%]">実行予定日</TableHead>
                <TableHead class="w-[20%]">ステータス</TableHead>
                <TableHead class="w-[20%] text-right">作成日時</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow
                v-for="batch in displayedBatches"
                :key="batch.id"
                class="hover:bg-muted/50"
              >
                <TableCell class="font-medium">{{ batch.batchName }}</TableCell>
                <TableCell>{{ formatDate(batch.scheduledDate) }}</TableCell>
                <TableCell>
                  <Badge :variant="getStatusBadge(batch.status).variant">
                    {{ getStatusBadge(batch.status).label }}
                  </Badge>
                </TableCell>
                <TableCell class="text-right text-sm text-muted-foreground">
                  {{ formatDate(batch.createdAt) }}
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>

        <div class="text-sm text-muted-foreground">
          全 {{ BATCH_EXECUTIONS.length }} 件中
          {{ displayedBatches.length }} 件表示
        </div>
      </CardContent>
    </Card>
  </div>
</template>
