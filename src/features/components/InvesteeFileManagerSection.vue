<script setup lang="ts">
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { DROPBOX_FILES } from '@/features/constants/dropbox'
import { computed, ref } from 'vue'

interface FileItem {
  id: string
  name: string
  path_display: string
  modified: string
  size: number
}

const files = ref<FileItem[]>(DROPBOX_FILES)
const sortKey = ref<'name' | 'modified' | 'size'>('name')
const sortOrder = ref<'asc' | 'desc'>('asc')

const sortedFiles = computed(() => {
  const sorted = [...files.value].sort((a, b) => {
    let aVal = a[sortKey.value]
    let bVal = b[sortKey.value]

    if (sortKey.value === 'size') {
      aVal = a.size
      bVal = b.size
    } else if (sortKey.value === 'modified') {
      aVal = new Date(a.modified).getTime()
      bVal = new Date(b.modified).getTime()
    }

    const comparison = aVal > bVal ? 1 : aVal < bVal ? -1 : 0
    return sortOrder.value === 'asc' ? comparison : -comparison
  })
  return sorted
})

const toggleSort = (key: 'name' | 'modified' | 'size') => {
  if (sortKey.value === key) {
    sortOrder.value = sortOrder.value === 'asc' ? 'desc' : 'asc'
  } else {
    sortKey.value = key
    sortOrder.value = 'asc'
  }
}

const openFile = (file: FileItem) => {
  window.open(
    `https://www.dropbox.com/home?preview=${file.path_display}`,
    '_blank'
  )
}

const formatSize = (bytes: number) => {
  if (bytes === 0) return '0 B'
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i]
}

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('ja-JP')
}
</script>

<template>
  <Card class="gap-0">
    <CardHeader>
      <CardTitle class="text-lg">ファイル一覧</CardTitle>
    </CardHeader>
    <CardContent class="flex-1 overflow-y-auto">
      <div
        v-if="sortedFiles.length === 0"
        class="text-center text-gray-500 py-4"
      >
        ファイルがありません
      </div>
      <div v-else class="space-y-0">
        <!-- ヘッダー -->
        <div
          class="hidden md:grid grid-cols-[1fr_120px_120px] gap-4 p-3 text-sm font-semibold text-gray-700 border-b"
        >
          <button
            @click="toggleSort('name')"
            class="text-left hover:text-gray-900 cursor-pointer"
          >
            ファイル名
            {{ sortKey === 'name' ? (sortOrder === 'asc' ? '↑' : '↓') : '' }}
          </button>
          <button
            @click="toggleSort('modified')"
            class="hover:text-gray-900 cursor-pointer"
          >
            日時
            {{
              sortKey === 'modified' ? (sortOrder === 'asc' ? '↑' : '↓') : ''
            }}
          </button>
          <button
            @click="toggleSort('size')"
            class="text-right hover:text-gray-900 cursor-pointer"
          >
            サイズ
            {{ sortKey === 'size' ? (sortOrder === 'asc' ? '↑' : '↓') : '' }}
          </button>
        </div>

        <!-- ファイル行 -->
        <div
          v-for="file in sortedFiles"
          :key="file.id"
          class="border-b last:border-b-0"
        >
          <!-- デスクトップ表示 -->
          <div
            class="hidden md:grid grid-cols-[1fr_120px_120px] gap-4 p-3 items-center hover:bg-gray-50"
          >
            <button
              @click="openFile(file)"
              class="text-blue-600 hover:underline text-sm text-left truncate"
            >
              {{ file.name }}
            </button>
            <span class="text-xs text-gray-500">{{
              formatDate(file.modified)
            }}</span>
            <span class="text-xs text-gray-500 text-right">{{
              formatSize(file.size)
            }}</span>
          </div>

          <!-- モバイル表示 -->
          <div class="md:hidden p-3 hover:bg-gray-50">
            <button
              @click="openFile(file)"
              class="text-blue-600 hover:underline text-sm font-medium text-left w-full"
            >
              {{ file.name }}
            </button>
            <div class="flex justify-between mt-1 text-xs text-gray-500">
              <span>{{ formatDate(file.modified) }}</span>
              <span>{{ formatSize(file.size) }}</span>
            </div>
          </div>
        </div>
      </div>
    </CardContent>
  </Card>
</template>
