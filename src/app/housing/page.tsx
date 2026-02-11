"use client"

import { FilterBar } from "@/components/common/FilterBar"
import { TransactionDialog } from "@/components/transactions/TransactionDialog"
import { TransactionList } from "@/components/transactions/TransactionList"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useFilter } from "@/contexts/FilterContext"
import { useFinanceStore } from "@/store/financeStore"
import { format, isAfter, isSameMonth, setDate } from "date-fns"
import { AlertCircle, CheckCircle, Clock } from "lucide-react"

export default function HousingPage() {
  const { transactions, settings } = useFinanceStore()
  const { filters, setPeriod, setDateRange, setType, setSearch, setAmountRange, resetFilters, filterTransactions } = useFilter()

  // Filter for 'aluguel' category
  const rentTransactions = filterTransactions(transactions)
    .filter((t) => t.category === "aluguel")
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

  // Check current month status
  const currentDate = new Date()
  const currentRent = rentTransactions.find(t => isSameMonth(new Date(t.date), currentDate))
  
  const isPaid = currentRent?.status === 'paid'
  const dueDate = setDate(currentDate, settings.rentDueDate || 10)
  
  // Status Logic
  let statusColor = "text-muted-foreground"
  let statusText = "Pendente"
  let StatusIcon = Clock

  if (isPaid) {
      statusColor = "text-green-600"
      statusText = "Pago"
      StatusIcon = CheckCircle
  } else if (isAfter(currentDate, dueDate)) {
      statusColor = "text-red-600"
      statusText = "Atrasado"
      StatusIcon = AlertCircle
  } else {
      statusColor = "text-yellow-600"
      statusText = "Próximo do Vencimento"
      StatusIcon = Clock
  }

  return (
    <div className="flex-1 space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Aluguel & Moradia</h2>
        <TransactionDialog 
            type="expense" 
            defaultValues={{ 
                category: "aluguel", 
                amount: settings.rentAmount, 
                description: "Aluguel Mensal" 
            }} 
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

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Status do Mês</CardTitle>
                <StatusIcon className={`h-4 w-4 ${statusColor}`} />
            </CardHeader>
            <CardContent>
                <div className={`text-2xl font-bold ${statusColor}`}>{statusText}</div>
                <p className="text-xs text-muted-foreground">
                    Vencimento: {format(dueDate, "dd/MM/yyyy")}
                </p>
            </CardContent>
        </Card>
        
        <Card>
             <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Valor Base</CardTitle>
            </CardHeader>
             <CardContent>
                <div className="text-2xl font-bold">
                    {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(settings.rentAmount)}
                </div>
                 <p className="text-xs text-muted-foreground">
                    Valor fixo configurado
                </p>
             </CardContent>
        </Card>
      </div>

      <div className="space-y-2">
          <h3 className="text-lg font-semibold">Histórico de Pagamentos</h3>
          <TransactionList transactions={rentTransactions} type="expense" />
      </div>
    </div>
  )
}
