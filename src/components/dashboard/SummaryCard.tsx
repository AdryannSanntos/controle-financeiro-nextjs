import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { LucideIcon } from "lucide-react"

interface SummaryCardProps {
  title: string
  amount: number
  icon: LucideIcon
  description?: string
  trend?: {
    value: number
    positive: boolean
  }
  className?: string
  isCurrency?: boolean
}

export function SummaryCard({ title, amount, icon: Icon, description, trend, className, isCurrency = true }: SummaryCardProps) {
  const formattedAmount = isCurrency 
    ? new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL',
      }).format(amount)
    : amount.toString()

  return (
    <Card className={cn("", className)}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">
          {title}
        </CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{formattedAmount}</div>
        {description && (
          <p className="text-xs text-muted-foreground">
            {description}
          </p>
        )}
      </CardContent>
    </Card>
  )
}
