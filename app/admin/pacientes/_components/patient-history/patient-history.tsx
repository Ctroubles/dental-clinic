"use client"

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "~/app/_components/ui/card"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "~/app/_components/ui/tabs"
import { TrackedCharge } from "@/domain/entities/tracked-charge"
import { Visit } from "@/domain/entities/visit"
import { PatientChargesTable } from "./patient-charges-table"
import { PatientVisitsTable } from "./patient-visits-table"

export default function PatientHistory({
  patientVisits,
  patientCharges,
}: {
  patientVisits: Visit[]
  patientCharges: TrackedCharge[]
}) {
  return (
    <Card className="gap-3">
      <CardHeader>
        <CardTitle className="text-2xl">Historial del Paciente</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="visits" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="visits">Visitas</TabsTrigger>
            <TabsTrigger value="charges">Cargos</TabsTrigger>
          </TabsList>

          <TabsContent value="visits">
            <PatientVisitsTable visits={patientVisits} />
          </TabsContent>

          <TabsContent value="charges">
            <PatientChargesTable charges={patientCharges} />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
