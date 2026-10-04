<script setup lang="ts">
  import { ref } from 'vue'
  import { useForm } from 'vee-validate'
  import { toTypedSchema } from '@vee-validate/zod'
  import * as z from 'zod'

  import { Button } from '@/components/ui/button'
  import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
  } from '@/components/ui/card'
  import {
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
  } from '@/components/ui/form'
  import { Input } from '@/components/ui/input'
  import { Label } from '@/components/ui/label'
  import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'

  // ---------------------------------------------------------------------------
  // 出力形式
  // ---------------------------------------------------------------------------
  const FORMAT_OPTIONS = [
    {
      value: 'summary',
      label: '投資案件サマリ',
      description:
        '指定した期間に投資期間を設定している案件をすべて出力します。期間は案件登録時に指定した投資期間が対象で、この期間外の計画・実績情報も含みます。（1案件複数行・行は年度単位）',
    },
    {
      value: 'list',
      label: '投資案件一覧',
      description:
        '投資案件一覧画面で出力できるCSVと同一フォーマットで出力します。登録時の基本情報に案件ごとの集計情報（出資金額合計、回収金額合計、回収率など）を加えます。（1案件1行）',
    },
  ] as const

  // ---------------------------------------------------------------------------
  // バリデーション (vee-validate + zod)
  // ---------------------------------------------------------------------------
  const formSchema = toTypedSchema(
    z
      .object({
        format: z.enum(['summary', 'list'], {
          errorMap: () => ({ message: '出力形式を選択してください' }),
        }),
        from: z
          .string({ required_error: '開始日を入力してください' })
          .min(1, '開始日を入力してください'),
        to: z
          .string({ required_error: '終了日を入力してください' })
          .min(1, '終了日を入力してください'),
      })
      // From <= To の相関チェック（両方入力済みの場合のみ）
      .refine((v) => !v.from || !v.to || v.from <= v.to, {
        path: ['to'],
        message: '終了日は開始日以降の日付を指定してください',
      })
  )

  const { handleSubmit, isSubmitting } = useForm({
    validationSchema: formSchema,
  })

  // ---------------------------------------------------------------------------
  // CSV出力
  // ---------------------------------------------------------------------------
  const errorMessage = ref('')

  const onSubmit = handleSubmit(async (values) => {
    errorMessage.value = ''
    try {
      // TODO: エンドポイントは実際のAPIに合わせて変更してください
      const params = new URLSearchParams({
        format: values.format,
        from: values.from,
        to: values.to,
      })
      const res = await fetch(
        `/api/investments/export/csv?${params.toString()}`
      )
      if (!res.ok) throw new Error(`HTTP ${res.status}`)

      const blob = await res.blob()
      const filename = `${values.format === 'summary' ? '投資案件サマリ' : '投資案件一覧'}_${values.from}_${values.to}.csv`
      downloadBlob(blob, filename)
    } catch (e) {
      console.error(e)
      errorMessage.value =
        'CSVの出力に失敗しました。時間をおいて再度お試しください。'
    }
  })

  function downloadBlob(blob: Blob, filename: string) {
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = filename
    a.click()
    URL.revokeObjectURL(url)
  }
</script>

<template>
  <div class="mx-auto w-full max-w-3xl p-6">
    <Card>
      <CardHeader>
        <CardTitle>投資案件CSV出力</CardTitle>
        <CardDescription
          >出力形式と対象期間を指定してCSVをダウンロードします。</CardDescription
        >
      </CardHeader>

      <CardContent>
        <form class="space-y-8" novalidate @submit="onSubmit">
          <!-- 出力形式 -->
          <FormField v-slot="{ componentField }" name="format">
            <FormItem class="space-y-3">
              <div class="flex items-center gap-3">
                <FormLabel>出力形式</FormLabel>
                <FormMessage />
              </div>
              <FormControl>
                <RadioGroup class="gap-3" v-bind="componentField">
                  <div
                    v-for="opt in FORMAT_OPTIONS"
                    :key="opt.value"
                    class="flex items-start gap-3 rounded-md border p-4"
                  >
                    <RadioGroupItem
                      :id="`format-${opt.value}`"
                      :value="opt.value"
                      class="mt-1"
                    />
                    <Label
                      :for="`format-${opt.value}`"
                      class="flex-1 cursor-pointer space-y-1"
                    >
                      <span class="block font-medium">{{ opt.label }}</span>
                      <span
                        class="block text-sm font-normal leading-relaxed text-muted-foreground"
                      >
                        {{ opt.description }}
                      </span>
                    </Label>
                  </div>
                </RadioGroup>
              </FormControl>
            </FormItem>
          </FormField>

          <!-- 対象期間 -->
          <div class="space-y-3">
            <p class="text-sm font-medium leading-none">対象期間</p>
            <div class="flex flex-col gap-4 sm:flex-row sm:items-start">
              <FormField v-slot="{ componentField }" name="from">
                <FormItem class="flex-1">
                  <div class="flex items-center gap-3">
                    <FormLabel>From</FormLabel>
                    <FormMessage />
                  </div>
                  <FormControl>
                    <Input type="date" v-bind="componentField" />
                  </FormControl>
                </FormItem>
              </FormField>

              <span class="hidden pt-9 text-muted-foreground sm:block">〜</span>

              <FormField v-slot="{ componentField }" name="to">
                <FormItem class="flex-1">
                  <div class="flex items-center gap-3">
                    <FormLabel>To</FormLabel>
                    <FormMessage />
                  </div>
                  <FormControl>
                    <Input type="date" v-bind="componentField" />
                  </FormControl>
                </FormItem>
              </FormField>
            </div>
          </div>

          <p v-if="errorMessage" class="text-sm text-destructive" role="alert">
            {{ errorMessage }}
          </p>

          <div class="flex justify-end">
            <Button type="submit" :disabled="isSubmitting">
              {{ isSubmitting ? '出力中...' : 'CSVを出力' }}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  </div>
</template>
