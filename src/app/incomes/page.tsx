"use client"

import { FilterBar } from "@/components/common/FilterBar"
import { SummaryCard } from "@/components/dashboard/SummaryCard"
import { TransactionDialog } from "@/components/transactions/TransactionDialog"
import { TransactionList } from "@/components/transactions/TransactionList"
import { useFilter } from "@/contexts/FilterContext"
import { useFinanceStore } from "@/store/financeStore"
import { Banknote, TrendingUp, Zap } from "lucide-react"

export default function IncomesPage() {
  const { transactions, settings } = useFinanceStore()
  const { filters, setPeriod, setDateRange, setType, setSearch, setAmountRange, resetFilters, filterTransactions } = useFilter()

  const incomeTransactions = filterTransactions(transactions)
    .filter((t) => t.type === "income")
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

  const totalIncome = incomeTransactions.reduce((acc, t) => acc + t.amount, 0)
  const extraIncome = incomeTransactions
    .filter(t => t.category !== 'salario')
    .reduce((acc, t) => acc + t.amount, 0)

  return (
    <div className="flex-1 space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Receitas</h2>
        <TransactionDialog type="income" />
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <SummaryCard 
            title="Total Recebido" 
            amount={totalIncome} 
            icon={TrendingUp} 
            description="No período selecionado"
        />
        <SummaryCard 
            title="Salário Base" 
            amount={settings.monthlySalary} 
            icon={Banknote} 
            description="Valor fixo mensal"
        />
        <SummaryCard 
            title="Renda Extra" 
            amount={extraIncome} 
            icon={Zap} 
            description="Bonificações/Freelas"
            className="text-primary"
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

      <TransactionList transactions={incomeTransactions} type="income" />
    </div>
  )
}
