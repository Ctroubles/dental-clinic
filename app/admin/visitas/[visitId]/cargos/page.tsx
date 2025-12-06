"use client"

import { use, useEffect, useState } from "react"
import { Loader2 } from "lucide-react"
import PageContainer from "~/app/_components/layout/page-container"
import { useVisitStore } from "@/features/cargos/hooks/use-visit-store"
import { useGetVisitById } from "@/features/visits/hooks"
import CargosHeader from "./_components/cargos-header"
import { ChargesCart } from "./_components/charges-cart"
import { ItemsCatalog } from "./_components/item-catalog"
import { TrackedChargesPanel } from "./_components/tracked-charges-panel"

export default function CargosPage({
  params,
}: {
  params: Promise<{ visitId: string }>
}) {
  const { visitId } = use(params)
  const [selectedTab, setSelectedTab] = useState<"services" | "products">(
    "services"
  )
  const { initializeVisit } = useVisitStore()

  const { data: visitData, isLoading: isLoadingVisit } =
    useGetVisitById(visitId)

  useEffect(() => {
    if (visitData) {
      initializeVisit(visitData)
    }
  }, [visitData, initializeVisit])

  return (
    <PageContainer scrollable={false}>
      {isLoadingVisit ? (
        <div className="flex items-center justify-center h-full w-full">
          <Loader2 className="w-10 h-10 animate-spin" />
        </div>
      ) : (
        <>
          {visitData ? (
            <article className="w-full flex-1 flex flex-col overflow-hidden">
              <div className="">
                <CargosHeader />
              </div>

              <div className="flex flex-1 overflow-hidden">
                {/* Left Column - Pending Charges on Top, Catalog Below */}
                <div className="w-1/3 border-r border-border overflow-y-auto flex-1 flex flex-col">
                  <div className="border-b border-border shrink-0">
                    <TrackedChargesPanel />
                  </div>

                  <div className="flex-1">
                    <ItemsCatalog
                      selectedTab={selectedTab}
                      setSelectedTab={setSelectedTab}
                    />
                  </div>
                </div>

                {/* Right Column - Charges Cart */}
                <div className="w-2/3 overflow-y-auto">
                  <ChargesCart />
                </div>
              </div>
            </article>
          ) : (
            <div className="flex items-center justify-center h-full w-full">
              <p className="text-sm text-muted-foreground">
                No se encontró la visita
              </p>
            </div>
          )}
        </>
      )}
    </PageContainer>
  )
}
