"use client"

import { Input } from "@/components/ui/input"
import * as React from "react"

interface NumericInputProps extends Omit<React.ComponentProps<typeof Input>, 'onChange' | 'value'> {
  value: number | string
  onChange: (value: number) => void
  min?: number
  max?: number
}

export function NumericInput({ value, onChange, className, min, max, ...props }: NumericInputProps) {
  const [displayValue, setDisplayValue] = React.useState(value.toString())

  React.useEffect(() => {
    setDisplayValue(value.toString())
  }, [value])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value.replace(/\D/g, "")
    
    if (rawValue === "") {
      setDisplayValue("")
      onChange(0)
      return
    }

    let numericValue = parseInt(rawValue, 10)
    
    if (max !== undefined && numericValue > max) numericValue = max
    if (min !== undefined && numericValue < min) numericValue = min

    setDisplayValue(numericValue.toString())
    onChange(numericValue)
  }

  return (
    <Input
      {...props}
      className={className}
      value={displayValue}
      onChange={handleChange}
      inputMode="numeric"
      type="text"
    />
  )
}
