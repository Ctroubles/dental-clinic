import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/app/_components/ui/select"
import { ChargeProgressStatus } from "@/domain/enums"

interface ChargeProgressSelectProps {
  value: ChargeProgressStatus
  onChange: (value: ChargeProgressStatus) => void
}

export function ChargeProgressSelect({
  value,
  onChange,
}: ChargeProgressSelectProps) {
  return (
    <div className="w-32">
      <label className="text-xs font-semibold text-muted-foreground mb-1 block">
        Progreso
      </label>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger className="text-sm">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="inProgress">En Progreso</SelectItem>
          <SelectItem value="completed">Completado</SelectItem>
          <SelectItem value="cancelled">Cancelado</SelectItem>
        </SelectContent>
      </Select>
    </div>
  )
}
