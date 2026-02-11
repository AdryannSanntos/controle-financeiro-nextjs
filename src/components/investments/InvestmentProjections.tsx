"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { CurrencyInput } from "@/components/ui/currency-input"
import { Label } from "@/components/ui/label"
import { NumericInput } from "@/components/ui/numeric-input"
import { useState } from "react"
import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"

export function InvestmentProjections({ currentTotal }: { currentTotal: number }) {
  const [monthlyContribution, setMonthlyContribution] = useState(1000)
  const [years, setYears] = useState(10)
  const [rate, setRate] = useState(10) // 10% per year

  const data = []
  let total = currentTotal
  const monthlyRate = Math.pow(1 + rate / 100, 1 / 12) - 1

  for (let m = 0; m <= years * 12; m++) {
    if (m % 12 === 0 || m === years * 12) {
      data.push({
        year: `Ano ${m / 12}`,
        value: Math.round(total)
      })
    }
    total = total * (1 + monthlyRate) + monthlyContribution
  }

  const finalValue = data[data.length - 1].value

  return (
    <Card className="col-span-full">
      <CardHeader>
        <CardTitle>Projeção de Longo Prazo</CardTitle>
        <CardDescription>Simule o crescimento do seu patrimônio com aportes constantes.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-2">
            <Label>Aporte Mensal</Label>
            <CurrencyInput value={monthlyContribution} onChange={setMonthlyContribution} />
          </div>
          <div className="space-y-2">
            <Label>Tempo (Anos)</Label>
            <NumericInput value={years} onChange={setYears} max={50} />
          </div>
          <div className="space-y-2">
            <Label>Rentabilidade Anual Estimada (%)</Label>
            <NumericInput value={rate} onChange={setRate} max={100} />
          </div>
        </div>

        <div className="h-[300px] w-full pt-4">
            <ResponsiveContainer width="100%" height="100%">
                <LineChart data={data}>
                    <XAxis 
                        dataKey="year" 
                        stroke="#888888" 
                        fontSize={12} 
                        tickLine={false} 
                        axisLine={false}
                    />
                    <YAxis 
                        stroke="#888888" 
                        fontSize={10} 
                        tickLine={false} 
                        axisLine={false}
                        tickFormatter={(value) => `R$${(value / 1000000).toFixed(1)}M`}
                    />
                    <Tooltip 
                         formatter={(value: number) => 
                            new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value)
                        }
                        contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                    />
                    <Line 
                        type="monotone" 
                        dataKey="value" 
                        stroke="hsl(var(--primary))" 
                        strokeWidth={4} 
                        dot={false}
                    />
                </LineChart>
            </ResponsiveContainer>
        </div>

        <div className="p-4 rounded-xl bg-primary/5 border border-primary/20 flex flex-col md:flex-row items-center justify-between gap-4">
            <div>
                <p className="text-sm text-muted-foreground uppercase font-bold tracking-wider">Resultado Estimado</p>
                <p className="text-3xl font-black text-primary">
                    {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(finalValue)}
                </p>
            </div>
            <p className="text-xs text-muted-foreground max-w-sm text-right md:block hidden">
                Este cálculo utiliza juros compostos mensais. Lembre-se que rendimentos passados não garantem rendimentos futuros.
            </p>
        </div>
      </CardContent>
    </Card>
  )
}
