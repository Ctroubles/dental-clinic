"use client"

import { Visit } from "@/domain/entities"
import { ChargesSection } from "./charges-section"
import { FinancialSummary } from "./financial-summary"
import { PaymentsSection } from "./payments-section"
import { VisitDetailHeader } from "./visit-detail-header"
import { VisitInfoCard } from "./visit-info-card"

export default function VisitDetailPage({ visit }: { visit: Visit }) {
  if (!visit) {
    return (
      <section>
        <header>
          <div className="max-w-6xl mx-auto px-6 py-4 flex items-center gap-4">
            <h1 className="text-xl font-semibold">Visita no encontrada</h1>
          </div>
        </header>
        <div className="max-w-6xl mx-auto px-6 py-4">
          <p className="text-muted-foreground">
            La visita solicitada no existe.
          </p>
        </div>
      </section>
    )
  }

  return (
    <div className="min-h-screen bg-background pb-10">
      <VisitDetailHeader visit={visit} />

      <main className="space-y-8">
        {/* Header Info Grid */}
        <VisitInfoCard visit={visit} />

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Charges and Payments */}
          <div className="lg:col-span-2 space-y-8">
            <ChargesSection charges={visit.charges} />
            <PaymentsSection
              payments={visit.payments}
              charges={visit.charges}
            />
          </div>

          {/* Right Column - Financial Summary */}
          <div>
            <FinancialSummary
              charges={visit.charges}
              payments={visit.payments}
            />
          </div>
        </div>
      </main>
    </div>
  )
}
