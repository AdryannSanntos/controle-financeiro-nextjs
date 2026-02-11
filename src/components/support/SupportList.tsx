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
import { useFinanceStore } from "@/store/financeStore"
import { FinancialSupport } from "@/types/finance"
import { Trash2 } from "lucide-react"
import { toast } from "sonner"
import { SupportDialog } from "./SupportDialog"

interface SupportListProps {
  supports: FinancialSupport[]
}

export function SupportList({ supports }: SupportListProps) {
  const removeSupport = useFinanceStore((state) => state.removeSupport)

  const handleDelete = (id: string) => {
    if (confirm("Remover este registro?")) {
        removeSupport(id)
        toast.success("Registro removido")
    }
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Mês</TableHead>
            <TableHead>Valor</TableHead>
            <TableHead>Observações</TableHead>
            <TableHead className="text-right">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {supports.length === 0 ? (
            <TableRow>
              <TableCell colSpan={4} className="text-center h-24 text-muted-foreground">
                Nenhum registro encontrado.
              </TableCell>
            </TableRow>
          ) : (
            supports.map((item) => (
              <TableRow key={item.id}>
                <TableCell>{item.month}</TableCell>
                <TableCell className="text-green-600 font-medium">
                  {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(item.amount)}
                </TableCell>
                <TableCell>{item.notes || "-"}</TableCell>
                <TableCell className="text-right">
                  <SupportDialog 
                    id={item.id} 
                    defaultValues={item} 
                  />
                  <Button variant="ghost" size="icon" onClick={() => handleDelete(item.id)}>
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
