"use client"

import { useEffect, useState } from "react"
import { MainLayout } from "@/app/components/layout/main-layout"
import { Button } from "@/app/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/app/components/ui/card"
import { Input } from "@/app/components/ui/input"
import { Skeleton } from "@/app/components/ui/skeleton"
import { DataTable } from "@/app/components/data-table"
import { UserPlus, Search } from "lucide-react"
import apiClient from "@/app/lib/api"

interface Patient {
  id: string | number
  full_name: string
  email: string
  phone: string
}

export default function PatientsPage() {
  const [patients, setPatients] = useState<Patient[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState("")

  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const result = await apiClient.getPatients()
        setPatients(Array.isArray(result) ? result : [])
      } catch (err) {
        console.error("Patients fetch error:", err)
        setError(err instanceof Error ? err.message : "Error al cargar pacientes")
      } finally {
        setLoading(false)
      }
    }

    fetchPatients()
  }, [])

  const filteredPatients = patients.filter((patient) =>
    patient.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    patient.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    patient.phone?.includes(searchTerm)
  )

  const columns = [
    { key: "full_name", header: "Nombre" },
    { key: "email", header: "Email" },
    { key: "phone", header: "Teléfono" },
    { 
      key: "actions", 
      header: "Acciones",
      render: () => (
        <Button variant="outline" size="sm">Ver</Button>
      )
    }
  ]

  if (loading) {
    return (
      <MainLayout>
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Pacientes</h1>
            <p className="text-muted-foreground">
              Gestiona tus pacientes
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
            <h1 className="text-3xl font-bold tracking-tight">Pacientes</h1>
            <p className="text-muted-foreground">
              Gestiona la información de tus pacientes
            </p>
          </div>
          <Button>
            <UserPlus className="mr-2 h-4 w-4" />
            Nuevo Paciente
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Lista de Pacientes</CardTitle>
            <CardDescription>
              {filteredPatients.length} paciente{filteredPatients.length !== 1 ? "s" : ""} encontrado{filteredPatients.length !== 1 ? "s" : ""}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="mb-4">
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar pacientes..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8"
                />
              </div>
            </div>
            {filteredPatients.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground">
                  {patients.length === 0 
                    ? "No hay pacientes registrados aún" 
                    : "No se encontraron pacientes"}
                </p>
              </div>
            ) : (
              <DataTable data={filteredPatients} columns={columns} searchable={false} />
            )}
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  )
}
