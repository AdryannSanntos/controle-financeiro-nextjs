"use client"

import { Button } from "@/components/ui/button"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { EXPENSE_CATEGORIES } from "@/lib/constants"
import { useFinanceStore } from "@/store/financeStore"
import { FixedExpense } from "@/types/finance"
import { HelpCircle, Trash2 } from "lucide-react"
import { toast } from "sonner"
import { FixedExpenseDialog } from "./FixedExpenseDialog"

interface FixedExpenseListProps {
  expenses: FixedExpense[]
}

export function FixedExpenseList({ expenses }: FixedExpenseListProps) {
  const deleteFixedExpense = useFinanceStore((state) => state.deleteFixedExpense)

  const handleDelete = (id: string) => {
    if (confirm("Tem certeza que deseja remover este gasto fixo?")) {
        deleteFixedExpense(id)
        toast.success("Gasto fixo removido")
    }
  }

  const getCategoryLabel = (catValue: string) => {
      return EXPENSE_CATEGORIES.find(c => c.value === catValue)?.label || catValue
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Dia Venc.</TableHead>
            <TableHead>Nome</TableHead>
            <TableHead>Categoria</TableHead>
            <TableHead>Valor</TableHead>
            <TableHead className="text-right">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {expenses.length === 0 ? (
            <TableRow>
              <TableCell colSpan={5} className="text-center h-24 text-muted-foreground">
                Nenhum gasto fixo cadastrado.
              </TableCell>
            </TableRow>
          ) : (
            expenses.map((expense) => (
              <TableRow key={expense.id}>
                <TableCell className="font-medium">Dia {expense.dayDue}</TableCell>
                <TableCell>
                  <div className="flex flex-col">
                    <span className="font-medium">{expense.name}</span>
                    {expense.paidBySupport && (
                      <span className="text-[10px] text-primary flex items-center gap-1 mt-1 bg-primary/10 w-fit px-1.5 py-0.5 rounded">
                        <HelpCircle className="h-2.5 w-2.5" />
                        Apoio Financeiro
                      </span>
                    )}
                  </div>
                </TableCell>
                <TableCell>{getCategoryLabel(expense.category)}</TableCell>
                <TableCell>
                  {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(expense.amount)}
                </TableCell>
                <TableCell className="text-right">
                  <FixedExpenseDialog 
                    id={expense.id} 
                    defaultValues={expense} 
                  />
                  <Button variant="ghost" size="icon" onClick={() => handleDelete(expense.id)}>
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  )
}
