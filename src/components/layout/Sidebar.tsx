"use client"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { navItems } from "./nav-items"

export function Sidebar() {
  const pathname = usePathname()

  return (
    <div className="hidden border-r bg-card/50 backdrop-blur-xl md:block w-64 h-screen sticky top-0 overflow-y-auto transition-all duration-300">
      <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
        <Link href="/" className="flex items-center gap-2 font-semibold">
          <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
            <span className="text-primary-foreground font-bold">F</span>
          </div>
          <span className="text-xl font-bold tracking-tight">Finanças</span>
        </Link>
      </div>
      <div className="flex-1 py-6">
        <nav className="grid items-start px-4 text-sm font-medium gap-2">
          {navItems.map((item, index) => {
            const Icon = item.icon
            const isActive = pathname === item.href
            
            return (
              <Button
                key={index}
                variant={isActive ? "secondary" : "ghost"}
                className={cn(
                  "justify-start gap-3 px-3 w-full transition-colors duration-200",
                  isActive ? "bg-primary/10 text-primary hover:bg-primary/20" : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                )}
                asChild
              >
                <Link href={item.href}>
                  <Icon className={cn("h-4 w-4", isActive ? "text-primary" : "text-muted-foreground")} />
                  {item.title}
                </Link>
              </Button>
            )
          })}
        </nav>
      </div>
    </div>
  )
}
