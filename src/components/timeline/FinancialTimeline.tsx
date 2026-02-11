'use client'

import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { useFilter } from "@/contexts/FilterContext"
import { useTimelineData } from "@/hooks/useTimelineData"
import { ReferenceType, TimelineEvent } from "@/types/finance"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"
import { ArrowDown, ArrowUp, CalendarClock, Wallet } from "lucide-react"

export function FinancialTimeline() {
  const events = useTimelineData()
  const { filters } = useFilter()

  // Group events by month
  const groupedEvents = events.reduce((acc, event) => {
    const monthKey = format(event.fullDate, 'MMMM yyyy', { locale: ptBR })
    if (!acc[monthKey]) {
      acc[monthKey] = []
    }
    acc[monthKey].push(event)
    return acc
  }, {} as Record<string, TimelineEvent[]>)

  const months = Object.keys(groupedEvents)

  if (events.length === 0) {
      return (
          <div className="text-center py-10 text-muted-foreground">
              <CalendarClock className="mx-auto h-12 w-12 opacity-20 mb-3" />
              <p>Nenhum evento encontrado para este período.</p>
          </div>
      )
  }

  return (
    <div className="space-y-8 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-border/50 before:to-transparent">
      {months.map((month) => (
        <div key={month} className="relative">
          <div className="sticky top-4 z-10 mb-6 flex justify-center">
             <Badge variant="outline" className="bg-background px-4 py-1 text-sm font-medium capitalize shadow-sm backdrop-blur-sm">
                {month}
             </Badge>
          </div>
          
          <div className="space-y-4">
              {groupedEvents[month].map((event) => (
                  <TimelineItem key={event.id} event={event} />
              ))}
          </div>
        </div>
      ))}
    </div>
  )
}

function TimelineItem({ event }: { event: TimelineEvent }) {
    const isFuture = event.status === 'projected' || event.status === 'pending'
    
    // Icon & Color Logic
    const getIcon = (type: ReferenceType, amount: number) => {
        if (type === 'investment_entry') return <Wallet className="h-4 w-4" />
        if (amount > 0) return <ArrowUp className="h-4 w-4" />
        return <ArrowDown className="h-4 w-4" />
    }

    const getColorClass = (type: ReferenceType, amount: number) => {
        if (isFuture) return "text-muted-foreground bg-muted"
        if (type === 'investment_entry') return "text-purple-500 bg-purple-500/10"
        if (amount > 0) return "text-green-500 bg-green-500/10"
        return "text-red-500 bg-red-500/10"
    }
    
    return (
        <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group select-none">
             {/* Timeline Dot */}
            <div className={`absolute left-5 md:left-1/2 -translate-x-1/2 w-4 h-4 rounded-full border-2 border-background z-10 
                ${isFuture ? 'bg-muted-foreground/30' : event.amount > 0 ? 'bg-green-500' : 'bg-red-500'}`} 
            />
            
            {/* Card */}
            <Card className={`ml-12 md:ml-0 w-full md:w-[calc(50%-2rem)] transition-all hover:shadow-md ${isFuture ? 'opacity-70 border-dashed' : ''} ${event.status === 'pending' ? 'border-yellow-500/50' : ''}`}>
                <CardContent className="flex items-center gap-4 p-4">
                    <div className={`flex h-9 w-9 items-center justify-center rounded-full ${getColorClass(event.type, event.amount)}`}>
                        {getIcon(event.type, event.amount)}
                    </div>
                    
                    <div className="flex-1 space-y-1">
                        <div className="flex items-center justify-between">
                            <div className="flex flex-col gap-1">
                                <p className="text-sm font-medium leading-none truncate pr-2">
                                    {event.title}
                                </p>
                                {event.originalData?.paidBySupport && (
                                    <span className="text-[10px] text-primary font-bold">Apoio Financeiro</span>
                                )}
                            </div>
                            <span className={`text-sm font-bold whitespace-nowrap ${event.amount > 0 ? 'text-green-600' : event.amount < 0 ? 'text-red-600' : ''}`}>
                                {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(Math.abs(event.amount))}
                            </span>
                        </div>
                        <div className="flex items-center justify-between text-xs text-muted-foreground">
                            <span className="capitalize">{event.category || 'Geral'}</span>
                            <div className="flex items-center gap-2">
                                <span>{format(event.fullDate, "d 'de' MMM", { locale: ptBR })}</span>
                                {event.status === 'projected' && <Badge variant="secondary" className="text-[10px] h-4 px-1">Previsto</Badge>}
                                {event.status === 'pending' && <Badge variant="outline" className="text-[10px] h-4 px-1 text-yellow-600 border-yellow-200">Pendente</Badge>}
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
