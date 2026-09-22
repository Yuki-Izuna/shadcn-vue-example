<script setup lang="ts">
/**
 * ③財務情報
 * 縦軸: 財務項目 / 横軸: 年度（右端が当年度、過去4年度分を含めて表示）のテーブル。
 * 編集モードでは項目名・値の変更、行の追加/削除に加え、SortableJSベースの
 * vuedraggable による行の並び替えができる。
 *
 * 依存パッケージ: vuedraggable (Vue3対応版)
 *   npm install vuedraggable@4
 */
import { computed, reactive, ref } from 'vue'
import draggable from 'vuedraggable'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Table,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Check, GripVertical, Pencil, Plus, Trash2, X } from '@lucide/vue'
import type {
  FinancialRowItem,
  InvesteeFinancialData,
} from '@/features/types/Investee'

const props = defineProps<{
  modelValue: InvesteeFinancialData
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: InvesteeFinancialData): void
}>()

const isEditing = ref(false)

function cloneRows(rows: FinancialRowItem[]): FinancialRowItem[] {
  return rows.map((row) => ({
    ...row,
    values: row.values.map((v) => ({ ...v })),
  }))
}

const draftRows = reactive<FinancialRowItem[]>(cloneRows(props.modelValue.rows))

// 表示する年度一覧（先頭行の年度を基準にする。右端が当年度になる想定）
const years = computed(() => draftRows[0]?.values.map((v) => v.year) ?? [])

function startEditing() {
  draftRows.splice(0, draftRows.length, ...cloneRows(props.modelValue.rows))
  isEditing.value = true
}

function cancelEditing() {
  draftRows.splice(0, draftRows.length, ...cloneRows(props.modelValue.rows))
  isEditing.value = false
}

function saveEditing() {
  emit('update:modelValue', { rows: cloneRows(draftRows) })
  isEditing.value = false
}

function addRow() {
  draftRows.push({
    id: `row-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    label: '',
    unit: '',
    values: years.value.map((year) => ({ year, value: null })),
  })
}

function removeRow(id: string) {
  const index = draftRows.findIndex((row) => row.id === id)
  if (index !== -1) draftRows.splice(index, 1)
}

function handleValueInput(yv: { value: number | null }, raw: string | number) {
  yv.value = raw === '' ? null : Number(raw)
}

function formatValue(value: number | null) {
  if (value === null || Number.isNaN(value)) return '-'
  return value.toLocaleString('ja-JP')
}
</script>

<template>
  <Card>
    <CardHeader class="flex flex-row items-center justify-between">
      <CardTitle class="text-lg">財務情報</CardTitle>
      <div class="flex gap-2">
        <Button
          v-if="!isEditing"
          variant="outline"
          size="sm"
          @click="startEditing"
        >
          <Pencil class="mr-1.5 h-4 w-4" />
          編集
        </Button>
        <template v-else>
          <Button variant="ghost" size="sm" @click="cancelEditing">
            <X class="mr-1.5 h-4 w-4" />
            キャンセル
          </Button>
          <Button size="sm" @click="saveEditing">
            <Check class="mr-1.5 h-4 w-4" />
            保存
          </Button>
        </template>
      </div>
    </CardHeader>

    <CardContent>
      <div class="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead v-if="isEditing" class="w-8" />
              <TableHead class="min-w-[140px]">項目</TableHead>
              <TableHead
                v-for="(year, idx) in years"
                :key="year"
                class="text-right"
                :class="{
                  'text-foreground font-semibold': idx === years.length - 1,
                }"
              >
                {{ year }}年度
              </TableHead>
              <TableHead v-if="isEditing" class="w-8" />
            </TableRow>
          </TableHeader>

          <!-- 編集モード: 行の並び替え・値の編集が可能 -->
          <draggable
            v-if="isEditing"
            v-model="draftRows"
            item-key="id"
            tag="tbody"
            handle=".drag-handle"
            ghost-class="opacity-40"
          >
            <template #item="{ element: row }">
              <TableRow>
                <TableCell
                  class="drag-handle cursor-grab text-muted-foreground active:cursor-grabbing"
                >
                  <GripVertical class="h-4 w-4" />
                </TableCell>
                <TableCell>
                  <Input
                    v-model="row.label"
                    placeholder="項目名"
                    class="min-w-[120px]"
                  />
                </TableCell>
                <TableCell
                  v-for="yv in row.values"
                  :key="yv.year"
                  class="text-right"
                >
                  <Input
                    :model-value="yv.value ?? ''"
                    type="number"
                    class="text-right"
                    @update:model-value="(val) => handleValueInput(yv, val)"
                  />
                </TableCell>
                <TableCell>
                  <Button
                    variant="ghost"
                    size="icon"
                    @click="removeRow(row.id)"
                  >
                    <Trash2 class="h-4 w-4 text-destructive" />
                  </Button>
                </TableCell>
              </TableRow>
            </template>
          </draggable>

          <!-- 閲覧モード -->
          <tbody v-else>
            <TableRow v-for="row in draftRows" :key="row.id">
              <TableCell class="font-medium">
                {{ row.label }}
                <span
                  v-if="row.unit"
                  class="ml-1 text-xs text-muted-foreground"
                >
                  ({{ row.unit }})
                </span>
              </TableCell>
              <TableCell
                v-for="(yv, idx) in row.values"
                :key="yv.year"
                class="text-right tabular-nums"
                :class="{ 'font-semibold': idx === row.values.length - 1 }"
              >
                {{ formatValue(yv.value) }}
              </TableCell>
            </TableRow>
          </tbody>
        </Table>
      </div>

      <Button
        v-if="isEditing"
        variant="outline"
        size="sm"
        class="mt-3"
        @click="addRow"
      >
        <Plus class="mr-1.5 h-4 w-4" />
        行を追加
      </Button>
    </CardContent>
  </Card>
</template>
