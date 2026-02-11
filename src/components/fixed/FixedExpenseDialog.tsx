"use client"

import { FixedExpenseForm, FixedExpenseFormValues } from "@/components/forms/FixedExpenseForm"
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
import { Edit, PlusCircle } from "lucide-react"
import { useState } from "react"
import { toast } from "sonner"

interface FixedExpenseDialogProps {
  id?: string
  defaultValues?: Partial<FixedExpenseFormValues>
}

export function FixedExpenseDialog({ id, defaultValues }: FixedExpenseDialogProps) {
  const [open, setOpen] = useState(false)
  const addFixedExpense = useFinanceStore((state) => state.addFixedExpense)
  const editFixedExpense = useFinanceStore((state) => state.editFixedExpense)

  const isEditing = !!id

  const onSubmit = (values: FixedExpenseFormValues) => {
    if (isEditing && id) {
        editFixedExpense(id, values)
        toast.success("Gasto fixo atualizado com sucesso!")
    } else {
        addFixedExpense({
          id: crypto.randomUUID(),
          ...values,
        })
        toast.success("Gasto fixo adicionado com sucesso!")
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
                Adicionar Gasto Fixo
            </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{isEditing ? 'Editar' : 'Novo'} Gasto Fixo</DialogTitle>
          <DialogDescription>
            {isEditing ? 'Atualize os dados do gasto fixo.' : 'Cadastre suas contas recorrentes (Internet, Assinaturas, etc).'}
          </DialogDescription>
        </DialogHeader>
        <FixedExpenseForm 
            defaultValues={defaultValues}
            onSubmit={onSubmit} 
            onCancel={() => setOpen(false)}
        />
      </DialogContent>
    </Dialog>
  )
}
