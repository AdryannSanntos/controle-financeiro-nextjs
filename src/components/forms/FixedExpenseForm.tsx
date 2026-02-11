"use client"

import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { CurrencyInput } from "@/components/ui/currency-input"
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { NumericInput } from "@/components/ui/numeric-input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { EXPENSE_CATEGORIES } from "@/lib/constants"
import { zodResolver } from "@hookform/resolvers/zod"
import { Tag } from "lucide-react"
import { useForm } from "react-hook-form"
import * as z from "zod"

const fixedExpenseSchema = z.object({
  name: z.string().min(2, "Nome deve ter pelo menos 2 caracteres"),
  amount: z.coerce.number().min(0.01, "Valor deve ser maior que zero"),
  category: z.string().min(1, "Selecione uma categoria"),
  dayDue: z.coerce.number().min(1).max(31),
  autoTrack: z.boolean().default(false),
  paidBySupport: z.boolean().default(false),
})

export type FixedExpenseFormValues = z.infer<typeof fixedExpenseSchema>

interface FixedExpenseFormProps {
  defaultValues?: Partial<FixedExpenseFormValues>
  onSubmit: (values: FixedExpenseFormValues) => void
  onCancel?: () => void
}

export function FixedExpenseForm({ defaultValues, onSubmit, onCancel }: FixedExpenseFormProps) {
  const form = useForm<FixedExpenseFormValues>({
    resolver: zodResolver(fixedExpenseSchema) as any,
    defaultValues: {
      name: "",
      amount: 0,
      category: "",
      dayDue: 1,
      autoTrack: false,
      paidBySupport: false,
      ...defaultValues,
    },
  })

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nome da Despesa</FormLabel>
              <FormControl>
                <Input placeholder="Ex: Internet, Academia..." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-2 gap-4">
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
            name="dayDue"
            render={({ field }) => (
                <FormItem>
                <FormLabel>Dia do Vencimento</FormLabel>
                <FormControl>
                    <NumericInput 
                      value={field.value} 
                      onChange={field.onChange}
                      min={1}
                      max={31}
                      placeholder="1"
                    />
                </FormControl>
                <FormMessage />
                </FormItem>
            )}
            />
        </div>

        <FormField
          control={form.control}
          name="category"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Categoria</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione..." />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {EXPENSE_CATEGORIES.map((cat) => (
                    <SelectItem key={cat.value} value={cat.value}>
                       <div className="flex items-center gap-2">
                        <Tag className="h-3 w-3 opacity-70" />
                        {cat.label}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="autoTrack"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4 shadow-sm">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel>Lançamento Automático</FormLabel>
                  <FormDescription className="text-xs">
                    Lançar automaticamente todo mês.
                  </FormDescription>
                </div>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="paidBySupport"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4 shadow-sm bg-primary/5 border-primary/20">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel>Pago pelo Apoio (Pais)</FormLabel>
                  <FormDescription className="text-xs">
                    Esta despesa é paga pelo seu apoio financeiro.
                  </FormDescription>
                </div>
              </FormItem>
            )}
          />
        </div>

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
