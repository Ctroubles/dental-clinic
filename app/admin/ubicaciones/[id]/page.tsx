import { Suspense } from "react"
import FormCardSkeleton from "~/app/_components/form-card-skeleton"
import PageContainer from "~/app/_components/layout/page-container"
import LocationViewPage from "~/app/admin/ubicaciones/_components/location-view-page"

export const metadata = {
  title: "Ubicación: Detalle",
}

type PageProps = { params: Promise<{ id: string }> }

export default async function Page(props: PageProps) {
  const params = await props.params
  return (
    <PageContainer scrollable>
      <div className="flex-1 space-y-4">
        <Suspense fallback={<FormCardSkeleton />}>
          <LocationViewPage locationId={params.id} />
        </Suspense>
      </div>
    </PageContainer>
  )
}
