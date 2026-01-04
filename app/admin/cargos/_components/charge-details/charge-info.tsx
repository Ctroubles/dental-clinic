import { User } from "lucide-react"

interface ChargeInfoProps {
  patientName: string
  doctorName: string
}

export function ChargeInfo({ patientName, doctorName }: ChargeInfoProps) {
  return (
    <div className="flex flex-wrap gap-x-8 gap-y-4 text-sm">
      <div className="flex items-center gap-2">
        <User className="h-4 w-4 text-muted-foreground" />
        <span className="text-muted-foreground">Paciente:</span>
        <span className="font-medium">{patientName}</span>
      </div>
      <div className="flex items-center gap-2">
        <User className="h-4 w-4 text-muted-foreground" />
        <span className="text-muted-foreground">Doctor:</span>
        <span className="font-medium">{doctorName}</span>
      </div>
    </div>
  )
}
