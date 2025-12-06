"use client"

import { useRouter } from "next/navigation"
import { Save, X } from "lucide-react"
import { Button } from "~/app/_components/ui/button"
import { getEntityFullname } from "~/lib/utils"
import { useVisitStore } from "@/features/cargos/hooks/use-visit-store"

export default function CargosHeader() {
  const router = useRouter()
  const { visit } = useVisitStore()

  const handleSaveDraft = async () => {
    // Mock API call
    alert("Borrador guardado exitosamente")
  }

  return (
    <header className="sticky top-0 z-50 border-b border-border">
      <div className="flex items-center justify-between pb-4">
        <div className="flex items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold text-foreground">
              Registrar Cargos
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* <Button
            variant="outline"
            onClick={handleSaveDraft}
            className="gap-2 bg-transparent"
          >
            <Save className="h-4 w-4" />
            Guardar borrador
          </Button> */}
        </div>
      </div>
    </header>
  )
}
