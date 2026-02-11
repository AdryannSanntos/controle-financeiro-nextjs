"use client"

import { FilterBar } from "@/components/common/FilterBar"
import { SummaryCard } from "@/components/dashboard/SummaryCard"
import { SupportDialog } from "@/components/support/SupportDialog"
import { SupportList } from "@/components/support/SupportList"
import { useFilter } from "@/contexts/FilterContext"
import { useFinanceStore } from "@/store/financeStore"
import { isWithinInterval } from "date-fns"
import { HandHelping, Landmark, PiggyBank } from "lucide-react"

export default function SupportPage() {
  const { financialSupport, transactions } = useFinanceStore()
  const { filters, setPeriod, setDateRange, setType, setSearch, setAmountRange, resetFilters } = useFilter()
  
  const filteredSupport = financialSupport.filter(s => {
      if (filters.dateRange) {
          const supportDate = new Date(s.month + '-01')
          if (!isWithinInterval(supportDate, { 
              start: filters.dateRange.from, 
              end: filters.dateRange.to 
          })) return false
      }
      if (filters.search) {
          const searchLower = filters.search.toLowerCase()
          return s.notes?.toLowerCase().includes(searchLower) || s.month.includes(searchLower)
      }
      return true
  })

  // Calculate stats
  const totalReceived = filteredSupport.reduce((acc, curr) => acc + curr.amount, 0)
  
  const supportExpenses = transactions
    .filter(t => t.paidBySupport && t.type === 'expense')
    .reduce((acc, t) => acc + t.amount, 0)
  
  const surplus = totalReceived - supportExpenses
  const average = financialSupport.length > 0 ? totalReceived / (financialSupport.length || 1) : 0

  const sortedSupport = [...filteredSupport].sort((a, b) => b.month.localeCompare(a.month))

  return (
    <div className="flex-1 space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Apoio Financeiro</h2>
        <SupportDialog />
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <SummaryCard 
            title="Total Recebido" 
            amount={totalReceived} 
            icon={Landmark} 
            description="Histórico total"
        />
        <SummaryCard 
            title="Média por Envio" 
            amount={average} 
            icon={HandHelping} 
            description="Valor médio recebido"
        />
        <SummaryCard 
            title="Sobra no Fundo" 
            amount={surplus} 
            icon={PiggyBank} 
            description="Apoio - Gastos pagos"
            className={surplus < 0 ? "text-red-500" : "text-primary"}
        />
      </div>

      <FilterBar 
        filters={filters}
        onPeriodChange={setPeriod}
        onDateRangeChange={(range) => range && setDateRange(range)}
        onTypeChange={setType}
        onSearchChange={setSearch}
        onAmountRangeChange={setAmountRange}
        onReset={resetFilters}
      />

      <SupportList supports={sortedSupport} />
    </div>
  )
}
