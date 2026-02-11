import { Transaction } from '@/types/finance'
import { endOfMonth, isWithinInterval, parseISO, startOfMonth } from 'date-fns'
import { useCallback, useState } from 'react'

export type FilterPeriod = 'this_month' | 'last_month' | 'last_3_months' | 'this_year' | 'all_time' | 'custom'
export type FilterType = 'all' | 'income' | 'expense' | 'investment'

export interface FilterState {
  period: FilterPeriod
  dateRange: { from: Date; to: Date }
  type: FilterType
  categories: string[]
  search: string
  minAmount?: number
  maxAmount?: number
}

const getInitialDateRange = (period: FilterPeriod) => {
  const now = new Date()
  switch (period) {
    case 'this_month':
      return { from: startOfMonth(now), to: endOfMonth(now) }
    case 'last_month':
      const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1)
      return { from: startOfMonth(lastMonth), to: endOfMonth(lastMonth) }
    case 'last_3_months':
      const threeMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 2, 1)
      return { from: startOfMonth(threeMonthsAgo), to: endOfMonth(now) }
    case 'this_year':
      return { from: new Date(now.getFullYear(), 0, 1), to: endOfMonth(now) }
    case 'all_time':
      return { from: new Date(1970, 0, 1), to: new Date(2100, 11, 31) }
    default:
      return { from: startOfMonth(now), to: endOfMonth(now) }
  }
}

export function useFinancialFilters() {
  const [filters, setFilters] = useState<FilterState>({
    period: 'all_time',
    dateRange: getInitialDateRange('all_time'),
    type: 'all',
    categories: [],
    search: '',
  })

  const setPeriod = useCallback((period: FilterPeriod) => {
    setFilters(prev => ({
      ...prev,
      period,
      dateRange: period !== 'custom' ? getInitialDateRange(period) : prev.dateRange
    }))
  }, [])

  const setDateRange = useCallback((range: { from: Date; to: Date }) => {
    setFilters(prev => ({
      ...prev,
      period: 'custom',
      dateRange: range
    }))
  }, [])

  const setType = useCallback((type: FilterType) => {
    setFilters(prev => ({ ...prev, type }))
  }, [])

  const setSearch = useCallback((search: string) => {
    setFilters(prev => ({ ...prev, search }))
  }, [])

  const setAmountRange = useCallback((min?: number, max?: number) => {
    setFilters(prev => ({ ...prev, minAmount: min, maxAmount: max }))
  }, [])

  const filterTransactions = useCallback((transactions: Transaction[]) => {
    return transactions.filter(t => {
      // Date Filter
      const dateParams = { start: filters.dateRange.from, end: filters.dateRange.to }
      if (!isWithinInterval(parseISO(t.date), dateParams)) return false

      // Type Filter
      if (filters.type !== 'all') {
        if (filters.type === 'income' && t.type !== 'income') return false
        if (filters.type === 'expense' && t.type !== 'expense') return false
        if (filters.type === 'investment') return false 
      }

      // Amount Filter
      if (filters.minAmount !== undefined && t.amount < filters.minAmount) return false
      if (filters.maxAmount !== undefined && t.amount > filters.maxAmount) return false

      // Search Filter
      if (filters.search) {
        const searchLower = filters.search.toLowerCase()
        return (
          t.description.toLowerCase().includes(searchLower) ||
          t.category.toLowerCase().includes(searchLower)
        )
      }

      return true
    })
  }, [filters])
  
  const resetFilters = useCallback(() => {
      setFilters({
        period: 'all_time',
        dateRange: getInitialDateRange('all_time'),
        type: 'all',
        categories: [],
        search: '',
        minAmount: undefined,
        maxAmount: undefined,
      })
  }, [])

  return {
    filters,
    setPeriod,
    setDateRange,
    setType,
    setSearch,
    setAmountRange,
    filterTransactions,
    resetFilters
  }
}
