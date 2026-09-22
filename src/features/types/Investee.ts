// 出資先関連の型定義

export type ListingStatus = '上場' | '非上場' | '上場準備中'

/** ①出資先情報 */
export interface InvesteeCompanyInfo {
  id: string
  companyName: string
  companyNameKana?: string
  listingStatus: ListingStatus
  marketName?: string // 上場市場（例: 東証グロース）
  industry: string
  representativeName: string
  establishedDate: string // ISO date (YYYY-MM-DD)
  address: string
  employeeCount?: number
  businessDescription: string
  fiscalYearEndMonth: number // 1-12
  websiteUrl?: string
}

/** 項目：値の1レコード（②で使用、編集可能） */
export interface KeyValueItem {
  id: string
  label: string
  value: string
}

/** ②出資先基本情報 */
export interface InvesteeBasicInfoData {
  /** 左側: 自社が保有する株式情報 */
  holdingItems: KeyValueItem[]
  /** 右側: 出資先の総株式数・保有ランキングなど */
  investeeStatsItems: KeyValueItem[]
}

/** 年度ごとの値（③で使用） */
export interface FinancialYearValue {
  year: number
  value: number | null
}

/** 財務項目の1行（③で使用、編集・並び替え可能） */
export interface FinancialRowItem {
  id: string
  label: string
  unit?: string
  values: FinancialYearValue[] // 古い年度→新しい年度の順で保持し、表示もこの順(右端が最新)
}

/** ③財務情報 */
export interface InvesteeFinancialData {
  rows: FinancialRowItem[]
}
