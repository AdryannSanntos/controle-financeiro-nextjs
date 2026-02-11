"use client"

import { Button } from "@/components/ui/button"
import { CurrencyInput } from "@/components/ui/currency-input"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { zodResolver } from "@hookform/resolvers/zod"
import { format } from "date-fns"
import { useForm } from "react-hook-form"
import * as z from "zod"

const supportSchema = z.object({
  amount: z.coerce.number().min(0.01, "Valor deve ser maior que zero"),
  notes: z.string().optional(),
  month: z.string().regex(/^\d{4}-\d{2}$/, "Formato inválido (YYYY-MM)"),
})

export type SupportFormValues = z.infer<typeof supportSchema>

interface SupportFormProps {
  defaultValues?: Partial<SupportFormValues>
  onSubmit: (values: SupportFormValues) => void
  onCancel?: () => void
}

export function SupportForm({ defaultValues, onSubmit, onCancel }: SupportFormProps) {
  const currentMonth = format(new Date(), 'yyyy-MM')
  
  const form = useForm<SupportFormValues>({
    resolver: zodResolver(supportSchema) as any,
    defaultValues: {
      amount: 0,
      notes: "",
      month: currentMonth,
      ...defaultValues,
    },
  })

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        
        <FormField
            control={form.control}
            name="amount"
            render={({ field }) => (
                <FormItem>
                <FormLabel>Valor</FormLabel>
                <FormControl>
                    <CurrencyInput 
                      value={field.value} 
                      onChange={field.onChange}
                      placeholder="R$ 0,00"
                    />
                </FormControl>
                <FormMessage />
                </FormItem>
            )}
            />

        <FormField
          control={form.control}
          name="month"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Mês de Referência</FormLabel>
              <FormControl>
                <Input type="month" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="notes"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Observações</FormLabel>
              <FormControl>
                <Input placeholder="Detalhes opcionais..." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end gap-2 pt-4">
            {onCancel && (
                <Button type="button" variant="outline" onClick={onCancel}>
                    Cancelar
                </Button>
            )}
            <Button type="submit">Salvar</Button>
        </div>
      </form>
    </Form>
  )
}
