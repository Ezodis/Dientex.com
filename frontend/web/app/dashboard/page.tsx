"use client"

import { useEffect, useState } from "react"
import { MainLayout } from "@/app/components/layout/main-layout"
import { StatsCard } from "@/app/components/stats-card"
import { AppointmentCard } from "@/app/components/appointment-card"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/app/components/ui/card"
import { Button } from "@/app/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/app/components/ui/tabs"
import { Skeleton } from "@/app/components/ui/skeleton"
import {
  Calendar,
  Users,
  DollarSign,
  Activity,
  TrendingUp,
  UserPlus,
  CalendarPlus,
  FileText,
} from "lucide-react"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from "recharts"
import apiClient from "@/app/lib/api"

interface DashboardData {
  today: {
    appointments: number
    patients_attended: number
    income: number
  }
  pending_debts: number
  active_treatments: number
  total_patients: number
  upcoming_appointments: number
  monthly: {
    income: number
    expenses: number
    net: number
  }
}

const recentAppointments = [
  {
    id: "1",
    patientName: "María González",
    date: "2024-01-15",
    time: "09:00",
    type: "Limpieza Dental",
    status: "confirmed" as const,
  },
  {
    id: "2",
    patientName: "Juan Pérez",
    date: "2024-01-15",
    time: "10:30",
    type: "Revisión General",
    status: "scheduled" as const,
  },
  {
    id: "3",
    patientName: "Carlos Ruiz",
    date: "2024-01-15",
    time: "14:00",
    type: "Ortodoncia",
    status: "confirmed" as const,
  },
]

const monthlyData = [
  { month: "Ene", ingresos: 45000, gastos: 15000 },
  { month: "Feb", ingresos: 52000, gastos: 18000 },
  { month: "Mar", ingresos: 48000, gastos: 16000 },
  { month: "Abr", ingresos: 61000, gastos: 19000 },
  { month: "May", ingresos: 55000, gastos: 17000 },
  { month: "Jun", ingresos: 67000, gastos: 20000 },
]

const weeklyAppointments = [
  { day: "Lun", citas: 12 },
  { day: "Mar", citas: 15 },
  { day: "Mié", citas: 10 },
  { day: "Jue", citas: 18 },
  { day: "Vie", citas: 14 },
  { day: "Sáb", citas: 8 },
]

export default function DashboardPage() {
  const [data, setData] = useState<DashboardData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await apiClient.getDashboard() as DashboardData
        setData(result)
      } catch (err) {
        console.error("Dashboard fetch error:", err)
        setError(err instanceof Error ? err.message : "Error al cargar los datos")
      } finally {
        setLoading(false)
      }
    }

    fetchData()
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
            <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
            <p className="text-muted-foreground">
              Bienvenido a tu panel de control
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {[...Array(4)].map((_, i) => (
              <Skeleton key={i} className="h-32" />
            ))}
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            <Skeleton className="h-96 lg:col-span-4" />
            <Skeleton className="h-96 lg:col-span-3" />
          </div>
        </div>
      </MainLayout>
    )
  }

  if (error || !data) {
    return (
      <MainLayout>
        <Card className="border-destructive">
          <CardHeader>
            <CardTitle className="text-destructive">Error</CardTitle>
            <CardDescription>
              {error || "No se pudieron cargar los datos del dashboard"}
            </CardDescription>
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
      <div className="space-y-4 md:space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Dashboard</h1>
            <p className="text-sm md:text-base text-muted-foreground">
              Resumen de tu clínica dental
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" className="md:h-10 md:px-4 md:py-2">
              <UserPlus className="mr-0 md:mr-2 h-4 w-4" />
              <span className="hidden sm:inline">Nuevo Paciente</span>
              <span className="sm:hidden">Paciente</span>
            </Button>
            <Button size="sm" className="md:h-10 md:px-4 md:py-2">
              <CalendarPlus className="mr-0 md:mr-2 h-4 w-4" />
              <span className="hidden sm:inline">Nueva Cita</span>
              <span className="sm:hidden">Cita</span>
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <StatsCard
            title="Citas de Hoy"
            value={data.today.appointments}
            icon={Calendar}
            trend={{ value: 12, isPositive: true }}
          />
          <StatsCard
            title="Pacientes Atendidos"
            value={data.today.patients_attended}
            icon={Users}
            trend={{ value: 8, isPositive: true }}
          />
          <StatsCard
            title="Ingresos del Día"
            value={formatCurrency(data.today.income)}
            icon={DollarSign}
            trend={{ value: 15, isPositive: true }}
          />
          <StatsCard
            title="Tratamientos Activos"
            value={data.active_treatments}
            icon={Activity}
          />
        </div>

        {/* Charts and Recent Activity */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
          {/* Revenue Chart */}
          <Card className="lg:col-span-4">
            <CardHeader>
              <CardTitle>Ingresos vs Gastos</CardTitle>
              <CardDescription>
                Comparación mensual de ingresos y gastos
              </CardDescription>
            </CardHeader>
            <CardContent className="pl-2">
              <ResponsiveContainer width="100%" height={350}>
                <BarChart data={monthlyData}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis
                    dataKey="month"
                    className="text-sm"
                    tick={{ fill: "hsl(var(--muted-foreground))" }}
                  />
                  <YAxis
                    className="text-sm"
                    tick={{ fill: "hsl(var(--muted-foreground))" }}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--card))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "8px",
                    }}
                  />
                  <Bar dataKey="ingresos" fill="hsl(var(--primary))" radius={[8, 8, 0, 0]} />
                  <Bar dataKey="gastos" fill="hsl(var(--destructive))" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Recent Appointments */}
          <Card className="lg:col-span-3">
            <CardHeader>
              <CardTitle>Citas Recientes</CardTitle>
              <CardDescription>
                Últimas citas programadas
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {recentAppointments.map((appointment) => (
                <AppointmentCard key={appointment.id} appointment={appointment} />
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Additional Stats and Activity */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
          {/* Weekly Appointments Chart */}
          <Card className="lg:col-span-4">
            <CardHeader>
              <CardTitle>Citas Semanales</CardTitle>
              <CardDescription>
                Distribución de citas durante la semana
              </CardDescription>
            </CardHeader>
            <CardContent className="pl-2">
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={weeklyAppointments}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis
                    dataKey="day"
                    className="text-sm"
                    tick={{ fill: "hsl(var(--muted-foreground))" }}
                  />
                  <YAxis
                    className="text-sm"
                    tick={{ fill: "hsl(var(--muted-foreground))" }}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--card))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "8px",
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="citas"
                    stroke="hsl(var(--primary))"
                    strokeWidth={2}
                    dot={{ fill: "hsl(var(--primary))", r: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Quick Stats */}
          <Card className="lg:col-span-3">
            <CardHeader>
              <CardTitle>Resumen General</CardTitle>
              <CardDescription>Estadísticas generales de la clínica</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-sm font-medium text-muted-foreground">
                    Total de Pacientes
                  </p>
                  <p className="text-2xl font-bold">{data.total_patients}</p>
                </div>
                <Users className="h-8 w-8 text-muted-foreground" />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-sm font-medium text-muted-foreground">
                    Adeudos Pendientes
                  </p>
                  <p className="text-2xl font-bold text-destructive">
                    {formatCurrency(data.pending_debts)}
                  </p>
                </div>
                <DollarSign className="h-8 w-8 text-destructive" />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-sm font-medium text-muted-foreground">
                    Próximas Citas
                  </p>
                  <p className="text-2xl font-bold">{data.upcoming_appointments}</p>
                </div>
                <Calendar className="h-8 w-8 text-muted-foreground" />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-sm font-medium text-muted-foreground">
                    Balance Mensual
                  </p>
                  <p className={`text-2xl font-bold ${data.monthly.net >= 0 ? 'text-green-600' : 'text-destructive'}`}>
                    {formatCurrency(data.monthly.net)}
                  </p>
                </div>
                <TrendingUp className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </MainLayout>
  )
}
