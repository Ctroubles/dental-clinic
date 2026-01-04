interface ChargeNotesProps {
  notes: string | undefined
}

export function ChargeNotes({ notes }: ChargeNotesProps) {
  if (!notes) return null

  return (
    <div className="space-y-2">
      <p className="text-sm font-medium">Notas del Tratamiento</p>
      <p className="text-sm text-muted-foreground leading-relaxed">{notes}</p>
    </div>
  )
}
