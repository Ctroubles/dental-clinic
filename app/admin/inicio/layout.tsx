import React from "react"
import { Metadata } from "next"
import PageContainer from "~/app/_components/layout/page-container"
import { OverviewCards } from "~/app/admin/inicio/_components/overview-cards/overview-cards"
import AnalyticsHeader from "./_components/analytics-header/analytics-header"

export const metadata: Metadata = {
  title: "Inicio",
  description: "Inicio",
}

/* eslint-disable camelcase -- Next.js parallel routes require underscore naming */
export default function OverViewLayout({
  daily_revenue,
  top_services,
  monthly_visits,
  payment_history,
}: {
  daily_revenue: React.ReactNode
  top_services: React.ReactNode
  monthly_visits: React.ReactNode
  payment_history: React.ReactNode
}) {
  return (
    <PageContainer>
      <div className="flex flex-1 flex-col space-y-2 pb-5">
        <AnalyticsHeader />

        <OverviewCards />
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-7">
          <div className="col-span-4">{daily_revenue}</div>
          <div className="col-span-4 md:col-span-3">{payment_history}</div>
          <div className="col-span-4">{monthly_visits}</div>
          <div className="col-span-4 md:col-span-3">{top_services}</div>
        </div>
      </div>
    </PageContainer>
  )
}
