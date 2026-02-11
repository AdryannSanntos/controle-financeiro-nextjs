"use client"

import { TransactionForm } from "@/components/forms/TransactionForm"
import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { useFinanceStore } from "@/store/financeStore"
import { TransactionType } from "@/types/finance"
import { Edit, PlusCircle } from "lucide-react"
import { useState } from "react"
import { toast } from "sonner"

interface TransactionDialogProps {
  type: TransactionType
  id?: string
  defaultValues?: Partial<any>
}

export function TransactionDialog({ type, id, defaultValues }: TransactionDialogProps) {
  const [open, setOpen] = useState(false)
  const addTransaction = useFinanceStore((state) => state.addTransaction)
  const editTransaction = useFinanceStore((state) => state.editTransaction)

  const isEditing = !!id

  const onSubmit = (values: any) => {
    const data = {
      type,
      category: values.category,
      amount: values.amount,
      date: values.date.toISOString(),
      description: values.description || "",
      status: values.status || "paid",
      paymentMethod: values.paymentMethod,
      paidBySupport: values.paidBySupport,
    }

    if (isEditing && id) {
      editTransaction(id, data)
      toast.success(`${type === 'income' ? 'Receita' : 'Despesa'} atualizada com sucesso!`)
    } else {
      addTransaction({
        id: crypto.randomUUID(),
        ...data
      })
      toast.success(`${type === 'income' ? 'Receita' : 'Despesa'} adicionada com sucesso!`)
    }
    
    setOpen(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {isEditing ? (
            <Button variant="ghost" size="icon">
                <Edit className="h-4 w-4 text-blue-500" />
            </Button>
        ) : (
            <Button>
                <PlusCircle className="mr-2 h-4 w-4" />
                Adicionar {type === 'income' ? 'Receita' : 'Despesa'}
            </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{isEditing ? 'Editar' : 'Nova'} {type === 'income' ? 'Receita' : 'Despesa'}</DialogTitle>
          <DialogDescription>
            {isEditing ? 'Atualize os dados da transação.' : 'Preencha os dados abaixo para registrar uma nova transação.'}
          </DialogDescription>
        </DialogHeader>
        <TransactionForm 
            type={type} 
            defaultValues={defaultValues}
            onSubmit={onSubmit} 
            onCancel={() => setOpen(false)}
        />
      </DialogContent>
    </Dialog>
  )
}
