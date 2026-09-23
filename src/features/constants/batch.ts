export interface BatchExecution {
  id: string
  batchName: string
  scheduledDate: string
  status: 'pending' | 'completed' | 'failed'
  createdAt: string
  updatedAt: string
}

export const BATCH_EXECUTIONS: BatchExecution[] = [
  {
    id: '1',
    batchName: '2024年1月月次バッチ',
    scheduledDate: '2024-01-31',
    status: 'completed',
    createdAt: '2023-12-15',
    updatedAt: '2024-01-31',
  },
  {
    id: '2',
    batchName: '2024年2月月次バッチ',
    scheduledDate: '2024-02-29',
    status: 'completed',
    createdAt: '2024-01-15',
    updatedAt: '2024-02-29',
  },
  {
    id: '3',
    batchName: '2024年3月月次バッチ',
    scheduledDate: '2024-03-31',
    status: 'completed',
    createdAt: '2024-02-15',
    updatedAt: '2024-03-31',
  },
  {
    id: '4',
    batchName: '2024年3月月次バッチ（第1次確定）',
    scheduledDate: '2024-03-15',
    status: 'completed',
    createdAt: '2024-02-20',
    updatedAt: '2024-03-15',
  },
  {
    id: '5',
    batchName: '2024年3月月次バッチ（第2次確定）',
    scheduledDate: '2024-03-22',
    status: 'completed',
    createdAt: '2024-02-25',
    updatedAt: '2024-03-22',
  },
  {
    id: '6',
    batchName: '2024年4月月次バッチ',
    scheduledDate: '2024-04-30',
    status: 'pending',
    createdAt: '2024-03-15',
    updatedAt: '2024-03-15',
  },
  {
    id: '7',
    batchName: '2024年5月月次バッチ',
    scheduledDate: '2024-05-31',
    status: 'pending',
    createdAt: '2024-04-15',
    updatedAt: '2024-04-15',
  },
  {
    id: '8',
    batchName: '2024年6月月次バッチ',
    scheduledDate: '2024-06-30',
    status: 'pending',
    createdAt: '2024-05-15',
    updatedAt: '2024-05-15',
  },
  {
    id: '9',
    batchName: '2024年6月月次バッチ（第1次確定）',
    scheduledDate: '2024-06-14',
    status: 'pending',
    createdAt: '2024-05-20',
    updatedAt: '2024-05-20',
  },
  {
    id: '10',
    batchName: '2024年6月月次バッチ（第2次確定）',
    scheduledDate: '2024-06-21',
    status: 'pending',
    createdAt: '2024-05-25',
    updatedAt: '2024-05-25',
  },
]
