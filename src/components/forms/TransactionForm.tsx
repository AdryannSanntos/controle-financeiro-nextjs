"use client"

import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Checkbox } from "@/components/ui/checkbox"
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
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { EXPENSE_CATEGORIES, INCOME_TYPES, PAYMENT_METHODS } from "@/lib/constants"
import { cn } from "@/lib/utils"
import { TransactionType } from "@/types/finance"
import { zodResolver } from "@hookform/resolvers/zod"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"
import { CalendarIcon, Tag } from "lucide-react"
import { useForm } from "react-hook-form"
import * as z from "zod"

export const formSchema = z.object({
  amount: z.coerce.number().min(0.01, "Valor deve ser maior que zero"),
  description: z.string().optional(),
  category: z.string().min(1, "Selecione uma categoria/tipo"),
  date: z.date(),
  paymentMethod: z.string().optional(),
  status: z.enum(["paid", "pending"]).default("paid"),
  paidBySupport: z.boolean().default(false),
})

export type FormValues = z.infer<typeof formSchema>

interface TransactionFormProps {
  type: TransactionType
  defaultValues?: Partial<FormValues>
  onSubmit: (values: FormValues) => void
  onCancel?: () => void
}

export function TransactionForm({ type, defaultValues, onSubmit, onCancel }: TransactionFormProps) {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema) as any,
    defaultValues: {
      amount: 0,
      description: "",
      category: "",
      status: "paid",
      paymentMethod: "",
      paidBySupport: false,
      ...defaultValues,
    },
  })

  // Presencial day calculation logic if needed? 
  // For now simple input.

  const categories = type === 'income' ? INCOME_TYPES : EXPENSE_CATEGORIES

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        
        <FormField
          control={form.control}
          name="category"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{type === 'income' ? 'Tipo de Receita' : 'Categoria'}</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione..." />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {categories.map((cat) => (
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
            name="date"
            render={({ field }) => (
                <FormItem className="flex flex-col">
                <FormLabel>Data</FormLabel>
                <Popover>
                    <PopoverTrigger asChild>
                    <FormControl>
                        <Button
                        variant={"outline"}
                        className={cn(
                            "w-full pl-3 text-left font-normal",
                            !field.value && "text-muted-foreground"
                        )}
                        >
                        {field.value ? (
                            format(field.value, "PPP", { locale: ptBR })
                        ) : (
                            <span>Selecione uma data</span>
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                    </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0 border-none" align="start">
                    <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        initialFocus
                        locale={ptBR}
                        className="rounded-md border shadow p-3 scale-110 origin-top-left"
                    />
                    </PopoverContent>
                </Popover>
                <FormMessage />
                </FormItem>
            )}
            />
        </div>

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Observações / Descrição</FormLabel>
              <FormControl>
                <Input placeholder="Detalhes opcionais..." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {type === 'expense' && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
                <FormField
                control={form.control}
                name="paymentMethod"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Forma de Pagamento</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                        <SelectTrigger>
                            <SelectValue placeholder="Selecione..." />
                        </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                        {PAYMENT_METHODS.map((method) => (
                            <SelectItem key={method.value} value={method.value}>
                            {method.label}
                            </SelectItem>
                        ))}
                        </SelectContent>
                    </Select>
                    <FormMessage />
                    </FormItem>
                )}
                />

                <FormField
                    control={form.control}
                    name="status"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Status</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                            <SelectTrigger>
                                <SelectValue placeholder="Selecione..." />
                            </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                                <SelectItem value="paid">Pago</SelectItem>
                                <SelectItem value="pending">Pendente</SelectItem>
                            </SelectContent>
                        </Select>
                        <FormMessage />
                        </FormItem>
                    )}
                    />
            </div>

            <FormField
              control={form.control}
              name="paidBySupport"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-3 bg-primary/5 border-primary/20">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>Pago pelo Apoio (Pais)</FormLabel>
                  </div>
                </FormItem>
              )}
            />
          </div>
        )}

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
