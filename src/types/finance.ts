export type TransactionType = 'income' | 'expense'
export type TransactionStatus = 'paid' | 'pending'
export type PaymentMethod = 'credit_card' | 'debit_card' | 'pix' | 'cash' | 'transfer'
export type InvestmentType = 'fixed_income' | 'stocks' | 'fiis' | 'crypto' | 'treasury' | 'other'
export type InvestmentAction = 'contribution' | 'withdrawal'

export interface Transaction {
  id: string
  type: TransactionType
  amount: number
  date: string // ISO string
  category: string
  description: string
  status: TransactionStatus
  paymentMethod?: PaymentMethod
  paidBySupport?: boolean
}

export interface FixedExpense {
  id: string
  name: string
  amount: number
  dayDue: number
  category: string
  autoTrack: boolean
  lastPaidDate?: string
  paidBySupport?: boolean
}

export interface Budget {
  category: string
  limit: number
  period: 'monthly'
}

export interface FinancialSupport {
  id: string
  amount: number
  month: string // "YYYY-MM"
  notes?: string
}

export interface InvestmentEntry {
  id: string
  date: string
  amount: number
  type: InvestmentAction
}

export interface Investment {
  id: string
  name: string
  type: InvestmentType
  currentAmount: number
  history: InvestmentEntry[]
  color?: string
}

export interface FinancialInsight {
  type: 'info' | 'warning' | 'success'
  title: string
  message: string
}

export interface AppSettings {
  currency: string
  hideValues: boolean
  userName: string
  monthlySalary: number
  rentAmount: number
  rentDueDate: number // Day of month
  nextRentDate: string // ISO date
  emergencyFundGoal: number
}

export interface FinanceState {
  transactions: Transaction[]
  fixedExpenses: FixedExpense[]
  budgets: Budget[]
  financialSupport: FinancialSupport[]
  investments: Investment[]
  settings: AppSettings
  lastSync?: string
}

export type ReferenceType = 'transaction' | 'fixed_expense' | 'budget' | 'support' | 'investment_entry'

export interface TimelineEvent {
  id: string
  date: string // ISO string
  fullDate: Date
  type: ReferenceType
  title: string
  amount: number
  category?: string
  status?: 'paid' | 'pending' | 'projected'
  originalData?: any
}
