import { Card, CardContent, CardHeader } from "@/app/components/ui/card"
import { Badge } from "@/app/components/ui/badge"
import { Button } from "@/app/components/ui/button"
import { Calendar, Clock, User } from "lucide-react"
import { format } from "date-fns"
import { es } from "date-fns/locale"

interface AppointmentCardProps {
  appointment: {
    id: string
    patientName: string
    date: string
    time: string
    type: string
    status: "scheduled" | "confirmed" | "completed" | "cancelled"
  }
}

const statusConfig = {
  scheduled: { label: "Programada", variant: "secondary" as const },
  confirmed: { label: "Confirmada", variant: "success" as const },
  completed: { label: "Completada", variant: "default" as const },
  cancelled: { label: "Cancelada", variant: "destructive" as const },
}

export function AppointmentCard({ appointment }: AppointmentCardProps) {
  const status = statusConfig[appointment.status]

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <User className="h-4 w-4 text-muted-foreground" />
              <h3 className="font-semibold">{appointment.patientName}</h3>
            </div>
            <p className="text-sm text-muted-foreground">{appointment.type}</p>
          </div>
          <Badge variant={status.variant}>{status.label}</Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex items-center gap-4 text-sm">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Calendar className="h-4 w-4" />
            <span>{format(new Date(appointment.date), "PP", { locale: es })}</span>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <Clock className="h-4 w-4" />
            <span>{appointment.time}</span>
          </div>
        </div>
        {appointment.status === "scheduled" && (
          <div className="flex gap-2 pt-2">
            <Button size="sm" variant="outline" className="flex-1">
              Confirmar
            </Button>
            <Button size="sm" variant="outline" className="flex-1">
              Cancelar
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
