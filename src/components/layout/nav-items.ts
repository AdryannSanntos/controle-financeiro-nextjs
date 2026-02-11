import {
    CalendarClock,
    HandCoins,
    History,
    Home,
    LayoutDashboard,
    PiggyBank,
    Settings,
    TrendingDown,
    TrendingUp
} from "lucide-react"

export const navItems = [
  {
    title: "Dashboard",
    href: "/",
    icon: LayoutDashboard,
  },
  {
    title: "Linha do Tempo",
    href: "/timeline",
    icon: History,
  },
  {
    title: "Receitas",
    href: "/incomes",
    icon: TrendingUp,
  },
  {
    title: "Despesas",
    href: "/expenses",
    icon: TrendingDown,
  },
  {
    title: "Aluguel & Moradia",
    href: "/housing",
    icon: Home,
  },
  {
    title: "Gastos Fixos",
    href: "/fixed",
    icon: CalendarClock,
  },
  {
    title: "Planejamento",
    href: "/planning",
    icon: PiggyBank,
  },
  {
    title: "Apoio Financeiro",
    href: "/support",
    icon: HandCoins,
  },
  {
    title: "Investimentos",
    href: "/investments",
    icon: PiggyBank,
  },
  {
    title: "Configurações",
    href: "/settings",
    icon: Settings,
  },
]
