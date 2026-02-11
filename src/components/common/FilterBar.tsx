'use client'

import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Input } from "@/components/ui/input"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { FilterPeriod, FilterType, useFinancialFilters } from "@/hooks/useFinancialFilters"
import { cn } from "@/lib/utils"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"
import { CalendarIcon, Search, X } from "lucide-react"

interface FilterBarProps {
  filters: ReturnType<typeof useFinancialFilters>['filters']
  onPeriodChange: (period: FilterPeriod) => void
  onDateRangeChange: (range: { from: Date; to: Date } | undefined) => void
  onTypeChange: (type: FilterType) => void
  onSearchChange: (search: string) => void
  onAmountRangeChange: (min?: number, max?: number) => void
  onReset: () => void
}

export function FilterBar({
  filters,
  onPeriodChange,
  onDateRangeChange,
  onTypeChange,
  onSearchChange,
  onAmountRangeChange,
  onReset
}: FilterBarProps) {
  return (
    <div className="flex flex-col gap-4 p-4 border rounded-lg bg-card text-card-foreground shadow-sm mb-6">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-sm text-muted-foreground">Filtros Globais</h3>
        {(filters.period !== 'all_time' || filters.type !== 'all' || filters.search || filters.minAmount || filters.maxAmount) && (
             <Button variant="ghost" size="sm" onClick={onReset} className="h-8 px-2 lg:px-3 text-red-500 hover:text-red-600 hover:bg-red-50">
                Resetar
                <X className="ml-2 h-4 w-4" />
             </Button>
        )}
      </div>
      
      <div className="flex flex-wrap gap-3 items-center">
        {/* Period Selector */}
        <Select 
            value={filters.period} 
            onValueChange={(value) => onPeriodChange(value as FilterPeriod)}
        >
          <SelectTrigger className="w-[180px]">
            <CalendarIcon className="mr-2 h-4 w-4 text-muted-foreground" />
            <SelectValue placeholder="Período" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="this_month">Este Mês</SelectItem>
            <SelectItem value="last_month">Mês Passado</SelectItem>
            <SelectItem value="last_3_months">Últimos 3 Meses</SelectItem>
            <SelectItem value="this_year">Este Ano</SelectItem>
            <SelectItem value="all_time">Todo o Período</SelectItem>
            <SelectItem value="custom">Personalizado</SelectItem>
          </SelectContent>
        </Select>

        {/* Custom Date Picker (only if custom is selected) */}
        {filters.period === 'custom' && (
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant={"outline"}
                className={cn(
                  "w-[240px] justify-start text-left font-normal",
                  !filters.dateRange && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {filters.dateRange?.from ? (
                  filters.dateRange.to ? (
                    <>
                      {format(filters.dateRange.from, "dd/MM/y", { locale: ptBR })} -{" "}
                      {format(filters.dateRange.to, "dd/MM/y", { locale: ptBR })}
                    </>
                  ) : (
                    format(filters.dateRange.from, "dd/MM/y", { locale: ptBR })
                  )
                ) : (
                  <span>Selecione uma data</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                initialFocus
                mode="range"
                defaultMonth={filters.dateRange?.from}
                selected={{
                    from: filters.dateRange?.from,
                    to: filters.dateRange?.to
                }}
                onSelect={(range) => {
                    if (range?.from && range?.to) {
                        onDateRangeChange({ from: range.from, to: range.to })
                    }
                }}
                numberOfMonths={2}
                locale={ptBR}
              />
            </PopoverContent>
          </Popover>
        )}

        {/* Type Filter */}
        <Select 
            value={filters.type} 
            onValueChange={(value) => onTypeChange(value as FilterType)}
        >
          <SelectTrigger className="w-[150px]">
            <SelectValue placeholder="Tipo" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos</SelectItem>
            <SelectItem value="income">Receitas</SelectItem>
            <SelectItem value="expense">Despesas</SelectItem>
            <SelectItem value="investment">Investimentos</SelectItem>
          </SelectContent>
        </Select>

        {/* Amount Range Filter */}
        <div className="flex items-center gap-2">
            <Input 
                type="number" 
                placeholder="Min R$" 
                className="w-[100px] h-9"
                value={filters.minAmount ?? ''}
                onChange={(e) => onAmountRangeChange(e.target.value ? Number(e.target.value) : undefined, filters.maxAmount)}
            />
            <span className="text-muted-foreground">-</span>
            <Input 
                type="number" 
                placeholder="Max R$" 
                className="w-[100px] h-9"
                value={filters.maxAmount ?? ''}
                onChange={(e) => onAmountRangeChange(filters.minAmount, e.target.value ? Number(e.target.value) : undefined)}
            />
        </div>

        {/* Search Input */}
        <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input 
                placeholder="Buscar por descrição ou categoria..." 
                className="pl-8 h-9"
                value={filters.search}
                onChange={(e) => onSearchChange(e.target.value)}
            />
        </div>
      </div>
    </div>
  )
}
