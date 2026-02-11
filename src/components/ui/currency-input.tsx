"use client"

import { Input } from "@/components/ui/input"
import * as React from "react"

interface CurrencyInputProps extends Omit<React.ComponentProps<typeof Input>, 'onChange' | 'value'> {
  value: number
  onChange: (value: number) => void
}

export function CurrencyInput({ value, onChange, className, ...props }: CurrencyInputProps) {
  const [displayValue, setDisplayValue] = React.useState("")

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(val)
  }

  React.useEffect(() => {
    setDisplayValue(formatCurrency(value))
  }, [value])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value.replace(/\D/g, "")
    const numericValue = rawValue ? parseInt(rawValue, 10) / 100 : 0
    onChange(numericValue)
  }

  const handleBlur = () => {
    setDisplayValue(formatCurrency(value))
  }

  const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    // Show only numbers for easier editing if preferred, 
    // but usually for currency we keep it formatted or show raw
    // Let's keep it formatted but at the end of the string
  }

  return (
    <Input
      {...props}
      className={className}
      value={displayValue}
      onChange={handleChange}
      onBlur={handleBlur}
      inputMode="numeric"
    />
  )
}
