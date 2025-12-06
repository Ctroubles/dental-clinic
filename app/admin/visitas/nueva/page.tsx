import { Suspense } from "react"
import FormCardSkeleton from "~/app/_components/form-card-skeleton"
import PageContainer from "~/app/_components/layout/page-container"
import VisitViewPage from "~/app/admin/visitas/[visitId]/_components/visit-view-page"

export const metadata = {
  title: "Nueva Visita",
}

export default function Page() {
  return (
    <PageContainer scrollable>
      <div className="flex-1 space-y-4">
        <Suspense fallback={<FormCardSkeleton />}>
          <VisitViewPage visitId={"nueva"} />
        </Suspense>
      </div>
    </PageContainer>
  )
}
