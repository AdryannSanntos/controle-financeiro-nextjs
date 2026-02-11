import { AppSettings, Budget, FinanceState, FinancialSupport, FixedExpense, Investment, InvestmentEntry, Transaction } from '@/types/finance'
import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'

interface FinanceStore extends FinanceState {
  addTransaction: (transaction: Transaction) => void
  editTransaction: (id: string, updated: Partial<Transaction>) => void
  deleteTransaction: (id: string) => void
  
  addFixedExpense: (expense: FixedExpense) => void
  editFixedExpense: (id: string, updated: Partial<FixedExpense>) => void
  deleteFixedExpense: (id: string) => void
  
  setBudget: (budget: Budget) => void
  removeBudget: (category: string) => void
  
  addSupport: (support: FinancialSupport) => void
  editSupport: (id: string, updated: Partial<FinancialSupport>) => void
  removeSupport: (id: string) => void
  
  addInvestment: (investment: Investment) => void
  updateInvestment: (id: string, updated: Partial<Investment>) => void
  deleteInvestment: (id: string) => void
  addInvestmentEntry: (investmentId: string, entry: InvestmentEntry) => void
  
  updateSettings: (settings: Partial<AppSettings>) => void
  
  importData: (data: FinanceState) => void
  resetData: () => void
}

const initialState: FinanceState = {
  transactions: [],
  fixedExpenses: [
    { id: 'f1', name: 'Aluguel & Condomínio', amount: 2500, dayDue: 5, category: 'aluguel', autoTrack: true },
    { id: 'f2', name: 'Energia Elétrica', amount: 80, dayDue: 10, category: 'aluguel', autoTrack: true },
    { id: 'f3', name: 'Internet', amount: 50, dayDue: 15, category: 'aluguel', autoTrack: true },
    { id: 'f4', name: 'Gás Encanado', amount: 80, dayDue: 10, category: 'aluguel', autoTrack: true },
    { id: 'f5', name: 'Celular', amount: 50, dayDue: 20, category: 'outros', autoTrack: true },
    { id: 'f6', name: 'Academia', amount: 180, dayDue: 1, category: 'saude', autoTrack: true },
    { id: 'f7', name: 'Spotify', amount: 6, dayDue: 15, category: 'lazer', autoTrack: true },
  ],
  budgets: [
    { category: 'alimentacao', limit: 1200, period: 'monthly' },
    { category: 'transporte', limit: 120, period: 'monthly' },
    { category: 'lazer', limit: 400, period: 'monthly' },
    { category: 'outros', limit: 400, period: 'monthly' }, // Reserva financeira
  ],
  financialSupport: [],
  investments: [],
  settings: {
    currency: 'BRL',
    hideValues: false,
    userName: 'Usuário',
    monthlySalary: 0,
    rentAmount: 2500,
    rentDueDate: 5,
    nextRentDate: new Date().toISOString(),
    emergencyFundGoal: 5000,
  },
}

export const useFinanceStore = create<FinanceStore>()(
  persist(
    (set) => ({
      ...initialState,

      addTransaction: (transaction) =>
        set((state) => ({ transactions: [transaction, ...state.transactions] })),

      editTransaction: (id, updated) =>
        set((state) => ({
          transactions: state.transactions.map((t) =>
            t.id === id ? { ...t, ...updated } : t
          ),
        })),

      deleteTransaction: (id) =>
        set((state) => ({
          transactions: state.transactions.filter((t) => t.id !== id),
        })),

      addFixedExpense: (expense) =>
        set((state) => ({ fixedExpenses: [...state.fixedExpenses, expense] })),

      editFixedExpense: (id, updated) =>
        set((state) => ({
          fixedExpenses: state.fixedExpenses.map((e) =>
            e.id === id ? { ...e, ...updated } : e
          ),
        })),

      deleteFixedExpense: (id) =>
        set((state) => ({
          fixedExpenses: state.fixedExpenses.filter((e) => e.id !== id),
        })),

      setBudget: (budget) =>
        set((state) => {
          const exists = state.budgets.find((b) => b.category === budget.category)
          if (exists) {
            return {
              budgets: state.budgets.map((b) =>
                b.category === budget.category ? budget : b
              ),
            }
          }
          return { budgets: [...state.budgets, budget] }
        }),

      removeBudget: (category) =>
        set((state) => ({
          budgets: state.budgets.filter((b) => b.category !== category),
        })),
        
      addSupport: (support) => 
        set((state) => ({
            financialSupport: [...state.financialSupport, support]
        })),
        
      editSupport: (id, updated) =>
        set((state) => ({
            financialSupport: state.financialSupport.map((s) =>
                s.id === id ? { ...s, ...updated } : s
            )
        })),

      removeSupport: (id) =>
        set((state) => ({
            financialSupport: state.financialSupport.filter((s) => s.id !== id)
        })),    

      addInvestment: (investment) =>
        set((state) => ({ investments: [...state.investments, investment] })),

      updateInvestment: (id, updated) =>
        set((state) => ({
          investments: state.investments.map((i) =>
            i.id === id ? { ...i, ...updated } : i
          ),
        })),

      deleteInvestment: (id) =>
        set((state) => ({
          investments: state.investments.filter((i) => i.id !== id),
        })),

      addInvestmentEntry: (investmentId, entry) =>
        set((state) => ({
          investments: state.investments.map((i) => {
            if (i.id === investmentId) {
              const newAmount = entry.type === 'contribution' 
                ? i.currentAmount + entry.amount 
                : i.currentAmount - entry.amount
              return {
                ...i,
                currentAmount: newAmount,
                history: [entry, ...i.history]
              }
            }
            return i
          })
        })),

      updateSettings: (newSettings) =>
        set((state) => ({ settings: { ...state.settings, ...newSettings } })),

      importData: (data) => set(() => ({ ...data })),

      resetData: () => set(() => initialState),
    }),
    {
      name: 'finance-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
)
