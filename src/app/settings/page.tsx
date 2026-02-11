"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { CurrencyInput } from "@/components/ui/currency-input"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { NumericInput } from "@/components/ui/numeric-input"
import { useFinanceStore } from "@/store/financeStore"
import { Download, Moon, Save, Sun, Trash2, Upload } from "lucide-react"
import { useTheme } from "next-themes"
import { useEffect, useRef, useState } from "react"
import { toast } from "sonner"

export default function SettingsPage() {
  const store = useFinanceStore()
  const { theme, setTheme } = useTheme()
  const fileInputRef = useRef<HTMLInputElement>(null)
  
  // Local state for settings to allow "Save" button functionality
  const [localSettings, setLocalSettings] = useState(store.settings)

  useEffect(() => {
    setLocalSettings(store.settings)
  }, [store.settings])

  const handleSave = () => {
    store.updateSettings(localSettings)
    toast.success("Configurações salvas com sucesso!")
  }

  const handleExport = () => {
    try {
        const data = {
            transactions: store.transactions,
            fixedExpenses: store.fixedExpenses,
            budgets: store.budgets,
            financialSupport: store.financialSupport,
            settings: store.settings
        }
        
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" })
        const url = URL.createObjectURL(blob)
        const a = document.createElement("a")
        a.href = url
        a.download = `financas-${new Date().toISOString().split('T')[0]}.json`
        document.body.appendChild(a)
        a.click()
        document.body.removeChild(a)
        URL.revokeObjectURL(url)
        toast.success("Dados exportados com sucesso!")
    } catch (error) {
        toast.error("Erro ao exportar dados")
    }
  }

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (event) => {
        try {
            const json = JSON.parse(event.target?.result as string)
            store.importData(json)
            toast.success("Dados importados com sucesso!")
        } catch (error) {
            toast.error("Arquivo inválido. Importação falhou.")
        }
    }
    reader.readAsText(file)
    if (fileInputRef.current) fileInputRef.current.value = ""
  }

  const handleReset = () => {
      if (confirm("ATENÇÃO: Isso apagará TODOS os seus dados permanentemente. Tem certeza?")) {
          // Double confirmation
          if (confirm("Tem certeza absoluta? Esta ação não pode ser desfeita.")) {
            store.resetData()
            toast.success("Sistema resetado com sucesso.")
          }
      }
  }

  return (
    <div className="flex-1 space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Configurações</h2>
        <Button onClick={handleSave} className="gap-2">
          <Save className="h-4 w-4" />
          Salvar Alterações
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Perfil Financeiro</CardTitle>
              <CardDescription>Defina as bases do seu planejamento mensal.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-2">
                <Label htmlFor="userName">Seu Nome / Apelido</Label>
                <Input 
                  id="userName" 
                  value={localSettings.userName} 
                  onChange={(e) => setLocalSettings(prev => ({ ...prev, userName: e.target.value }))}
                  placeholder="Ex: Adryan"
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="monthlySalary">Salário Mensal Líquido</Label>
                <CurrencyInput 
                  id="monthlySalary" 
                  value={localSettings.monthlySalary} 
                  onChange={(val) => setLocalSettings(prev => ({ ...prev, monthlySalary: val }))}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="rentAmount">Valor do Aluguel</Label>
                  <CurrencyInput 
                    id="rentAmount" 
                    value={localSettings.rentAmount} 
                    onChange={(val) => setLocalSettings(prev => ({ ...prev, rentAmount: val }))}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="rentDueDate">Dia do Vencimento</Label>
                  <NumericInput 
                    id="rentDueDate" 
                    min={1}
                    max={31}
                    value={localSettings.rentDueDate} 
                    onChange={(val) => setLocalSettings(prev => ({ ...prev, rentDueDate: val }))}
                  />
                </div>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="emergencyFundGoal">Meta Reserva de Emergência</Label>
                <CurrencyInput 
                  id="emergencyFundGoal" 
                  value={localSettings.emergencyFundGoal} 
                  onChange={(val) => setLocalSettings(prev => ({ ...prev, emergencyFundGoal: val }))}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
              <CardHeader>
                  <CardTitle>Aparência</CardTitle>
                  <CardDescription>Personalize a interface do sistema.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                      <Label htmlFor="theme">Tema</Label>
                      <div className="flex gap-2">
                          <Button 
                              variant={theme === 'light' ? 'default' : 'outline'} 
                              size="icon"
                              onClick={() => setTheme('light')}
                          >
                              <Sun className="h-4 w-4" />
                          </Button>
                          <Button 
                              variant={theme === 'dark' ? 'default' : 'outline'} 
                              size="icon"
                              onClick={() => setTheme('dark')}
                          >
                              <Moon className="h-4 w-4" />
                          </Button>
                      </div>
                  </div>
              </CardContent>
          </Card>
        </div>

        <div className="space-y-4">
          <Card>
              <CardHeader>
                  <CardTitle>Dados do Sistema</CardTitle>
                  <CardDescription>Exporte, importe ou apague seus registros.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                  <div className="flex flex-col gap-2">
                      <Button variant="outline" className="w-full justify-start" onClick={handleExport}>
                          <Download className="mr-2 h-4 w-4" />
                          Exportar Dados (JSON)
                      </Button>
                      
                      <div className="relative">
                          <Input 
                              type="file" 
                              accept=".json" 
                              className="hidden" 
                              ref={fileInputRef}
                              onChange={handleImport}
                          />
                          <Button 
                              variant="outline" 
                              className="w-full justify-start" 
                              onClick={() => fileInputRef.current?.click()}
                          >
                              <Upload className="mr-2 h-4 w-4" />
                              Importar Dados (JSON)
                          </Button>
                      </div>

                      <Button variant="destructive" className="w-full justify-start mt-4" onClick={handleReset}>
                          <Trash2 className="mr-2 h-4 w-4" />
                          Resetar Todos os Dados
                      </Button>
                  </div>
              </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
