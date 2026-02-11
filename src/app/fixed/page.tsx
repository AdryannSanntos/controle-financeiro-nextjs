"use client"

import { FilterBar } from "@/components/common/FilterBar"
import { SummaryCard } from "@/components/dashboard/SummaryCard"
import { FixedExpenseDialog } from "@/components/fixed/FixedExpenseDialog"
import { FixedExpenseList } from "@/components/fixed/FixedExpenseList"
import { useFilter } from "@/contexts/FilterContext"
import { useFinanceStore } from "@/store/financeStore"
import { CreditCard, HeartHandshake, Percent, Wallet } from "lucide-react"

export default function FixedExpensesPage() {
  const { fixedExpenses, settings } = useFinanceStore()
  const { filters, setPeriod, setDateRange, setType, setSearch, setAmountRange, resetFilters } = useFilter()
  
  const filteredExpenses = fixedExpenses.filter(e => {
      if (filters.search) {
          const searchLower = filters.search.toLowerCase()
          return e.name.toLowerCase().includes(searchLower) || e.category.toLowerCase().includes(searchLower)
      }
      return true
  })

  const totalFixed = filteredExpenses.reduce((acc, curr) => acc + curr.amount, 0)
  const personalFixed = filteredExpenses.filter(e => !e.paidBySupport).reduce((acc, curr) => acc + curr.amount, 0)
  const supportFixed = filteredExpenses.filter(e => e.paidBySupport).reduce((acc, curr) => acc + curr.amount, 0)
  
  const commitment = settings.monthlySalary > 0 
    ? (personalFixed / settings.monthlySalary) * 100 
    : 0

  return (
    <div className="flex-1 space-y-6">
      <div className="flex items-center justify-between">
        <div>
            <h2 className="text-3xl font-bold tracking-tight">Gastos Fixos</h2>
            <p className="text-muted-foreground text-sm">Suas contas recorrentes e compromissos mentais.</p>
        </div>
        <FixedExpenseDialog />
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <SummaryCard 
            title="Total Mensal" 
            amount={totalFixed} 
            icon={CreditCard} 
            description="Todos os fixos"
        />
        <SummaryCard 
            title="Sua Cota (Eu)" 
            amount={personalFixed} 
            icon={Wallet} 
            description="Pago por você"
        />
        <SummaryCard 
            title="Cota Apoio" 
            amount={supportFixed} 
            icon={HeartHandshake} 
            description="Pago pelos pais"
            className="text-primary"
        />
        <div className="rounded-xl border bg-card text-card-foreground shadow">
            <div className="p-6 flex flex-row items-center justify-between space-y-0 pb-2">
                <h3 className="text-sm font-medium tracking-tight">Comprometimento</h3>
                <Percent className="h-4 w-4 text-muted-foreground" />
            </div>
            <div className="p-6 pt-0">
                <div className="text-2xl font-bold">{commitment.toFixed(1)}%</div>
                <p className="text-xs text-muted-foreground">Do seu salário real</p>
            </div>
        </div>
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

      <FixedExpenseList expenses={filteredExpenses} />
    </div>
  )
}
