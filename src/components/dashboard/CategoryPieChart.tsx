"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts"

interface CategoryPieChartProps {
  data: {
    name: string
    value: number
    color: string
  }[]
}

const RADIAN = Math.PI / 180;
const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, index }: any) => {
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  return (
    <text x={x} y={y} fill="white" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central" className="text-xs font-bold pointer-events-none">
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  );
};

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const entry = payload[0];
    return (
      <div className="bg-card border border-border p-3 rounded-lg shadow-xl backdrop-blur-sm bg-card/95">
        <div className="flex items-center gap-2 mb-1">
          <div 
            className="w-2 h-2 rounded-full" 
            style={{ backgroundColor: entry.payload.color }} 
          />
          <span className="text-sm font-bold text-foreground">{entry.name}</span>
        </div>
        <div className="flex items-center justify-between gap-4">
          <span className="text-xs text-muted-foreground">Valor:</span>
          <span className="text-xs font-mono font-bold" style={{ color: entry.payload.color }}>
            {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(entry.value)}
          </span>
        </div>
        <div className="flex items-center justify-between gap-4">
          <span className="text-xs text-muted-foreground">Proporção:</span>
          <span className="text-xs font-bold text-foreground">
            {`${((entry.value / payload[0].payload.total) * 100).toFixed(1)}%`}
          </span>
        </div>
      </div>
    );
  }
  return null;
};

export function CategoryPieChart({ data }: CategoryPieChartProps) {
    if (data.length === 0) {
        return (
            <Card className="col-span-3 border-none shadow-lg">
                <CardHeader>
                    <CardTitle className="text-xl font-bold tracking-tight">Gastos por Categoria</CardTitle>
                </CardHeader>
                <CardContent className="h-[350px] flex items-center justify-center text-muted-foreground italic">
                    Sem dados para exibir
                </CardContent>
            </Card>
        )
    }

    const total = data.reduce((acc, curr) => acc + curr.value, 0);
    const enrichedData = data.map(d => ({ ...d, total }));

  return (
    <Card className="col-span-3 border-none shadow-lg bg-gradient-to-b from-card to-card/50">
      <CardHeader>
        <CardTitle className="text-xl font-bold tracking-tight">Gastos por Categoria</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={350}>
          <PieChart>
            <Pie
              data={enrichedData}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={100}
              paddingAngle={5}
              dataKey="value"
            >
              {enrichedData.map((entry, index) => (
                <Cell 
                    key={`cell-${index}`} 
                    fill={entry.color} 
                    stroke="transparent"
                    className="hover:opacity-80 transition-opacity cursor-pointer outline-none"
                />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
            <Legend 
              verticalAlign="bottom" 
              align="center" 
              iconType="circle"
              iconSize={8}
              layout="horizontal"
              wrapperStyle={{ paddingTop: '20px' }}
            />
          </PieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}
