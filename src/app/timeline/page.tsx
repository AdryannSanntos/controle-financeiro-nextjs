"use client"

import { FilterBar } from "@/components/common/FilterBar"
import { SummaryCard } from "@/components/dashboard/SummaryCard"
import { FinancialTimeline } from "@/components/timeline/FinancialTimeline"
import { useFilter } from "@/contexts/FilterContext"
import { useFinanceStore } from "@/store/financeStore"
import { CalendarClock, History, LineChart } from "lucide-react"

export default function TimelinePage() {
  const { transactions } = useFinanceStore()
  const { filters, setPeriod, setDateRange, setType, setSearch, setAmountRange, resetFilters, filterTransactions } = useFilter()

  const filtered = filterTransactions(transactions)
  const pendingCount = filtered.filter(t => t.status === 'pending').length
  const totalBalance = filtered.reduce((acc, t) => t.type === 'income' ? acc + t.amount : acc - t.amount, 0)

  return (
    <div className="flex-1 space-y-6">
      <div className="flex flex-col gap-2">
        <h2 className="text-3xl font-bold tracking-tight">
          Linha do Tempo
        </h2>
        <p className="text-muted-foreground">
          Visualize todos os seus eventos financeiros passados e futuros em um único lugar.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <SummaryCard 
            title="Total de Eventos" 
            amount={filtered.length} 
            icon={History} 
            description="Transações filtradas"
            isCurrency={false}
        />
        <SummaryCard 
            title="Pendências" 
            amount={pendingCount} 
            icon={CalendarClock} 
            description="Contagem de ações"
            className={pendingCount > 0 ? "text-yellow-600" : ""}
            isCurrency={false}
        />
        <SummaryCard 
            title="Saldo no Período" 
            amount={totalBalance} 
            icon={LineChart} 
            description="Fluxo de caixa líquido"
            className={totalBalance < 0 ? "text-red-500" : "text-primary"}
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

      <FinancialTimeline />
    </div>
  )
}
