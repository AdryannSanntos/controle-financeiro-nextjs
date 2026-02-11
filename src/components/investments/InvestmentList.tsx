"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useFinanceStore } from "@/store/financeStore"
import { Investment } from "@/types/finance"
import { Trash2 } from "lucide-react"
import { InvestmentDialog } from "./InvestmentDialog"
interface InvestmentListProps {
  investments: Investment[]
}

const TYPE_BADGES: Record<string, string> = {
  fixed_income: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
  stocks: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
  fiis: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400',
  crypto: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400',
  treasury: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
  other: 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400'
}

export function InvestmentList({ investments }: InvestmentListProps) {
  const deleteInvestment = useFinanceStore(state => state.deleteInvestment)

  const handleDelete = (id: string, name: string) => {
    if (confirm(`Excluir o ativo ${name}?`)) {
        deleteInvestment(id)
    }
  }

  return (
    <Card className="col-span-full xl:col-span-2">
      <CardHeader>
        <CardTitle>Meus Ativos</CardTitle>
        <CardDescription>Detalhamento de cada investimento individual.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b text-muted-foreground">
                <th className="text-left pb-4 font-medium">Ativo</th>
                <th className="text-left pb-4 font-medium">Tipo</th>
                <th className="text-right pb-4 font-medium">Saldo Atual</th>
                <th className="text-right pb-4 font-medium">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {investments.length === 0 ? (
                  <tr>
                      <td colSpan={4} className="py-8 text-center text-muted-foreground">
                          Nenhum ativo cadastrado.
                      </td>
                  </tr>
              ) : (
                investments.map((inv) => (
                  <tr key={inv.id} className="group hover:bg-muted/50 transition-colors">
                    <td className="py-4">
                      <div className="font-semibold">{inv.name}</div>
                    </td>
                    <td className="py-4">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${TYPE_BADGES[inv.type]}`}>
                        {inv.type.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="py-4 text-right">
                      <div className="font-bold">
                        {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(inv.currentAmount)}
                      </div>
                    </td>
                    <td className="py-4 text-right">
                        <InvestmentDialog 
                            id={inv.id} 
                            defaultValues={{
                                name: inv.name,
                                type: inv.type,
                                currentAmount: inv.currentAmount
                            }} 
                        />
                        <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-8 w-8 text-destructive group-hover:opacity-100 transition-opacity"
                            onClick={() => handleDelete(inv.id, inv.name)}
                        >
                            <Trash2 className="h-4 w-4" />
                        </Button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  )
}
