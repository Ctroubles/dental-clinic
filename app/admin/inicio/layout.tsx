import React from "react"
import PageContainer from "~/app/_components/layout/page-container"
import { OverviewCards } from "~/app/admin/inicio/_components/overview-cards/overview-cards"
import OverViewPage from "./_components/overview"

export default function OverViewLayout({
  sales,
  // eslint-disable-next-line camelcase
  pie_stats,
  // eslint-disable-next-line camelcase
  bar_stats,
  // eslint-disable-next-line camelcase
  area_stats,
}: {
  sales: React.ReactNode
  pie_stats: React.ReactNode
  bar_stats: React.ReactNode
  area_stats: React.ReactNode
}) {
  return (
    <PageContainer>
      <div className="flex flex-1 flex-col space-y-2 pb-5">
        <div className="flex items-center justify-between space-y-2">
          <h2 className="text-2xl font-bold tracking-tight">
            Hola, bienvenido de nuevo 👋
          </h2>
        </div>

        <OverviewCards />
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-7">
          {/* eslint-disable-next-line camelcase */}
          <div className="col-span-4">{bar_stats}</div>
          <div className="col-span-4 md:col-span-3">
            {/* sales parallel routes */}
            {sales}
          </div>
          {/* eslint-disable-next-line camelcase */}
          <div className="col-span-4">{area_stats}</div>
          {/* eslint-disable-next-line camelcase */}
          <div className="col-span-4 md:col-span-3">{pie_stats}</div>
        </div>
      </div>
    </PageContainer>
  )
}
