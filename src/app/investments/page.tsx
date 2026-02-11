"use client"

import { FilterBar } from "@/components/common/FilterBar"
import { InvestmentAllocation } from "@/components/investments/InvestmentAllocation"
import { InvestmentDialog } from "@/components/investments/InvestmentDialog"
import { InvestmentList } from "@/components/investments/InvestmentList"
import { InvestmentProjections } from "@/components/investments/InvestmentProjections"
import { InvestmentSummary } from "@/components/investments/InvestmentSummary"
import { Card, CardContent } from "@/components/ui/card"
import { useFilter } from "@/contexts/FilterContext"
import { generateFinancialInsights } from "@/lib/intelligence"
import { useFinanceStore } from "@/store/financeStore"
import { AlertCircle, Lightbulb } from "lucide-react"

export default function InvestmentsPage() {
  const store = useFinanceStore()
  const { filters, setPeriod, setDateRange, setType, setSearch, setAmountRange, resetFilters } = useFilter()
  
  const filteredInvestments = store.investments.filter(i => {
      if (filters.search) {
          const searchLower = filters.search.toLowerCase()
          return i.name.toLowerCase().includes(searchLower) || i.type.toLowerCase().includes(searchLower)
      }
      return true
  })

  const insights = generateFinancialInsights(store)
  const investmentInsights = insights.filter(i => 
    i.title.includes('Reserva') || i.title.includes('Concentração')
  )

  const totalInvested = filteredInvestments.reduce((sum, i) => sum + i.currentAmount, 0)

  return (
    <div className="flex-1 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Investimentos</h2>
          <p className="text-muted-foreground">Gerencie seu patrimônio e acompanhe sua rentabilidade.</p>
        </div>
        <InvestmentDialog />
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

      <InvestmentSummary investments={filteredInvestments} />

      {investmentInsights.length > 0 && (
         <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {investmentInsights.map((insight, idx) => (
                <Card key={idx} className={`border-none ${insight.type === 'warning' ? 'bg-yellow-500/10' : 'bg-primary/10'}`}>
                    <CardContent className="pt-6">
                        <div className="flex gap-3">
                            {insight.type === 'warning' ? (
                                <AlertCircle className="h-5 w-5 text-yellow-600 shrink-0" />
                            ) : (
                                <Lightbulb className="h-5 w-5 text-primary shrink-0" />
                            )}
                            <div className="space-y-1">
                                <p className={`font-bold text-sm ${insight.type === 'warning' ? 'text-yellow-700' : 'text-primary'}`}>
                                    {insight.title}
                                </p>
                                <p className="text-xs text-muted-foreground leading-relaxed">
                                    {insight.message}
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            ))}
         </div>
      )}

      <div className="grid gap-6 grid-cols-1 xl:grid-cols-3">
        <InvestmentList investments={filteredInvestments} />
        <InvestmentAllocation investments={filteredInvestments} />
      </div>

      <InvestmentProjections currentTotal={totalInvested} />
    </div>
  )
}
