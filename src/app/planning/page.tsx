"use client"

import { SummaryCard } from "@/components/dashboard/SummaryCard"
import { BudgetCard } from "@/components/planning/BudgetCard"
import { EXPENSE_CATEGORIES } from "@/lib/constants"
import { useFinanceStore } from "@/store/financeStore"
import { endOfMonth, isWithinInterval, startOfMonth } from "date-fns"
import { AlertCircle, Scale, Target, TrendingUp } from "lucide-react"

export default function PlanningPage() {
  const { transactions, budgets, settings } = useFinanceStore()
  
  const currentDate = new Date()
  const monthStart = startOfMonth(currentDate)
  const monthEnd = endOfMonth(currentDate)
  
  const currentMonthExpenses = transactions.filter((t: any) => 
    t.type === 'expense' &&
    isWithinInterval(new Date(t.date), { start: monthStart, end: monthEnd })
  )

  const currentMonthIncomes = transactions.filter((t: any) => 
    t.type === 'income' &&
    isWithinInterval(new Date(t.date), { start: monthStart, end: monthEnd })
  )

  // Calculate spent per category
  const spentByCategory: Record<string, number> = {}
  currentMonthExpenses.forEach((t: any) => {
      spentByCategory[t.category] = (spentByCategory[t.category] || 0) + t.amount
  })

  // Defaults references
  const defaultBudgets: Record<string, number> = {
      alimentacao: 800,
      transporte: 350,
      lazer: 200,
      aluguel: 2500
  }

  const sumOfBudgets = EXPENSE_CATEGORIES.reduce((acc, cat) => {
    const budget = budgets.find(b => b.category === cat.value)
    return acc + (budget ? budget.limit : (defaultBudgets[cat.value] || 0))
  }, 0)

  const totalOtherIncomes = currentMonthIncomes.reduce((acc, t: any) => acc + t.amount, 0)
  const totalRevenue = settings.monthlySalary + totalOtherIncomes
  const remainingBudget = totalRevenue - sumOfBudgets

  return (
    <div className="flex-1 space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Planejamento & Metas</h2>
      </div>
      <p className="text-muted-foreground">
          Defina limites para seus gastos mensais. O sistema irá alertá-lo quando você ultrapassar.
      </p>

      <div className="grid gap-4 md:grid-cols-3">
        <SummaryCard 
            title="Total Planejado" 
            amount={sumOfBudgets} 
            icon={Target} 
            description="Soma dos seus limites"
        />
        <SummaryCard 
            title="Receita Prevista" 
            amount={totalRevenue} 
            icon={TrendingUp} 
            description="Salário + Outras receitas"
        />
        <SummaryCard 
            title="Margem de Segurança" 
            amount={remainingBudget} 
            icon={Scale} 
            description="Opcional p/ Investimentos"
            className={remainingBudget < 0 ? "text-red-500" : "text-green-600"}
        />
      </div>

      {sumOfBudgets > totalRevenue && totalRevenue > 0 && (
          <div className="bg-red-500/10 border border-red-500/20 p-4 rounded-xl flex items-start gap-3">
              <AlertCircle className="h-5 w-5 text-red-600 shrink-0 mt-0.5" />
              <div className="space-y-1">
                  <p className="font-bold text-red-700 text-sm">Orçamento acima da Renda</p>
                  <p className="text-xs text-red-600/80 leading-relaxed">
                      A soma dos seus limites planejados ({new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(sumOfBudgets)}) 
                      é maior que o sua receita total prevista ({new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(totalRevenue)}). 
                      Considere ajustar seus limites para não comprometer sua saúde financeira.
                  </p>
              </div>
          </div>
      )}

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {EXPENSE_CATEGORIES.map(cat => {
            const budget = budgets.find(b => b.category === cat.value)
            const limit = budget ? budget.limit : (defaultBudgets[cat.value] || 0)
            const spent = spentByCategory[cat.value] || 0
            
            return (
                <BudgetCard 
                    key={cat.value}
                    category={cat.value}
                    label={cat.label}
                    spent={spent}
                    limit={limit}
                />
            )
        })}
      </div>
    </div>
  )
}
