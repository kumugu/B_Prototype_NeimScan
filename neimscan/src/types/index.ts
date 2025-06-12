import { Database } from './database.types'

// Database types from Supabase
export type { Database } from './database.types'
export type { Json, Tables, TablesInsert, TablesUpdate, Enums } from './database.types'

// Specific table types for easier use
export type GiftMoney = Database['public']['Tables']['gift_money']['Row']
export type GiftMoneyInsert = Database['public']['Tables']['gift_money']['Insert']
export type GiftMoneyUpdate = Database['public']['Tables']['gift_money']['Update']

// OCR related types
export interface OCRResult {
  text: string
  confidence: number
}

export interface OCRProgress {
  status: string
  progress: number
}

// Camera related types
export interface CameraSettings {
  facingMode: 'user' | 'environment'
  width?: { ideal: number }
  height?: { ideal: number }
}

export interface CapturedImage {
  dataUrl: string
  blob: Blob
  timestamp: Date
}

// Component prop types
export interface CameraCaptureProps {
  onImageCapture: (image: CapturedImage) => void
  onError: (error: string) => void
}

export interface OCRProcessorProps {
  imageData: string
  onOCRComplete: (result: OCRResult) => void
  onOCRProgress: (progress: OCRProgress) => void
}

export interface GiftMoneyFormProps {
  initialName?: string
  onSubmit: (data: Omit<GiftMoneyInsert, 'user_id'>) => void
}

export interface GiftMoneyListProps {
  gifts: GiftMoney[]
  onEdit: (id: number, data: GiftMoneyUpdate) => void
  onDelete: (id: number) => void
}

// API response types
export interface SupabaseResponse<T> {
  data: T | null
  error: Error | null
}

export interface PaginatedResponse<T> {
  data: T[]
  count: number
  hasMore: boolean
}

// Excel export types
export interface ExcelExportData {
  이름: string
  금액: number
  날짜: string
  메모?: string
}

// Auth types
export interface User {
  id: string
  email?: string
  created_at: string
}

// Error types
export interface AppError {
  message: string
  code?: string
  details?: any
}

// Form validation types
export interface ValidationError {
  field: string
  message: string
}

export interface FormState<T> {
  data: T
  errors: ValidationError[]
  isValid: boolean
  isSubmitting: boolean
}

// Korean name patterns for OCR validation
export interface KoreanNamePattern {
  surnames: string[]
  commonNames: string[]
  minLength: number
  maxLength: number
}

// PWA types
export interface PWAInstallPrompt {
  prompt: () => Promise<void>
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>
}

export interface ServiceWorkerRegistration {
  installing?: ServiceWorker
  waiting?: ServiceWorker
  active?: ServiceWorker
  update: () => Promise<void>
}

// Event types
export interface GiftMoneyEvent {
  id: string
  title: string
  date: Date
  totalAmount: number
  giftCount: number
}

// Statistics types
export interface GiftMoneyStats {
  totalAmount: number
  averageAmount: number
  giftCount: number
  topGifts: Array<{
    name: string
    amount: number
  }>
  dailyStats: Array<{
    date: string
    amount: number
    count: number
  }>
}

// Settings types
export interface AppSettings {
  theme: 'light' | 'dark' | 'system'
  language: 'ko' | 'en'
  autoBackup: boolean
  ocrLanguage: 'kor' | 'eng' | 'kor+eng'
  currency: 'KRW' | 'USD'
  dateFormat: 'YYYY-MM-DD' | 'MM/DD/YYYY' | 'DD/MM/YYYY'
}

// Hook return types
export interface UseCameraReturn {
  videoRef: React.RefObject<HTMLVideoElement>
  startCamera: () => Promise<boolean>
  stopCamera: () => void
  captureImage: () => string | null
  stream: MediaStream | null
  error: string | null
  isPermissionGranted: boolean
}

export interface UseOCRReturn {
  recognizeText: (imageData: string) => Promise<OCRResult | null>
  isProcessing: boolean
  progress: number
  result: OCRResult | null
  error: string | null
}

export interface UseSupabaseReturn {
  saveGiftMoney: (data: Omit<GiftMoneyInsert, 'user_id'>, userId: string) => Promise<number | null>
  fetchGiftMoney: (userId: string) => Promise<GiftMoney[]>
  updateGiftMoney: (id: number, data: GiftMoneyUpdate) => Promise<boolean>
  deleteGiftMoney: (id: number) => Promise<boolean>
  uploadImage: (file: File, fileName: string) => Promise<string | null>
  isLoading: boolean
  error: string | null
}
