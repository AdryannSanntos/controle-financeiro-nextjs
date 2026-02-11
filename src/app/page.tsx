"use client"

import { FilterBar } from "@/components/common/FilterBar"
import { CategoryPieChart } from "@/components/dashboard/CategoryPieChart"
import { OverviewChart } from "@/components/dashboard/OverviewChart"
import { SummaryCard } from "@/components/dashboard/SummaryCard"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { useFilter } from "@/contexts/FilterContext"
import { generateFinancialInsights } from "@/lib/intelligence"
import { useFinanceStore } from "@/store/financeStore"
import { endOfMonth, format, isWithinInterval, startOfMonth, subMonths } from "date-fns"
import { ptBR } from "date-fns/locale"
import { AlertCircle, Lightbulb, PiggyBank, TrendingDown, TrendingUp, Wallet } from "lucide-react"
import { useMemo } from "react"

export default function Dashboard() {
  const store = useFinanceStore()
  const { transactions, financialSupport, settings, investments, fixedExpenses } = store
  const { filters, setPeriod, setDateRange, setType, setSearch, setAmountRange, resetFilters, filterTransactions: filterTx } = useFilter()
  
  const currentDate = new Date()

  const filteredTransactions = filterTx(transactions)

  // Calculate personal vs support finances
  const personalIncome = filteredTransactions
    .filter(t => t.type === 'income' && !t.paidBySupport)
    .reduce((acc, t) => acc + t.amount, 0)
    
  const supportExpenses = filteredTransactions
    .filter(t => t.type === 'expense' && t.paidBySupport)
    .reduce((acc, t) => acc + t.amount, 0)

  const personalExpenses = filteredTransactions
    .filter(t => t.type === 'expense' && !t.paidBySupport)
    .reduce((acc, t) => acc + t.amount, 0)

  const supportIncome = financialSupport
    .filter(s => {
      if (!filters.dateRange) return true
      const supportDate = new Date(s.month + '-01')
      return isWithinInterval(supportDate, { 
          start: filters.dateRange.from, 
          end: filters.dateRange.to 
      })
    })
    .reduce((acc, s) => acc + s.amount, 0)

  const personalBalance = personalIncome - personalExpenses
  const supportBalance = supportIncome - supportExpenses

  const totalInvested = investments.reduce((sum, inv) => sum + inv.currentAmount, 0)
  const emergencyFundProgress = settings.emergencyFundGoal > 0 
    ? (totalInvested / settings.emergencyFundGoal) * 100 
    : 0

  const insights = generateFinancialInsights(store)

  // Chart Data Preparation
  const chartData = useMemo(() => {
    const data = []
    for (let i = 5; i >= 0; i--) {
        const d = subMonths(currentDate, i)
        const start = startOfMonth(d)
        const end = endOfMonth(d)
        
        const monthTrans = transactions.filter(t => 
            isWithinInterval(new Date(t.date), { start, end })
        )
        
        const inc = monthTrans
          .filter(t => t.type === 'income' && !t.paidBySupport)
          .reduce((acc, t) => acc + t.amount, 0)
          
        const exp = monthTrans
          .filter(t => t.type === 'expense' && !t.paidBySupport)
          .reduce((acc, t) => acc + t.amount, 0)
        
        data.push({
            name: format(d, 'MMM', { locale: ptBR }),
            income: inc,
            expense: exp
        })
    }
    return data
  }, [transactions])

  const categoryData = useMemo(() => {
      const expenseTrans = filteredTransactions.filter(t => t.type === 'expense' && !t.paidBySupport)
      const categories: Record<string, number> = {}
      
      expenseTrans.forEach(t => {
          categories[t.category] = (categories[t.category] || 0) + t.amount
      })
      
      const colors = [
          "hsl(var(--chart-1))", "hsl(var(--chart-2))", "hsl(var(--chart-3))", "hsl(var(--chart-4))", "hsl(var(--chart-5))"
      ]
      
      return Object.entries(categories).map(([name, value], index) => ({
          name,
          value,
          color: colors[index % colors.length] || "#8884d8"
      }))
  }, [filteredTransactions])

  return (
    <div className="flex-1 space-y-6">
      <div className="flex flex-col gap-2">
        <h2 className="text-3xl font-bold tracking-tight">
          Olá, {settings.userName || 'Investidor'} 👋
        </h2>
        <p className="text-muted-foreground">
            Visão geral das suas finanças.
        </p>
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

      {insights.length > 0 && (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {insights.slice(0, 3).map((insight, idx) => (
                <Card key={idx} className={`border-none ${insight.type === 'warning' ? 'bg-yellow-500/10' : insight.type === 'success' ? 'bg-green-500/10' : 'bg-primary/10'}`}>
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

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
        <SummaryCard 
            title="Economia Pessoal" 
            amount={personalIncome} 
            icon={TrendingUp} 
            description="Seu salário/receitas"
        />
        <SummaryCard 
            title="Gastos Pessoais" 
            amount={personalExpenses} 
            icon={TrendingDown} 
            description="Exclui apoio"
        />
        <SummaryCard 
            title="Sobra Real" 
            amount={personalBalance} 
            icon={PiggyBank} 
            description="Sua economia real"
        />
        <SummaryCard 
            title="Saldo de Apoio" 
            amount={supportBalance} 
            icon={Wallet} 
            description="Fundo dos pais"
            className={supportBalance < 0 ? "text-red-500" : "text-primary"}
        />
        <SummaryCard 
            title="Patrimônio Total" 
            amount={totalInvested} 
            icon={PiggyBank} 
            description="Total em ativos"
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <div className="col-span-4 space-y-4">
            <OverviewChart data={chartData} />
            
            <Card>
                <CardHeader>
                    <CardTitle className="text-lg">Reserva de Emergência</CardTitle>
                    <CardDescription>Meta: {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(settings.emergencyFundGoal)}</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        <Progress value={emergencyFundProgress} className="h-2" />
                        <div className="flex justify-between text-sm text-muted-foreground">
                            <span>{emergencyFundProgress.toFixed(1)}% concluído</span>
                            <span>Faltam {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(Math.max(0, settings.emergencyFundGoal - totalInvested))}</span>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
        
        <div className="col-span-3 space-y-4">
            <CategoryPieChart data={categoryData} />
            
            <Card>
                <CardHeader>
                    <CardTitle className="text-lg">Saúde Financeira</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Salário vs Gastos Fixos</span>
                        <span className="font-bold">
                            {settings.monthlySalary > 0 
                                ? ((fixedExpenses.filter(e => !e.paidBySupport).reduce((s, e) => s + e.amount, 0) / settings.monthlySalary) * 100).toFixed(0)
                                : 0}% 
                        </span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Comprometimento Aluguel</span>
                        <span className="font-bold">
                             {settings.monthlySalary > 0 
                                ? ((settings.rentAmount / settings.monthlySalary) * 100).toFixed(0)
                                : 0}%
                        </span>
                    </div>
                    <p className="text-[10px] text-muted-foreground italic mt-4 text-center">
                        Calculado com base no seu perfil configurado.
                    </p>
                </CardContent>
            </Card>
        </div>
      </div>
    </div>
  )
}
