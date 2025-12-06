import { Input } from "~/app/_components/ui/input"

interface ChargeDescriptionFieldProps {
  value: string
  onChange: (value: string) => void
  disabled?: boolean
}

export function ChargeDescriptionField({
  value,
  onChange,
  disabled = false,
}: ChargeDescriptionFieldProps) {
  return (
    <div className="flex-1">
      <label className="text-xs font-semibold text-muted-foreground mb-1 block">
        Descripción
      </label>
      <Input
        value={value}
        onChange={e => onChange(e.target.value)}
        className="text-sm"
        disabled={disabled}
      />
    </div>
  )
}
