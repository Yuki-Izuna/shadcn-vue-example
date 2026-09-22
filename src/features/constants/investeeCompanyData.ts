import type { InvesteeCompanyInfo } from '@/features/types/Investee'

// TODO: API実装後は fetch 結果に置き換える
export const investeeCompanyData: InvesteeCompanyInfo = {
  id: 'inv-001',
  companyName: '株式会社サンプルテック',
  companyNameKana: 'カブシキガイシャサンプルテック',
  listingStatus: '上場',
  marketName: '東証グロース',
  industry: 'ソフトウェア・情報通信',
  representativeName: '山田 太郎',
  establishedDate: '2015-04-01',
  address: '東京都港区六本木1-2-3 サンプルビル10F',
  employeeCount: 128,
  businessDescription:
    'SaaS型の業務効率化プラットフォームの開発・提供を行う。国内中堅企業を中心に導入実績を拡大中。',
  fiscalYearEndMonth: 3,
  websiteUrl: 'https://example.com',
}
