'use client'

import { FilterPeriod, FilterState, FilterType, useFinancialFilters } from '@/hooks/useFinancialFilters'
import { createContext, ReactNode, useContext } from 'react'

interface FilterContextType {
  filters: FilterState
  setPeriod: (period: FilterPeriod) => void
  setDateRange: (range: { from: Date; to: Date }) => void
  setType: (type: FilterType) => void
  setSearch: (search: string) => void
  setAmountRange: (min?: number, max?: number) => void
  resetFilters: () => void
  filterTransactions: (transactions: any[]) => any[]
}

const FilterContext = createContext<FilterContextType | undefined>(undefined)

export function FilterProvider({ children }: { children: ReactNode }) {
  const filterLogic = useFinancialFilters()

  return (
    <FilterContext.Provider value={filterLogic}>
      {children}
    </FilterContext.Provider>
  )
}

export function useFilter() {
  const context = useContext(FilterContext)
  if (context === undefined) {
    throw new Error('useFilter must be used within a FilterProvider')
  }
  return context
}
