import { Suspense } from "react"
import FormCardSkeleton from "~/app/_components/form-card-skeleton"
import PageContainer from "~/app/_components/layout/page-container"
import LocationViewPage from "~/app/admin/ubicaciones/_components/location-view-page"

export const metadata = {
  title: "Nueva Ubicación",
}

export default function Page() {
  return (
    <PageContainer scrollable>
      <div className="flex-1 space-y-4">
        <Suspense fallback={<FormCardSkeleton />}>
          <LocationViewPage locationId={"nuevo"} />
        </Suspense>
      </div>
    </PageContainer>
  )
}
