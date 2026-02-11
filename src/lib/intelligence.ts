import { FinanceState, FinancialInsight, Investment } from "@/types/finance"
import { startOfMonth } from "date-fns"

export function generateFinancialInsights(state: FinanceState): FinancialInsight[] {
  const insights: FinancialInsight[] = []
  const { settings, transactions, fixedExpenses, investments } = state

  // 1. Rent reminder
  const today = new Date()
  const currentDay = today.getDate()
  if (settings.rentDueDate > 0) {
    const daysUntilRent = settings.rentDueDate - currentDay
    if (daysUntilRent >= 0 && daysUntilRent <= 3) {
      insights.push({
        type: 'warning',
        title: 'Aluguel Próximo',
        message: `O vencimento do seu aluguel é em ${daysUntilRent === 0 ? 'hoje' : daysUntilRent + ' dias'}.`
      })
    }
  }

  // 2. Emergency Fund Progress
  const totalInvested = investments.reduce((sum, inv) => sum + inv.currentAmount, 0)
  if (settings.emergencyFundGoal > 0) {
    const progress = (totalInvested / settings.emergencyFundGoal) * 100
    if (progress < 20) {
      insights.push({
        type: 'info',
        title: 'Reserva de Emergência',
        message: `Você atingiu ${progress.toFixed(1)}% da sua meta. Continue focado!`
      })
    } else if (progress >= 100) {
        insights.push({
            type: 'success',
            title: 'Meta Batida!',
            message: `Parabéns! Você completou sua reserva de emergência.`
          })
    }
  }

  // 3. Investment Diversification
  if (investments.length > 0) {
    const byType = investments.reduce((acc, inv) => {
        acc[inv.type] = (acc[inv.type] || 0) + inv.currentAmount
        return acc
    }, {} as Record<string, number>)

    const maxType = Object.entries(byType).sort((a, b) => b[1] - a[1])[0]
    const concentration = (maxType[1] / totalInvested) * 100

    if (concentration > 70 && investments.length > 1) {
        insights.push({
            type: 'warning',
            title: 'Alta Concentração',
            message: `Seu portfólio está muito concentrado em ${maxType[0].replace('_', ' ')} (${concentration.toFixed(0)}%).`
        })
    }
  }

  // 4. Savings Rate (Excluding Support)
  const currentMonthTransactions = transactions.filter(t => 
    t.date.startsWith(startOfMonth(today).toISOString().slice(0, 7))
  )
  
  const personalMonthlyExpenses = currentMonthTransactions
    .filter(t => t.type === 'expense' && !t.paidBySupport)
    .reduce((sum, t) => sum + t.amount, 0)
  
  const personalMonthlyFixed = fixedExpenses
    .filter(e => !e.paidBySupport)
    .reduce((sum, e) => sum + e.amount, 0)
    
  const totalPersonalExpenses = personalMonthlyExpenses + personalMonthlyFixed
  
  if (settings.monthlySalary > 0) {
    const personalSavingsRate = ((settings.monthlySalary - totalPersonalExpenses) / settings.monthlySalary) * 100
    if (personalSavingsRate > 20) {
        insights.push({
            type: 'success',
            title: 'Ótima Taxa de Poupança',
            message: `Você está poupando ${personalSavingsRate.toFixed(0)}% do seu salário este mês (excluindo apoio).`
        })
    } else if (personalSavingsRate < 5 && personalSavingsRate > 0) {
        insights.push({
            type: 'info',
            title: 'Atenção aos Gastos',
            message: `Sua margem de sobra real (pessoal) este mês está baixa (${personalSavingsRate.toFixed(0)}%).`
        })
    }
  }

  return insights
}

export function calculatePortfolioScore(investments: Investment[]): number {
    if (investments.length === 0) return 0
    
    let score = 50 // Base score

    // Diversification factor
    const types = new Set(investments.map(i => i.type))
    score += (types.size * 10)

    // Consistency factor (simplified: number of assets)
    score += Math.min(investments.length * 2, 20)

    // Limit score to 100
    return Math.min(score, 100)
}
