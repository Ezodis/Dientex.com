"use client"

import { useEffect, useState } from "react"
import { MainLayout } from "@/app/components/layout/main-layout"
import { Button } from "@/app/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/app/components/ui/card"
import { Skeleton } from "@/app/components/ui/skeleton"
import { Badge } from "@/app/components/ui/badge"
import { FileText, Plus } from "lucide-react"
import apiClient from "@/app/lib/api"

interface Treatment {
  id: string | number
  name?: string
  treatment_type?: string
  patient_name?: string
  status: "in_progress" | "completed" | "cancelled" | "pending"
}

export default function TreatmentsPage() {
  const [treatments, setTreatments] = useState<Treatment[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchTreatments = async () => {
      try {
        const result = await apiClient.getTreatments()
        setTreatments(Array.isArray(result) ? result : [])
      } catch (err) {
        console.error("Treatments fetch error:", err)
        setError(err instanceof Error ? err.message : "Error al cargar tratamientos")
      } finally {
        setLoading(false)
      }
    }

    fetchTreatments()
  }, [])

  const getStatusBadge = (status: string) => {
    const statusMap: Record<string, { label: string; variant: "default" | "secondary" | "destructive" | "outline" }> = {
      in_progress: { label: "En progreso", variant: "default" },
      completed: { label: "Completado", variant: "secondary" },
      cancelled: { label: "Cancelado", variant: "destructive" },
      pending: { label: "Pendiente", variant: "outline" },
    }
    const config = statusMap[status] || { label: status, variant: "outline" }
    return <Badge variant={config.variant}>{config.label}</Badge>
  }

  if (loading) {
    return (
      <MainLayout>
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Tratamientos</h1>
            <p className="text-muted-foreground">
              Gestiona los tratamientos
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
            <h1 className="text-3xl font-bold tracking-tight">Tratamientos</h1>
            <p className="text-muted-foreground">
              Gestiona los tratamientos dentales
            </p>
          </div>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Nuevo Tratamiento
          </Button>
        </div>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Lista de Tratamientos</CardTitle>
                <CardDescription>
                  {treatments.length} tratamiento{treatments.length !== 1 ? "s" : ""} registrado{treatments.length !== 1 ? "s" : ""}
                </CardDescription>
              </div>
              <FileText className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardHeader>
          <CardContent>
            {treatments.length === 0 ? (
              <div className="text-center py-12">
                <FileText className="mx-auto h-12 w-12 text-muted-foreground" />
                <p className="mt-4 text-muted-foreground">
                  No hay tratamientos registrados
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {treatments.map((treatment) => (
                  <div
                    key={treatment.id}
                    className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent transition-colors"
                  >
                    <div className="space-y-1">
                      <p className="font-medium">{treatment.name || treatment.treatment_type || "Sin nombre"}</p>
                      <p className="text-sm text-muted-foreground">
                        Paciente: {treatment.patient_name || "Sin asignar"}
                      </p>
                    </div>
                    <div className="flex items-center gap-4">
                      {getStatusBadge(treatment.status || "pending")}
                      <Button variant="outline" size="sm">
                        Ver detalles
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  )
}
