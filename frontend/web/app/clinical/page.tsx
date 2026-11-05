"use client"

import { useEffect, useState } from "react"
import { MainLayout } from "@/app/components/layout/main-layout"
import { Button } from "@/app/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/app/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/app/components/ui/tabs"
import { Skeleton } from "@/app/components/ui/skeleton"
import { Badge } from "@/app/components/ui/badge"
import { Odontogram } from "@/app/components/odontogram"
import {
  Stethoscope,
  FileText,
  Paperclip,
  ClipboardList,
  Activity,
  AlertCircle,
  Pill,
  Wind,
} from "lucide-react"
import apiClient from "@/app/lib/api"

// ─── Types ────────────────────────────────────────────────────────────────────

interface MedicalHistory {
  id: number
  patient: number
  patient_name: string
  chronic_diseases: string | null
  current_medications: string | null
  allergies: string | null
  previous_dental_treatments: string | null
  smoking: boolean
  alcohol_consumption: boolean
  notes: string | null
  created_at: string
  updated_at: string
}

interface ClinicalNote {
  id: number
  patient: number
  patient_name: string
  date: string
  title: string
  description: string
  observations: string | null
  created_by: string | null
  created_at: string
  updated_at: string
}

interface ClinicalFile {
  id: number
  patient: number
  patient_name: string
  file_type: string
  file: string
  file_url: string | null
  title: string
  description: string | null
  date_taken: string | null
  uploaded_by: string | null
  uploaded_at: string
}

interface Periodontogram {
  id: number
  patient: number
  patient_name: string
  measurements: Record<string, number[]>
  date: string
  notes: string | null
  has_abnormal_values: boolean
  created_at: string
  updated_at: string
}

// ─── Mock Data ────────────────────────────────────────────────────────────────

const MOCK_MEDICAL_HISTORY: MedicalHistory = {
  id: 1,
  patient: 1,
  patient_name: "María González",
  chronic_diseases: "Diabetes tipo 2, Hipertensión arterial",
  current_medications: "Metformina 850mg, Enalapril 10mg",
  allergies: "Penicilina, Látex",
  previous_dental_treatments: "Extracción pieza 36 (2021), Ortodoncia (2018-2020)",
  smoking: false,
  alcohol_consumption: false,
  notes: "Paciente colaboradora. Control médico periódico cada 3 meses.",
  created_at: "2024-01-10T10:00:00Z",
  updated_at: "2024-03-01T09:30:00Z",
}

const MOCK_CLINICAL_NOTES: ClinicalNote[] = [
  {
    id: 1,
    patient: 1,
    patient_name: "María González",
    date: "2024-03-15",
    title: "Revisión periódica de rutina",
    description: "Se realiza limpieza dental profunda y evaluación de encías.",
    observations: "Leve gingivitis en sector anterior superior. Se indica uso de colutorio con clorhexidina por 10 días.",
    created_by: "Dr. Rodríguez",
    created_at: "2024-03-15T11:00:00Z",
    updated_at: "2024-03-15T11:30:00Z",
  },
  {
    id: 2,
    patient: 1,
    patient_name: "María González",
    date: "2024-01-22",
    title: "Urgencia: Dolor pieza 26",
    description: "Paciente acude por dolor agudo en molar superior izquierdo.",
    observations: "Caries profunda con posible afectación pulpar. Se realiza apertura endodóntica de emergencia y medicación provisional.",
    created_by: "Dr. Rodríguez",
    created_at: "2024-01-22T16:00:00Z",
    updated_at: "2024-01-22T16:45:00Z",
  },
  {
    id: 3,
    patient: 1,
    patient_name: "María González",
    date: "2023-11-05",
    title: "Obturación piezas 14 y 15",
    description: "Se realizan obturaciones con composite en premolares superiores.",
    observations: "Procedimiento sin incidencias. Control a los 15 días.",
    created_by: "Dr. Rodríguez",
    created_at: "2023-11-05T09:00:00Z",
    updated_at: "2023-11-05T10:00:00Z",
  },
]

const MOCK_CLINICAL_FILES: ClinicalFile[] = [
  {
    id: 1,
    patient: 1,
    patient_name: "María González",
    file_type: "radiograph",
    file: "clinical_files/2024/03/panoramica.jpg",
    file_url: null,
    title: "Radiografía Panorámica",
    description: "Panorámica de control anual 2024",
    date_taken: "2024-03-15",
    uploaded_by: "Dr. Rodríguez",
    uploaded_at: "2024-03-15T11:30:00Z",
  },
  {
    id: 2,
    patient: 1,
    patient_name: "María González",
    file_type: "photo",
    file: "clinical_files/2024/01/foto_inicial.jpg",
    file_url: null,
    title: "Foto clínica inicial",
    description: "Fotografía intraoral frontal en oclusión",
    date_taken: "2024-01-22",
    uploaded_by: "Dr. Rodríguez",
    uploaded_at: "2024-01-22T16:00:00Z",
  },
  {
    id: 3,
    patient: 1,
    patient_name: "María González",
    file_type: "pdf",
    file: "clinical_files/2023/11/analisis.pdf",
    file_url: null,
    title: "Análisis de laboratorio",
    description: "Hemograma y glucemia previos al tratamiento",
    date_taken: "2023-11-01",
    uploaded_by: "Dr. Rodríguez",
    uploaded_at: "2023-11-05T08:30:00Z",
  },
]

const MOCK_PERIODONTOGRAM: Periodontogram = {
  id: 1,
  patient: 1,
  patient_name: "María González",
  measurements: {
    "11": [2, 2, 3, 2, 2, 3],
    "12": [2, 3, 2, 2, 3, 2],
    "13": [3, 2, 2, 3, 2, 2],
    "14": [2, 2, 2, 2, 2, 2],
    "15": [2, 2, 3, 2, 2, 3],
    "16": [4, 4, 3, 3, 4, 4],
    "17": [3, 3, 4, 3, 3, 4],
    "21": [2, 2, 3, 2, 2, 3],
    "22": [2, 3, 2, 2, 3, 2],
    "23": [3, 2, 2, 3, 2, 2],
    "24": [2, 2, 2, 2, 2, 2],
    "25": [2, 2, 3, 2, 2, 3],
    "26": [5, 4, 4, 4, 5, 4],
    "27": [3, 3, 4, 3, 3, 4],
  },
  date: "2024-03-15",
  notes: "Bolsas periodontales aumentadas en sector posterior. Se recomienda RAR.",
  has_abnormal_values: true,
  created_at: "2024-03-15T11:00:00Z",
  updated_at: "2024-03-15T11:00:00Z",
}

// ─── Helper utilities ─────────────────────────────────────────────────────────

const FILE_TYPE_LABELS: Record<string, string> = {
  photo: "Foto Clínica",
  radiograph: "Radiografía",
  pdf: "Documento PDF",
  other: "Otro",
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("es-ES", {
    year: "numeric",
    month: "long",
    day: "numeric",
  })
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function ClinicalPage() {
  const [medicalHistory, setMedicalHistory] = useState<MedicalHistory | null>(null)
  const [clinicalNotes, setClinicalNotes] = useState<ClinicalNote[]>([])
  const [clinicalFiles, setClinicalFiles] = useState<ClinicalFile[]>([])
  const [periodontogram, setPeriodontogram] = useState<Periodontogram | null>(null)
  const [loading, setLoading] = useState(true)
  const [usingMockData, setUsingMockData] = useState(false)

  useEffect(() => {
    const fetchClinicalData = async () => {
      try {
        const [historyResult, notesResult, filesResult, perioResult] = await Promise.allSettled([
          apiClient.getMedicalHistories(),
          apiClient.getClinicalNotes(),
          apiClient.getClinicalFiles(),
          apiClient.getPeriodontograms(),
        ])

        let anyRealData = false

        if (historyResult.status === "fulfilled") {
          const data = historyResult.value as MedicalHistory[]
          if (Array.isArray(data) && data.length > 0) {
            setMedicalHistory(data[0])
            anyRealData = true
          }
        }

        if (notesResult.status === "fulfilled") {
          const data = notesResult.value as ClinicalNote[]
          if (Array.isArray(data) && data.length > 0) {
            setClinicalNotes(data)
            anyRealData = true
          }
        }

        if (filesResult.status === "fulfilled") {
          const data = filesResult.value as ClinicalFile[]
          if (Array.isArray(data) && data.length > 0) {
            setClinicalFiles(data)
            anyRealData = true
          }
        }

        if (perioResult.status === "fulfilled") {
          const data = perioResult.value as Periodontogram[]
          if (Array.isArray(data) && data.length > 0) {
            setPeriodontogram(data[0])
            anyRealData = true
          }
        }

        if (!anyRealData) {
          setMedicalHistory(MOCK_MEDICAL_HISTORY)
          setClinicalNotes(MOCK_CLINICAL_NOTES)
          setClinicalFiles(MOCK_CLINICAL_FILES)
          setPeriodontogram(MOCK_PERIODONTOGRAM)
          setUsingMockData(true)
        }
      } catch {
        setMedicalHistory(MOCK_MEDICAL_HISTORY)
        setClinicalNotes(MOCK_CLINICAL_NOTES)
        setClinicalFiles(MOCK_CLINICAL_FILES)
        setPeriodontogram(MOCK_PERIODONTOGRAM)
        setUsingMockData(true)
      } finally {
        setLoading(false)
      }
    }

    fetchClinicalData()
  }, [])

  if (loading) {
    return (
      <MainLayout>
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Vista Clínica</h1>
            <p className="text-muted-foreground">Cargando historial clínico...</p>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <Skeleton className="h-64" />
            <Skeleton className="h-64" />
          </div>
          <Skeleton className="h-96" />
        </div>
      </MainLayout>
    )
  }

  return (
    <MainLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Vista Clínica</h1>
            <p className="text-muted-foreground">
              Historial médico, notas clínicas y odontograma del paciente
            </p>
          </div>
          {usingMockData && (
            <Badge variant="secondary" className="gap-1">
              <AlertCircle className="h-3 w-3" />
              Datos de demostración
            </Badge>
          )}
        </div>

        {/* Patient banner */}
        {medicalHistory && (
          <Card className="bg-primary/5 border-primary/20">
            <CardContent className="pt-4 pb-4">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-bold">
                  {medicalHistory.patient_name.charAt(0)}
                </div>
                <div>
                  <p className="font-semibold">{medicalHistory.patient_name}</p>
                  <p className="text-sm text-muted-foreground">
                    Última actualización: {formatDate(medicalHistory.updated_at)}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Tabs */}
        <Tabs defaultValue="medical-history">
          <TabsList className="flex-wrap h-auto gap-1">
            <TabsTrigger value="medical-history" className="gap-1">
              <Stethoscope className="h-4 w-4" />
              Historial Médico
            </TabsTrigger>
            <TabsTrigger value="notes" className="gap-1">
              <FileText className="h-4 w-4" />
              Notas Clínicas
            </TabsTrigger>
            <TabsTrigger value="odontogram" className="gap-1">
              <ClipboardList className="h-4 w-4" />
              Odontograma
            </TabsTrigger>
            <TabsTrigger value="files" className="gap-1">
              <Paperclip className="h-4 w-4" />
              Archivos
            </TabsTrigger>
            <TabsTrigger value="periodontogram" className="gap-1">
              <Activity className="h-4 w-4" />
              Periodontograma
            </TabsTrigger>
          </TabsList>

          {/* ── Medical History ─────────────────────────────────────────── */}
          <TabsContent value="medical-history" className="mt-4">
            {medicalHistory ? (
              <div className="grid gap-4 md:grid-cols-2">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-base">
                      <AlertCircle className="h-4 w-4 text-destructive" />
                      Enfermedades Crónicas
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm">
                      {medicalHistory.chronic_diseases || "Sin enfermedades crónicas registradas"}
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-base">
                      <Pill className="h-4 w-4 text-blue-500" />
                      Medicamentos Actuales
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm">
                      {medicalHistory.current_medications || "Sin medicamentos registrados"}
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-base">
                      <Wind className="h-4 w-4 text-orange-500" />
                      Alergias
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm">
                      {medicalHistory.allergies || "Sin alergias conocidas"}
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-base">
                      <Stethoscope className="h-4 w-4 text-primary" />
                      Tratamientos Dentales Previos
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm">
                      {medicalHistory.previous_dental_treatments || "Sin tratamientos previos registrados"}
                    </p>
                  </CardContent>
                </Card>

                <Card className="md:col-span-2">
                  <CardHeader>
                    <CardTitle className="text-base">Hábitos y Observaciones</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex gap-4 mb-4">
                      <Badge variant={medicalHistory.smoking ? "destructive" : "secondary"}>
                        {medicalHistory.smoking ? "Fumador" : "No fumador"}
                      </Badge>
                      <Badge variant={medicalHistory.alcohol_consumption ? "destructive" : "secondary"}>
                        {medicalHistory.alcohol_consumption ? "Consume alcohol" : "No consume alcohol"}
                      </Badge>
                    </div>
                    {medicalHistory.notes && (
                      <p className="text-sm text-muted-foreground">{medicalHistory.notes}</p>
                    )}
                  </CardContent>
                </Card>
              </div>
            ) : (
              <Card>
                <CardContent className="py-12 text-center">
                  <Stethoscope className="mx-auto h-10 w-10 text-muted-foreground mb-3" />
                  <p className="text-muted-foreground">No hay historial médico registrado</p>
                  <Button className="mt-4" size="sm">Crear historial médico</Button>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* ── Clinical Notes ───────────────────────────────────────────── */}
          <TabsContent value="notes" className="mt-4">
            <div className="flex justify-between items-center mb-4">
              <p className="text-sm text-muted-foreground">
                {clinicalNotes.length} nota{clinicalNotes.length !== 1 ? "s" : ""} clínica{clinicalNotes.length !== 1 ? "s" : ""}
              </p>
              <Button size="sm">
                <FileText className="mr-2 h-4 w-4" />
                Nueva nota
              </Button>
            </div>
            {clinicalNotes.length === 0 ? (
              <Card>
                <CardContent className="py-12 text-center">
                  <FileText className="mx-auto h-10 w-10 text-muted-foreground mb-3" />
                  <p className="text-muted-foreground">No hay notas clínicas registradas</p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {clinicalNotes.map((note) => (
                  <Card key={note.id}>
                    <CardHeader className="pb-2">
                      <div className="flex items-start justify-between">
                        <CardTitle className="text-base">{note.title}</CardTitle>
                        <span className="text-xs text-muted-foreground shrink-0 ml-2">
                          {formatDate(note.date)}
                        </span>
                      </div>
                      {note.created_by && (
                        <CardDescription>{note.created_by}</CardDescription>
                      )}
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <p className="text-sm">{note.description}</p>
                      {note.observations && (
                        <div className="rounded-md bg-muted p-3">
                          <p className="text-xs font-medium text-muted-foreground mb-1">Observaciones clínicas</p>
                          <p className="text-sm">{note.observations}</p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          {/* ── Odontogram ───────────────────────────────────────────────── */}
          <TabsContent value="odontogram" className="mt-4">
            <Odontogram />
          </TabsContent>

          {/* ── Clinical Files ───────────────────────────────────────────── */}
          <TabsContent value="files" className="mt-4">
            <div className="flex justify-between items-center mb-4">
              <p className="text-sm text-muted-foreground">
                {clinicalFiles.length} archivo{clinicalFiles.length !== 1 ? "s" : ""}
              </p>
              <Button size="sm">
                <Paperclip className="mr-2 h-4 w-4" />
                Subir archivo
              </Button>
            </div>
            {clinicalFiles.length === 0 ? (
              <Card>
                <CardContent className="py-12 text-center">
                  <Paperclip className="mx-auto h-10 w-10 text-muted-foreground mb-3" />
                  <p className="text-muted-foreground">No hay archivos clínicos adjuntos</p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {clinicalFiles.map((file) => (
                  <Card key={file.id}>
                    <CardHeader className="pb-2">
                      <div className="flex items-center justify-between">
                        <Badge variant="outline" className="text-xs">
                          {FILE_TYPE_LABELS[file.file_type] ?? file.file_type}
                        </Badge>
                        {file.date_taken && (
                          <span className="text-xs text-muted-foreground">
                            {formatDate(file.date_taken)}
                          </span>
                        )}
                      </div>
                      <CardTitle className="text-sm">{file.title}</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      {file.description && (
                        <p className="text-xs text-muted-foreground">{file.description}</p>
                      )}
                      {file.file_url ? (
                        <a
                          href={file.file_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs text-primary hover:underline"
                        >
                          Ver archivo
                        </a>
                      ) : (
                        <span className="text-xs text-muted-foreground italic">
                          Archivo no disponible en modo demostración
                        </span>
                      )}
                      {file.uploaded_by && (
                        <p className="text-xs text-muted-foreground">
                          Subido por: {file.uploaded_by}
                        </p>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          {/* ── Periodontogram ───────────────────────────────────────────── */}
          <TabsContent value="periodontogram" className="mt-4">
            {periodontogram ? (
              <div className="space-y-4">
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="flex items-center gap-2">
                        <Activity className="h-5 w-5" />
                        Periodontograma
                      </CardTitle>
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-muted-foreground">
                          {formatDate(periodontogram.date)}
                        </span>
                        {periodontogram.has_abnormal_values && (
                          <Badge variant="destructive" className="gap-1">
                            <AlertCircle className="h-3 w-3" />
                            Valores anormales
                          </Badge>
                        )}
                      </div>
                    </div>
                    <CardDescription>
                      6 mediciones por diente (rango normal: 1–3 mm)
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="overflow-x-auto">
                    <table className="w-full text-xs">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left py-2 pr-4 font-medium text-muted-foreground">Diente</th>
                          <th className="text-center py-2 px-1 font-medium text-muted-foreground">M1</th>
                          <th className="text-center py-2 px-1 font-medium text-muted-foreground">M2</th>
                          <th className="text-center py-2 px-1 font-medium text-muted-foreground">M3</th>
                          <th className="text-center py-2 px-1 font-medium text-muted-foreground">M4</th>
                          <th className="text-center py-2 px-1 font-medium text-muted-foreground">M5</th>
                          <th className="text-center py-2 px-1 font-medium text-muted-foreground">M6</th>
                        </tr>
                      </thead>
                      <tbody>
                        {Object.entries(periodontogram.measurements).map(([tooth, values]) => {
                          const hasAbnormal = values.some((v) => v > 3)
                          return (
                            <tr
                              key={tooth}
                              className={`border-b last:border-0 ${hasAbnormal ? "bg-destructive/5" : ""}`}
                            >
                              <td className="py-2 pr-4 font-medium">Diente {tooth}</td>
                              {values.map((v, i) => (
                                <td
                                  key={i}
                                  className={`text-center py-2 px-1 font-mono ${v > 3 ? "text-destructive font-bold" : ""}`}
                                >
                                  {v}
                                </td>
                              ))}
                            </tr>
                          )
                        })}
                      </tbody>
                    </table>
                    {periodontogram.notes && (
                      <div className="mt-4 rounded-md bg-muted p-3">
                        <p className="text-xs font-medium text-muted-foreground mb-1">Notas</p>
                        <p className="text-sm">{periodontogram.notes}</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            ) : (
              <Card>
                <CardContent className="py-12 text-center">
                  <Activity className="mx-auto h-10 w-10 text-muted-foreground mb-3" />
                  <p className="text-muted-foreground">No hay periodontograma registrado</p>
                  <Button className="mt-4" size="sm">Crear periodontograma</Button>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  )
}
