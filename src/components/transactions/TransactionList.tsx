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
import { EXPENSE_CATEGORIES, INCOME_TYPES } from "@/lib/constants"
import { useFinanceStore } from "@/store/financeStore"
import { Transaction } from "@/types/finance"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"
import { HelpCircle, Trash2 } from "lucide-react"
import { toast } from "sonner"
import { TransactionDialog } from "./TransactionDialog"

interface TransactionListProps {
  transactions: Transaction[]
  type: 'income' | 'expense'
}

export function TransactionList({ transactions, type }: TransactionListProps) {
  const deleteTransaction = useFinanceStore((state) => state.deleteTransaction)

  const handleDelete = (id: string) => {
    if (confirm("Tem certeza que deseja excluir este registro?")) {
        deleteTransaction(id)
        toast.success("Registro excluído com sucesso")
    }
  }

  const getCategoryLabel = (catValue: string) => {
      const list = type === 'income' ? INCOME_TYPES : EXPENSE_CATEGORIES
      return list.find(c => c.value === catValue)?.label || catValue
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Data</TableHead>
            <TableHead>{type === 'income' ? 'Tipo' : 'Categoria'}</TableHead>
            <TableHead>Descrição</TableHead>
            <TableHead>Valor</TableHead>
            {type === 'expense' && <TableHead>Status</TableHead>}
            <TableHead className="text-right">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {transactions.length === 0 ? (
            <TableRow>
              <TableCell colSpan={type === 'expense' ? 6 : 5} className="text-center h-24 text-muted-foreground">
                Nenhum registro encontrado.
              </TableCell>
            </TableRow>
          ) : (
            transactions.map((transaction) => (
              <TableRow key={transaction.id}>
                <TableCell>{format(new Date(transaction.date), "dd/MM/yyyy", { locale: ptBR })}</TableCell>
                <TableCell>{getCategoryLabel(transaction.category)}</TableCell>
                <TableCell>
                    <div className="flex flex-col">
                        <span className="font-medium">{transaction.description || "Sem descrição"}</span>
                        {transaction.paidBySupport && (
                            <span className="text-[10px] text-primary flex items-center gap-1 mt-1 bg-primary/10 w-fit px-1.5 py-0.5 rounded">
                                <HelpCircle className="h-2.5 w-2.5" />
                                Apoio Financeiro
                            </span>
                        )}
                    </div>
                </TableCell>
                <TableCell className={type === 'income' ? "text-green-600" : "text-red-600"}>
                  {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(transaction.amount)}
                </TableCell>
                {type === 'expense' && (
                    <TableCell>
                        <span className={`px-2 py-1 rounded text-xs ${transaction.status === 'paid' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                            {transaction.status === 'paid' ? 'Pago' : 'Pendente'}
                        </span>
                    </TableCell>
                )}
                <TableCell className="text-right">
                  <TransactionDialog 
                    type={transaction.type} 
                    id={transaction.id} 
                    defaultValues={{
                        ...transaction,
                        date: new Date(transaction.date)
                    }} 
                  />
                  <Button variant="ghost" size="icon" onClick={() => handleDelete(transaction.id)}>
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
