<script setup lang="ts">
/**
 * ②出資先基本情報
 * 二段組み（項目名・値の2カラム）のパネルを左右に2つ並べる。
 * 左: 自社が保有する株式情報 / 右: 出資先の総株式数・保有ランキングなど
 * 編集モードでは項目名・値の変更、項目の追加/削除ができる（API未接続のためローカル状態のみ）。
 */
import { reactive, ref } from 'vue'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Check, Pencil, Plus, Trash2, X } from '@lucide/vue'
import type {
  InvesteeBasicInfoData,
  KeyValueItem,
} from '@/features/types/Investee'

const props = defineProps<{
  modelValue: InvesteeBasicInfoData
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: InvesteeBasicInfoData): void
}>()

const isEditing = ref(false)

function cloneData(data: InvesteeBasicInfoData): InvesteeBasicInfoData {
  return {
    holdingItems: data.holdingItems.map((item) => ({ ...item })),
    investeeStatsItems: data.investeeStatsItems.map((item) => ({ ...item })),
  }
}

const draft = reactive<InvesteeBasicInfoData>(cloneData(props.modelValue))

function startEditing() {
  Object.assign(draft, cloneData(props.modelValue))
  isEditing.value = true
}

function cancelEditing() {
  Object.assign(draft, cloneData(props.modelValue))
  isEditing.value = false
}

function saveEditing() {
  emit('update:modelValue', cloneData(draft))
  isEditing.value = false
}

function createEmptyItem(): KeyValueItem {
  return {
    id: `item-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    label: '',
    value: '',
  }
}

function addItem(target: KeyValueItem[]) {
  target.push(createEmptyItem())
}

function removeItem(target: KeyValueItem[], id: string) {
  const index = target.findIndex((item) => item.id === id)
  if (index !== -1) target.splice(index, 1)
}
</script>

<template>
  <Card class="">
    <CardHeader class="flex flex-row items-center justify-between">
      <CardTitle class="text-lg">出資先基本情報</CardTitle>
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
      <div class="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <!-- 左側: 自社の保有株式情報 -->
        <div class="space-y-3 rounded-lg border p-4">
          <h3 class="text-sm font-semibold text-muted-foreground">
            保有株式情報
          </h3>

          <dl v-if="!isEditing" class="grid grid-cols-2 gap-x-4 gap-y-3">
            <template v-for="item in draft.holdingItems" :key="item.id">
              <dt class="text-xs text-muted-foreground">{{ item.label }}</dt>
              <dd class="text-right text-sm font-medium">{{ item.value }}</dd>
            </template>
          </dl>

          <div v-else class="space-y-2">
            <div
              v-for="item in draft.holdingItems"
              :key="item.id"
              class="flex items-center gap-2"
            >
              <Input v-model="item.label" placeholder="項目名" class="w-1/2" />
              <Input v-model="item.value" placeholder="値" class="w-1/2" />
              <Button
                variant="ghost"
                size="icon"
                class="shrink-0"
                @click="removeItem(draft.holdingItems, item.id)"
              >
                <Trash2 class="h-4 w-4 text-destructive" />
              </Button>
            </div>
            <Button
              variant="outline"
              size="sm"
              class="w-full"
              @click="addItem(draft.holdingItems)"
            >
              <Plus class="mr-1.5 h-4 w-4" />
              項目を追加
            </Button>
          </div>
        </div>

        <!-- 右側: 出資先の総株式数・保有ランキングなど -->
        <div class="space-y-3 rounded-lg border p-4">
          <h3 class="text-sm font-semibold text-muted-foreground">
            出資先概況
          </h3>

          <dl v-if="!isEditing" class="grid grid-cols-2 gap-x-4 gap-y-3">
            <template v-for="item in draft.investeeStatsItems" :key="item.id">
              <dt class="text-xs text-muted-foreground">{{ item.label }}</dt>
              <dd class="text-right text-sm font-medium">{{ item.value }}</dd>
            </template>
          </dl>

          <div v-else class="space-y-2">
            <div
              v-for="item in draft.investeeStatsItems"
              :key="item.id"
              class="flex items-center gap-2"
            >
              <Input v-model="item.label" placeholder="項目名" class="w-1/2" />
              <Input v-model="item.value" placeholder="値" class="w-1/2" />
              <Button
                variant="ghost"
                size="icon"
                class="shrink-0"
                @click="removeItem(draft.investeeStatsItems, item.id)"
              >
                <Trash2 class="h-4 w-4 text-destructive" />
              </Button>
            </div>
            <Button
              variant="outline"
              size="sm"
              class="w-full"
              @click="addItem(draft.investeeStatsItems)"
            >
              <Plus class="mr-1.5 h-4 w-4" />
              項目を追加
            </Button>
          </div>
        </div>
      </div>
    </CardContent>
  </Card>
</template>
