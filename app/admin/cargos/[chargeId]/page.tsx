"use client"

import { useMemo } from "react"
import Link from "next/link"
import { useParams } from "next/navigation"
import PageContainer from "~/app/_components/layout/page-container"
import { Button } from "~/app/_components/ui/button"
import { Separator } from "~/app/_components/ui/separator"
import { Skeleton } from "~/app/_components/ui/skeleton"
import {
  ChargeBadges,
  ChargeFinancialSummary,
  ChargeInfo,
  ChargeNotes,
  ChargeTimeline,
} from "~/app/admin/cargos/_components/charge-details"
import { dateToHumanReadable } from "~/lib/utils"
import { useGetTrackedChargeById } from "@/features/cargos/hooks/api/queries"

export default function ChargeDetailsPage() {
  const params = useParams<{ chargeId: string }>()
  const { data: chargeData, isLoading } = useGetTrackedChargeById(
    params.chargeId
  )

  const charge = useMemo(() => {
    if (!chargeData) return null

    const patientName = chargeData.patient
      ? `${chargeData.patient.firstName} ${chargeData.patient.lastName}`
      : "Sin paciente"

    const doctorName = chargeData.doctor
      ? `${chargeData.doctor.firstName} ${chargeData.doctor.lastName}`
      : "Sin doctor"

    return {
      ...chargeData,
      notes: chargeData.notes ?? undefined,
      patient: { name: patientName },
      doctor: { name: doctorName },
      visits: chargeData.visits ?? [],
    }
  }, [chargeData])

  if (isLoading) {
    return (
      <PageContainer scrollable>
        <div className="flex flex-1 flex-col space-y-4">
          <Skeleton className="h-10 w-[300px]" />
          <Skeleton className="h-6 w-[200px]" />
          <Skeleton className="h-[400px] w-full" />
        </div>
      </PageContainer>
    )
  }

  if (!charge) {
    return (
      <PageContainer scrollable>
        <div className="flex flex-1 flex-col items-center justify-center space-y-4">
          <p className="text-muted-foreground">Cargo no encontrado</p>
          <Button variant="outline" asChild>
            <Link href="/admin/cargos">Volver</Link>
          </Button>
        </div>
      </PageContainer>
    )
  }

  return (
    <PageContainer scrollable>
      <div className="flex flex-1 flex-col space-y-4 pb-20">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-balance">
              {charge.description}
            </h1>
            <p className="text-muted-foreground text-sm mt-1">
              Creado el {dateToHumanReadable(charge.createdAt)}
            </p>
          </div>
          <Button variant="outline" asChild>
            <Link href="/admin/cargos">Volver</Link>
          </Button>
        </div>

        <ChargeBadges
          paymentStatus={charge.paymentStatus}
          progressStatus={charge.progressStatus}
        />

        <Separator />

        <ChargeInfo
          patientName={charge.patient.name}
          doctorName={charge.doctor.name}
        />

        <ChargeFinancialSummary
          totalPrice={charge.totalPrice}
          paidAmount={charge.paidAmount}
        />

        <ChargeNotes notes={charge.notes} />

        <Separator className="my-4" />

        <ChargeTimeline
          visits={charge.visits ?? undefined}
          progressStatus={charge.progressStatus}
        />
      </div>
    </PageContainer>
  )
}
