import type { InvesteeFinancialData } from '@/types/investee'

// TODO: API実装後は fetch 結果に置き換える
// values は古い年度→新しい年度の順。表示上も右端が当年度になる。
export const investeeFinancialData: InvesteeFinancialData = {
  rows: [
    {
      id: 'f1',
      label: '売上高',
      unit: '百万円',
      values: [
        { year: 2022, value: 820 },
        { year: 2023, value: 1050 },
        { year: 2024, value: 1380 },
        { year: 2025, value: 1720 },
        { year: 2026, value: 2100 },
      ],
    },
    {
      id: 'f2',
      label: '営業利益',
      unit: '百万円',
      values: [
        { year: 2022, value: -60 },
        { year: 2023, value: 10 },
        { year: 2024, value: 95 },
        { year: 2025, value: 180 },
        { year: 2026, value: 260 },
      ],
    },
    {
      id: 'f3',
      label: '経常利益',
      unit: '百万円',
      values: [
        { year: 2022, value: -65 },
        { year: 2023, value: 5 },
        { year: 2024, value: 88 },
        { year: 2025, value: 170 },
        { year: 2026, value: 250 },
      ],
    },
    {
      id: 'f4',
      label: '当期純利益',
      unit: '百万円',
      values: [
        { year: 2022, value: -70 },
        { year: 2023, value: -5 },
        { year: 2024, value: 60 },
        { year: 2025, value: 120 },
        { year: 2026, value: 190 },
      ],
    },
    {
      id: 'f5',
      label: '総資産',
      unit: '百万円',
      values: [
        { year: 2022, value: 1200 },
        { year: 2023, value: 1450 },
        { year: 2024, value: 1900 },
        { year: 2025, value: 2400 },
        { year: 2026, value: 3050 },
      ],
    },
    {
      id: 'f6',
      label: '純資産',
      unit: '百万円',
      values: [
        { year: 2022, value: 300 },
        { year: 2023, value: 340 },
        { year: 2024, value: 420 },
        { year: 2025, value: 560 },
        { year: 2026, value: 780 },
      ],
    },
  ],
}
