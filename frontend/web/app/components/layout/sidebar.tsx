"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/app/lib/utils"
import {
  LayoutDashboard,
  Users,
  Calendar,
  FileText,
  DollarSign,
  Settings,
  ChevronLeft,
  ChevronRight,
  Stethoscope,
} from "lucide-react"
import { Button } from "@/app/components/ui/button"
import { Separator } from "@/app/components/ui/separator"

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Pacientes", href: "/patients", icon: Users },
  { name: "Citas", href: "/appointments", icon: Calendar },
  { name: "Tratamientos", href: "/treatments", icon: FileText },
  { name: "Clínico", href: "/clinical", icon: Stethoscope },
  { name: "Finanzas", href: "/finance", icon: DollarSign },
  { name: "Configuración", href: "/settings", icon: Settings },
]

export function Sidebar() {
  const [collapsed, setCollapsed] = useState(false)
  const pathname = usePathname()

  return (
    <div
      className={cn(
        "relative hidden md:flex flex-col border-r bg-card transition-all duration-300",
        collapsed ? "w-16" : "w-64"
      )}
    >
      {/* Logo */}
      <div className="flex h-16 items-center justify-between px-4 border-b">
        {!collapsed && (
          <div className="flex items-center space-x-2">
            <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-lg">D</span>
            </div>
            <span className="font-semibold text-lg">Dientex</span>
          </div>
        )}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setCollapsed(!collapsed)}
          className={cn("h-8 w-8", collapsed && "mx-auto")}
        >
          {collapsed ? (
            <ChevronRight className="h-4 w-4" />
          ) : (
            <ChevronLeft className="h-4 w-4" />
          )}
        </Button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 p-2">
        {navigation.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                isActive
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-accent hover:text-accent-foreground",
                collapsed && "justify-center"
              )}
            >
              <item.icon className="h-5 w-5 shrink-0" />
              {!collapsed && <span>{item.name}</span>}
            </Link>
          )
        })}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t">
        <div className={cn("text-xs text-muted-foreground", collapsed && "text-center")}>
          {!collapsed ? "© 2024 Dientex" : "©"}
        </div>
      </div>
    </div>
  )
}
