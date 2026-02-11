"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Investment } from "@/types/finance"
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts'

interface InvestmentAllocationProps {
  investments: Investment[]
}

const TYPE_LABELS: Record<string, string> = {
  fixed_income: 'Renda Fixa',
  stocks: 'Ações',
  fiis: 'FIIs',
  crypto: 'Cripto',
  treasury: 'Tesouro',
  other: 'Outros'
}

const COLORS = ['#0ea5e9', '#10b981', '#f59e0b', '#8b5cf6', '#ef4444', '#64748b']

export function InvestmentAllocation({ investments }: InvestmentAllocationProps) {
  const data = investments.reduce((acc, inv) => {
    const existing = acc.find(item => item.name === TYPE_LABELS[inv.type])
    if (existing) {
      existing.value += inv.currentAmount
    } else {
      acc.push({ name: TYPE_LABELS[inv.type], value: inv.currentAmount })
    }
    return acc
  }, [] as { name: string, value: number }[])

  return (
    <Card className="col-span-full xl:col-span-1">
      <CardHeader>
        <CardTitle>Alocação por Tipo</CardTitle>
        <CardDescription>Distribuição atual do patrimônio.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                paddingAngle={5}
                dataKey="value"
              >
                {data.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip 
                formatter={(value: number) => 
                    new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value)
                }
                contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="grid grid-cols-2 gap-2 mt-4">
          {data.map((item, index) => (
            <div key={item.name} className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }} />
              <span className="text-xs text-muted-foreground truncate">{item.name}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
