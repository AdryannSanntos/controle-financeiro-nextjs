"use client"

import { FilterBar } from "@/components/common/FilterBar"
import { SummaryCard } from "@/components/dashboard/SummaryCard"
import { TransactionDialog } from "@/components/transactions/TransactionDialog"
import { TransactionList } from "@/components/transactions/TransactionList"
import { useFilter } from "@/contexts/FilterContext"
import { useFinanceStore } from "@/store/financeStore"
import { HeartHandshake, Receipt, Wallet } from "lucide-react"

export default function ExpensesPage() {
  const transactions = useFinanceStore((state) => state.transactions)
  const { filters, setPeriod, setDateRange, setType, setSearch, setAmountRange, resetFilters, filterTransactions } = useFilter()

  const expenseTransactions = filterTransactions(transactions)
    .filter((t) => t.type === "expense")
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

  const totalExpense = expenseTransactions.reduce((acc, t) => acc + t.amount, 0)
  const personalExpense = expenseTransactions.filter(t => !t.paidBySupport).reduce((acc, t) => acc + t.amount, 0)
  const supportExpense = expenseTransactions.filter(t => t.paidBySupport).reduce((acc, t) => acc + t.amount, 0)

  return (
    <div className="flex-1 space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Despesas</h2>
        <TransactionDialog type="expense" />
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <SummaryCard 
            title="Total em Despesas" 
            amount={totalExpense} 
            icon={Receipt} 
            description="No período selecionado"
        />
        <SummaryCard 
            title="Despesas Pessoais" 
            amount={personalExpense} 
            icon={Wallet} 
            description="Sua responsabilidade"
        />
        <SummaryCard 
            title="Pagas por Apoio" 
            amount={supportExpense} 
            icon={HeartHandshake} 
            description="Coberto pelos pais"
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

      <TransactionList transactions={expenseTransactions} type="expense" />
    </div>
  )
}
