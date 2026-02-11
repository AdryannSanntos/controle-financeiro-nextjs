import { useFilter } from "@/contexts/FilterContext"
import { useFinanceStore } from "@/store/financeStore"
import { TimelineEvent } from "@/types/finance"
import { addMonths, isAfter, isBefore, isSameMonth, parseISO } from "date-fns"
import { useMemo } from "react"

export function useTimelineData() {
  const { transactions, fixedExpenses, financialSupport, investments } = useFinanceStore()
  const { filters } = useFilter()

  const events = useMemo(() => {
    let timelineEvents: TimelineEvent[] = []
    
    // 1. Transactions (Real data)
    transactions.forEach(t => {
      timelineEvents.push({
        id: t.id,
        date: t.date,
        fullDate: parseISO(t.date),
        type: 'transaction',
        title: t.description,
        amount: t.type === 'expense' ? -t.amount : t.amount,
        category: t.category,
        status: t.status,
        originalData: t
      })
    })

    // 2. Investment Entries (Real data)
    investments.forEach(inv => {
      inv.history.forEach(entry => {
        timelineEvents.push({
          id: entry.id,
          date: entry.date,
          fullDate: parseISO(entry.date),
          type: 'investment_entry',
          title: `Investimento: ${inv.name}`,
          amount: entry.type === 'withdrawal' ? entry.amount : -entry.amount, // Money leaving wallet or entering?
          // Usually investment contribution is an "expense" from wallet perspective, but it's an asset increase.
          // Let's keep it negative for contribution (money out of liquid cash) and positive for withdrawal.
          // Or maybe just distinguish by type.
          category: 'Investimento',
          status: 'paid',
          originalData: entry
        })
      })
    })

    // 3. Financial Support (Real data)
    financialSupport.forEach(s => {
      const date = new Date(s.month + '-01') // First day of month
      // Ideally support comes in on a specific day? Assuming 1st or rent day.
      // Let's assume 1st for now.
      timelineEvents.push({
        id: s.id,
        date: date.toISOString(),
        fullDate: date,
        type: 'support',
        title: 'Apoio Financeiro',
        amount: s.amount,
        category: 'Renda Extra',
        status: 'paid', // Assumed paid if valid
        originalData: s
      })
    })

    // 4. Projections for Fixed Expenses (Future only)
    // We project for the next 12 months or up to filter end.
    const today = new Date()
    const projectionStart = today
    const projectionEnd = filters.dateRange?.to || addMonths(today, 12)

    if (isAfter(projectionEnd, projectionStart)) {
        let currentMonth = projectionStart
        while (isBefore(currentMonth, projectionEnd) || isSameMonth(currentMonth, projectionEnd)) {
            fixedExpenses.forEach(expense => {
                // Check if already paid this month?
                // Logic: If there is a transaction with same category and mostly similar amount in this month?
                // For simplicity: Projection is strictly future "pending" items.
                // We show them as "projected".
                
                // Construct date for this month
                // expense.dayDue
                const dueYear = currentMonth.getFullYear()
                const dueMonth = currentMonth.getMonth()
                
                // Handle days like 31st in Feb
                const maxDays = new Date(dueYear, dueMonth + 1, 0).getDate()
                const day = Math.min(expense.dayDue, maxDays)
                
                const dueDate = new Date(dueYear, dueMonth, day)
                
                if (isAfter(dueDate, today)) {
                     timelineEvents.push({
                        id: `proj-${expense.id}-${dueDate.toISOString()}`,
                        date: dueDate.toISOString(),
                        fullDate: dueDate,
                        type: 'fixed_expense',
                        title: expense.name,
                        amount: -expense.amount,
                        category: expense.category,
                        status: 'projected', // Distinct status
                        originalData: expense
                    })
                }
            })
            currentMonth = addMonths(currentMonth, 1)
        }
    }

    // Sort by date descending (newest first)
    return timelineEvents.sort((a, b) => b.fullDate.getTime() - a.fullDate.getTime())
  }, [transactions, fixedExpenses, financialSupport, investments, filters.dateRange])

  // Apply Global Filters to the Timeline (except date range which is handled in projection logic somewhat, but we should strictly clip it)
  const filteredEvents = useMemo(() => {
    return events.filter(e => {
        // Date Range
        if (filters.dateRange) {
            if (isBefore(e.fullDate, filters.dateRange.from) || isAfter(e.fullDate, filters.dateRange.to)) {
                return false
            }
        }

        // Type Filter logic mapping
        if (filters.type !== 'all') {
             if (filters.type === 'income') {
                 if (e.amount < 0) return false
             }
             if (filters.type === 'expense') {
                 if (e.amount >= 0) return false
             }
             if (filters.type === 'investment') {
                 if (e.type !== 'investment_entry') return false
             }
        }

         // Search Filter
         if (filters.search) {
             const searchLower = filters.search.toLowerCase()
             return (
                 e.title.toLowerCase().includes(searchLower) ||
                 (e.category && e.category.toLowerCase().includes(searchLower))
             )
         }

        return true
    })
  }, [events, filters])

  return filteredEvents
}
