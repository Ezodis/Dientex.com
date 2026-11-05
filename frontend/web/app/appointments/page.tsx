"use client"

import { useEffect, useState } from "react"
import { MainLayout } from "@/app/components/layout/main-layout"
import { Button } from "@/app/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/app/components/ui/card"
import { Skeleton } from "@/app/components/ui/skeleton"
import { AppointmentCard } from "@/app/components/appointment-card"
import { CalendarPlus, Calendar as CalendarIcon } from "lucide-react"
import apiClient from "@/app/lib/api"

interface Appointment {
  id: string | number
  patient_name: string
  date: string
  start_time: string
  treatment_type: string
  status: "scheduled" | "confirmed" | "completed" | "cancelled"
}

export default function AppointmentsPage() {
  const [appointments, setAppointments] = useState<Appointment[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const result = await apiClient.getAppointments()
        setAppointments(Array.isArray(result) ? result : [])
      } catch (err) {
        console.error("Appointments fetch error:", err)
        setError(err instanceof Error ? err.message : "Error al cargar citas")
      } finally {
        setLoading(false)
      }
    }

    fetchAppointments()
  }, [])

  if (loading) {
    return (
      <MainLayout>
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Citas</h1>
            <p className="text-muted-foreground">
              Gestiona tus citas
            </p>
          </div>
          <Skeleton className="h-96" />
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
            <h1 className="text-3xl font-bold tracking-tight">Citas</h1>
            <p className="text-muted-foreground">
              Gestiona el calendario de citas
            </p>
          </div>
          <Button>
            <CalendarPlus className="mr-2 h-4 w-4" />
            Nueva Cita
          </Button>
        </div>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Calendario de Citas</CardTitle>
                <CardDescription>
                  {appointments.length} cita{appointments.length !== 1 ? "s" : ""} programada{appointments.length !== 1 ? "s" : ""}
                </CardDescription>
              </div>
              <CalendarIcon className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardHeader>
          <CardContent>
            {appointments.length === 0 ? (
              <div className="text-center py-12">
                <CalendarIcon className="mx-auto h-12 w-12 text-muted-foreground" />
                <p className="mt-4 text-muted-foreground">
                  No hay citas programadas
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {appointments.map((appointment) => (
                  <AppointmentCard 
                    key={appointment.id} 
                    appointment={{
                      id: String(appointment.id),
                      patientName: appointment.patient_name || "Sin nombre",
                      date: appointment.date || "",
                      time: appointment.start_time || "",
                      type: appointment.treatment_type || "Consulta general",
                      status: appointment.status || "scheduled",
                    }} 
                  />
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  )
}
