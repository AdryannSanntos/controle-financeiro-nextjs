"use client"

import { ThemeToggle } from "@/components/theme-toggle"
import { MobileNav } from "./MobileNav"

export function Header() {
  return (
    <header className="flex h-14 items-center gap-4 border-b bg-card/50 px-4 lg:h-[60px] lg:px-6 sticky top-0 z-10 w-full backdrop-blur-xl transition-all duration-300">
      <MobileNav />
      <div className="w-full flex-1">
        {/* Breadcrumbs or Title could go here */}
      </div>
      <ThemeToggle />
    </header>
  )
}
