"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { calculatePortfolioScore } from "@/lib/intelligence"
import { Investment } from "@/types/finance"
import { Activity, ArrowUpRight, ShieldCheck, Wallet } from "lucide-react"

interface InvestmentSummaryProps {
  investments: Investment[]
}

export function InvestmentSummary({ investments }: InvestmentSummaryProps) {
  const totalAmount = investments.reduce((sum, i) => sum + i.currentAmount, 0)
  const score = calculatePortfolioScore(investments)
  
  // Total contributions (simplified for demo/initial load)
  const totalInvested = investments.reduce((sum, inv) => {
    return sum + inv.history
        .filter(h => h.type === 'contribution')
        .reduce((s, h) => s + h.amount, 0)
  }, 0)
  
  const totalWithdrawals = investments.reduce((sum, inv) => {
    return sum + inv.history
        .filter(h => h.type === 'withdrawal')
        .reduce((s, h) => s + h.amount, 0)
  }, 0)

  const netInvested = totalInvested - totalWithdrawals
  const growth = totalAmount > netInvested ? totalAmount - netInvested : 0
  const growthPercent = netInvested > 0 ? (growth / netInvested) * 100 : 0

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card className="bg-primary text-primary-foreground border-none">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Patrimônio Total</CardTitle>
          <Wallet className="h-4 w-4 opacity-70" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(totalAmount)}
          </div>
          <p className="text-xs opacity-70 mt-1">
            {investments.length} ativos em carteira
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Rentabilidade Histórica</CardTitle>
          <ArrowUpRight className="h-4 w-4 text-green-500" />
        </CardHeader>
        <CardContent>
          <div className={`text-2xl font-bold ${growth > 0 ? "text-green-500" : ""}`}>
            {growth > 0 ? '+' : ''}
            {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(growth)}
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            <span className="text-green-500 font-medium">+{growthPercent.toFixed(1)}%</span> desde o início
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Portfólio Score</CardTitle>
          <ShieldCheck className={`h-4 w-4 ${score > 70 ? "text-green-500" : "text-yellow-500"}`} />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{score}/100</div>
          <div className="w-full bg-secondary h-1 rounded-full mt-2">
            <div 
              className={`h-full rounded-full transition-all ${score > 70 ? "bg-green-500" : "bg-yellow-500"}`} 
              style={{ width: `${score}%` }}
            />
          </div>
          <p className="text-xs text-muted-foreground mt-2 italic">
            {score > 75 ? 'Excelente diversificação!' : 'Considere diversificar mais.'}
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Aportes Mensais</CardTitle>
          <Activity className="h-4 w-4 text-primary" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
             {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(totalInvested / 12)}
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            Média estimada
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
