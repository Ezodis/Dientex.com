"use client"

import { useEffect, useState } from "react"
import { MainLayout } from "@/app/components/layout/main-layout"
import { Button } from "@/app/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/app/components/ui/card"
import { Skeleton } from "@/app/components/ui/skeleton"
import { StatsCard } from "@/app/components/stats-card"
import { DollarSign, TrendingUp, TrendingDown, Wallet } from "lucide-react"
import apiClient from "@/app/lib/api"

interface FinancialSummary {
  total_income: number
  total_expenses: number
  net_balance: number
  pending_payments: number
}

export default function FinancePage() {
  const [summary, setSummary] = useState<FinancialSummary | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchFinancialData = async () => {
      try {
        const result = await apiClient.getFinancialSummary() as FinancialSummary
        setSummary(result)
      } catch (err) {
        console.error("Finance fetch error:", err)
        setError(err instanceof Error ? err.message : "Error al cargar datos financieros")
      } finally {
        setLoading(false)
      }
    }

    fetchFinancialData()
  }, [])

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("es-MX", {
      style: "currency",
      currency: "MXN",
    }).format(amount)
  }

  if (loading) {
    return (
      <MainLayout>
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Finanzas</h1>
            <p className="text-muted-foreground">
              Gestiona las finanzas de tu clínica
            </p>
          </div>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {[...Array(4)].map((_, i) => (
              <Skeleton key={i} className="h-32" />
            ))}
          </div>
        </div>
      </MainLayout>
    )
  }

  if (error) {
    return (
      <MainLayout>
        <Card className="border-destructive">
          <CardHeader>
            <CardTitle className="text-destructive">Error</CardTitle>
            <CardDescription>{error}</CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => window.location.reload()}>Reintentar</Button>
          </CardContent>
        </Card>
      </MainLayout>
    )
  }

  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Finanzas</h1>
            <p className="text-muted-foreground">
              Resumen financiero de tu clínica
            </p>
          </div>
          <Button>
            <DollarSign className="mr-2 h-4 w-4" />
            Registrar Pago
          </Button>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <StatsCard
            title="Ingresos Totales"
            value={formatCurrency(summary?.total_income || 0)}
            icon={TrendingUp}
            trend={{ value: 12, isPositive: true }}
          />
          <StatsCard
            title="Gastos Totales"
            value={formatCurrency(summary?.total_expenses || 0)}
            icon={TrendingDown}
          />
          <StatsCard
            title="Balance Neto"
            value={formatCurrency(summary?.net_balance || 0)}
            icon={Wallet}
            trend={{ value: 8, isPositive: true }}
          />
          <StatsCard
            title="Pagos Pendientes"
            value={formatCurrency(summary?.pending_payments || 0)}
            icon={DollarSign}
          />
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Ingresos Recientes</CardTitle>
              <CardDescription>Últimos movimientos de ingresos</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12">
                <p className="text-muted-foreground">
                  No hay ingresos recientes para mostrar
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Gastos Recientes</CardTitle>
              <CardDescription>Últimos movimientos de gastos</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12">
                <p className="text-muted-foreground">
                  No hay gastos recientes para mostrar
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </MainLayout>
  )
}
