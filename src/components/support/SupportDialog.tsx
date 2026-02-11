"use client"

import { SupportForm, SupportFormValues } from "@/components/forms/SupportForm"
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

interface SupportDialogProps {
  id?: string
  defaultValues?: Partial<SupportFormValues>
}

export function SupportDialog({ id, defaultValues }: SupportDialogProps) {
  const [open, setOpen] = useState(false)
  const addSupport = useFinanceStore((state) => state.addSupport)
  const editSupport = useFinanceStore((state) => state.editSupport)

  const isEditing = !!id

  const onSubmit = (values: SupportFormValues) => {
    if (isEditing && id) {
        editSupport(id, values)
        toast.success("Apoio financeiro atualizado!")
    } else {
        addSupport({
          id: crypto.randomUUID(),
          ...values,
        })
        toast.success("Apoio financeiro registrado!")
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
                Registrar Apoio
            </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{isEditing ? 'Editar' : 'Novo'} Apoio Financeiro</DialogTitle>
          <DialogDescription>
            {isEditing ? 'Atualize os dados do apoio financeiro.' : 'Registre ajudas ou doações recebidas.'}
          </DialogDescription>
        </DialogHeader>
        <SupportForm 
            defaultValues={defaultValues}
            onSubmit={onSubmit} 
            onCancel={() => setOpen(false)}
        />
      </DialogContent>
    </Dialog>
  )
}
