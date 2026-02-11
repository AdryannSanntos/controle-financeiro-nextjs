"use client"

import { Button } from "@/components/ui/button"
import { CurrencyInput } from "@/components/ui/currency-input"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useFinanceStore } from "@/store/financeStore"
import { zodResolver } from "@hookform/resolvers/zod"
import { Edit, PlusCircle } from "lucide-react"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import * as z from "zod"

const investmentSchema = z.object({
  name: z.string().min(2, "Nome deve ter pelo menos 2 caracteres"),
  type: z.enum(['fixed_income', 'stocks', 'fiis', 'crypto', 'treasury', 'other'] as const),
  currentAmount: z.number().min(0, "Valor deve ser positivo"),
})

type InvestmentFormValues = z.infer<typeof investmentSchema>

interface InvestmentDialogProps {
  id?: string
  defaultValues?: Partial<InvestmentFormValues>
}

export function InvestmentDialog({ id, defaultValues }: InvestmentDialogProps) {
  const [open, setOpen] = useState(false)
  const addInvestment = useFinanceStore((state) => state.addInvestment)
  const updateInvestment = useFinanceStore((state) => state.updateInvestment)

  const isEditing = !!id

  const form = useForm<InvestmentFormValues>({
    resolver: zodResolver(investmentSchema) as any,
    defaultValues: {
      name: "",
      type: "fixed_income",
      currentAmount: 0,
      ...defaultValues,
    },
  })

  const onSubmit = (values: InvestmentFormValues) => {
    if (isEditing && id) {
        updateInvestment(id, values)
        toast.success("Investimento atualizado!")
    } else {
        addInvestment({
          id: crypto.randomUUID(),
          name: values.name,
          type: values.type,
          currentAmount: values.currentAmount,
          history: [{
            id: crypto.randomUUID(),
            date: new Date().toISOString(),
            amount: values.currentAmount,
            type: 'contribution'
          }],
          color: `#${Math.floor(Math.random()*16777215).toString(16)}`
        })
        toast.success("Investimento adicionado!")
    }
    
    setOpen(false)
    if (!isEditing) form.reset()
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {isEditing ? (
            <Button variant="ghost" size="icon">
                <Edit className="h-4 w-4 text-blue-500" />
            </Button>
        ) : (
            <Button className="gap-2">
                <PlusCircle className="h-4 w-4" />
                Novo Ativo
            </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{isEditing ? 'Editar' : 'Novo'} Investimento</DialogTitle>
          <DialogDescription>
            {isEditing ? 'Atualize os dados do ativo.' : 'Adicione um novo ativo ao seu portfólio.'}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome do Ativo</FormLabel>
                  <FormControl>
                    <Input placeholder="Ex: PETR4, Tesouro Selic..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tipo de Ativo</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione..." />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="fixed_income">Renda Fixa (CDB/LCI)</SelectItem>
                      <SelectItem value="treasury">Tesouro Direto</SelectItem>
                      <SelectItem value="stocks">Ações</SelectItem>
                      <SelectItem value="fiis">FIIs (Fundos Imob.)</SelectItem>
                      <SelectItem value="crypto">Criptoativos</SelectItem>
                      <SelectItem value="other">Outros</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="currentAmount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Valor Atual (Saldo)</FormLabel>
                  <FormControl>
                    <CurrencyInput 
                      value={field.value} 
                      onChange={field.onChange}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end gap-2 pt-4">
                <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                    Cancelar
                </Button>
                <Button type="submit">Adicionar</Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
