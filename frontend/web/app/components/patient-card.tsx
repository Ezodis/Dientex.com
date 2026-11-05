import { Card, CardContent, CardHeader } from "@/app/components/ui/card"
import { Badge } from "@/app/components/ui/badge"
import { Button } from "@/app/components/ui/button"
import { User, Phone, Mail, Calendar } from "lucide-react"
import { format } from "date-fns"
import { es } from "date-fns/locale"

interface PatientCardProps {
  patient: {
    id: string
    name: string
    email: string
    phone: string
    lastVisit?: string
    nextAppointment?: string
    status: "active" | "inactive"
  }
}

export function PatientCard({ patient }: PatientCardProps) {
  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
              <User className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold text-lg">{patient.name}</h3>
              <Badge variant={patient.status === "active" ? "success" : "secondary"}>
                {patient.status === "active" ? "Activo" : "Inactivo"}
              </Badge>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Mail className="h-4 w-4" />
          <span>{patient.email}</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Phone className="h-4 w-4" />
          <span>{patient.phone}</span>
        </div>
        {patient.nextAppointment && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Calendar className="h-4 w-4" />
            <span>
              Próxima cita:{" "}
              {format(new Date(patient.nextAppointment), "PP", { locale: es })}
            </span>
          </div>
        )}
        <div className="flex gap-2 pt-2">
          <Button size="sm" className="flex-1">
            Ver Detalles
          </Button>
          <Button size="sm" variant="outline" className="flex-1">
            Agendar Cita
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
