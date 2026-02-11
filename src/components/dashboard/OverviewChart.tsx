"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Bar, BarChart, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"

interface OverviewChartProps {
  data: {
    name: string
    income: number
    expense: number
  }[]
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-card border border-border p-3 rounded-lg shadow-xl backdrop-blur-sm bg-card/95">
        <p className="text-sm font-bold mb-2 text-foreground">{label}</p>
        <div className="space-y-1">
          {payload.map((entry: any, index: number) => (
            <div key={index} className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <div 
                  className="w-2 h-2 rounded-full" 
                  style={{ backgroundColor: entry.fill }} 
                />
                <span className="text-xs text-muted-foreground">{entry.name}:</span>
              </div>
              <span className="text-xs font-mono font-bold" style={{ color: entry.fill }}>
                {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(entry.value)}
              </span>
            </div>
          ))}
        </div>
      </div>
    );
  }
  return null;
};

export function OverviewChart({ data }: OverviewChartProps) {
  return (
    <Card className="col-span-4 border-none shadow-lg bg-gradient-to-b from-card to-card/50">
      <CardHeader>
        <CardTitle className="text-xl font-bold tracking-tight">Visão Geral</CardTitle>
      </CardHeader>
      <CardContent className="pl-2">
        <ResponsiveContainer width="100%" height={350}>
          <BarChart data={data}>
            <defs>
              <linearGradient id="incomeGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0.3}/>
              </linearGradient>
              <linearGradient id="expenseGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(var(--destructive))" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="hsl(var(--destructive))" stopOpacity={0.3}/>
              </linearGradient>
            </defs>
            <XAxis
              dataKey="name"
              stroke="#888888"
              fontSize={12}
              tickLine={false}
              axisLine={false}
              dy={10}
            />
            <YAxis
              stroke="#888888"
              fontSize={11}
              tickLine={false}
              axisLine={false}
              tickFormatter={(value) => `R$ ${value}`}
              dx={-10}
            />
            <Tooltip 
                content={<CustomTooltip />}
                cursor={{ fill: 'hsl(var(--muted))', opacity: 0.1 }}
            />
            <Legend 
              verticalAlign="top" 
              align="right" 
              iconType="circle"
              iconSize={8}
              wrapperStyle={{ paddingTop: '0px', paddingBottom: '20px' }}
            />
            <Bar 
              dataKey="income" 
              name="Receita" 
              fill="url(#incomeGradient)" 
              radius={[6, 6, 0, 0]} 
              barSize={32}
            />
            <Bar 
              dataKey="expense" 
              name="Despesa" 
              fill="url(#expenseGradient)" 
              radius={[6, 6, 0, 0]} 
              barSize={32}
            />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}
