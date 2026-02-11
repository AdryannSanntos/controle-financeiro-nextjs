"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CurrencyInput } from "@/components/ui/currency-input"
import { Progress } from "@/components/ui/progress"
import { useFinanceStore } from "@/store/financeStore"
import { Edit2, Save, X } from "lucide-react"
import { useState } from "react"
import { toast } from "sonner"

interface BudgetCardProps {
  category: string
  label: string
  spent: number
  limit: number
}

export function BudgetCard({ category, label, spent, limit }: BudgetCardProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [newLimit, setNewLimit] = useState(limit)
  const setBudget = useFinanceStore((state) => state.setBudget)

  const progress = limit > 0 ? (spent / limit) * 100 : 0
  const isOverBudget = spent > limit && limit > 0

  const handleSave = () => {
    const val = newLimit
    if (val < 0) {
        toast.error("Valor inválido")
        return
    }
    setBudget({
        category,
        limit: val,
        period: "monthly"
    })
    setIsEditing(false)
    toast.success("Orçamento atualizado")
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{label}</CardTitle>
        {isEditing ? (
            <div className="flex items-center gap-2">
                <Button size="icon" variant="ghost" className="h-6 w-6" onClick={handleSave}>
                    <Save className="h-4 w-4 text-green-600" />
                </Button>
                <Button size="icon" variant="ghost" className="h-6 w-6" onClick={() => setIsEditing(false)}>
                    <X className="h-4 w-4 text-red-600" />
                </Button>
            </div>
        ) : (
            <Button size="icon" variant="ghost" className="h-6 w-6" onClick={() => setIsEditing(true)}>
                <Edit2 className="h-3 w-3" />
            </Button>
        )}
      </CardHeader>
      <CardContent>
        <div className="flex items-end justify-between mb-2">
            <div>
                <span className={`text-2xl font-bold ${isOverBudget ? "text-red-600" : ""}`}>
                    {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(spent)}
                </span>
                <span className="text-muted-foreground text-sm ml-2">
                    de {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(limit)}
                </span>
            </div>
        </div>
        
        {isEditing && (
             <div className="mb-2">
                <CurrencyInput 
                    value={newLimit} 
                    onChange={setNewLimit} 
                    className="h-8"
                />
            </div>
        )}

        <Progress value={progress} className={`h-2 ${isOverBudget ? "[&>div]:bg-red-600" : ""}`} />
        <p className="text-xs text-muted-foreground mt-2">
            {progress.toFixed(0)}% utilizado
        </p>
      </CardContent>
    </Card>
  )
}
