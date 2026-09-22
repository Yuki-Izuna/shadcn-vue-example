import type { InvesteeBasicInfoData } from '@/types/investee'

// TODO: API実装後は fetch 結果に置き換える
export const investeeBasicInfoData: InvesteeBasicInfoData = {
  holdingItems: [
    { id: 'h1', label: '保有株式数', value: '120,000株' },
    { id: 'h2', label: '保有比率', value: '8.5%' },
    { id: 'h3', label: '取得価額', value: '¥180,000,000' },
    { id: 'h4', label: '時価評価額', value: '¥312,000,000' },
    { id: 'h5', label: '株式種類', value: '普通株式' },
    { id: 'h6', label: '初回投資日', value: '2019-06-12' },
  ],
  investeeStatsItems: [
    { id: 's1', label: '発行済株式総数', value: '1,411,764株' },
    { id: 's2', label: '株主数', value: '42名' },
    { id: 's3', label: '保有ランキング', value: '第3位' },
    { id: 's4', label: '直近資金調達ラウンド', value: 'シリーズC' },
    { id: 's5', label: '直近資金調達額', value: '¥1,500,000,000' },
    { id: 's6', label: '直近評価額（時価総額）', value: '¥8,200,000,000' },
  ],
}
